// components/dashboard/Notification.tsx
// SHARED COMPONENT

'use client';

import { CheckCircle } from 'lucide-react';
import { useStore } from '@/lib/store/useStore';

export const Notification = () => {
  const notification = useStore((state) => state.notification);

  if (!notification) return null;

  return (
    <div className="fixed top-6 right-6 bg-[#1B254B] text-white px-6 py-4 rounded-xl shadow-2xl z-[200] animate-bounce flex items-center gap-3">
      <CheckCircle className="w-5 h-5 text-green-400" />
      {notification.message}
    </div>
  );
};