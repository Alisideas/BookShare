// components/tables/BooksTable.tsx
// TABLE COMPONENT (Updated)

'use client';

import { Trash2 } from 'lucide-react';
import { Book } from '@/lib/types';

interface BooksTableProps {
  isAdmin?: boolean;
  books: Book[];
  onRefetch?: () => void;
}

export const BooksTable: React.FC<BooksTableProps> = ({
  isAdmin = false,
  books,
  onRefetch,
}) => {
  const handleDelete = async (bookId: string) => {
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
      if (onRefetch) onRefetch();
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Failed to delete book');
    }
  };

  return (
    <div className="bg-white rounded-[20px] shadow-sm border border-gray-50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#F4F7FE] text-[#1B254B]">
            <tr>
              <th className="px-6 py-4 font-bold">Book</th>
              <th className="px-6 py-4 font-bold">Owner</th>
              <th className="px-6 py-4 font-bold">Category</th>
              <th className="px-6 py-4 font-bold">Status</th>
              {isAdmin && <th className="px-6 py-4 font-bold text-right">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {books.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 5 : 4} className="px-6 py-10 text-center text-gray-400">
                  No books found
                </td>
              </tr>
            ) : (
              books.map((book) => (
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
                    {book.owner?.name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{book.category}</td>
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
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};