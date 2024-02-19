import { getMyCountInfo } from "@/lib/server";
import { fail, getUserFromToken, success } from "@/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(params: NextRequest) {
  const user = await getUserFromToken();

  if (!user) {
    return NextResponse.json(fail(401));
  }

  try {
    const data = await getMyCountInfo({ id: user.id })
    
    return NextResponse.json(
      success({
        user,
        note: data.data?.noteCount,
        noteDraft: data.data?.draftCount,
        browse: data.data?.browseCount,
      })
    );
  } catch (error) {
    return NextResponse.json(fail(500, error));
  }
}
