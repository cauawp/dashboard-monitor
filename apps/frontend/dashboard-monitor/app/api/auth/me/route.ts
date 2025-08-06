import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const cookie = req.headers.get("cookie") || "";

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/auth/me`, {
    headers: {
      cookie,
    },
    credentials: "include",
  });

  if (!res.ok) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const data = await res.json();

  return NextResponse.json({ authenticated: true, user: data.user });
}
