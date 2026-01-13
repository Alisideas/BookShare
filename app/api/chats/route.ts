// app/api/chats/route.ts
// CHATS API ROUTE (Fixed)

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ChatParticipant } from '@prisma/client';

// GET all chats for current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUserId = (session.user as any).id;

    // Fetch all chats and filter in memory
    const allChats = await prisma.chat.findMany({
      include: {
        messages: {
          include: {
            sender: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            timestamp: 'asc',
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // Filter chats where current user is a participant
    const userChats = allChats.filter((chat) =>
      (chat as any).participants.some((participant: ChatParticipant) => participant.userId === currentUserId)
    );

    // Fetch participant details for each chat
    const chatsWithParticipants = await Promise.all(
      userChats.map(async (chat) => {
        const participants = await prisma.user.findMany({
          where: {
            id: {
              in: (chat as any).participants.map((participant: ChatParticipant) => participant.userId),
            },
          },
        });

        return {
          ...chat,
          participants,
        };
      })
    );

    return NextResponse.json(chatsWithParticipants);
  } catch (error) {
    console.error('Error fetching chats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chats' },
      { status: 500 }
    );
  }
}

// POST create or get existing chat
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { targetUserId } = body;

    if (!targetUserId) {
      return NextResponse.json(
        { error: 'Target user ID is required' },
        { status: 400 }
      );
    }

    const currentUserId = (session.user as any).id;

    // Check if chat already exists by fetching all chats and filtering
    const allChats = await prisma.chat.findMany();
    const existingChat = allChats.find(
      (chat) =>
        (chat as any).participants.some((participant: ChatParticipant) => participant.userId === currentUserId) &&
        (chat as any).participants.some((participant: ChatParticipant) => participant.userId === targetUserId)
    );

    if (existingChat) {
      // Fetch full chat details with messages and participants
      const chatWithDetails = await prisma.chat.findUnique({
        where: { id: existingChat.id },
        include: {
          messages: {
            include: {
              sender: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
            orderBy: {
              timestamp: 'asc',
            },
          },
        },
      });

      // Fetch participants
      const participants = await prisma.user.findMany({
        where: {
          id: {
            in: (existingChat as any).participants.map((participant: ChatParticipant) => participant.userId),
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      });

      return NextResponse.json({
        ...chatWithDetails,
        participants,
      });
    }

    // Create new chat
    const newChat = await prisma.chat.create({
      data: {
        participants: {
          create: [
            { userId: currentUserId },
            { userId: targetUserId },
          ],
        },
      },
      include: {
        messages: {
          include: {
            sender: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    // Fetch participants
    const participants = await prisma.user.findMany({
      where: {
        id: {
          in: [currentUserId, targetUserId],
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    return NextResponse.json(
      {
        ...newChat,
        participants,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating chat:', error);
    return NextResponse.json(
      { error: 'Failed to create chat' },
      { status: 500 }
    );
  }
}