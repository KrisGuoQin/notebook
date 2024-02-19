
import { getMyLikeNotes } from "@/lib/server";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const userId = req.nextUrl.searchParams.get('userId') as string
    const res = await getMyLikeNotes({ userId })

    return NextResponse.json(res)
}