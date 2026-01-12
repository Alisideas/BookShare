// app/dashboard/admin/users/page.tsx
// ADMIN USERS PAGE

'use client';

import { UsersTable } from '@/components/tables/UsersTable';

export default function AdminUsersPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h2 className="text-3xl font-bold text-[#1B254B]">User Directory</h2>
      <UsersTable />
    </div>
  );
}