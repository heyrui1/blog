import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// 验证JWT token
function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
  } catch {
    return null;
  }
}

// 获取当前用户
async function getCurrentUser(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded) return null;

  return await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: { id: true, username: true, role: true },
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("search") || "";

  const posts = await prisma.post.findMany({
    where: keyword
      ? {
          OR: [
            { title: { contains: keyword } },
            { content: { contains: keyword } },
          ],
        }
      : {},
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request);

  if (!user) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  const { title, content } = await request.json();
  const post = await prisma.post.create({
    data: {
      title,
      content,
      authorId: user.id,
    } as any, // 强制类型断言，解决authorId类型问题
  });
  return NextResponse.json(post);
}

export async function PUT(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }
  const { id, title, content } = await request.json();
  // 先查找文章
  const post = await prisma.post.findUnique({
    where: { id },
    select: { id: true, authorId: true },
  });
  if (!post) {
    return NextResponse.json({ error: "文章不存在" }, { status: 404 });
  }
  // 权限判断
  if (user.role !== "ADMIN" && post.authorId !== user.id) {
    return NextResponse.json({ error: "无权限操作" }, { status: 403 });
  }
  const updated = await prisma.post.update({
    where: { id },
    data: { title, content },
  });
  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }
  const { id } = await request.json();
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) {
    return NextResponse.json({ error: "文章不存在" }, { status: 404 });
  }
  if (user.role !== "ADMIN" && post.authorId !== user.id) {
    return NextResponse.json({ error: "无权限操作" }, { status: 403 });
  }
  await prisma.post.delete({ where: { id } });
  return NextResponse.json({ message: "Deleted" });
}
