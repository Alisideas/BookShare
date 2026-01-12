// app/dashboard/admin/overview/page.tsx
// ADMIN OVERVIEW PAGE

'use client';

import { Library, Users, List, AlertCircle } from 'lucide-react';
import { useStore } from '@/lib/store/useStore';
import { BooksTable } from '@/components/tables/BooksTable';
import { LoansTable } from '@/components/tables/LoansTable';
import { StatCard } from '@/components/dashboard/StatCard';

export default function AdminOverviewPage() {
  const books = useStore((state) => state.books);
  const users = useStore((state) => state.users);
  const transactions = useStore((state) => state.transactions);

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
        <div>
          <h3 className="text-xl font-bold text-[#1B254B] mb-4">
            Recent Loans
          </h3>
          <LoansTable isAdmin />
        </div>
        <div>
          <h3 className="text-xl font-bold text-[#1B254B] mb-4">
            Newest Books
          </h3>
          <BooksTable isAdmin />
        </div>
      </div>
    </div>
  );
}