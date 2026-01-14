// lib/data/mockData.ts
// INITIAL DATA FILE (Mongo/Prisma-compatible types)

import type { Book, User, Transaction, Chat, Message } from '../types';

const now = new Date();

export const INITIAL_USERS: User[] = [
  {
    id: 'u_demo_alice',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'user',
    joined: new Date('2023-10-12'),
    location: 'New York, USA',
    bio: 'Avid reader of tech and sci-fi. Always looking for the next big idea.',
    image: undefined,
  },
  {
    id: 'u_demo_bob',
    name: 'Bob Smith',
    email: 'bob@example.com',
    role: 'user',
    joined: new Date('2023-11-05'),
    location: 'London, UK',
    bio: 'History buff and classic literature enthusiast. Collecting rare editions.',
    image: undefined,
  },
  {
    id: 'u_demo_charlie',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    role: 'user',
    joined: new Date('2023-12-01'),
    location: 'Toronto, Canada',
    bio: "Loves dystopian novels and coffee. Let's discuss Orwell.",
    image: undefined,
  },
];

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'b_demo_1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    category: 'Classic',
    stock: 1,
    total: 1,
    coverUrl:
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800',
    maxDuration: 14,
    description:
      'A story of the fabulously wealthy Jay Gatsby and his new love for the beautiful Daisy Buchanan.',
    ownerId: 'u_demo_bob',
    owner: {
      id: 'u_demo_bob',
      name: 'Bob Smith',
      email: 'bob@example.com',
    },
    createdAt: new Date('2023-11-06'),
    updatedAt: new Date('2023-11-06'),
  },
  {
    id: 'b_demo_2',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    category: 'Technology',
    stock: 1,
    total: 1,
    coverUrl:
      'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800',
    maxDuration: 30,
    description:
      "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees.",
    ownerId: 'u_demo_alice',
    owner: {
      id: 'u_demo_alice',
      name: 'Alice Johnson',
      email: 'alice@example.com',
    },
    createdAt: new Date('2023-10-13'),
    updatedAt: new Date('2023-10-13'),
  },
  {
    id: 'b_demo_3',
    title: '1984',
    author: 'George Orwell',
    category: 'Dystopian',
    stock: 0,
    total: 1,
    coverUrl:
      'https://images.unsplash.com/photo-1531988042231-d39a9cc12a96?auto=format&fit=crop&q=80&w=800',
    maxDuration: 7,
    description:
      'Among the seminal texts of the 20th century, a rare work that grows more haunting as its futuristic purgatory becomes more real.',
    ownerId: 'u_demo_charlie',
    owner: {
      id: 'u_demo_charlie',
      name: 'Charlie Brown',
      email: 'charlie@example.com',
    },
    createdAt: new Date('2023-12-02'),
    updatedAt: new Date('2023-12-02'),
  },
  {
    id: 'b_demo_4',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    category: 'Fantasy',
    stock: 1,
    total: 1,
    coverUrl:
      'https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?auto=format&fit=crop&q=80&w=800',
    maxDuration: 21,
    description:
      'A timeless classic introduced the world to Bilbo Baggins, Gandalf, and Middle-earth.',
    ownerId: 'u_demo_bob',
    owner: {
      id: 'u_demo_bob',
      name: 'Bob Smith',
      email: 'bob@example.com',
    },
    createdAt: new Date('2023-11-07'),
    updatedAt: new Date('2023-11-07'),
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 't_demo_1',
    bookId: 'b_demo_3',
    userId: 'u_demo_alice',
    issueDate: new Date('2023-10-20'),
    returnDate: new Date('2023-10-28'),
    status: 'Returned',
    createdAt: new Date('2023-10-20'),
    updatedAt: new Date('2023-10-28'),
  },
];

export const INITIAL_CHATS: Chat[] = [
  {
    id: 'c_demo_1',
    participantIds: ['u_demo_alice', 'u_demo_bob'],
    participants: [
      { id: 'u_demo_alice', name: 'Alice Johnson', email: 'alice@example.com', role: 'user', joined: new Date('2023-10-12') },
      { id: 'u_demo_bob', name: 'Bob Smith', email: 'bob@example.com', role: 'user', joined: new Date('2023-11-05') },
    ],
    messages: [
      {
        id: 'm_demo_1',
        chatId: 'c_demo_1',
        senderId: 'u_demo_bob',
        text: 'Hi Alice, please return The Hobbit by Tuesday!',
        timestamp: new Date(now.getTime() - 1000 * 60 * 10),
      },
      {
        id: 'm_demo_2',
        chatId: 'c_demo_1',
        senderId: 'u_demo_alice',
        text: "Sure Bob, I'm almost done with it.",
        timestamp: new Date(now.getTime() - 1000 * 60 * 8),
      },
    ] as Message[],
    createdAt: new Date('2023-11-10'),
    updatedAt: new Date('2023-11-10'),
  },
];
