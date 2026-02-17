"use client";

import { SendHorizontal, Plus, Mic } from "lucide-react";
import { FormEvent, useState } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  onFileUpload?: () => void;
  onVoiceRecord?: () => void;
}

export default function ChatInput({ onSend, disabled, onFileUpload, onVoiceRecord }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput("");
    }
  };

  return (
    <div className="bg-zinc-900 p-4">
      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
        <div className="relative flex items-center gap-2">
          <button
            type="button"
            onClick={onFileUpload}
            disabled={disabled}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-700 hover:text-emerald-400 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-zinc-400"
          >
            <Plus className="h-5 w-5" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about mining..."
            disabled={disabled}
            className="flex-1 rounded-xl border border-zinc-600 bg-zinc-800 px-4 py-3 pr-20 text-zinc-100 placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
          />
          <button
            type="button"
            onClick={onVoiceRecord}
            disabled={disabled}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-700 hover:text-emerald-400 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-zinc-400"
          >
            <Mic className="h-5 w-5" />
          </button>
          <button
            type="submit"
            disabled={!input.trim() || disabled}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-700 hover:text-emerald-400 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-zinc-400"
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
