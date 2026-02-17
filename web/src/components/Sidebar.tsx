"use client";

import { MessageSquarePlus, HardHat, Settings, MessageSquare, Trash2, User } from "lucide-react";

export interface ChatHistory {
  id: string;
  title: string;
  timestamp: number;
  messages: { role: "user" | "assistant"; content: string }[];
}

interface SidebarProps {
  onNewChat: () => void;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
  chatHistory: ChatHistory[];
  currentChatId: string | null;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
}

export default function Sidebar({
  onNewChat,
  onOpenSettings,
  onOpenProfile,
  chatHistory,
  currentChatId,
  onSelectChat,
  onDeleteChat,
}: SidebarProps) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  // Group chats by date
  const groupedChats = chatHistory.reduce((acc, chat) => {
    const dateKey = formatDate(chat.timestamp);
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(chat);
    return acc;
  }, {} as Record<string, ChatHistory[]>);

  return (
    <div className="flex h-full w-64 flex-col bg-zinc-950">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5">
        <HardHat className="h-7 w-7 text-emerald-500" />
        <span className="text-xl font-bold text-zinc-100">Mining Bot</span>
      </div>

      {/* New Chat Button */}
      <div className="px-4 py-3">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-zinc-300 bg-emerald-600/10 border border-emerald-600/20 transition-all hover:bg-emerald-600/20 hover:border-emerald-600/30"
        >
          <MessageSquarePlus className="h-4 w-4" />
          New chat
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-4">
        {Object.entries(groupedChats).map(([date, chats]) => (
          <div key={date} className="mb-6">
            <p className="px-1 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">{date}</p>
            <div className="space-y-1">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-3 cursor-pointer transition-all duration-200 ${currentChatId === chat.id
                    ? "bg-gradient-to-r from-zinc-700 to-zinc-600 text-zinc-100 border-l-3 border-zinc-500 shadow-lg shadow-zinc-500/10"
                    : "text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200 hover:translate-x-1"
                    }`}
                  onClick={() => onSelectChat(chat.id)}
                >
                  <MessageSquare className={`h-4 w-4 shrink-0 transition-colors ${currentChatId === chat.id ? "text-zinc-100" : "opacity-70"
                    }`} />
                  <span className={`flex-1 truncate text-sm font-medium transition-colors ${currentChatId === chat.id ? "text-zinc-100" : ""
                    }`}>{chat.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteChat(chat.id);
                    }}
                    className={`opacity-0 group-hover:opacity-100 p-1.5 text-zinc-500 hover:text-red-400 transition-all rounded hover:bg-zinc-800/50 ${currentChatId === chat.id ? "opacity-100 text-zinc-300 hover:text-red-400" : ""
                      }`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
        {chatHistory.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-zinc-600">
            <MessageSquare className="h-8 w-8 mb-3 opacity-50" />
            <p className="text-sm text-center">No chat history yet</p>
            <p className="text-xs mt-1 text-zinc-700">Start a new conversation</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 space-y-2">
        <button
          onClick={onOpenProfile}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-400 transition-all hover:bg-zinc-800/30 hover:text-zinc-200"
        >
          <User className="h-4 w-4" />
          <span className="font-medium">Profile</span>
        </button>
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-400 transition-all hover:bg-zinc-800/30 hover:text-zinc-200"
        >
          <Settings className="h-4 w-4" />
          <span className="font-medium">Settings</span>
        </button>
        <p className="px-3 mt-3 text-xs text-zinc-700 text-center">
          Mining Bot v2.0
        </p>
      </div>
    </div>
  );
}
