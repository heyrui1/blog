import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
  const { title, content } = await request.json();
  const post = await prisma.post.create({
    data: { title, content },
  });
  return NextResponse.json(post);
}

export async function PUT(request: NextRequest) {
  const { id, title, content } = await request.json();
  const post = await prisma.post.update({
    where: { id },
    data: { title, content },
  });
  return NextResponse.json(post);
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  await prisma.post.delete({
    where: { id },
  });
  return NextResponse.json({ message: "Deleted" });
}
