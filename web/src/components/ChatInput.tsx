"use client";

import { SendHorizontal, Paperclip, Mic, Sparkles } from "lucide-react";
import { FormEvent, useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  onFileUpload?: () => void;
  onVoiceRecord?: () => void;
}

export default function ChatInput({ onSend, disabled, onFileUpload, onVoiceRecord }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
        <motion.div
          animate={{
            boxShadow: isFocused
              ? "0 0 0 2px rgba(16, 185, 129, 0.2), 0 4px 20px rgba(0, 0, 0, 0.3)"
              : "0 2px 10px rgba(0, 0, 0, 0.2)",
          }}
          className={`relative flex items-end gap-2 p-2 rounded-2xl border transition-colors ${
            isFocused
              ? "bg-zinc-900 border-emerald-500/50"
              : "bg-zinc-900/80 border-zinc-800 hover:border-zinc-700"
          }`}
        >
          {/* Attachment button */}
          <button
            type="button"
            onClick={onFileUpload}
            disabled={disabled}
            className="shrink-0 p-2.5 rounded-xl text-zinc-500 hover:text-emerald-400 hover:bg-zinc-800 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-zinc-500 transition-all"
            title="Attach file"
          >
            <Paperclip className="h-5 w-5" />
          </button>

          {/* Input area */}
          <div className="flex-1 min-w-0">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about coal mining, safety, production..."
              disabled={disabled}
              rows={1}
              className="w-full resize-none bg-transparent px-2 py-2 text-[15px] text-zinc-100 placeholder-zinc-500 focus:outline-none disabled:opacity-50 max-h-[200px]"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Voice button */}
            <button
              type="button"
              onClick={onVoiceRecord}
              disabled={disabled}
              className="p-2.5 rounded-xl text-zinc-500 hover:text-emerald-400 hover:bg-zinc-800 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-zinc-500 transition-all"
              title="Voice input"
            >
              <Mic className="h-5 w-5" />
            </button>

            {/* Send button */}
            <motion.button
              type="submit"
              disabled={!input.trim() || disabled}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2.5 rounded-xl transition-all ${
                input.trim() && !disabled
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
                  : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
              }`}
              title="Send message"
            >
              <SendHorizontal className="h-5 w-5" />
            </motion.button>
          </div>
        </motion.div>

        {/* Footer info */}
        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-zinc-600">
          <Sparkles className="h-3 w-3 text-emerald-500/50" />
          <span>AI-powered mining assistant • Press Enter to send, Shift+Enter for new line</span>
        </div>
      </form>
    </div>
  );
}
