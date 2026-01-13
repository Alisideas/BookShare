// app/dashboard/layout.tsx
// DASHBOARD LAYOUT (Updated with Auth Check)

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { LogOut, Loader2 } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#F4F7FE] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#4318FF] mx-auto mb-4" />
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F4F7FE] font-sans flex text-[#1B254B]">
      <Sidebar />

      <main className="flex-1 md:ml-[312px] p-4 md:p-8 min-h-screen">
        {/* Mobile Header */}
        <div className="md:hidden flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm">
          <span className="font-bold text-xl">BookShare</span>
          <button onClick={() => router.push('/api/auth/signout')}>
            <LogOut className="w-5 h-5 text-red-500" />
          </button>
        </div>

        {children}
      </main>
    </div>
  );
}