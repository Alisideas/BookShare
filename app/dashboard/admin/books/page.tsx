// app/dashboard/admin/books/page.tsx
// ADMIN BOOKS PAGE

'use client';

import { BooksTable } from '@/components/tables/BooksTable';

export default function AdminBooksPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h2 className="text-3xl font-bold text-[#1B254B]">Book Management</h2>
      <BooksTable isAdmin />
    </div>
  );
}