"use client";

import { SendHorizontal } from "lucide-react";
import { FormEvent, useState } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput("");
    }
  };

  return (
    <div className="border-t border-zinc-700 bg-zinc-900 p-4">
      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about mining..."
            disabled={disabled}
            className="w-full rounded-xl border border-zinc-600 bg-zinc-800 px-4 py-3 pr-12 text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || disabled}
            className="absolute right-2 rounded-lg p-2 text-zinc-400 hover:bg-zinc-700 hover:text-emerald-400 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-zinc-400"
          >
            <SendHorizontal className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-2 text-center text-xs text-zinc-500">
          Mining Chatbot can help with cryptocurrency mining questions
        </p>
      </form>
    </div>
  );
}
