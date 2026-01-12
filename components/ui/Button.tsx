// components/ui/Button.tsx
// SHARED UI COMPONENT

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'ai';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  className = '',
  disabled = false,
  ...props
}) => {
  const baseStyle = "px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 text-sm";
  
  const variants = {
    primary: "bg-[#4318FF] text-white hover:bg-[#3311CC] shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed",
    secondary: "bg-white text-gray-700 border border-gray-100 hover:bg-gray-50 hover:border-gray-300 shadow-sm",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100",
    ghost: "bg-transparent text-gray-500 hover:text-[#4318FF] hover:bg-[#F4F7FE]",
    ai: "bg-gradient-to-r from-[#868CFF] to-[#4318FF] text-white hover:shadow-lg shadow-indigo-500/20"
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};