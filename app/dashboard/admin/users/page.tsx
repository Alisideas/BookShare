// app/dashboard/admin/users/page.tsx
// ADMIN USERS PAGE (Updated)

'use client';

import { Loader2 } from 'lucide-react';
import { useUsers } from '@/hooks/useData';
import { UsersTable } from '@/components/tables/UsersTable';

export default function AdminUsersPage() {
  const { users, loading } = useUsers();

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
        <h2 className="text-3xl font-bold text-[#1B254B]">User Directory</h2>
        <div className="text-sm text-gray-500">
          Total: <span className="font-bold text-[#4318FF]">{users.length}</span> users
        </div>
      </div>
      <UsersTable users={users} />
    </div>
  );
}