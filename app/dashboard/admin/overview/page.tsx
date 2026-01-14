// app/dashboard/admin/overview/page.tsx
// ADMIN OVERVIEW PAGE (Updated)

'use client';

import { Library, Users, List, AlertCircle, Loader2 } from 'lucide-react';
import { useBooks, useUsers, useTransactions } from '@/hooks/useData';
import { StatCard } from '@/components/dashboard/StatCard';

export default function AdminOverviewPage() {
  const { books, loading: booksLoading } = useBooks();
  const { users, loading: usersLoading } = useUsers();
  const { transactions, loading: transactionsLoading } = useTransactions();

  const stats = [
    {
      label: 'Total Books',
      value: books.length.toString(),
      icon: Library,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
    },
    {
      label: 'Active Users',
      value: users.length.toString(),
      icon: Users,
      color: 'text-green-500',
      bg: 'bg-green-50',
    },
    {
      label: 'Active Loans',
      value: transactions.filter((t) => t.status === 'Active').length.toString(),
      icon: List,
      color: 'text-orange-500',
      bg: 'bg-orange-50',
    },
    {
      label: 'Overdue',
      value: '0',
      icon: AlertCircle,
      color: 'text-red-500',
      bg: 'bg-red-50',
    },
  ];

  if (booksLoading || usersLoading || transactionsLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#4318FF]" />
      </div>
    );
  }

  // Get recent transactions (last 5)
  const recentTransactions = transactions.slice(0, 5);

  // Get newest books (last 5)
  const newestBooks = books.slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h2 className="text-3xl font-bold text-[#1B254B]">Dashboard Overview</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Loans */}
        <div>
          <h3 className="text-xl font-bold text-[#1B254B] mb-4">
            Recent Loans
          </h3>
          <div className="bg-white rounded-[20px] shadow-sm border border-gray-50 overflow-hidden">
            <div className="divide-y divide-gray-50">
              {recentTransactions.length === 0 ? (
                <div className="p-6 text-center text-gray-400">
                  No transactions yet
                </div>
              ) : (
                recentTransactions.map((t) => (
                  <div
                    key={t.id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-bold text-[#1B254B] text-sm">
                          {t.book?.title || 'Unknown Book'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Borrowed by {t.user?.name || 'Unknown User'}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          t.status === 'Active'
                            ? 'bg-orange-50 text-orange-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Newest Books */}
        <div>
          <h3 className="text-xl font-bold text-[#1B254B] mb-4">
            Newest Books
          </h3>
          <div className="bg-white rounded-[20px] shadow-sm border border-gray-50 overflow-hidden">
            <div className="divide-y divide-gray-50">
              {newestBooks.length === 0 ? (
                <div className="p-6 text-center text-gray-400">
                  No books yet
                </div>
              ) : (
                newestBooks.map((book) => (
                  <div
                    key={book.id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={book.coverUrl}
                        className="w-12 h-16 object-cover rounded shadow-sm"
                        alt={book.title}
                      />
                      <div className="flex-1">
                        <p className="font-bold text-[#1B254B] text-sm">
                          {book.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          by {book.author}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          book.stock > 0
                            ? 'bg-green-50 text-green-600'
                            : 'bg-red-50 text-red-600'
                        }`}
                      >
                        {book.stock > 0 ? 'Available' : 'Lended'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}