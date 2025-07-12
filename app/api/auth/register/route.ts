import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "用户名和密码不能为空" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "密码长度至少6位" }, { status: 400 });
    }

    // 检查用户名是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return NextResponse.json({ error: "用户名已存在" }, { status: 400 });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户（默认为访客角色）
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: "VISITOR",
      },
      select: {
        id: true,
        username: true,
        role: true,
      },
    });

    return NextResponse.json({
      message: "注册成功",
      user,
    });
  } catch (error) {
    console.error("注册错误:", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
