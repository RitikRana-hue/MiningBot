"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  MessageSquarePlus,
  HardHat,
  MessageSquare,
  Trash2,
  ChevronRight,
  Sparkles,
  Home
} from "lucide-react";
import { useRouter } from "next/navigation";

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
  chatHistory,
  currentChatId,
  onSelectChat,
  onDeleteChat,
}: SidebarProps) {
  const router = useRouter();

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
    <div className="flex h-full w-72 flex-col bg-zinc-900/50 border-r border-zinc-800/50 backdrop-blur-xl">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-zinc-800/50">
        <Link href="/chat" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all" />
            <div className="relative w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <HardHat className="h-5 w-5 text-white" />
            </div>
          </div>
          <div>
            <span className="text-lg font-bold text-white">Mine</span>
            <span className="text-lg font-light text-emerald-400">GPT</span>
          </div>
        </Link>
        <Link
          href="/chat"
          className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all"
          title="Back to chat"
        >
          <Home className="h-4 w-4" />
        </Link>
      </div>

      {/* New Chat Button */}
      <div className="px-4 pb-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-shadow"
        >
          <MessageSquarePlus className="h-4 w-4" />
          New Conversation
        </motion.button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-4">
        <AnimatePresence>
          {Object.entries(groupedChats).map(([date, chats]) => (
            <motion.div
              key={date}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4"
            >
              <p className="px-2 py-2 text-xs font-semibold text-zinc-600 uppercase tracking-wider">
                {date}
              </p>
              <div className="space-y-1">
                {chats.map((chat, index) => (
                  <motion.div
                    key={chat.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`group flex items-center gap-3 rounded-xl px-3 py-3 cursor-pointer transition-all duration-200 ${currentChatId === chat.id
                      ? "bg-emerald-500/10 border border-emerald-500/20 text-white"
                      : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                      }`}
                    onClick={() => onSelectChat(chat.id)}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${currentChatId === chat.id
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-zinc-800/50 text-zinc-500"
                      }`}>
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <span className="flex-1 truncate text-sm font-medium">
                      {chat.title}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(chat.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all rounded-lg"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {chatHistory.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-zinc-600">
            <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center mb-4">
              <MessageSquare className="h-8 w-8 opacity-50" />
            </div>
            <p className="text-sm text-center font-medium">No conversations yet</p>
            <p className="text-xs mt-1 text-zinc-700">Start a new chat to begin</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-zinc-800/50">
        <div className="flex items-center gap-2 text-xs text-zinc-600">
          <Sparkles className="h-3 w-3 text-emerald-500/50" />
          <span>MineGPT</span>
        </div>
      </div>
    </div>
  );
}
