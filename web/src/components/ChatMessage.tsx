"use client";

import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div className={`py-6 ${isUser ? "bg-transparent" : "bg-zinc-800/50"}`}>
      <div className="mx-auto max-w-3xl px-4 flex gap-4">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
            isUser ? "bg-blue-600" : "bg-emerald-600"
          }`}
        >
          {isUser ? (
            <User className="h-5 w-5 text-white" />
          ) : (
            <Bot className="h-5 w-5 text-white" />
          )}
        </div>
        <div className="flex-1 space-y-2 overflow-hidden">
          <p className="text-sm font-semibold text-zinc-200">
            {isUser ? "You" : "Mining Assistant"}
          </p>
          <div className="prose prose-invert max-w-none">
            <p className="text-zinc-300 whitespace-pre-wrap leading-relaxed">
              {content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
