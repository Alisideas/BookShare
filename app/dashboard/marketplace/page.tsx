// app/dashboard/marketplace/page.tsx
// USER MARKETPLACE PAGE

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Sparkles, Plus, CheckCircle } from 'lucide-react';
import { useStore } from '@/lib/store/useStore';
import { Button } from '@/components/ui/Button';
import { BookCard } from '@/components/dashboard/BookCard';
import { AILibrarianModal } from '@/components/modals/AILibrarianModal';

export default function MarketplacePage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAILibrarianOpen, setIsAILibrarianOpen] = useState(false);

  const currentUser = useStore((state) => state.currentUser);
  const books = useStore((state) => state.books);
  const transactions = useStore((state) => state.transactions);
  const borrowBook = useStore((state) => state.borrowBook);
  const notify = useStore((state) => state.notify);
  const initiateChat = useStore((state) => state.initiateChat);

  if (currentUser === 'admin' || !currentUser) return null;

  const marketplaceBooks = books.filter(
    (b) =>
      b.ownerId !== currentUser.id &&
      (b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.author.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleBorrowBook = (bookId: number) => {
    const book = books.find((b) => b.id === bookId);
    if (!book) return;

    borrowBook(bookId, currentUser.id);
    notify(`You borrowed "${book.title}"`);
    initiateChat(currentUser.id, book.ownerId as number);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Hero Section */}
      <div className="bg-[#4318FF] rounded-[30px] p-10 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">
            Hello, {currentUser.name.split(' ')[0]}! 👋
          </h2>
          <p className="text-indigo-100 mb-6 max-w-lg">
            Discover the latest books from your community or consult our AI
            librarian for a perfect match.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => setIsAILibrarianOpen(true)}
              className="bg-white text-[#4318FF] px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              AI Librarian
            </button>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-indigo-300" />
              <input
                type="text"
                placeholder="Search titles, authors..."
                className="w-full bg-[#3311CC] text-white placeholder:text-indigo-300 rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-white/20 border-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Books Grid */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-[#1B254B]">Trending Books</h3>
          <button className="text-[#4318FF] font-bold text-sm hover:underline">
            See all
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {marketplaceBooks.map((book) => {
            const alreadyBorrowed = transactions.some(
              (t) =>
                t.userId === currentUser.id &&
                t.bookId === book.id &&
                t.status === 'Active'
            );

            return (
              <BookCard
                key={book.id}
                book={book}
                showOwner
                onOwnerClick={() => router.push(`/dashboard/profile/${book.ownerId}`)}
                actionButton={{
                  disabled: book.stock === 0 || alreadyBorrowed,
                  onClick: () => handleBorrowBook(book.id),
                  icon: alreadyBorrowed ? CheckCircle : Plus,
                  variant: alreadyBorrowed ? 'disabled' : 'primary',
                }}
              />
            );
          })}
        </div>
      </div>

      {/* AI Librarian Modal */}
      {isAILibrarianOpen && (
        <AILibrarianModal
          onClose={() => setIsAILibrarianOpen(false)}
          currentUser={currentUser}
          books={books}
        />
      )}
    </div>
  );
}