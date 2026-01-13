// prisma/seed.js
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Hash passwords
  const userPassword = await bcrypt.hash('demouser123', 12);
  const adminPassword = await bcrypt.hash('admin123', 12);

  console.log('Creating users...');

  // Demo user
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@user.com' },
    update: {},
    create: {
      email: 'demo@user.com',
      name: 'Alice Johnson',
      password: userPassword,
      role: 'user',
      location: 'New York, USA',
      bio: 'Avid reader of tech and sci-fi. Always looking for the next big idea.',
    },
  });
  console.log('✓ Demo user created');

  // Admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@bookshare.com' },
    update: {},
    create: {
      email: 'admin@bookshare.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'admin',
      location: 'San Francisco, USA',
      bio: 'BookShare administrator',
    },
  });
  console.log('✓ Admin user created');

  // More demo users
  const bob = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      email: 'bob@example.com',
      name: 'Bob Smith',
      password: await bcrypt.hash('password123', 12),
      role: 'user',
      location: 'London, UK',
      bio: 'History buff and classic literature enthusiast.',
    },
  });
  console.log('✓ Bob created');

  const charlie = await prisma.user.upsert({
    where: { email: 'charlie@example.com' },
    update: {},
    create: {
      email: 'charlie@example.com',
      name: 'Charlie Brown',
      password: await bcrypt.hash('password123', 12),
      role: 'user',
      location: 'Toronto, Canada',
      bio: 'Loves dystopian novels and coffee.',
    },
  });
  console.log('✓ Charlie created');

  // ----------------------------
  // BOOKS
  // ----------------------------
  console.log('Creating books...');

  await prisma.book.deleteMany({});

  await prisma.book.createMany({
    data: [
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        category: 'Classic',
        coverUrl:
          'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800',
        ownerId: bob.id,
        maxDuration: 14,
        description:
          'A story of the fabulously wealthy Jay Gatsby and his new love for the beautiful Daisy Buchanan.',
      },
      {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        category: 'Technology',
        coverUrl:
          'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800',
        ownerId: demoUser.id,
        maxDuration: 30,
        description:
          "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees.",
      },
      {
        title: '1984',
        author: 'George Orwell',
        category: 'Dystopian',
        stock: 0,
        coverUrl:
          'https://images.unsplash.com/photo-1531988042231-d39a9cc12a96?auto=format&fit=crop&q=80&w=800',
        ownerId: charlie.id,
        maxDuration: 7,
        description:
          'Among the seminal texts of the 20th century, a rare work that grows more haunting as its futuristic purgatory becomes more real.',
      },
      {
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        category: 'Fantasy',
        coverUrl:
          'https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?auto=format&fit=crop&q=80&w=800',
        ownerId: bob.id,
        maxDuration: 21,
        description:
          'A timeless classic that introduced the world to Bilbo Baggins, Gandalf, and Middle-earth.',
      },
      {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        category: 'Classic',
        coverUrl:
          'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800',
        ownerId: charlie.id,
        maxDuration: 14,
        description:
          'A gripping tale of racial injustice and childhood innocence in the American South.',
      },
      {
        title: 'Sapiens',
        author: 'Yuval Noah Harari',
        category: 'Science',
        coverUrl:
          'https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&q=80&w=800',
        ownerId: demoUser.id,
        maxDuration: 21,
        description:
          'A brief history of humankind, from the Stone Age to the modern age.',
      },
    ],
  });

  console.log('✓ Books created');

  // ----------------------------
  // CHAT + MESSAGES
  // ----------------------------
  console.log('Creating chats + messages...');

  // Find an existing chat that already includes both users.
  // We'll load all chats with participants and search in JS.
  const allChats = await prisma.chat.findMany({
    include: { participants: true },
  });

  const existingChat = allChats.find((chat) => {
    const ids = chat.participants.map((p) => p.userId);
    return ids.includes(demoUser.id) && ids.includes(bob.id);
  });

  const chat =
    existingChat ??
    (await prisma.chat.create({
      data: {
        participants: {
          create: [{ userId: demoUser.id }, { userId: bob.id }],
        },
      },
      include: { participants: true },
    }));

  if (existingChat) console.log('✓ Chat already existed');
  else console.log('✓ Chat created');

  // Remove old messages for this chat to avoid duplicates every seed
  await prisma.message.deleteMany({ where: { chatId: chat.id } });

  await prisma.message.createMany({
    data: [
      {
        chatId: chat.id,
        senderId: demoUser.id,
        text: 'Hey Bob! I saw you listed The Great Gatsby. Is it available?',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
      },
      {
        chatId: chat.id,
        senderId: bob.id,
        text: "Hi Alice! Yes, it's available 😊 Want to borrow it?",
        timestamp: new Date(Date.now() - 1000 * 60 * 50),
      },
      {
        chatId: chat.id,
        senderId: demoUser.id,
        text: 'Yes please! I can return it within 10 days.',
        timestamp: new Date(Date.now() - 1000 * 60 * 45),
      },
    ],
  });

  console.log('✓ Messages created');

  console.log('\n✅ Database seeded successfully!\n');
  console.log('📧 Demo Accounts:');
  console.log('   User: demo@user.com / demouser123');
  console.log('   Admin: admin@bookshare.com / admin123');
  console.log('   Bob: bob@example.com / password123');
  console.log('   Charlie: charlie@example.com / password123\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
