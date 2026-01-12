// lib/types/index.ts
// TYPE DEFINITIONS FILE

export interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  stock: number;
  total: number;
  coverUrl: string;
  ownerId: number | string;
  ownerName: string;
  maxDuration: number;
  description: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  joined: string;
  location: string;
  bio: string;
}

export interface Transaction {
  id: number;
  bookId: number;
  userId: number;
  issueDate: string;
  returnDate: string | null;
  status: 'Active' | 'Returned';
}

export interface Message {
  senderId: number;
  text: string;
  timestamp: string;
}

export interface Chat {
  id: number;
  participants: number[];
  messages: Message[];
}

export interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
}

export type UserRole = 'user' | 'admin';