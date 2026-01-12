// app/dashboard/profile/[userId]/page.tsx
// PROFILE PAGE (Dynamic Route)

'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, Calendar, MessageSquare, Plus, Trash2, CheckCircle } from 'lucide-react';
import { useStore } from '@/lib/store/useStore';
import { Button } from '@/components/ui/Button';
import { BookCard } from '@/components/dashboard/BookCard';
import  AddBookModal from '@/components/modals/AddBookModal';

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const userId = parseInt(params.userId as string);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const currentUser = useStore((state) => state.currentUser);
  const getUser = useStore((state) => state.getUser);
  const books = useStore((state) => state.books);
  const transactions = useStore((state) => state.transactions);
  const setBooks = useStore((state) => state.setBooks);
  const borrowBook = useStore((state) => state.borrowBook);
  const initiateChat = useStore((state) => state.initiateChat);
  const notify = useStore((state) => state.notify);

  if (currentUser === 'admin' || !currentUser) return null;

  const profileUser = getUser(userId);
  if (!profileUser) {
    return <div>User not found</div>;
  }

  const userBooks = books.filter((b) => b.ownerId === userId);
  const isMyProfile = currentUser.id === userId;

  const handleBorrowBook = (bookId: number) => {
    const book = books.find((b) => b.id === bookId);
    if (!book) return;

    borrowBook(bookId, currentUser.id);
    notify(`You borrowed "${book.title}"`);
    initiateChat(currentUser.id, book.ownerId as number);
  };

  const handleDeleteBook = (bookId: number) => {
    setBooks(books.filter((b) => b.id !== bookId));
    notify('Book deleted');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Profile Header */}
      <div className="relative rounded-[30px] overflow-hidden bg-white shadow-sm border border-gray-100">
        <div className="h-48 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center"></div>
        <div className="px-8 pb-8">
          <div className="flex flex-col md:flex-row items-end -mt-16 mb-6 gap-6">
            <div className="w-32 h-32 rounded-full border-[6px] border-white bg-[#4318FF] text-white flex items-center justify-center text-4xl font-bold shadow-lg">
              {profileUser.name[0]}
            </div>
            <div className="flex-1 mb-2">
              <h2 className="text-3xl font-bold text-[#1B254B]">
                {profileUser.name}
              </h2>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2 font-medium">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#4318FF]" />
                  {profileUser.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#4318FF]" />
                  Joined {profileUser.joined}
                </span>
              </div>
            </div>
            {!isMyProfile && (
              <Button
                onClick={() => initiateChat(currentUser.id, profileUser.id)}
                variant="primary"
                className="mb-4"
              >
                <MessageSquare className="w-4 h-4" />
                Message
              </Button>
            )}
          </div>
          <p className="text-gray-600 max-w-3xl text-lg leading-relaxed font-medium">
            {profileUser.bio}
          </p>
        </div>
      </div>

      {/* Books Collection */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-[#1B254B]">
            {isMyProfile ? 'My Collection' : 'Shelf'}
          </h3>
          {isMyProfile && (
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="w-4 h-4" />
              Add Book
            </Button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {userBooks.map((book) => {
            const alreadyBorrowed =
              !isMyProfile &&
              transactions.some(
                (t) =>
                  t.userId === currentUser.id &&
                  t.bookId === book.id &&
                  t.status === 'Active'
              );

            return (
              <BookCard
                key={book.id}
                book={book}
                actionButton={
                  isMyProfile
                    ? {
                        onClick: () => handleDeleteBook(book.id),
                        icon: Trash2,
                        variant: 'danger',
                      }
                    : {
                        disabled: book.stock === 0 || alreadyBorrowed,
                        onClick: () => handleBorrowBook(book.id),
                        icon: alreadyBorrowed ? CheckCircle : Plus,
                        variant: alreadyBorrowed ? 'disabled' : 'primary',
                      }
                }
              />
            );
          })}
          {userBooks.length === 0 && (
            <div className="col-span-full py-20 text-center text-gray-400">
              No books listed yet.
            </div>
          )}
        </div>
      </div>

      {/* Add Book Modal */}
      {isAddModalOpen && (
        <AddBookModal onClose={() => setIsAddModalOpen(false)} currentUser={currentUser} books={books} />
      )}
    </div>
  );
}