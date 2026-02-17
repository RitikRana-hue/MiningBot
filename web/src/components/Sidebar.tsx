"use client";

import { MessageSquarePlus, Pickaxe } from "lucide-react";

interface SidebarProps {
  onNewChat: () => void;
}

export default function Sidebar({ onNewChat }: SidebarProps) {
  return (
    <div className="flex h-full w-64 flex-col bg-zinc-950 p-2">
      {/* Logo */}
      <div className="flex items-center gap-2 px-3 py-4">
        <Pickaxe className="h-6 w-6 text-emerald-500" />
        <span className="text-lg font-semibold text-zinc-100">Mining Bot</span>
      </div>

      {/* New Chat Button */}
      <button
        onClick={onNewChat}
        className="flex items-center gap-3 rounded-lg border border-zinc-700 px-3 py-3 text-sm text-zinc-300 transition-colors hover:bg-zinc-800"
      >
        <MessageSquarePlus className="h-4 w-4" />
        New chat
      </button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Footer */}
      <div className="border-t border-zinc-800 px-3 py-4">
        <p className="text-xs text-zinc-500">
          Mining Chatbot v1.0
        </p>
        <p className="mt-1 text-xs text-zinc-600">
          Ask about crypto mining, hardware, pools & more
        </p>
      </div>
    </div>
  );
}
