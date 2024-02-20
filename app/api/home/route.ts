import { getAllNotes } from "@/server";
import { fail, getUserFromToken } from "@/utils";

export async function GET(req: Request) {
  try {
    const user = await getUserFromToken();
    const data = await getAllNotes({ userId: user?.id });

    if (data.code === 0) {
      return Response.json(data);
    }

    return Response.json(fail(500, data.message));
  } catch (error) {
    return Response.json(fail(500, error));
  }
}
