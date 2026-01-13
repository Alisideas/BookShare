'use client';

import { useMemo, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import {
  Book,
  Users,
  LayoutDashboard,
  LogOut,
  BookOpen,
  Library,
  User,
  MessageSquare,
  List,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarItem {
  id: string;
  icon: any;
  label: string;
  path: string;
}

export const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  const isAdmin = (session?.user as any)?.role === 'admin';
  const userId = (session?.user as any)?.id;

  const adminItems: SidebarItem[] = [
    {
      id: 'admin-overview',
      icon: LayoutDashboard,
      label: 'Overview',
      path: '/dashboard/admin/overview',
    },
    {
      id: 'admin-books',
      icon: Book,
      label: 'Books',
      path: '/dashboard/admin/books',
    },
    {
      id: 'admin-users',
      icon: Users,
      label: 'Users',
      path: '/dashboard/admin/users',
    },
    {
      id: 'admin-loans',
      icon: List,
      label: 'Loans',
      path: '/dashboard/admin/loans',
    },
  ];

  const userItems: SidebarItem[] = [
    {
      id: 'marketplace',
      icon: Library,
      label: 'Marketplace',
      path: '/dashboard/marketplace',
    },
    {
      id: 'profile',
      icon: User,
      label: 'My Profile',
      path: `/dashboard/profile/${userId}`,
    },
    {
      id: 'borrowed',
      icon: BookOpen,
      label: 'My Loans',
      path: '/dashboard/borrowed',
    },
    {
      id: 'messages',
      icon: MessageSquare,
      label: 'Messages',
      path: '/dashboard/messages',
    },
  ];

  const sidebarItems = useMemo(() => (isAdmin ? adminItems : userItems), [isAdmin, userId]);

  return (
    <aside
      className={[
        'bg-white m-4 rounded-[30px] flex flex-col fixed h-[calc(100vh-32px)]',
        'shadow-[0px_20px_50px_rgba(0,0,0,0.03)] z-50 hidden md:flex',
        'transition-all duration-300 ease-in-out',
        collapsed ? 'w-[96px]' : 'w-[280px]',
      ].join(' ')}
    >
      {/* Header */}
      <div className="p-6 flex items-center justify-between gap-3 border-b border-gray-50">
        <div className="flex items-center gap-3">
          <div className="bg-[#4318FF] p-2.5 rounded-xl">
            <BookOpen className="text-white w-6 h-6" />
          </div>

          {!collapsed && (
            <span className="text-2xl font-bold tracking-tight text-[#1B254B]">
              BookShare
            </span>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="p-2 rounded-xl hover:bg-gray-50 text-[#1B254B] transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Nav */}
      <nav className={collapsed ? 'flex-1 px-3 py-6 space-y-2' : 'flex-1 px-4 py-6 space-y-2'}>
        {sidebarItems.map((item) => {
          const isActive = pathname === item.path || pathname.startsWith(item.path);

          return (
            <button
              key={item.id}
              onClick={() => router.push(item.path)}
              className={[
                'w-full flex items-center rounded-[20px] transition-all duration-300 font-bold',
                collapsed ? 'justify-center px-0 py-4' : 'gap-4 px-5 py-4',
                isActive
                  ? 'bg-[#4318FF] text-white shadow-lg shadow-indigo-500/30'
                  : 'text-[#A3AED0] hover:bg-gray-50 hover:text-[#4318FF]',
              ].join(' ')}
              title={collapsed ? item.label : undefined}
              aria-label={item.label}
            >
              <item.icon className="w-5 h-5" />
              {!collapsed && item.label}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className={collapsed ? 'p-4' : 'p-8'}>
        {/* Promo card */}
        <div
          className={[
            'bg-gradient-to-br from-[#868CFF] to-[#4318FF] rounded-[24px] text-white relative overflow-hidden mb-6 shadow-xl shadow-indigo-500/30',
            collapsed ? 'p-4' : 'p-6',
          ].join(' ')}
        >
          <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/20 rounded-full blur-xl" />

          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-3 backdrop-blur-sm">
            <Sparkles className="w-5 h-5" />
          </div>

          {!collapsed ? (
            <>
              <p className="text-sm font-bold mb-1">Upgrade to Pro</p>
              <p className="text-xs text-indigo-100 mb-3">Get unlimited listings</p>
            </>
          ) : (
            <p className="text-xs font-bold text-center">Pro</p>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={[
            'flex items-center font-bold rounded-xl w-full transition-colors',
            collapsed ? 'justify-center px-0 py-3' : 'gap-3 px-4 py-3',
            'text-red-500 hover:bg-red-50',
          ].join(' ')}
          title={collapsed ? 'Logout' : undefined}
          aria-label="Logout"
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && 'Logout'}
        </button>
      </div>
    </aside>
  );
};
