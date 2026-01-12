// components/tables/LoansTable.tsx
// TABLE COMPONENT

'use client';

import { useStore } from '@/lib/store/useStore';

interface LoansTableProps {
  isAdmin?: boolean;
}

export const LoansTable: React.FC<LoansTableProps> = ({ isAdmin = false }) => {
  const transactions = useStore((state) => state.transactions);
  const getBook = useStore((state) => state.getBook);
  const getUser = useStore((state) => state.getUser);
  const returnBook = useStore((state) => state.returnBook);
  const notify = useStore((state) => state.notify);

  const handleForceReturn = (transactionId: number) => {
    returnBook(transactionId);
    notify('Book returned by admin');
  };

  return (
    <div className="bg-white rounded-[20px] shadow-sm border border-gray-50 overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-[#F4F7FE] text-[#1B254B]">
          <tr>
            <th className="px-6 py-4 font-bold">Book</th>
            <th className="px-6 py-4 font-bold">Borrower</th>
            <th className="px-6 py-4 font-bold">Date</th>
            <th className="px-6 py-4 font-bold">Status</th>
            {isAdmin && (
              <th className="px-6 py-4 font-bold text-right">Admin Action</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {transactions.map((t) => {
            const book = getBook(t.bookId);
            const user = getUser(t.userId);

            return (
              <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-bold text-[#1B254B]">
                  {book?.title || 'Unknown Book'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {user?.name || 'Unknown User'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {t.issueDate}
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
                        className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-100 font-bold"
                      >
                        Force Return
                      </button>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};