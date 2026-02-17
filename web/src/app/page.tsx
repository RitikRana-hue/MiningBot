"use client";

import { useState, useRef, useEffect } from "react";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import Sidebar from "@/components/Sidebar";
import { Pickaxe } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNewChat = () => {
    setMessages([]);
  };

  const handleSend = async (message: string) => {
    const userMessage: Message = { role: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      if (data.response) {
        const assistantMessage: Message = {
          role: "assistant",
          content: data.response,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, something went wrong. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-zinc-900">
      {/* Sidebar */}
      <Sidebar onNewChat={handleNewChat} />

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-zinc-400">
              <Pickaxe className="h-12 w-12 text-emerald-500 mb-4" />
              <h1 className="text-2xl font-semibold text-zinc-100 mb-2">
                Mining Chatbot
              </h1>
              <p className="text-center max-w-md">
                Ask me anything about cryptocurrency mining, hardware, pools,
                profitability, and more!
              </p>
              <div className="mt-8 grid grid-cols-2 gap-3 text-sm">
                <button
                  onClick={() => handleSend("What is Bitcoin mining?")}
                  className="rounded-lg border border-zinc-700 px-4 py-3 text-left hover:bg-zinc-800 transition-colors"
                >
                  What is Bitcoin mining?
                </button>
                <button
                  onClick={() => handleSend("Tell me about GPU mining")}
                  className="rounded-lg border border-zinc-700 px-4 py-3 text-left hover:bg-zinc-800 transition-colors"
                >
                  Tell me about GPU mining
                </button>
                <button
                  onClick={() => handleSend("How do I start mining?")}
                  className="rounded-lg border border-zinc-700 px-4 py-3 text-left hover:bg-zinc-800 transition-colors"
                >
                  How do I start mining?
                </button>
                <button
                  onClick={() => handleSend("What affects mining profitability?")}
                  className="rounded-lg border border-zinc-700 px-4 py-3 text-left hover:bg-zinc-800 transition-colors"
                >
                  What affects profitability?
                </button>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  role={message.role}
                  content={message.content}
                />
              ))}
              {isLoading && (
                <div className="py-6 bg-zinc-800/50">
                  <div className="mx-auto max-w-3xl px-4 flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600">
                      <Pickaxe className="h-5 w-5 text-white animate-pulse" />
                    </div>
                    <div className="flex items-center">
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 rounded-full bg-zinc-500 animate-bounce" />
                        <div className="h-2 w-2 rounded-full bg-zinc-500 animate-bounce delay-100" />
                        <div className="h-2 w-2 rounded-full bg-zinc-500 animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        <ChatInput onSend={handleSend} disabled={isLoading} />
      </div>
    </div>
  );
}
