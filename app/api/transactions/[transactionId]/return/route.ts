// app/api/transactions/[transactionId]/return/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  _request: NextRequest,
  ctx: { params: Promise<{ transactionId: string }> }
) {
  try {
    const { transactionId } = await ctx.params; // ✅ unwrap params
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUserId = (session.user as any).id as string;
    const isAdmin = (session.user as any).role === 'admin';

    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { book: true },
    });

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    const isBorrower = transaction.userId === currentUserId;

    if (!isAdmin && !isBorrower) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (transaction.status === 'Returned') {
      return NextResponse.json({ error: 'Book already returned' }, { status: 400 });
    }

    const updatedTransaction = await prisma.$transaction(async (tx) => {
      const updated = await tx.transaction.update({
        where: { id: transactionId },
        data: {
          status: 'Returned',
          returnDate: new Date(),
        },
        include: {
          book: {
            include: {
              owner: { select: { id: true, name: true, email: true } },
            },
          },
          user: { select: { id: true, name: true, email: true } },
        },
      });

      await tx.book.update({
        where: { id: transaction.bookId },
        data: { stock: { increment: 1 } },
      });

      return updated;
    });

    return NextResponse.json(updatedTransaction);
  } catch (error) {
    console.error('Error returning book:', error);
    return NextResponse.json({ error: 'Failed to return book' }, { status: 500 });
  }
}
