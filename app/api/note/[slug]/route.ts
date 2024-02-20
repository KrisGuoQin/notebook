import {
  likeNote,
  getMyNotes,
  getMyFavoriteNotes,
  getMyBrowseNotes,
  favoriteNote,
  getMyNoteDrafts,
  getUserById,
  getNote,
  getNoteLikeCount,
  getNoteFavoriteCount,
  getNoteIsMyFavorite,
  getNoteIsMyLike,
  createBrowseRecord,
  removeNote,
} from "@/server";
import { getUserFromToken, success, fail } from "@/utils";
import { NextRequest, NextResponse } from "next/server";
import type { User } from "prisma/prisma-client";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  const user = await getUserFromToken();

  if (!user) {
    return Response.json(fail(401));
  }
  // note详情
  if (slug === "detail") {
    return handleGetNoteDetail(req, user);
  }
  // 获取我的所有的Note
  if (slug === "list") {
    return handleGetMyNotes(req, user);
  }

  // 获取我的所有的草稿
  if (slug === "drafts") {
    return handleGetMyDrafts(req, user);
  }

  if (slug === "history") {
    return handleGetMyHistory(req, user);
  }

  if (slug === "favorites") {
    return handleGetMyFavorites(req, user);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  const user = await getUserFromToken();

  if (!user) {
    return Response.json(fail(401));
  }

  if (slug === "like") {
    return handleLike(req, user);
  }

  if (slug === "favorite") {
    return handleFavorite(req, user);
  }

  if (slug === "delete") {
    return handleDeleteNote(req, user);
  }
}

const handleDeleteNote = async (req: NextRequest, user: User) => {
  try {
    const data = await req.json();
    const response = await removeNote({ noteId: data.id, authorId: user.id });

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(fail(500, error));
  }
};

const handleGetNoteDetail = async (req: NextRequest, user: User) => {
  try {
    const noteId = req.nextUrl.searchParams.get("id") as string;
    const [note, likeCount, favoriteCount, favorite, like] = await Promise.all([
      getNote({ noteId }),
      getNoteLikeCount({ noteId }),
      getNoteFavoriteCount({ noteId }),
      getNoteIsMyFavorite({ noteId, userId: user.id }),
      getNoteIsMyLike({ noteId, userId: user.id }),
    ]);

    if (note.data?.authorId !== user.id) {
      createBrowseRecord({
        noteId,
        userId: user.id,
      });
    }

    return NextResponse.json(
      success({
        isMine: note.data?.author.id === user.id,
        note: note.data,
        like: like.data,
        favorite: favorite.data,
        likeCount: likeCount.data,
        favoriteCount: favoriteCount.data,
      })
    );
  } catch (error) {
    return NextResponse.json(fail(500, error));
  }
};

const handleGetMyFavorites = async (req: NextRequest, user: User) => {
  try {
    const result = await getMyFavoriteNotes({ userId: user.id });
    return Response.json(result);
  } catch (error) {
    return Response.json(fail(500, error));
  }
};

const handleGetMyHistory = async (req: NextRequest, user: User) => {
  try {
    const result = await getMyBrowseNotes({ userId: user.id });
    return Response.json(result);
  } catch (error) {
    return Response.json(fail(500, error));
  }
};

const handleGetMyNotes = async (req: NextRequest, user: User) => {
  try {
    const result = await getMyNotes(user.id);
    return Response.json(result);
  } catch (error) {
    return Response.json(fail(500, error));
  }
};

const handleGetMyDrafts = async (req: NextRequest, user: User) => {
  try {
    const result = await getMyNoteDrafts(user.id);
    return Response.json({...result, data: result.data?.map(note => ({ note }))});
  } catch (error) {
    return Response.json(fail(500, error));
  }
};

const handleLike = async (req: NextRequest, user: User) => {
  const { id, like } = await req.json();
  try {
    await likeNote({
      like,
      noteId: id,
      userId: user.id,
    });
    return Response.json(success(null));
  } catch (error: any) {
    return Response.json(fail(500, error));
  }
};

const handleFavorite = async (req: NextRequest, user: User) => {
  const { id, favorite } = await req.json();
  try {
    await favoriteNote({
      favorite,
      noteId: id,
      userId: user.id,
    });
    return Response.json(success(null));
  } catch (error: any) {
    return Response.json(fail(500, error));
  }
};
