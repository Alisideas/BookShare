// components/modals/AddBookModal.tsx
// MODAL COMPONENT (Updated)

'use client';

import { useState } from 'react';
import { XCircle, Library, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { generateWithGemini } from '@/lib/api/gemini';
import { User } from '@/lib/types';

interface AddBookModalProps {
  onClose: () => void;
}

export const AddBookModal: React.FC<AddBookModalProps> = ({ onClose }) => {
  const [form, setForm] = useState({
    title: '',
    author: '',
    category: '',
    maxDuration: 14,
    description: '',
    coverUrl: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGenerate = async () => {
    if (!form.title) return;

    setIsGenerating(true);
    const prompt = `Write a short, engaging description for the book "${form.title}" by ${form.author}. Under 30 words.`;
    const desc = await generateWithGemini(prompt);
    setForm((prev) => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  const handleSubmit = async () => {
    if (!form.title || !form.author || !form.category) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || 'Failed to add book');
        return;
      }

      alert('Book listed successfully!');
      onClose();
    } catch (error) {
      console.error('Error adding book:', error);
      alert('Failed to add book');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#1e1e2d]/50 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
      <div className="bg-white w-full max-w-lg rounded-[30px] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-bold text-[#1B254B]">List a Book</h3>
            <p className="text-gray-400 text-sm">
              Share your collection with the world
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XCircle className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="Title *"
              className="w-full p-4 bg-[#F4F7FE] rounded-2xl border-none focus:ring-2 focus:ring-[#4318FF] outline-none text-[#1B254B] font-medium placeholder:text-[#A3AED0]"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <input
              placeholder="Author *"
              className="w-full p-4 bg-[#F4F7FE] rounded-2xl border-none focus:ring-2 focus:ring-[#4318FF] outline-none text-[#1B254B] font-medium placeholder:text-[#A3AED0]"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
            />
          </div>

          <div className="relative">
            <input
              placeholder="Cover Image URL (Optional)"
              className="w-full p-4 pl-12 bg-[#F4F7FE] rounded-2xl border-none focus:ring-2 focus:ring-[#4318FF] outline-none text-[#1B254B] font-medium placeholder:text-[#A3AED0]"
              value={form.coverUrl}
              onChange={(e) => setForm({ ...form, coverUrl: e.target.value })}
            />
            <Library className="absolute left-4 top-4 h-5 w-5 text-[#A3AED0]" />
          </div>

          <div className="relative">
            <textarea
              placeholder="Book description..."
              className="w-full p-4 bg-[#F4F7FE] rounded-2xl border-none focus:ring-2 focus:ring-[#4318FF] outline-none text-[#1B254B] font-medium placeholder:text-[#A3AED0] h-32 resize-none"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !form.title || !form.author}
              className="absolute bottom-3 right-3 text-xs bg-white shadow-sm text-[#4318FF] hover:bg-gray-50 px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-bold transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Sparkles className="w-3 h-3" />
              )}
              {isGenerating ? 'Magic...' : 'AI Write'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <select
              className="w-full p-4 bg-[#F4F7FE] rounded-2xl border-none focus:ring-2 focus:ring-[#4318FF] outline-none text-[#1B254B] font-medium"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="">Category *</option>
              <option value="Fiction">Fiction</option>
              <option value="Technology">Technology</option>
              <option value="Science">Science</option>
              <option value="Biography">Biography</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Classic">Classic</option>
              <option value="Dystopian">Dystopian</option>
            </select>
            <input
              type="number"
              min="1"
              max="365"
              placeholder="Duration (Days)"
              className="w-full p-4 bg-[#F4F7FE] rounded-2xl border-none focus:ring-2 focus:ring-[#4318FF] outline-none text-[#1B254B] font-medium"
              value={form.maxDuration}
              onChange={(e) =>
                setForm({ ...form, maxDuration: parseInt(e.target.value) || 14 })
              }
            />
          </div>

          <Button
            className="w-full py-4 text-lg"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Publishing...
              </>) : (
          'Publish Listing'
        )}
      </Button>
        </div>
      </div>
    </div>
  );
};