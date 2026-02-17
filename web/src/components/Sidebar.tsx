"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  MessageSquarePlus, 
  HardHat, 
  Settings, 
  MessageSquare, 
  Trash2, 
  User,
  Coins,
  LogOut,
  ChevronRight,
  Sparkles,
  Home
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
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
  onOpenSettings,
  onOpenProfile,
  chatHistory,
  currentChatId,
  onSelectChat,
  onDeleteChat,
}: SidebarProps) {
  const { user, logout } = useAuth();
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

  const handleLogout = () => {
    logout();
    router.push("/");
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
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/20 rounded-xl blur-lg group-hover:blur-xl transition-all" />
            <div className="relative w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <HardHat className="h-5 w-5 text-white" />
            </div>
          </div>
          <div>
            <span className="text-lg font-bold text-white">CoalMine</span>
            <span className="text-lg font-light text-emerald-400">AI</span>
          </div>
        </Link>
        <Link 
          href="/"
          className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all"
          title="Back to home"
        >
          <Home className="h-4 w-4" />
        </Link>
      </div>

      {/* User Info Card */}
      {user && (
        <div className="px-4 py-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-zinc-800/80 to-zinc-800/40 border border-zinc-700/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center">
                <span className="text-emerald-400 font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                <p className="text-xs text-zinc-500 truncate">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-zinc-900/80 rounded-xl">
                <Coins className="h-4 w-4 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-400">
                  {user.plan === 'enterprise' ? '∞' : user.tokens}
                </span>
                <span className="text-xs text-zinc-500">tokens</span>
              </div>
              <span className="px-2 py-2 text-xs font-medium bg-zinc-900/80 text-zinc-400 rounded-xl capitalize">
                {user.plan}
              </span>
            </div>
          </div>
        </div>
      )}

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
                    className={`group flex items-center gap-3 rounded-xl px-3 py-3 cursor-pointer transition-all duration-200 ${
                      currentChatId === chat.id
                        ? "bg-emerald-500/10 border border-emerald-500/20 text-white"
                        : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                    }`}
                    onClick={() => onSelectChat(chat.id)}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      currentChatId === chat.id
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
      <div className="px-4 py-4 border-t border-zinc-800/50 space-y-1">
        <Link
          href="/pricing"
          className="w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-zinc-400 transition-all hover:bg-zinc-800/50 hover:text-emerald-400 group"
        >
          <div className="flex items-center gap-3">
            <Coins className="h-4 w-4" />
            <span className="font-medium">Buy Tokens</span>
          </div>
          <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-400 transition-all hover:bg-zinc-800/50 hover:text-zinc-200"
        >
          <Settings className="h-4 w-4" />
          <span className="font-medium">Settings</span>
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-400 transition-all hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
