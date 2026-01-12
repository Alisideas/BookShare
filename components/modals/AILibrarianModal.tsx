// components/modals/AILibrarianModal.tsx
// MODAL COMPONENT

'use client';

import { useState, useEffect, useRef } from 'react';
import { XCircle, Sparkles, Send, Loader2 } from 'lucide-react';
import { generateWithGemini } from '@/lib/api/gemini';
import { Book, User } from '@/lib/types';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

interface AILibrarianModalProps {
  onClose: () => void;
  currentUser: User | 'admin';
  books: Book[];
}

export const AILibrarianModal: React.FC<AILibrarianModalProps> = ({
  onClose,
  currentUser,
  books,
}) => {
  const userName =
    currentUser !== 'admin' ? currentUser.name.split(' ')[0] : 'there';

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: `Hi ${userName}! I'm your AI Librarian. Looking for a new read?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Create context from available books
    const availableBooks = books
      .filter((b) => b.stock > 0)
      .map((b) => `${b.title} by ${b.author} (${b.category})`)
      .join(', ');

    const systemContext = `You are a helpful librarian. Available books: [${availableBooks}]. Only recommend from this list. Keep it short & fun.`;
    const prompt = `${systemContext}\nUser: ${input}\nLibrarian:`;

    const responseText = await generateWithGemini(prompt);
    setMessages((prev) => [...prev, { sender: 'ai', text: responseText }]);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-[#1e1e2d]/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-4">
      <div className="bg-white w-full max-w-md h-[80vh] sm:h-[600px] rounded-[30px] flex flex-col overflow-hidden shadow-2xl relative">
        {/* Header */}
        <div className="bg-[#4318FF] p-6 flex justify-between items-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-xl" />
          <div className="relative z-10 flex items-center gap-3">
            <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Librarian AI</h3>
              <p className="text-indigo-200 text-xs">Always online</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="relative z-10 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F4F7FE]">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-[#4318FF] text-white rounded-br-sm'
                    : 'bg-white text-[#1B254B] rounded-bl-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-gray-400 text-sm ml-4">
              <Loader2 className="w-4 h-4 animate-spin" />
              Thinking...
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
          <input
            className="flex-1 bg-[#F4F7FE] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4318FF] text-[#1B254B]"
            placeholder="Ask for a recommendation..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-[#4318FF] text-white p-3 rounded-xl hover:bg-[#3311CC] transition-colors disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};