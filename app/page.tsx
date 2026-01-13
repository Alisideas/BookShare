"use client";

import { useRouter } from "next/navigation";
import {
  BookOpen,
  Sparkles,
  Users,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const router = useRouter();
  type LandingBook = {
    id: string;
    title: string;
    author: string;
    coverUrl: string;
    category: string;
  };
  const [books, setBooks] = useState<LandingBook[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const res = await fetch("/api/books", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch books");
        const data = await res.json();
        setBooks(data.slice(0, 6)); // show only first 6
      } catch (e) {
        console.error("Failed to load books:", e);
        setBooks([]);
      } finally {
        setLoadingBooks(false);
      }
    };

    loadBooks();
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-[#1B254B] overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        {/* soft blobs */}
        <div className="absolute -top-24 -left-24 w-[520px] h-[520px] rounded-full bg-[#4318FF]/10 blur-3xl" />
        <div className="absolute top-40 -right-24 w-[520px] h-[520px] rounded-full bg-[#868CFF]/12 blur-3xl" />
        <div className="absolute bottom-[-160px] left-1/3 w-[620px] h-[620px] rounded-full bg-[#4318FF]/8 blur-3xl" />
        {/* subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #1B254B 1px, transparent 1px), linear-gradient(to bottom, #1B254B 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Top Nav */}
      <nav className="relative z-10 flex items-center justify-between p-6 md:p-8 max-w-7xl mx-auto w-full">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-[#4318FF] font-black text-2xl tracking-tight"
        >
          <BookOpen className="w-8 h-8" />
          <span>BookShare.</span>
        </button>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => router.push("/login")}
            variant="ghost"
            className="text-base"
          >
            Login
          </Button>
          <Button
            onClick={() => router.push("/login")}
            className="rounded-full px-5"
          >
            Get Started <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 pt-8 md:pt-14 pb-12 md:pb-20">
        <div className="max-w-3xl">
          {/* badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F4F7FE] text-[#4318FF] font-bold text-sm ring-1 ring-[#4318FF]/10">
              <Sparkles className="w-4 h-4" />
              Modern P2P Library
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[#1B254B] font-bold text-sm ring-1 ring-gray-100">
              <ShieldCheck className="w-4 h-4 text-[#4318FF]" />
              Secure + Simple
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.95]">
            Read. Share. <br />
            <span className="text-[#4318FF]">Connect.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-500 mt-6 max-w-2xl font-medium">
            The modern P2P library for communities. Discover books, lend with
            confidence, and chat to coordinate pickups — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-10">
            <Button
              onClick={() => router.push("/login")}
              className="px-8 py-5 text-base md:text-lg rounded-full"
            >
              Start Sharing <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              onClick={() => router.push("/login")}
              variant="secondary"
              className="px-8 py-5 text-base md:text-lg rounded-full"
            >
              Explore Marketplace
            </Button>
          </div>

          {/* social proof */}
          <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#4318FF]" />
              <span>
                <span className="font-bold text-[#1B254B]">
                  Community-first
                </span>{" "}
                lending
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#4318FF]" />
              <span>
                Built-in{" "}
                <span className="font-bold text-[#1B254B]">messages</span> to
                coordinate
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-[#4318FF]" />
              <span>
                Quick discovery with{" "}
                <span className="font-bold text-[#1B254B]">categories</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right side mock card */}
        <div className="mt-12 md:mt-0 md:absolute md:right-8 md:top-24 md:w-[420px]">
          <div className="bg-white rounded-[28px] border border-gray-100 shadow-[0px_30px_70px_rgba(0,0,0,0.08)] overflow-hidden">
            <div className="p-5 border-b border-gray-50 flex items-center justify-between">
              <div className="font-black">Trending Now</div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#F4F7FE] text-[#4318FF]">
                Live
              </span>
            </div>

            <div className="p-5 space-y-4">
              {[
                { title: "Clean Code", author: "Robert C. Martin" },
                { title: "The Hobbit", author: "J.R.R. Tolkien" },
                { title: "Sapiens", author: "Yuval Noah Harari" },
              ].map((b) => (
                <div
                  key={b.title}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-[#FAFCFE] border border-gray-100"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#4318FF]/10 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-[#4318FF]" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold">{b.title}</div>
                    <div className="text-xs text-gray-500">{b.author}</div>
                  </div>
                  <div className="text-xs font-bold text-[#4318FF]">View</div>
                </div>
              ))}
            </div>

            <div className="p-5 border-t border-gray-50 bg-white">
              <Button
                onClick={() => router.push("/login")}
                variant="secondary"
                className="w-full rounded-full py-4"
              >
                Browse All Books
              </Button>
            </div>
          </div>
        </div>
      </header>
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 pb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">
              Community Library
            </h2>
            <p className="text-gray-500 font-medium mt-2">
              Books shared by real users in the community
            </p>
          </div>

          <Button
            onClick={() => router.push("/login")}
            variant="secondary"
            className="rounded-full"
          >
            View all
          </Button>
        </div>

        {loadingBooks ? (
          <div className="text-gray-400">Loading books...</div>
        ) : books.length === 0 ? (
          <div className="text-gray-400">No books yet.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {books.map((book) => (
              <div
                key={book.id}
                className="group bg-white rounded-[24px] border border-gray-100 overflow-hidden shadow-[0px_20px_50px_rgba(0,0,0,0.03)] hover:shadow-[0px_30px_70px_rgba(0,0,0,0.08)] transition-all"
              >
                <div className="aspect-[3/4] overflow-hidden bg-[#F4F7FE]">
                  {!imageErrors[book.id] && book.coverUrl ? (
                    <img
                      src={book.coverUrl}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
                      onError={() => setImageErrors((prev) => ({ ...prev, [book.id]: true }))}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <BookOpen className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="font-bold text-sm line-clamp-1">
                    {book.title}
                  </div>
                  <div className="text-xs text-gray-500 line-clamp-1">
                    {book.author}
                  </div>

                  <div className="mt-2 inline-block text-[10px] font-bold px-2 py-1 rounded-full bg-[#F4F7FE] text-[#4318FF]">
                    {book.category}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 pb-16">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-[28px] border border-gray-100 p-6 shadow-[0px_20px_50px_rgba(0,0,0,0.03)]">
            <div className="w-11 h-11 rounded-2xl bg-[#4318FF]/10 flex items-center justify-center mb-4">
              <Search className="w-5 h-5 text-[#4318FF]" />
            </div>
            <div className="font-black text-lg mb-1">Discover fast</div>
            <p className="text-sm text-gray-500 font-medium">
              Browse categories and find what you want in seconds.
            </p>
          </div>

          <div className="bg-white rounded-[28px] border border-gray-100 p-6 shadow-[0px_20px_50px_rgba(0,0,0,0.03)]">
            <div className="w-11 h-11 rounded-2xl bg-[#4318FF]/10 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5 text-[#4318FF]" />
            </div>
            <div className="font-black text-lg mb-1">Lend with confidence</div>
            <p className="text-sm text-gray-500 font-medium">
              Track loans, due dates, and history — all neatly organized.
            </p>
          </div>

          <div className="bg-white rounded-[28px] border border-gray-100 p-6 shadow-[0px_20px_50px_rgba(0,0,0,0.03)]">
            <div className="w-11 h-11 rounded-2xl bg-[#4318FF]/10 flex items-center justify-center mb-4">
              <MessageSquare className="w-5 h-5 text-[#4318FF]" />
            </div>
            <div className="font-black text-lg mb-1">Chat built-in</div>
            <p className="text-sm text-gray-500 font-medium">
              Message borrowers instantly to coordinate handoff and returns.
            </p>
          </div>
        </div>

        <footer className="mt-14 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} BookShare. Built for communities.
        </footer>
      </section>
    </div>
  );
}
