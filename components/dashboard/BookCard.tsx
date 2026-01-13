// components/dashboard/BookCard.tsx
// REUSABLE COMPONENT (Updated)

import { useState } from 'react';
import { LucideIcon, BookOpen } from 'lucide-react';
import { Book } from '@/lib/types';

interface BookCardProps {
  book: Book;
  showOwner?: boolean;
  onOwnerClick?: () => void;
  actionButton?: {
    onClick: () => void;
    icon: LucideIcon;
    variant: 'primary' | 'danger' | 'disabled';
    disabled?: boolean;
  };
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  showOwner = false,
  onOwnerClick,
  actionButton,
}) => {
  const ownerName = book.owner?.name || 'Unknown';
  const [imageError, setImageError] = useState(false);

  return (
    <div className="group relative bg-white rounded-[20px] p-3 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-50 flex flex-col h-full">
      {/* Book Cover */}
      <div className="relative aspect-[2/3] rounded-2xl overflow-hidden mb-4 bg-gray-100">
        {!imageError && book.coverUrl ? (
          <img
            src={book.coverUrl}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            alt={book.title}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <BookOpen className="w-16 h-16 text-gray-400" />
          </div>
        )}
        

        {/* Duration Badge */}
        <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-[#1B254B] shadow-sm">
          {book.maxDuration}d
        </div>

        {/* Owner Badge */}
        {showOwner && onOwnerClick && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOwnerClick();
            }}
            className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md pl-1 pr-3 py-1 rounded-full flex items-center gap-2 text-xs font-bold text-[#1B254B] shadow-sm hover:bg-white transition-colors"
          >
            <div className="w-5 h-5 bg-[#4318FF] rounded-full text-white flex items-center justify-center text-[8px]">
              {ownerName[0]}
            </div>
            {ownerName}
          </button>
        )}
      </div>

      {/* Book Info */}
      <div className="px-2 pb-2 flex-1 flex flex-col">
        <h4 className="font-bold text-[#1B254B] text-lg leading-tight line-clamp-1 mb-1">
          {book.title}
        </h4>
        <p className="text-sm text-gray-400 mb-3 font-medium">{book.author}</p>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between">
          <span
            className={`px-2.5 py-1 rounded-md text-xs font-bold ${
              book.stock > 0
                ? 'bg-green-50 text-green-600'
                : 'bg-red-50 text-red-500'
            }`}
          >
            {book.stock > 0 ? 'Available' : 'Taken'}
          </span>

          {actionButton && (
            <button
              disabled={actionButton.disabled}
              onClick={actionButton.onClick}
              className={`p-2 rounded-full transition-colors ${
                actionButton.variant === 'danger'
                  ? 'bg-red-50 text-red-500 hover:bg-red-100'
                  : actionButton.variant === 'disabled'
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-[#4318FF] text-white hover:bg-[#3311CC] shadow-md shadow-indigo-500/20'
              }`}
            >
              <actionButton.icon className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};