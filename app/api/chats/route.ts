// app/api/chats/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET all chats for current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUserId = (session.user as any).id as string;

    // ✅ Filter in DB + include participants + messages
    const chats = await prisma.chat.findMany({
      where: {
        participants: {
          some: { userId: currentUserId },
        },
      },
      include: {
        participants: true, // ✅ IMPORTANT
        messages: {
          include: {
            sender: {
              select: { id: true, name: true, email: true, image: true },
            },
          },
          orderBy: { timestamp: 'asc' },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    

    // collect unique userIds from all chat participants
    const userIds = Array.from(
      new Set(chats.flatMap((c) => c.participants.map((p) => p.userId)))
    );

    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true, image: true },
    });
    

    const userMap = new Map(users.map((u) => [u.id, u]));

    // ✅ return consistent shape that your UI can use
    const result = chats.map((c) => {
      const participantIds = c.participants.map((p) => p.userId);
      const participants = participantIds.map((id) => userMap.get(id)).filter(Boolean);

      return {
        id: c.id,
        participantIds,
        participants,
        messages: c.messages.map((m) => ({
          id: m.id,
          chatId: m.chatId,
          senderId: m.senderId,
          text: m.text,
          timestamp: m.timestamp,
          sender: m.sender,
        })),
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching chats:', error);
    return NextResponse.json({ error: 'Failed to fetch chats' }, { status: 500 });
  }
}



// POST create or get existing chat
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { targetUserId } = await request.json();

    if (!targetUserId) {
      return NextResponse.json({ error: 'Target user ID is required' }, { status: 400 });
    }

    const currentUserId = (session.user as any).id as string;

    // ✅ Find existing chat in DB (not in memory)
    const existingChat = await prisma.chat.findFirst({
      where: {
        AND: [
          { participants: { some: { userId: currentUserId } } },
          { participants: { some: { userId: targetUserId } } },
        ],
      },
      include: {
        participants: true,
        messages: {
          include: {
            sender: { select: { id: true, name: true, email: true, image: true } },
          },
          orderBy: { timestamp: 'asc' },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const chat =
      existingChat ??
      (await prisma.chat.create({
        data: {
          participants: {
            create: [{ userId: currentUserId }, { userId: targetUserId }],
          },
        },
        include: {
          participants: true,
          messages: {
            include: {
              sender: { select: { id: true, name: true, email: true, image: true } },
            },
            orderBy: { timestamp: 'asc' },
          },
        },
      }));

    // fetch participant user details
    const participantIds = chat.participants.map((p) => p.userId);
    const participants = await prisma.user.findMany({
      where: { id: { in: participantIds } },
      select: { id: true, name: true, email: true, image: true },
    });

    return NextResponse.json(
      {
        id: chat.id,
        participantIds,
        participants,
        messages: chat.messages,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt,
      },
      { status: existingChat ? 200 : 201 }
    );
  } catch (error) {
    console.error('Error creating chat:', error);
    return NextResponse.json({ error: 'Failed to create chat' }, { status: 500 });
  }
}
