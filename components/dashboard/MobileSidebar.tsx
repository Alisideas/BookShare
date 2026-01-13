'use client';

import { useEffect, useMemo, useState } from 'react';
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
  X,
  Menu,
} from 'lucide-react';

interface SidebarItem {
  id: string;
  icon: any;
  label: string;
  path: string;
}

export const MobileSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  const [open, setOpen] = useState(false);

  const isAdmin = (session?.user as any)?.role === 'admin';
  const userId = (session?.user as any)?.id;

  const adminItems: SidebarItem[] = [
    { id: 'admin-overview', icon: LayoutDashboard, label: 'Overview', path: '/dashboard/admin/overview' },
    { id: 'admin-books', icon: Book, label: 'Books', path: '/dashboard/admin/books' },
    { id: 'admin-users', icon: Users, label: 'Users', path: '/dashboard/admin/users' },
    { id: 'admin-loans', icon: List, label: 'Loans', path: '/dashboard/admin/loans' },
  ];

  const userItems: SidebarItem[] = [
    { id: 'marketplace', icon: Library, label: 'Marketplace', path: '/dashboard/marketplace' },
    { id: 'profile', icon: User, label: 'My Profile', path: `/dashboard/profile/${userId}` },
    { id: 'borrowed', icon: BookOpen, label: 'My Loans', path: '/dashboard/borrowed' },
    { id: 'messages', icon: MessageSquare, label: 'Messages', path: '/dashboard/messages' },
  ];

  const sidebarItems = useMemo(() => (isAdmin ? adminItems : userItems), [isAdmin, userId]);

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  // Close on route change
  useEffect(() => {
    setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Close on ESC
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Prevent background scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      {/* Top bar button (mobile only) */}
      <div className="md:hidden fixed top-4 left-4 z-[60]">
        <button
          onClick={() => setOpen(true)}
          className="bg-white shadow-[0px_10px_30px_rgba(0,0,0,0.08)] border border-gray-100 rounded-2xl p-3"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6 text-[#1B254B]" />
        </button>
      </div>

      {/* Overlay */}
      <div
        className={`md:hidden fixed inset-0 z-[55] transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setOpen(false)}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Drawer */}
      <aside
        className={`md:hidden fixed top-0 left-0 h-full z-[56] w-[85%] max-w-[320px] bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 flex items-center justify-between border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="bg-[#4318FF] p-2.5 rounded-xl">
              <BookOpen className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-[#1B254B]">
              BookShare
            </span>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-xl hover:bg-gray-50 text-[#1B254B]"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Nav */}
        <nav className="px-4 py-6 space-y-2">
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

        {/* Bottom */}
        <div className="p-6 mt-auto">
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
    </>
  );
};
