import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const authRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}api/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!authRes.ok) {
    const error = await authRes.json();
    return NextResponse.json({ message: error.message }, { status: 401 });
  }

  const { token } = await authRes.json();

  const response = NextResponse.json({ success: true });

  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 dia
  });

  return response;
}
