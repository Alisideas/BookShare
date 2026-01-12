// app/page.tsx
// LANDING PAGE

'use client';

import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white font-sans text-[#1B254B] flex flex-col">
      <nav className="flex items-center justify-between p-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2 text-[#4318FF] font-black text-2xl tracking-tight">
          <BookOpen className="w-8 h-8" />
          <span>BookShare.</span>
        </div>
        <Button 
          onClick={() => router.push('/login')} 
          variant="ghost" 
          className="text-base"
        >
          Login
        </Button>
      </nav>

      <header className="flex-1 flex flex-col justify-center items-center px-6 text-center max-w-4xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
          Read. Share. <br />
          <span className="text-[#4318FF]">Connect.</span>
        </h1>
        <p className="text-xl text-gray-500 mb-12 max-w-2xl font-medium">
          The modern P2P library for communities. Lending made social.
        </p>
        <div className="flex gap-4">
          <Button 
            onClick={() => router.push('/login')} 
            className="px-10 py-5 text-lg rounded-full"
          >
            Get Started
          </Button>
          <Button 
            onClick={() => router.push('/login')} 
            variant="secondary" 
            className="px-10 py-5 text-lg rounded-full"
          >
            Explore
          </Button>
        </div>
      </header>
    </div>
  );
}