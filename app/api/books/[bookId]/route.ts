// app/api/books/[bookId]/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// DELETE a book
export async function DELETE(
  _request: NextRequest,
  ctx: { params: Promise<{ bookId: string }> }
) {
  try {
    const { bookId } = await ctx.params; // ✅ unwrap params promise

    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!bookId) {
      return NextResponse.json({ error: 'Missing bookId' }, { status: 400 });
    }

    const book = await prisma.book.findUnique({
      where: { id: bookId },
      select: { id: true, ownerId: true },
    });

    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    const isAdmin = (session.user as any).role === 'admin';
    const isOwner = book.ownerId === (session.user as any).id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.book.delete({ where: { id: bookId } });

    return NextResponse.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    return NextResponse.json({ error: 'Failed to delete book' }, { status: 500 });
  }
}
