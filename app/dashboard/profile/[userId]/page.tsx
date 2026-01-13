// app/dashboard/profile/[userId]/page.tsx
// PROFILE PAGE (Updated)

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  MapPin,
  Calendar,
  MessageSquare,
  Plus,
  Trash2,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BookCard } from '@/components/dashboard/BookCard';
import { AddBookModal } from '@/components/modals/AddBookModal';
import { useBooks, useTransactions } from '@/hooks/useData';
import { User } from '@/lib/types';

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const userId = params.userId as string;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const { books, refetch: refetchBooks } = useBooks();
  const { transactions, refetch: refetchTransactions } = useTransactions();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();
        setProfileUser(data);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (!session?.user || loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#4318FF]" />
      </div>
    );
  }

  if (!profileUser) {
    return <div className="text-center py-20">User not found</div>;
  }

  const currentUser = session.user as any;
  const userBooks = books.filter((b) => b.ownerId === userId);
  const isMyProfile = currentUser.id === userId;

  const handleBorrowBook = async (bookId: string) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId }),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Failed to borrow book');
        return;
      }

      const book = books.find((b) => b.id === bookId);
      alert(`You borrowed "${book?.title}"`);
      refetchBooks();
      refetchTransactions();

      // Create chat with owner
      await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: book?.ownerId }),
      });
    } catch (error) {
      console.error('Error borrowing book:', error);
      alert('Failed to borrow book');
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    if (!confirm('Are you sure you want to delete this book?')) return;

    try {
      const response = await fetch(`/api/books/${bookId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        alert('Failed to delete book');
        return;
      }

      alert('Book deleted successfully');
      refetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Failed to delete book');
    }
  };

  const handleInitiateChat = async () => {
    try {
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId: userId }),
      });

      const chat = await response.json();
      router.push('/dashboard/messages');
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Profile Header */}
      <div className="relative rounded-[30px] overflow-hidden bg-white shadow-sm border border-gray-100">
        <div className="h-48 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center"></div>
        <div className="px-8 pb-8">
          <div className="flex flex-col md:flex-row items-end -mt-16 mb-6 gap-6">
            <div className="w-32 h-32 rounded-full border-[6px] border-white bg-[#4318FF] text-white flex items-center justify-center text-4xl font-bold shadow-lg">
              {profileUser.name?.[0] || 'U'}
            </div>
            <div className="flex-1 mb-2">
              <h2 className="text-3xl font-bold text-[#1B254B]">
                {profileUser.name}
              </h2>
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2 font-medium">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#4318FF]" />
                  {profileUser.location || 'Unknown location'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#4318FF]" />
                  Joined {new Date(profileUser.joined).toLocaleDateString()}
                </span>
              </div>
            </div>
            {!isMyProfile && (
              <Button
                onClick={handleInitiateChat}
                variant="primary"
                className="mb-4"
              >
                <MessageSquare className="w-4 h-4" />
                Message
              </Button>
            )}
          </div>
          <p className="text-gray-600 max-w-3xl text-lg leading-relaxed font-medium">
            {profileUser.bio || 'No bio available'}
          </p>
        </div>
      </div>

      {/* Books Collection */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-[#1B254B]">
            {isMyProfile ? 'My Collection' : 'Book Collection'}
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
              {isMyProfile
                ? 'No books listed yet. Add your first book!'
                : 'This user has no books listed.'}
            </div>
          )}
        </div>
      </div>

      {/* Add Book Modal */}
      {isAddModalOpen && (
        <AddBookModal
          // currentUser={profileUser as User}
          onClose={() => {
            setIsAddModalOpen(false);
            refetchBooks();
          }}
        />
      )}
    </div>
  );
}