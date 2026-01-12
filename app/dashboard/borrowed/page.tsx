// app/dashboard/borrowed/page.tsx
// MY LOANS PAGE

'use client';

import { useRouter } from 'next/navigation';
import { MessageSquare } from 'lucide-react';
import { useStore } from '@/lib/store/useStore';
import { Button } from '@/components/ui/Button';

export default function BorrowedPage() {
  const router = useRouter();

  const currentUser = useStore((state) => state.currentUser);
  const transactions = useStore((state) => state.transactions);
  const getBook = useStore((state) => state.getBook);
  const returnBook = useStore((state) => state.returnBook);
  const initiateChat = useStore((state) => state.initiateChat);
  const notify = useStore((state) => state.notify);

  if (currentUser === 'admin' || !currentUser) return null;

  const myLoans = transactions.filter(
    (t) => t.userId === currentUser.id && t.status === 'Active'
  );

  const handleReturn = (transactionId: number) => {
    returnBook(transactionId);
    notify('Book returned successfully');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h3 className="text-2xl font-bold text-[#1B254B]">Active Loans</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {myLoans.length === 0 && (
          <div className="text-gray-400 py-10">No books currently borrowed.</div>
        )}

        {myLoans.map((loan) => {
          const book = getBook(loan.bookId);
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
                  className="text-sm text-gray-500 mb-4 cursor-pointer hover:text-[#4318FF]"
                >
                  By {book.ownerName}
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
                    onClick={() =>
                      initiateChat(currentUser.id, book.ownerId as number)
                    }
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