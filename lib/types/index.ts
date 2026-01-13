// lib/types/index.ts
// TYPE DEFINITIONS FILE (Updated)

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  stock: number;
  total: number;
  coverUrl: string;
  maxDuration: number;
  description: string;
  ownerId: string;
  owner?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  location?: string;
  bio?: string;
  joined: Date;
  image?: string;
}

export interface Transaction {
  id: string;
  bookId: string;
  userId: string;
  issueDate: Date;
  returnDate?: Date | null;
  status: 'Active' | 'Returned';
  book?: Book;
  user?: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  timestamp: Date;
  sender?: User;
}

export interface Chat {
  id: string;
  participantIds: string[];
  participants?: User[];
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
}