// app/dashboard/layout.tsx
// DASHBOARD LAYOUT (wraps all dashboard pages)

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { useStore } from '@/lib/store/useStore';
import { LogOut } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const currentUser = useStore((state) => state.currentUser);
  const setCurrentUser = useStore((state) => state.setCurrentUser);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  const handleLogout = () => {
    setCurrentUser(null);
    router.push('/');
  };

  if (!currentUser) {
    return null; // Or a loading spinner
  }

  return (
    <div className="min-h-screen bg-[#F4F7FE] font-sans flex text-[#1B254B]">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-[312px] p-4 md:p-8 min-h-screen">
        {/* Mobile Header */}
        <div className="md:hidden flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm">
          <span className="font-bold text-xl">BookShare</span>
          <button onClick={handleLogout}>
            <LogOut className="w-5 h-5 text-red-500" />
          </button>
        </div>

        {/* Page Content */}
        {children}
      </main>
    </div>
  );
}