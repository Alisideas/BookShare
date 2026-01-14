// components/tables/UsersTable.tsx
// TABLE COMPONENT

'use client';

import { useStore } from '@/lib/store/useStore';

export const UsersTable: React.FC = () => {
  const users = useStore((state) => state.users as any);

  return (
    <div className="bg-white rounded-[20px] shadow-sm border border-gray-50 overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-[#F4F7FE] text-[#1B254B]">
          <tr>
            <th className="px-6 py-4 font-bold">User</th>
            <th className="px-6 py-4 font-bold">Email</th>
            <th className="px-6 py-4 font-bold">Location</th>
            <th className="px-6 py-4 font-bold">Joined</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {users.map((user: any) => (
            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#4318FF] text-white flex items-center justify-center font-bold text-xs">
                  {user.name[0]}
                </div>
                <span className="font-bold text-[#1B254B]">{user.name}</span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {user.location}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">{user.joined}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};