'use client';

import { Trash2 } from 'lucide-react';
import { useStore } from '@/lib/store/useStore';
import type { Book } from '@/lib/types';

interface BooksTableProps {
  isAdmin?: boolean;
}

export const BooksTable: React.FC<BooksTableProps> = ({ isAdmin = false }) => {
  const books = useStore((state) => state.books) as Book[];
  const setBooks = useStore((state) => state.setBooks);
  const notify = useStore((state) => state.notify);

  const handleDelete = (bookId: string) => {
    setBooks(books.filter((b) => b.id !== bookId));
    notify('Book removed');
  };

  return (
    <div className="bg-white rounded-[20px] shadow-sm border border-gray-50 overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-[#F4F7FE] text-[#1B254B]">
          <tr>
            <th className="px-6 py-4 font-bold">Book</th>
            <th className="px-6 py-4 font-bold">Owner</th>
            <th className="px-6 py-4 font-bold">Status</th>
            {isAdmin && (
              <th className="px-6 py-4 font-bold text-right">Action</th>
            )}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-50">
          {books.map((book) => (
            <tr key={book.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <img
                    src={book.coverUrl}
                    className="w-10 h-14 object-cover rounded shadow-sm"
                    alt="cover"
                  />
                  <div>
                    <div className="font-bold text-[#1B254B]">{book.title}</div>
                    <div className="text-xs text-gray-500">{book.author}</div>
                  </div>
                </div>
              </td>

              <td className="px-6 py-4 text-sm text-gray-600">
                {/* Your Book type has owner?: { name }, and ownerId. */}
                {book.owner?.name ?? '—'}
              </td>

              <td className="px-6 py-4">
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${
                    book.stock > 0
                      ? 'bg-green-50 text-green-600'
                      : 'bg-red-50 text-red-600'
                  }`}
                >
                  {book.stock > 0 ? 'Available' : 'Lended'}
                </span>
              </td>

              {isAdmin && (
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleDelete(book.id)}
                    className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                    aria-label="Delete book"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
