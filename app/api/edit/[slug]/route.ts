import { type CodeResult, fail, success, getUserFromToken, type User } from "@/utils";
import { NextRequest, NextResponse } from "next/server";
import { addNote,updateNote, addNoteDraft, getNote, getNoteDraft, removeNoteDraft, type NoteParams, type Note } from "@/lib/server";
import { promisify } from "util";
import imageSize from "image-size";
import { writeFile } from "fs/promises";
import { cwd } from "node:process";
import path from "path";
import { omit, pipe } from "ramda";

const sizeOf = promisify(imageSize);
const removeDraftKey = omit(['draft'])
const removeIdKey = omit(['id'])
const removeDraftKeys = omit(['id', 'draft'])

export const api = {
  bodyParser: false,
};

export async function GET(req: NextRequest) {
  const user = await getUserFromToken();
  const searchParams = req.nextUrl.searchParams
  const id = searchParams.get('id');
  const draft = searchParams.get('draft');

  if (!user) {
    return NextResponse.json(fail(401));
  }

  if (draft === '1' && id) {
    const data = await getNoteDraft({ id })
    return NextResponse.json(data)
  }

  if (id) {
    const data = await getNote({ id })
    return NextResponse.json(data)
  }
} 

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  const user = await getUserFromToken();

  if (!user) {
    return NextResponse.json(fail(401));
  }

  if (slug === "publish") {
    const data = await req.json();
    // 发布草稿
    if (data.id && data.draft) {
      return handlePublishDraft(data, user)
    }
    // 编辑已有，进行发布
    if (data.id && !data.draft) {
      return handleUpdateNote(data, user)
    }
    // 全新发布
    return handleAddNote(data, user)
  }

  if (slug === "uploadImage") {
    return handleUpload(req, user);
  }

  if (slug === "draft") {
    return handleSaveDraft(req, user);
  }

  return NextResponse.json(fail(404));
}

// 发布草稿
const handlePublishDraft = async (data: any, user: User) => {
  const dataRet = removeDraftKeys<NoteParams>(data)
  // 先发布，再删除草稿
  const noteRes = await addNote({ ...dataRet, authorId: user.id });
  if (noteRes.code === 0) {
    await removeNoteDraft({ id: data.id })
    return NextResponse.json(noteRes);
  }

  return NextResponse.json(noteRes);
}

// 更新已有Note
const handleUpdateNote = async (data: any, user: User) => {
  const dataRet = removeDraftKey<Note>(data)
  const noteRes = await updateNote({ ...dataRet, authorId: user.id });

  return NextResponse.json(noteRes);
}

const handleAddNote = async (data: any, user: User) => {
  const noteRes = await addNote({ ...data, authorId: user.id });

  return NextResponse.json(noteRes);
};

const handleSaveDraft = async (req: NextRequest, user: User) => {
  const data = await req.json();
  
  const draft = await addNoteDraft({
    ...removeDraftKeys<Note>(data),
    authorId: user.id,
  });

  return NextResponse.json(draft);
};

const handleUpload = async (req: NextRequest, user: User) => {
  try {
    const uploadDir = path.join(cwd(), "./public/images");
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(fail(400));
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const url = `${uploadDir}/${file.name}`;
    await writeFile(url, buffer);
    const dimension = await sizeOf(url);

    return NextResponse.json(
      success({
        url: `/images/${file.name}`,
        dimension,
      })
    );
  } catch (error) {
    return NextResponse.json(fail(500, error));
  }
};

