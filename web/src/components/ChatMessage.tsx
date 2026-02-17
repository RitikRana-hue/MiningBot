"use client";

import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div className={`py-2 ${isUser ? "bg-transparent" : "bg-zinc-900/50"}`}>
      <div className={`mx-auto max-w-4xl px-2 flex gap-2 ${isUser ? "flex-row-reverse" : ""}`}>
        <div
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full shadow-sm ${isUser ? "bg-gradient-to-br from-blue-500 to-blue-600" : "bg-gradient-to-br from-emerald-500 to-emerald-600"
            }`}
        >
          {isUser ? (
            <User className="h-3.5 w-3.5 text-white" />
          ) : (
            <Bot className="h-3.5 w-3.5 text-white" />
          )}
        </div>
        <div className={`max-w-[75%] ${isUser ? "text-right" : ""}`}>
          <div
            className={`inline-block px-3 py-2 rounded-xl shadow-sm ${isUser
                ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-blue-500/20"
                : "bg-zinc-800 text-zinc-100 border border-zinc-700"
              }`}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {content}
            </p>
          </div>
          <div className={`mt-1 text-xs text-zinc-500 ${isUser ? "text-right" : ""}`}>
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
}
