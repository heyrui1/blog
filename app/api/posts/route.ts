import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const { title, content } = await request.json();
  const post = await prisma.post.create({
    data: { title, content }
  });
  return NextResponse.json(post);
}

export async function PUT(request: NextRequest) {
  const { id, title, content } = await request.json();
  const post = await prisma.post.update({
    where: { id },
    data: { title, content }
  });
  return NextResponse.json(post);
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  await prisma.post.delete({
    where: { id }
  });
  return NextResponse.json({ message: 'Deleted' });
}