// app/api/transactions/[transactionId]/return/route.ts
// RETURN BOOK API ROUTE

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { transactionId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const transaction = await prisma.transaction.findUnique({
      where: { id: params.transactionId },
      include: { book: true },
    });

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Check if user is the borrower or admin
    const isAdmin = (session.user as any).role === 'admin';
    const isBorrower = transaction.userId === (session.user as any).id;

    if (!isAdmin && !isBorrower) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (transaction.status === 'Returned') {
      return NextResponse.json(
        { error: 'Book already returned' },
        { status: 400 }
      );
    }

    // Update transaction and book stock
    const updatedTransaction = await prisma.$transaction(async (tx) => {
      // Update transaction
      const updated = await tx.transaction.update({
        where: { id: params.transactionId },
        data: {
          status: 'Returned',
          returnDate: new Date(),
        },
        include: {
          book: {
            include: {
              owner: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      // Update book stock
      await tx.book.update({
        where: { id: transaction.bookId },
        data: {
          stock: {
            increment: 1,
          },
        },
      });

      return updated;
    });

    return NextResponse.json(updatedTransaction);
  } catch (error) {
    console.error('Error returning book:', error);
    return NextResponse.json(
      { error: 'Failed to return book' },
      { status: 500 }
    );
  }
}