// app/dashboard/messages/page.tsx
// MESSAGES PAGE

'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { useStore } from '@/lib/store/useStore';

export default function MessagesPage() {
  const [msgInput, setMsgInput] = useState('');

  const currentUser = useStore((state) => state.currentUser);
  const chats = useStore((state) => state.chats);
  const selectedChatId = useStore((state) => state.selectedChatId);
  const setSelectedChatId = useStore((state) => state.setSelectedChatId);
  const getUser = useStore((state) => state.getUser);
  const sendMessage = useStore((state) => state.sendMessage);

  if (currentUser === 'admin' || !currentUser) return null;

  const myChats = chats.filter((c) => c.participants.includes(currentUser.id));
  const activeChat = chats.find((c) => c.id === selectedChatId);

  const handleSendMessage = () => {
    if (!msgInput.trim() || !activeChat) return;
    sendMessage(activeChat.id, currentUser.id, msgInput);
    setMsgInput('');
  };

  return (
    <div className="h-[calc(100vh-140px)] flex bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
      {/* Chat List */}
      <div className="w-80 border-r border-gray-100 bg-white flex flex-col">
        <div className="p-6 font-bold text-xl text-[#1B254B] border-b border-gray-50">
          Messages
        </div>
        <div className="overflow-y-auto flex-1 p-3 space-y-2">
          {myChats.map((chat) => {
            const otherId = chat.participants.find((p) => p !== currentUser.id);
            const otherUser = getUser(otherId!) || { name: 'User' };

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
                <div className="font-bold text-[#1B254B]">
                  {otherUser.name}
                </div>
                <div className="text-xs text-gray-400 truncate mt-1">
                  {chat.messages[chat.messages.length - 1]?.text}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-[#FAFCFE]">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-100 bg-white flex items-center gap-3 shadow-sm z-10">
              <div className="w-10 h-10 rounded-full bg-[#4318FF] text-white flex items-center justify-center font-bold">
                {
                  getUser(
                    activeChat.participants.find((p) => p !== currentUser.id)!
                  )?.name[0]
                }
              </div>
              <div className="font-bold text-[#1B254B]">
                {
                  getUser(
                    activeChat.participants.find((p) => p !== currentUser.id)!
                  )?.name
                }
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {activeChat.messages.map((msg, idx) => {
                const isMe = msg.senderId === currentUser.id;
                return (
                  <div
                    key={idx}
                    className={`flex ${
                      isMe ? 'justify-end' : 'justify-start'
                    }`}
                  >
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
              })}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100 flex gap-3">
              <input
                className="flex-1 bg-[#F4F7FE] rounded-xl px-4 py-3 outline-none text-[#1B254B]"
                placeholder="Type a message..."
                value={msgInput}
                onChange={(e) => setMsgInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                className="bg-[#4318FF] text-white p-3 rounded-xl hover:bg-[#3311CC]"
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