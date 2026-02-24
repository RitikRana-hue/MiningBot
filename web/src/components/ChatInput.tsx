"use client";

import { SendHorizontal, Paperclip, Mic, MicOff } from "lucide-react";
import { FormEvent, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  onFileUpload?: () => void;
  isRecording?: boolean;
  onStartRecording?: () => void;
  onStopRecording?: () => void;
}

export default function ChatInput({
  onSend,
  disabled,
  onFileUpload,
  isRecording = false,
  onStartRecording,
  onStopRecording
}: ChatInputProps) {
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
              ? "0 0 0 2px rgba(16, 185, 129, 0.2), 0 4px 20px rgba(0, 0, 0, 0.05)"
              : "0 2px 10px rgba(0, 0, 0, 0.05)",
          }}
          className={`relative flex items-end gap-2 p-2 rounded-2xl border transition-colors ${isFocused
            ? "bg-white border-emerald-500/50"
            : "bg-white border-zinc-300 hover:border-zinc-400"
            }`}
        >
          {/* Attachment button */}
          <button
            type="button"
            onClick={onFileUpload}
            disabled={disabled}
            className="shrink-0 p-2.5 rounded-xl text-zinc-600 hover:text-emerald-500 hover:bg-zinc-100 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-zinc-600 transition-all"
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
              className="w-full resize-none bg-transparent px-2 py-2 text-[15px] text-zinc-900 placeholder-zinc-500 focus:outline-none disabled:opacity-50 max-h-[200px]"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Voice button */}
            <motion.button
              type="button"
              onClick={isRecording ? onStopRecording : onStartRecording}
              disabled={disabled}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative p-2.5 rounded-xl transition-all ${isRecording
                ? "bg-red-500 text-white shadow-lg shadow-red-500/50"
                : "text-zinc-600 hover:text-emerald-500 hover:bg-zinc-100"
                } disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-zinc-600`}
              title={isRecording ? "Stop recording" : "Voice input"}
            >
              <AnimatePresence mode="wait">
                {isRecording ? (
                  <motion.div
                    key="recording"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                  >
                    <MicOff className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: -180 }}
                  >
                    <Mic className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Recording pulse animation */}
              {isRecording && (
                <motion.div
                  className="absolute inset-0 rounded-xl bg-red-500"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </motion.button>

            {/* Send button */}
            <motion.button
              type="submit"
              disabled={!input.trim() || disabled}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2.5 rounded-xl transition-all ${input.trim() && !disabled
                ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
                : "bg-zinc-200 text-zinc-400 cursor-not-allowed"
                }`}
              title="Send message"
            >
              <SendHorizontal className="h-5 w-5" />
            </motion.button>
          </div>
        </motion.div>
      </form>
    </div>
  );
}
