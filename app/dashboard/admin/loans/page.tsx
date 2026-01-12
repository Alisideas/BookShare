// app/dashboard/admin/loans/page.tsx
// ADMIN LOANS PAGE

'use client';

import { LoansTable } from '@/components/tables/LoansTable';

export default function AdminLoansPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h2 className="text-3xl font-bold text-[#1B254B]">Loan History</h2>
      <LoansTable isAdmin />
    </div>
  );
}