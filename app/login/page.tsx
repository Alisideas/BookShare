// app/login/page.tsx
// LOGIN PAGE

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useStore } from '@/lib/store/useStore';
import { INITIAL_USERS } from '@/lib/data/mockData';

export default function LoginPage() {
  const router = useRouter();
  const setCurrentUser = useStore((state) => state.setCurrentUser);

  const handleLogin = (role: 'user' | 'admin') => {
    if (role === 'admin') {
      setCurrentUser('admin');
      router.push('/dashboard/admin/overview');
    } else {
      setCurrentUser(INITIAL_USERS[0]);
      router.push('/dashboard/marketplace');
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FE] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-[30px] shadow-2xl text-center animate-in zoom-in-95 duration-300">
        <div className="mb-6 flex justify-center">
          <div className="bg-[#4318FF] p-4 rounded-2xl shadow-lg shadow-indigo-500/30">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-[#1B254B] mb-2">Welcome Back</h1>
        <p className="text-gray-400 mb-8">Choose your role to continue</p>
        
        <div className="space-y-4">
          <Button 
            onClick={() => handleLogin('user')} 
            className="w-full py-4 text-lg shadow-xl shadow-indigo-500/20"
          >
            Login as Alice (User)
          </Button>
          <Button 
            onClick={() => handleLogin('admin')} 
            variant="secondary" 
            className="w-full py-4 text-lg"
          >
            Login as Admin
          </Button>
        </div>
        
        <button
          onClick={() => router.push('/')}
          className="mt-8 text-gray-400 hover:text-[#4318FF] text-sm font-medium flex items-center justify-center gap-2 w-full"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Home
        </button>
      </div>
    </div>
  );
}