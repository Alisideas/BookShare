// app/dashboard/borrowed/page.tsx
// MY LOANS PAGE (Updated)

'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { MessageSquare, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useBooks, useTransactions } from '@/hooks/useData';

export default function BorrowedPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const { books } = useBooks();
  const { transactions, loading, refetch } = useTransactions();

  if (!session?.user) return null;

  const currentUser = session.user as any;
  const myLoans = transactions.filter(
    (t) => t.userId === currentUser.id && t.status === 'Active'
  );

  const handleReturn = async (transactionId: string) => {
    try {
      const response = await fetch(
        `/api/transactions/${transactionId}/return`,
        {
          method: 'POST',
        }
      );

      if (!response.ok) {
        alert('Failed to return book');
        return;
      }

      alert('Book returned successfully');
      refetch();
    } catch (error) {
      console.error('Error returning book:', error);
      alert('Failed to return book');
    }
  };

  const handleMessage = async (ownerId: string) => {
    try {
      await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: ownerId }),
      });
      router.push('/dashboard/messages');
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#4318FF]" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h3 className="text-2xl font-bold text-[#1B254B]">Active Loans</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {myLoans.length === 0 && (
          <div className="col-span-full text-gray-400 py-10 text-center">
            No books currently borrowed.
          </div>
        )}

        {myLoans.map((loan) => {
          const book = loan.book || books.find((b) => b.id === loan.bookId);
          if (!book) return null;

          return (
            <div
              key={loan.id}
              className="bg-white p-4 rounded-[20px] shadow-sm border border-gray-50 flex gap-5 hover:shadow-lg transition-all"
            >
              <img
                src={book.coverUrl}
                className="w-24 h-36 object-cover rounded-xl shadow-sm"
                alt={book.title}
              />
              <div className="flex-1 flex flex-col py-2">
                <h4 className="font-bold text-[#1B254B] text-lg">
                  {book.title}
                </h4>
                <div
                  onClick={() =>
                    router.push(`/dashboard/profile/${book.ownerId}`)
                  }
                  className="text-sm text-gray-500 mb-1 cursor-pointer hover:text-[#4318FF]"
                >
                  By {book.owner?.name || 'Unknown'}
                </div>
                <div className="text-xs text-gray-400 mb-4">
                  Borrowed: {new Date(loan.issueDate).toLocaleDateString()}
                </div>
                <div className="mt-auto flex gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => handleReturn(loan.id)}
                    className="flex-1"
                  >
                    Return
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => handleMessage(book.ownerId)}
                    className="px-3"
                  >
                    <MessageSquare className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}