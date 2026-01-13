'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Send } from 'lucide-react';

type ApiUser = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
};

type ApiMessage = {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  timestamp: string; // comes as ISO string
  sender?: ApiUser;
};

type ApiChat = {
  id: string;
  participantIds: string[];
  participants: ApiUser[];
  messages: ApiMessage[];
  createdAt: string;
  updatedAt: string;
};

export default function MessagesPage() {
  const { data: session, status } = useSession();

  const currentUserId = (session?.user as any)?.id as string | undefined;
  const currentUserRole = (session?.user as any)?.role as string | undefined;

  const [loadingChats, setLoadingChats] = useState(true);
  const [chats, setChats] = useState<ApiChat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [msgInput, setMsgInput] = useState('');
  const [sending, setSending] = useState(false);

  const fetchChats = async () => {
    setLoadingChats(true);
    try {
      const res = await fetch('/api/chats', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to fetch chats');
      const data: ApiChat[] = await res.json();
      setChats(data);

      if (!selectedChatId && data.length > 0) {
        setSelectedChatId(data[0].id);
      }
    } catch (e) {
      console.error('fetchChats error:', e);
      setChats([]);
    } finally {
      setLoadingChats(false);
    }
  };

  // Load chats once session is ready and we have userId
  useEffect(() => {
    if (status !== 'authenticated') return;
    if (!currentUserId) return;
    if (currentUserRole === 'admin') return;

    fetchChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, currentUserId, currentUserRole]);

  // Guards
  if (status === 'loading') {
    return (
      <div className="h-[calc(100vh-140px)] flex items-center justify-center text-gray-400">
        Loading messages...
      </div>
    );
  }

  if (status !== 'authenticated' || !currentUserId) {
    return (
      <div className="h-[calc(100vh-140px)] flex items-center justify-center text-gray-400">
        Please login to view messages.
      </div>
    );
  }

  if (currentUserRole === 'admin') {
    return (
      <div className="h-[calc(100vh-140px)] flex items-center justify-center text-gray-400">
        Admin account has no messages UI.
      </div>
    );
  }

  const myChats = useMemo(
    () => chats.filter((c) => c.participantIds.includes(currentUserId)),
    [chats, currentUserId]
  );

  const activeChat = useMemo(
    () => chats.find((c) => c.id === selectedChatId) ?? null,
    [chats, selectedChatId]
  );

  const otherUser = useMemo(() => {
    if (!activeChat) return null;
    return activeChat.participants.find((p) => p.id !== currentUserId) ?? null;
  }, [activeChat, currentUserId]);

  const handleSendMessage = async () => {
    if (!activeChat) return;
    const text = msgInput.trim();
    if (!text) return;

    setSending(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId: activeChat.id, text }),
      });

      if (!res.ok) throw new Error('Failed to send message');

      const created: ApiMessage = await res.json();

      // Optimistic update
      setChats((prev) =>
        prev.map((c) =>
          c.id === activeChat.id ? { ...c, messages: [...c.messages, created] } : c
        )
      );

      setMsgInput('');
    } catch (e) {
      console.error('sendMessage error:', e);
      // fallback refresh
      await fetchChats();
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
      {/* Chat List */}
      <div className="w-80 border-r border-gray-100 bg-white flex flex-col">
        <div className="p-6 font-bold text-xl text-[#1B254B] border-b border-gray-50">
          Messages
        </div>

        {loadingChats ? (
          <div className="p-6 text-gray-400">Loading chats...</div>
        ) : myChats.length === 0 ? (
          <div className="p-6 text-gray-400">No chats yet.</div>
        ) : (
          <div className="overflow-y-auto flex-1 p-3 space-y-2">
            {myChats.map((chat) => {
              const other = chat.participants.find((p) => p.id !== currentUserId);
              const last = chat.messages?.[chat.messages.length - 1]?.text ?? '';

              return (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChatId(chat.id)}
                  className={`w-full p-4 text-left rounded-xl transition-all ${
                    selectedChatId === chat.id
                      ? 'bg-[#F4F7FE] ring-1 ring-[#4318FF]/10'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="font-bold text-[#1B254B]">{other?.name ?? 'User'}</div>
                  <div className="text-xs text-gray-400 truncate mt-1">{last}</div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-[#FAFCFE]">
        {activeChat ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-gray-100 bg-white flex items-center gap-3 shadow-sm z-10">
              <div className="w-10 h-10 rounded-full bg-[#4318FF] text-white flex items-center justify-center font-bold">
                {(otherUser?.name?.[0] ?? 'U').toUpperCase()}
              </div>
              <div className="font-bold text-[#1B254B]">{otherUser?.name ?? 'User'}</div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {activeChat.messages.length === 0 ? (
                <div className="text-gray-400">No messages yet. Say hi 👋</div>
              ) : (
                activeChat.messages.map((msg) => {
                  const isMe = msg.senderId === currentUserId;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[70%] px-5 py-3 rounded-2xl text-sm font-medium shadow-sm ${
                          isMe
                            ? 'bg-[#4318FF] text-white rounded-br-none'
                            : 'bg-white text-[#1B254B] rounded-bl-none'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100 flex gap-3">
              <input
                className="flex-1 bg-[#F4F7FE] rounded-xl px-4 py-3 outline-none text-[#1B254B]"
                placeholder="Type a message..."
                value={msgInput}
                onChange={(e) => setMsgInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={sending}
              />
              <button
                onClick={handleSendMessage}
                disabled={sending}
                className="bg-[#4318FF] text-white p-3 rounded-xl hover:bg-[#3311CC] disabled:opacity-60"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a chat
          </div>
        )}
      </div>
    </div>
  );
}
