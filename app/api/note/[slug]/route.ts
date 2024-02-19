import { likeNote, getMyNotes, getMyNoteDrafts, getNote } from "@/lib/server";
import { getUserFromToken, success, fail, type User } from "@/utils";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  const user = await getUserFromToken();

  if (!user) {
    return Response.json(fail(401));
  }
// 获取我的所有的Note
  if (slug === "list") {
    return await handleGetMyNotes(req, user);
  }

  // 获取我的所有的草稿
  if (slug === "drafts") {
    return await handleGetMyDrafts(req, user);
  }
}
// 点赞收藏
export async function POST(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  const user = await getUserFromToken();

  if (!user) {
    return Response.json(fail(401));
  }

  if (slug === "like") {
    return await handleLike(req, user);
  }
}

const handleGetMyNotes = async (req: Request, user: User) => {
  try {
    const result = await getMyNotes(user.id);
    return Response.json(success(result.data));
  } catch (error) {
    return Response.json(fail(500, error));
  }
};

const handleGetMyDrafts = async (req: Request, user: User) => {
  try {
    const result = await getMyNoteDrafts(user.id);
    return Response.json(success(result.data));
  } catch (error) {
    return Response.json(fail(500, error));
  }
};

const handleLike = async (req: Request, user: User) => {
  const { id, like } = await req.json();
  try {
    await likeNote({
      noteId: id,
      like,
      userId: user.id,
    });
    return Response.json(success(null));
  } catch (error: any) {
    return Response.json(fail(500, error));
  }
};
