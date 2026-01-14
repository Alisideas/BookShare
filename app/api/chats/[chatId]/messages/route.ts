// app/api/chats/[chatId]/messages/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  ctx: { params: Promise<{ chatId: string }> }
) {
  try {
    const { chatId } = await ctx.params; // ✅ unwrap params
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const senderId = (session.user as any).id as string;

    const body = await request.json();
    const text = (body?.text ?? '') as string;

    if (!text.trim()) {
      return NextResponse.json({ error: 'Message text is required' }, { status: 400 });
    }

    // ✅ verify participant in DB (fast + safe)
    const isParticipant = await prisma.chatParticipant.findFirst({
      where: { chatId, userId: senderId },
      select: { id: true },
    });

    if (!isParticipant) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // ✅ create message
    const message = await prisma.message.create({
      data: {
        chatId,
        senderId,
        text: text.trim(),
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    // ✅ bump chat updatedAt so ordering works
    await prisma.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json({ error: 'Failed to create message' }, { status: 500 });
  }
}
