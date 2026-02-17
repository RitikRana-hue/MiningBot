"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import Sidebar, { ChatHistory } from "@/components/Sidebar";
import FileUpload from "@/components/FileUpload";
import SettingsModal, { Settings } from "@/components/SettingsModal";
import ProfileModal from "@/components/ProfileModal";
import { HardHat, Upload, X } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const DEFAULT_SETTINGS: Settings = {
  theme: "dark",
  notifications: true,
  saveHistory: true,
  mineLocation: "",
  units: "metric",
  language: "english",
  autoSave: true,
  soundEnabled: false,
  fontSize: "medium",
  responseSpeed: "normal",
};

const STORAGE_KEYS = {
  HISTORY: "coal-mining-chat-history",
  SETTINGS: "coal-mining-settings",
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);
    const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);

    if (savedHistory) {
      try {
        setChatHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse chat history", e);
      }
    }

    if (savedSettings) {
      try {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) });
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
  }, []);

  // Save chat history to localStorage
  const saveHistory = useCallback(
    (history: ChatHistory[]) => {
      if (settings.saveHistory) {
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
      }
    },
    [settings.saveHistory]
  );

  // Save settings to localStorage
  const saveSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update chat history when messages change
  useEffect(() => {
    if (messages.length > 0 && currentChatId) {
      setChatHistory((prevHistory) => {
        const updatedHistory = prevHistory.map((chat) =>
          chat.id === currentChatId ? { ...chat, messages } : chat
        );
        saveHistory(updatedHistory);
        return updatedHistory;
      });
    }
  }, [messages, currentChatId, saveHistory]);

  const generateChatTitle = (firstMessage: string): string => {
    const words = firstMessage.split(" ").slice(0, 5).join(" ");
    return words.length < firstMessage.length ? words + "..." : words;
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
  };

  const handleSelectChat = (id: string) => {
    const chat = chatHistory.find((c) => c.id === id);
    if (chat) {
      setCurrentChatId(id);
      setMessages(chat.messages);
    }
  };

  const handleDeleteChat = (id: string) => {
    const updatedHistory = chatHistory.filter((c) => c.id !== id);
    setChatHistory(updatedHistory);
    saveHistory(updatedHistory);

    if (currentChatId === id) {
      setCurrentChatId(null);
      setMessages([]);
    }
  };

  const handleClearHistory = () => {
    setChatHistory([]);
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
    setCurrentChatId(null);
    setMessages([]);
  };

  const handleSend = async (message: string) => {
    const userMessage: Message = { role: "user", content: message };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    // Create new chat if needed
    if (!currentChatId) {
      const newChatId = Date.now().toString();
      const newChat: ChatHistory = {
        id: newChatId,
        title: generateChatTitle(message),
        timestamp: Date.now(),
        messages: newMessages,
      };
      const updatedHistory = [newChat, ...chatHistory];
      setChatHistory(updatedHistory);
      setCurrentChatId(newChatId);
      saveHistory(updatedHistory);
    }

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

  const handleVoiceRecord = () => {
    // Placeholder for voice recording functionality
    alert("Voice recording feature coming soon! This will allow you to send messages using your voice.");
  };

  const handleFileUpload = async (file: File) => {
    setShowFileUpload(false);
    setIsLoading(true);

    const uploadMessage: Message = {
      role: "user",
      content: `📎 Uploaded file: ${file.name}`,
    };
    const newMessages = [...messages, uploadMessage];
    setMessages(newMessages);

    // Create new chat if needed
    if (!currentChatId) {
      const newChatId = Date.now().toString();
      const newChat: ChatHistory = {
        id: newChatId,
        title: `File: ${file.name}`,
        timestamp: Date.now(),
        messages: newMessages,
      };
      const updatedHistory = [newChat, ...chatHistory];
      setChatHistory(updatedHistory);
      setCurrentChatId(newChatId);
      saveHistory(updatedHistory);
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.analysis) {
        const analysisMessage: Message = {
          role: "assistant",
          content: data.analysis,
        };
        setMessages((prev) => [...prev, analysisMessage]);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, failed to process the file. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-zinc-900 overflow-hidden flex">
      {/* Sidebar */}
      <Sidebar
        onNewChat={handleNewChat}
        onOpenSettings={() => setShowSettings(true)}
        onOpenProfile={() => setShowProfile(true)}
        chatHistory={chatHistory}
        currentChatId={currentChatId}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
      />

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Header with upload toggle */}
        <div className="flex items-center justify-between px-4 py-5">
          <h2 className="text-sm font-medium text-zinc-300">
            {currentChatId
              ? chatHistory.find((c) => c.id === currentChatId)?.title || "Chat"
              : "New Chat"}
          </h2>
          <button
            onClick={() => setShowFileUpload(!showFileUpload)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${showFileUpload
              ? "bg-emerald-600 text-white"
              : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
              }`}
          >
            {showFileUpload ? <X className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
            {showFileUpload ? "Close" : "Upload"}
          </button>
        </div>

        {/* File Upload Area */}
        {showFileUpload && (
          <FileUpload onUpload={handleFileUpload} disabled={isLoading} />
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-zinc-400">
              <HardHat className="h-12 w-12 text-emerald-500 mb-4" />
              <h1 className="text-2xl font-semibold text-zinc-100 mb-2">
                Mining Bot
              </h1>
              <p className="text-center max-w-md mb-2">
                Ask me anything about mining operations, safety, production,
                and analysis!
              </p>
              <p className="text-center text-sm text-zinc-500 mb-6">
                Upload files and photos for detailed analysis
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <button
                  onClick={() => handleSend("What types of coal are there?")}
                  className="rounded-lg border border-zinc-700 px-4 py-3 text-left hover:bg-zinc-800 transition-colors"
                >
                  What types of coal are there?
                </button>
                <button
                  onClick={() => handleSend("Tell me about underground mining")}
                  className="rounded-lg border border-zinc-700 px-4 py-3 text-left hover:bg-zinc-800 transition-colors"
                >
                  Tell me about underground mining
                </button>
                <button
                  onClick={() => handleSend("What are the safety requirements?")}
                  className="rounded-lg border border-zinc-700 px-4 py-3 text-left hover:bg-zinc-800 transition-colors"
                >
                  What are the safety requirements?
                </button>
                <button
                  onClick={() => handleSend("How do I analyze production data?")}
                  className="rounded-lg border border-zinc-700 px-4 py-3 text-left hover:bg-zinc-800 transition-colors"
                >
                  How do I analyze production data?
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
                      <HardHat className="h-5 w-5 text-white animate-pulse" />
                    </div>
                    <div className="flex items-center">
                      <div className="flex space-x-1">
                        <div className="h-2 w-2 rounded-full bg-zinc-500 animate-bounce" />
                        <div
                          className="h-2 w-2 rounded-full bg-zinc-500 animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <div
                          className="h-2 w-2 rounded-full bg-zinc-500 animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
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
        <ChatInput
          onSend={handleSend}
          disabled={isLoading}
          onFileUpload={() => setShowFileUpload(true)}
          onVoiceRecord={handleVoiceRecord}
        />
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSave={saveSettings}
        onClearHistory={handleClearHistory}
      />

      {/* Profile Modal */}
      <ProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />
    </div>
  );
}
