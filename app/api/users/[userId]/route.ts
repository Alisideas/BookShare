import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ userId: string }> }
) {
  const { userId } = await ctx.params; // ✅ unwrap params

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId }, // ✅ now not undefined
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        location: true,
        bio: true,
        joined: true,
        image: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}
