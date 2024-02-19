import { NextRequest, NextResponse } from "next/server";
import { getUser, addUser } from "@/lib/server";
import { generateToken, getUserFromToken, fail, success } from "@/utils";
import cookie from "cookie";
import { TOKEN_MAX_AGE } from "@/const";

export async function POST(req: NextRequest) {
  const { type, ...data } = await req.json();
  const result =
    type === "register" ? await addUser(data) : await getUser(data);

  if (!result.data) {
    return NextResponse.json(result);
  }

  const token = generateToken(result.data);

  const cookieRes = cookie.serialize("token", token, {
    path: "/",
    httpOnly: true,
    maxAge: TOKEN_MAX_AGE,
  });

  return NextResponse.json(success(result.data), {
    headers: {
      "Set-Cookie": cookieRes,
    },
  });
}

export async function GET(req: NextRequest) {
  const user = await getUserFromToken();

  if (!user) {
    return NextResponse.json(fail(401));
  }

  return NextResponse.json(success(user));
}
