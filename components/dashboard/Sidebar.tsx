// components/dashboard/Sidebar.tsx
// LAYOUT COMPONENT

'use client';

import { useRouter, usePathname } from 'next/navigation';
import { 
  Book, Users, LayoutDashboard, LogOut, BookOpen, 
  Library, User, MessageSquare, List, Sparkles 
} from 'lucide-react';
import { useStore } from '@/lib/store/useStore';
import type { LucideIcon } from 'lucide-react';

interface SidebarItem {
  id: string;
  icon: LucideIcon;
  label: string;
  path: string;
}

export const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const currentUser = useStore((state) => state.currentUser);
  const setCurrentUser = useStore((state) => state.setCurrentUser);

  const handleLogout = () => {
    setCurrentUser(null);
    router.push('/');
  };

  const adminItems: SidebarItem[] = [
    { id: 'admin-overview', icon: LayoutDashboard, label: 'Overview', path: '/dashboard/admin/overview' },
    { id: 'admin-books', icon: Book, label: 'Books', path: '/dashboard/admin/books' },
    { id: 'admin-users', icon: Users, label: 'Users', path: '/dashboard/admin/users' },
    { id: 'admin-loans', icon: List, label: 'Loans', path: '/dashboard/admin/loans' },
  ];

  const userId = typeof currentUser === 'object' && currentUser !== null && 'id' in currentUser ? currentUser.id : 101;

  const userItems: SidebarItem[] = [
    { id: 'marketplace', icon: Library, label: 'Marketplace', path: '/dashboard/marketplace' },
    { id: 'profile', icon: User, label: 'My Profile', path: `/dashboard/profile/${userId}` },
    { id: 'borrowed', icon: BookOpen, label: 'My Loans', path: '/dashboard/borrowed' },
    { id: 'messages', icon: MessageSquare, label: 'Messages', path: '/dashboard/messages' },
  ];

  const sidebarItems = currentUser === 'admin' ? adminItems : userItems;

  return (
    <aside className="w-[280px] bg-white m-4 rounded-[30px] flex flex-col fixed h-[calc(100vh-32px)] shadow-[0px_20px_50px_rgba(0,0,0,0.03)] z-50 hidden md:flex">
      <div className="p-8 flex items-center gap-3 border-b border-gray-50">
        <div className="bg-[#4318FF] p-2.5 rounded-xl">
          <BookOpen className="text-white w-6 h-6" />
        </div>
        <span className="text-2xl font-bold tracking-tight text-[#1B254B]">
          BookShare
        </span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.path || pathname.startsWith(item.path);
          
          return (
            <button
              key={item.id}
              onClick={() => router.push(item.path)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-[20px] transition-all duration-300 font-bold ${
                isActive
                  ? 'bg-[#4318FF] text-white shadow-lg shadow-indigo-500/30'
                  : 'text-[#A3AED0] hover:bg-gray-50 hover:text-[#4318FF]'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-8">
        <div className="bg-gradient-to-br from-[#868CFF] to-[#4318FF] rounded-[24px] p-6 text-white relative overflow-hidden mb-6 shadow-xl shadow-indigo-500/30">
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/20 rounded-full blur-xl" />
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-3 backdrop-blur-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <p className="text-sm font-bold mb-1">Upgrade to Pro</p>
          <p className="text-xs text-indigo-100 mb-3">Get unlimited listings</p>
        </div>
        
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-red-500 font-bold hover:bg-red-50 px-4 py-3 rounded-xl w-full transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};