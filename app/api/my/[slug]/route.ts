import { getMyCountInfo, getMyLikeNotes, getMyFavoriteNotes, getMyBrowseNotes } from "@/server";
import { fail, getUserFromToken, success } from "@/utils";
import { NextRequest, NextResponse } from "next/server";
import { type User } from '@/server';

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const user = await getUserFromToken();
  const slug = params.slug

  if (!user) {
    return NextResponse.json(fail(401));
  }

  if (slug === 'info') {
    return handleGetMyInfo(req, user)
  }

  if (slug === 'favorites') {
    return NextResponse.json(
      await getMyFavoriteNotes({ userId: user.id }) 
    )
  }

  if (slug === 'likes') {
    return NextResponse.json(
      await getMyLikeNotes({ userId: user.id }) 
    ) 
  }

  if (slug === 'browses') {
    return NextResponse.json(
      await getMyBrowseNotes({ userId: user.id }) 
    )  
  }
}

const handleGetMyInfo = async (req: NextRequest, user: User) => {
  try {
    const data = await getMyCountInfo({ userId: user.id })
    
    return NextResponse.json(
      success({
        user,
        note: data.data?.noteCount || 0,
        noteDraft: data.data?.draftCount || 0,
        browse: data.data?.browseCount || 0,
        favorite: data.data?.favoriteCount || 0,
        like: data.data?.likeCount || 0,
      })
    );
  } catch (error) {
    return NextResponse.json(fail(500, error));
  }
}