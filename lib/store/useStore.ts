// lib/store/useStore.ts
// STATE MANAGEMENT FILE (using Zustand) — FIXED to match lib/types/index.ts

'use client';

import { create } from 'zustand';
import type { Book, User, Transaction, Chat, Notification, Message } from '../types/index';
import { INITIAL_BOOKS, INITIAL_USERS, INITIAL_TRANSACTIONS, INITIAL_CHATS } from '../data/mockData';

// Small helper for string IDs (works in browser; safe fallback)
const makeId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

interface AppState {
  // State
  currentUser: User | 'admin' | null;
  books: Book[];
  users: User[];
  transactions: Transaction[];
  chats: Chat[];
  notification: Notification | null;
  selectedChatId: string | null;

  // Actions
  setCurrentUser: (user: User | 'admin' | null) => void;

  setBooks: (books: Book[]) => void;

  addBook: (
    book: Omit<
      Book,
      'id' | 'stock' | 'total' | 'ownerId' | 'owner' | 'createdAt' | 'updatedAt'
    >
  ) => void;

  removeBook: (bookId: string) => void;

  borrowBook: (bookId: string, userId: string) => void;

  returnBook: (transactionId: string) => void;

  notify: (message: string, type?: 'success' | 'error' | 'info') => void;
  clearNotification: () => void;

  setSelectedChatId: (id: string | null) => void;

  initiateChat: (userId: string, targetUserId: string) => void;

  sendMessage: (chatId: string, senderId: string, text: string) => void;

  getBook: (id: string) => Book | undefined;
  getUser: (id: string) => User | undefined;
}

export const useStore = create<AppState>((set, get) => ({
  // Initial State
  currentUser: null,
  books: INITIAL_BOOKS,
  users: INITIAL_USERS,
  transactions: INITIAL_TRANSACTIONS,
  chats: INITIAL_CHATS,
  notification: null,
  selectedChatId: null,

  // Actions
  setCurrentUser: (user) => set({ currentUser: user }),

  setBooks: (books) => set({ books }),

  addBook: (newBook) =>
    set((state) => {
      const currentUser = state.currentUser;
      if (!currentUser || currentUser === 'admin') return state;

      const now = new Date();

      const book: Book = {
        ...newBook,
        id: makeId(),
        stock: 1,
        total: 1,
        ownerId: currentUser.id,
        owner: {
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email,
        },
        coverUrl:
          newBook.coverUrl ||
          'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=800',
        createdAt: now,
        updatedAt: now,
      };

      return { books: [...state.books, book] };
    }),

  removeBook: (bookId) =>
    set((state) => ({
      books: state.books.filter((b) => b.id !== bookId),
    })),

  borrowBook: (bookId, userId) =>
    set((state) => {
      const book = state.books.find((b) => b.id === bookId);
      if (!book || book.stock === 0) return state;

      const now = new Date();

      const newTransaction: Transaction = {
        id: makeId(),
        bookId,
        userId,
        issueDate: now,
        returnDate: null,
        status: 'Active',
        book,
        user: state.users.find((u) => u.id === userId),
        createdAt: now,
        updatedAt: now,
      };

      return {
        transactions: [newTransaction, ...state.transactions],
        books: state.books.map((b) =>
          b.id === bookId ? { ...b, stock: b.stock - 1, updatedAt: now } : b
        ),
      };
    }),

  returnBook: (transactionId) =>
    set((state) => {
      const tx = state.transactions.find((t) => t.id === transactionId);
      if (!tx) return state;

      const now = new Date();

      return {
        transactions: state.transactions.map((t) =>
          t.id === transactionId
            ? { ...t, returnDate: now, status: 'Returned', updatedAt: now }
            : t
        ),
        books: state.books.map((b) =>
          b.id === tx.bookId ? { ...b, stock: b.stock + 1, updatedAt: now } : b
        ),
      };
    }),

  notify: (message, type = 'success') => {
    set({ notification: { message, type } });
    setTimeout(() => set({ notification: null }), 3000);
  },

  clearNotification: () => set({ notification: null }),

  setSelectedChatId: (id) => set({ selectedChatId: id }),

  initiateChat: (userId, targetUserId) =>
    set((state) => {
      // Use participantIds from your types
      const existingChat = state.chats.find(
        (c) =>
          c.participantIds.includes(userId) && c.participantIds.includes(targetUserId)
      );

      if (existingChat) {
        return { selectedChatId: existingChat.id };
      }

      const now = new Date();

      const newChat: Chat = {
        id: makeId(),
        participantIds: [userId, targetUserId],
        // optional convenience cache for UI if you want it:
        participants: [
          state.users.find((u) => u.id === userId)!,
          state.users.find((u) => u.id === targetUserId)!,
        ].filter(Boolean),
        messages: [],
        createdAt: now,
        updatedAt: now,
      };

      return {
        chats: [...state.chats, newChat],
        selectedChatId: newChat.id,
      };
    }),

  sendMessage: (chatId, senderId, text) =>
    set((state) => {
      const trimmed = text.trim();
      if (!trimmed) return state;

      const now = new Date();

      const msg: Message = {
        id: makeId(),
        chatId,
        senderId,
        text: trimmed,
        timestamp: now,
        sender: state.users.find((u) => u.id === senderId),
      };

      return {
        chats: state.chats.map((chat) =>
          chat.id === chatId
            ? {
                ...chat,
                messages: [...chat.messages, msg],
                updatedAt: now,
              }
            : chat
        ),
      };
    }),

  getBook: (id) => get().books.find((b) => b.id === id),
  getUser: (id) => get().users.find((u) => u.id === id),
}));
