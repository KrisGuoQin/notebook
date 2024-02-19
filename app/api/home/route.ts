import { getAllNotes } from "@/lib/server";
import { success, fail } from "@/utils";

export interface Note {
    id: string;
    title: string;
    images: string;
    content: string;
    createAt: Date;
    updateAt: Date;
    authorId: string;
}[]

export async function GET(req: Request) {
    try {
       const data = await getAllNotes()
       if (data.code === 0) {
            return Response.json(success(data.data))
       }
       return Response.json(fail(500, data.message))
    } catch (error) {
        return Response.json(fail(500, error))
    }
}