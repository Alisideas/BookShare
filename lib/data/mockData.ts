// lib/data/mockData.ts
// INITIAL DATA FILE

import { Book, User, Transaction, Chat } from '../types';

export const INITIAL_BOOKS: Book[] = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    category: "Classic",
    stock: 1,
    total: 1,
    coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800",
    ownerId: 102,
    ownerName: "Bob Smith",
    maxDuration: 14,
    description: "A story of the fabulously wealthy Jay Gatsby and his new love for the beautiful Daisy Buchanan."
  },
  {
    id: 2,
    title: "Clean Code",
    author: "Robert C. Martin",
    category: "Technology",
    stock: 1,
    total: 1,
    coverUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800",
    ownerId: 101,
    ownerName: "Alice Johnson",
    maxDuration: 30,
    description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees."
  },
  {
    id: 3,
    title: "1984",
    author: "George Orwell",
    category: "Dystopian",
    stock: 0,
    total: 1,
    coverUrl: "https://images.unsplash.com/photo-1531988042231-d39a9cc12a96?auto=format&fit=crop&q=80&w=800",
    ownerId: 103,
    ownerName: "Charlie Brown",
    maxDuration: 7,
    description: "Among the seminal texts of the 20th century, Nineteen Eighty-Four is a rare work that grows more haunting as its futuristic purgatory becomes more real."
  },
  {
    id: 4,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    category: "Fantasy",
    stock: 1,
    total: 1,
    coverUrl: "https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?auto=format&fit=crop&q=80&w=800",
    ownerId: 102,
    ownerName: "Bob Smith",
    maxDuration: 21,
    description: "A timeless classic introduced the world to the Hobbit Bilbo Baggins, the wizard Gandalf, and the spectacular world of Middle-earth."
  },
];

export const INITIAL_USERS: User[] = [
  {
    id: 101,
    name: "Alice Johnson",
    email: "alice@example.com",
    joined: "2023-10-12",
    location: "New York, USA",
    bio: "Avid reader of tech and sci-fi. Always looking for the next big idea."
  },
  {
    id: 102,
    name: "Bob Smith",
    email: "bob@example.com",
    joined: "2023-11-05",
    location: "London, UK",
    bio: "History buff and classic literature enthusiast. Collecting rare editions."
  },
  {
    id: 103,
    name: "Charlie Brown",
    email: "charlie@example.com",
    joined: "2023-12-01",
    location: "Toronto, Canada",
    bio: "Loves dystopian novels and coffee. Let's discuss Orwell."
  },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 1,
    bookId: 3,
    userId: 101,
    issueDate: "2023-10-20",
    returnDate: "2023-10-28",
    status: "Returned"
  },
];

export const INITIAL_CHATS: Chat[] = [
  {
    id: 1,
    participants: [101, 102],
    messages: [
      {
        senderId: 102,
        text: "Hi Alice, please return The Hobbit by Tuesday!",
        timestamp: "10:30 AM"
      },
      {
        senderId: 101,
        text: "Sure Bob, I'm almost done with it.",
        timestamp: "10:32 AM"
      }
    ]
  }
];