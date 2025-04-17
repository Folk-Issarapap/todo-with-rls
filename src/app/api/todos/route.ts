import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return new Response('Unauthorized', { status: 401 });

  const { text } = await request.json();
  const todo = await prisma.todo.create({
    data: {
      text,
      userId: session.user.id,
    },
  });
  return NextResponse.json(todo);
}

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return new Response('Unauthorized', { status: 401 });

  const todos = await prisma.todo.findMany({
    where: { userId: session.user.id },
  });
  return NextResponse.json(todos);
}

export async function PUT(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return new Response('Unauthorized', { status: 401 });

  const { id, text } = await request.json();
  const todo = await prisma.todo.update({
    where: { id, userId: session.user.id },
    data: { text },
  });
  return NextResponse.json(todo);
}

export async function DELETE(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return new Response('Unauthorized', { status: 401 });

  const { id } = await request.json();
  await prisma.todo.delete({
    where: { id, userId: session.user.id },
  });
  return new Response(null, { status: 204 });
}
