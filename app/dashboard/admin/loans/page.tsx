// app/dashboard/admin/loans/page.tsx
// ADMIN LOANS PAGE (Updated)

'use client';

import { Loader2 } from 'lucide-react';
import { useTransactions } from '@/hooks/useData';
import { LoansTable } from '@/components/tables/LoansTable';

export default function AdminLoansPage() {
  const { transactions, loading, refetch } = useTransactions();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#4318FF]" />
      </div>
    );
  }

  const activeLoans = transactions.filter((t) => t.status === 'Active').length;
  const returnedLoans = transactions.filter((t) => t.status === 'Returned').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-[#1B254B]">Loan History</h2>
        <div className="flex gap-4 text-sm">
          <div className="text-gray-500">
            Active: <span className="font-bold text-orange-600">{activeLoans}</span>
          </div>
          <div className="text-gray-500">
            Returned: <span className="font-bold text-green-600">{returnedLoans}</span>
          </div>
        </div>
      </div>
      <LoansTable isAdmin transactions={transactions} onRefetch={refetch} />
    </div>
  );
}