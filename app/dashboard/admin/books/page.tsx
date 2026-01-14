// app/dashboard/admin/books/page.tsx
// ADMIN BOOKS PAGE (Updated)

'use client';

import { Loader2 } from 'lucide-react';
import { useBooks } from '@/hooks/useData';
import { BooksTable } from '@/components/tables/BooksTable';

export default function AdminBooksPage() {
  const { books, loading, refetch } = useBooks();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#4318FF]" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-[#1B254B]">Book Management</h2>
        <div className="text-sm text-gray-500">
          Total: <span className="font-bold text-[#4318FF]">{books.length}</span> books
        </div>
      </div>
      <BooksTable isAdmin books={books} onRefetch={refetch} />
    </div>
  );
}