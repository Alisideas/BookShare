// lib/store/useStore.ts
// STATE MANAGEMENT FILE (using Zustand)

'use client';

import { create } from 'zustand';
import { Book, User, Transaction, Chat, Notification } from '../types/index';
import { INITIAL_BOOKS, INITIAL_USERS, INITIAL_TRANSACTIONS, INITIAL_CHATS } from '../data/mockData';

interface AppState {
  // State
  currentUser: User | 'admin' | null;
  books: Book[];
  users: User[];
  transactions: Transaction[];
  chats: Chat[];
  notification: Notification | null;
  selectedChatId: number | null;

  // Actions
  setCurrentUser: (user: User | 'admin' | null) => void;
  setBooks: (books: Book[]) => void;
  addBook: (book: Omit<Book, 'id' | 'stock' | 'total' | 'ownerId' | 'ownerName'>) => void;
  removeBook: (bookId: number) => void;
  borrowBook: (bookId: number, userId: number) => void;
  returnBook: (transactionId: number) => void;
  notify: (message: string, type?: 'success' | 'error' | 'info') => void;
  clearNotification: () => void;
  setSelectedChatId: (id: number | null) => void;
  initiateChat: (userId: number, targetUserId: number) => void;
  sendMessage: (chatId: number, senderId: number, text: string) => void;
  getBook: (id: number) => Book | undefined;
  getUser: (id: number) => User | undefined;
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

  addBook: (newBook) => set((state) => {
    const currentUser = state.currentUser;
    if (!currentUser || currentUser === 'admin') return state;

    const book: Book = {
      ...newBook,
      id: Date.now(),
      stock: 1,
      total: 1,
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      coverUrl: newBook.coverUrl || "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=800"
    };

    return { books: [...state.books, book] };
  }),

  removeBook: (bookId) => set((state) => ({
    books: state.books.filter(b => b.id !== bookId)
  })),

  borrowBook: (bookId, userId) => set((state) => {
    const book = state.books.find(b => b.id === bookId);
    if (!book || book.stock === 0) return state;

    const newTransaction: Transaction = {
      id: Date.now(),
      bookId,
      userId,
      issueDate: new Date().toISOString().split('T')[0],
      returnDate: null,
      status: 'Active'
    };

    return {
      transactions: [newTransaction, ...state.transactions],
      books: state.books.map(b =>
        b.id === bookId ? { ...b, stock: b.stock - 1 } : b
      )
    };
  }),

  returnBook: (transactionId) => set((state) => {
    const transaction = state.transactions.find(t => t.id === transactionId);
    if (!transaction) return state;

    return {
      transactions: state.transactions.map(t =>
        t.id === transactionId
          ? { ...t, returnDate: new Date().toISOString().split('T')[0], status: 'Returned' as const }
          : t
      ),
      books: state.books.map(b =>
        b.id === transaction.bookId ? { ...b, stock: b.stock + 1 } : b
      )
    };
  }),

  notify: (message, type = 'success') => {
    set({ notification: { message, type } });
    setTimeout(() => set({ notification: null }), 3000);
  },

  clearNotification: () => set({ notification: null }),

  setSelectedChatId: (id) => set({ selectedChatId: id }),

  initiateChat: (userId, targetUserId) => set((state) => {
    const existingChat = state.chats.find(c =>
      c.participants.includes(userId) && c.participants.includes(targetUserId)
    );

    if (existingChat) {
      return { selectedChatId: existingChat.id };
    }

    const newChat: Chat = {
      id: Date.now(),
      participants: [userId, targetUserId],
      messages: []
    };

    return {
      chats: [...state.chats, newChat],
      selectedChatId: newChat.id
    };
  }),

  sendMessage: (chatId, senderId, text) => set((state) => {
    if (!text.trim()) return state;

    return {
      chats: state.chats.map(chat => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: [
              ...chat.messages,
              {
                senderId,
                text,
                timestamp: new Date().toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })
              }
            ]
          };
        }
        return chat;
      })
    };
  }),

  getBook: (id) => get().books.find(b => b.id === id),
  getUser: (id) => get().users.find(u => u.id === id),
}));