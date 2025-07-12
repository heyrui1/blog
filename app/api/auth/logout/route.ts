import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "登出成功" });

  // 清除认证cookie
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0, // 立即过期
  });

  return response;
}
