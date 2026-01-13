// app/login/page.tsx
// LOGIN PAGE (Updated with NextAuth)

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { BookOpen, ChevronLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    location: '',
    bio: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Login
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.error) {
          setError('Invalid email or password');
          setLoading(false);
          return;
        }

        router.push('/dashboard/marketplace');
        router.refresh();
      } else {
        // Register
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Registration failed');
          setLoading(false);
          return;
        }

        // Auto login after registration
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.error) {
          setError('Registration successful but login failed');
          setLoading(false);
          return;
        }

        router.push('/dashboard/marketplace');
        router.refresh();
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError('Something went wrong');
      setLoading(false);
    }
  };

  // Demo login function
  const handleDemoLogin = async (role: 'user' | 'admin') => {
    setLoading(true);
    const demoCredentials = {
      user: { email: 'demo@user.com', password: 'demouser123' },
      admin: { email: 'admin@bookshare.com', password: 'admin123' },
    };

    const result = await signIn('credentials', {
      ...demoCredentials[role],
      redirect: false,
    });

    if (result?.error) {
      setError('Demo account not found. Please register first.');
      setLoading(false);
      return;
    }

    router.push(
      role === 'admin' ? '/dashboard/admin/overview' : '/dashboard/marketplace'
    );
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#F4F7FE] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-[30px] shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="mb-6 flex justify-center">
          <div className="bg-[#4318FF] p-4 rounded-2xl shadow-lg shadow-indigo-500/30">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-[#1B254B] mb-2 text-center">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className="text-gray-400 mb-8 text-center">
          {isLogin
            ? 'Login to continue to BookShare'
            : 'Join the BookShare community'}
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-4 bg-[#F4F7FE] rounded-2xl border-none focus:ring-2 focus:ring-[#4318FF] outline-none text-[#1B254B] font-medium"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Location (e.g., New York, USA)"
                className="w-full p-4 bg-[#F4F7FE] rounded-2xl border-none focus:ring-2 focus:ring-[#4318FF] outline-none text-[#1B254B] font-medium"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
              />
              <textarea
                placeholder="Short bio about yourself"
                className="w-full p-4 bg-[#F4F7FE] rounded-2xl border-none focus:ring-2 focus:ring-[#4318FF] outline-none text-[#1B254B] font-medium resize-none h-24"
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
              />
            </>
          )}

          <input
            type="email"
            placeholder="Email"
            className="w-full p-4 bg-[#F4F7FE] rounded-2xl border-none focus:ring-2 focus:ring-[#4318FF] outline-none text-[#1B254B] font-medium"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-4 bg-[#F4F7FE] rounded-2xl border-none focus:ring-2 focus:ring-[#4318FF] outline-none text-[#1B254B] font-medium"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-4 text-lg shadow-xl shadow-indigo-500/20"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {isLogin ? 'Logging in...' : 'Creating account...'}
              </>
            ) : isLogin ? (
              'Login'
            ) : (
              'Create Account'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-[#4318FF] font-medium hover:underline"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : 'Already have an account? Login'}
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-gray-400 text-sm text-center mb-4">
            Try demo accounts:
          </p>
          <div className="space-y-2">
            <Button
              onClick={() => handleDemoLogin('user')}
              variant="secondary"
              disabled={loading}
              className="w-full"
            >
              Demo User Account
            </Button>
            <Button
              onClick={() => handleDemoLogin('admin')}
              variant="secondary"
              disabled={loading}
              className="w-full"
            >
              Demo Admin Account
            </Button>
          </div>
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