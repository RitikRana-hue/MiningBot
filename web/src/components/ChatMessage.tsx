"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HardHat, User, Copy, Check, Sparkles } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="py-6 bg-white"
    >
      <div className="mx-auto max-w-3xl px-4">
        <div className={`flex gap-4 ${isUser ? "flex-row-reverse" : ""}`}>
          {/* Avatar */}
          <div className="shrink-0">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-lg ${isUser
                ? "bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/20"
                : "bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-500/20"
                }`}
            >
              {isUser ? (
                <User className="h-5 w-5 text-white" />
              ) : (
                <HardHat className="h-5 w-5 text-white" />
              )}
            </div>
          </div>

          {/* Message Content */}
          <div className={`flex-1 min-w-0 ${isUser ? "text-right" : ""}`}>
            {/* Name and time */}
            <div className={`flex items-center gap-2 mb-2 ${isUser ? "justify-end" : ""}`}>
              <span className="text-sm font-medium text-zinc-700">
                {isUser ? "You" : "MiningAI"}
              </span>
              {!isUser && (
                <span className="flex items-center gap-1 text-xs text-emerald-500">
                  <Sparkles className="h-3 w-3" />
                  AI
                </span>
              )}
            </div>

            {/* Message bubble */}
            <div
              className={`group relative inline-block max-w-full ${isUser ? "text-right" : "text-left"
                }`}
            >
              <div
                className={`inline-block px-4 py-3 rounded-2xl ${isUser
                  ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-tr-sm"
                  : "bg-white text-zinc-900 border border-zinc-200 rounded-tl-sm shadow-sm"
                  }`}
              >
                <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                  {content}
                </p>
              </div>

              {/* Copy button for assistant messages */}
              {!isUser && (
                <button
                  onClick={handleCopy}
                  className="absolute -right-2 top-0 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 text-zinc-600 hover:text-zinc-900"
                  title="Copy message"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              )}
            </div>

            {/* Timestamp */}
            <div className={`mt-1.5 text-xs text-zinc-500 ${isUser ? "text-right" : ""}`}>
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
