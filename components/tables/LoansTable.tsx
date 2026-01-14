// components/tables/LoansTable.tsx
// TABLE COMPONENT (Updated)

'use client';

import { Transaction } from '@/lib/types';

interface LoansTableProps {
  isAdmin?: boolean;
  transactions: Transaction[];
  onRefetch?: () => void;
}

export const LoansTable: React.FC<LoansTableProps> = ({
  isAdmin = false,
  transactions,
  onRefetch,
}) => {
  const handleForceReturn = async (transactionId: string) => {
    if (!confirm('Are you sure you want to force return this book?')) return;

    try {
      const response = await fetch(`/api/transactions/${transactionId}/return`, {
        method: 'POST',
      });

      if (!response.ok) {
        alert('Failed to return book');
        return;
      }

      alert('Book returned successfully');
      if (onRefetch) onRefetch();
    } catch (error) {
      console.error('Error returning book:', error);
      alert('Failed to return book');
    }
  };

  return (
    <div className="bg-white rounded-[20px] shadow-sm border border-gray-50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-[#F4F7FE] text-[#1B254B]">
            <tr>
              <th className="px-6 py-4 font-bold">Book</th>
              <th className="px-6 py-4 font-bold">Borrower</th>
              <th className="px-6 py-4 font-bold">Issue Date</th>
              <th className="px-6 py-4 font-bold">Return Date</th>
              <th className="px-6 py-4 font-bold">Status</th>
              {isAdmin && (
                <th className="px-6 py-4 font-bold text-right">Admin Action</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {transactions.length === 0 ? (
              <tr>
                <td
                  colSpan={isAdmin ? 6 : 5}
                  className="px-6 py-10 text-center text-gray-400"
                >
                  No transactions found
                </td>
              </tr>
            ) : (
              transactions.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-[#1B254B]">
                    {t.book?.title || 'Unknown Book'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {t.user?.name || 'Unknown User'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(t.issueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {t.returnDate
                      ? new Date(t.returnDate).toLocaleDateString()
                      : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        t.status === 'Active'
                          ? 'bg-orange-50 text-orange-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 text-right">
                      {t.status === 'Active' && (
                        <button
                          onClick={() => handleForceReturn(t.id)}
                          className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-100 font-bold transition-colors"
                        >
                          Force Return
                        </button>
                      )}
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