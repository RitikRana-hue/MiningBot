"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import Sidebar, { ChatHistory } from "@/components/Sidebar";
import FileUpload from "@/components/FileUpload";
import SettingsModal, { Settings } from "@/components/SettingsModal";
import ProfileModal from "@/components/ProfileModal";
import { useAuth } from "@/context/AuthContext";
import { 
  HardHat, 
  Upload, 
  X, 
  Coins, 
  Sparkles, 
  AlertCircle,
  ArrowRight,
  Zap,
  Shield,
  BarChart3,
  LogOut,
  ChevronRight
} from "lucide-react";

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

const TOKEN_COST_PER_MESSAGE = 1;

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showNoTokensModal, setShowNoTokensModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { user, isLoading: authLoading, deductTokens, logout } = useAuth();
  const router = useRouter();

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
    // Check if user has tokens
    if (!user) {
      router.push("/login");
      return;
    }

    // Check and deduct tokens
    if (user.plan !== 'enterprise' && user.tokens < TOKEN_COST_PER_MESSAGE) {
      setShowNoTokensModal(true);
      return;
    }

    // Deduct token
    const success = deductTokens(TOKEN_COST_PER_MESSAGE);
    if (!success && user.plan !== 'enterprise') {
      setShowNoTokensModal(true);
      return;
    }

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

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="h-screen bg-zinc-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="h-screen bg-zinc-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md px-4"
        >
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <HardHat className="h-10 w-10 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Login Required</h1>
          <p className="text-zinc-400 mb-8">
            Please login or create an account to access the AI Mining Assistant.
            You&apos;ll get 100 free tokens to start!
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white font-semibold rounded-full hover:bg-emerald-500 transition-colors"
          >
            Login / Sign Up
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-zinc-950 overflow-hidden flex">
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
      <div className="flex flex-1 flex-col bg-zinc-950">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-medium text-zinc-300">
              {currentChatId
                ? chatHistory.find((c) => c.id === currentChatId)?.title || "Chat"
                : "New Chat"}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {/* Token Balance */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full">
              <Coins className="h-4 w-4 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-400">
                {user.plan === 'enterprise' ? '∞' : user.tokens}
              </span>
              <span className="text-xs text-zinc-500">tokens</span>
            </div>
            {/* Upload Button */}
            <button
              onClick={() => setShowFileUpload(!showFileUpload)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${showFileUpload
                ? "bg-emerald-600 text-white"
                : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                }`}
            >
              {showFileUpload ? <X className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
              {showFileUpload ? "Close" : "Upload"}
            </button>
          </div>
        </div>

        {/* File Upload Area */}
        <AnimatePresence>
          {showFileUpload && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <FileUpload onUpload={handleFileUpload} disabled={isLoading} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-zinc-400 px-4">
              {/* Hero section for empty state */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-2xl"
              >
                <div className="relative mb-6">
                  <motion.div
                    className="absolute inset-0 bg-emerald-500/20 rounded-full blur-2xl"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />
                  <div className="relative w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                    <HardHat className="h-10 w-10 text-white" />
                  </div>
                </div>
                
                <h1 className="text-3xl font-bold text-white mb-3">
                  AI Mining Assistant
                </h1>
                <p className="text-zinc-400 mb-2">
                  Ask me anything about coal mining operations, safety protocols, 
                  production analysis, and more!
                </p>
                <p className="text-sm text-zinc-500 mb-8">
                  Each message costs 1 token • Upload files for detailed analysis
                </p>

                {/* Quick action cards */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {[
                    { icon: <Sparkles className="h-4 w-4" />, text: "What types of coal exist?", color: "emerald" },
                    { icon: <Shield className="h-4 w-4" />, text: "Safety requirements for mining", color: "amber" },
                    { icon: <BarChart3 className="h-4 w-4" />, text: "Analyze production data", color: "blue" },
                    { icon: <Zap className="h-4 w-4" />, text: "Underground mining methods", color: "purple" },
                  ].map((item, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => handleSend(item.text)}
                      className="group flex items-center gap-3 p-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/80 hover:border-zinc-700 text-left transition-all"
                    >
                      <div className={`w-10 h-10 rounded-xl bg-${item.color}-500/10 flex items-center justify-center text-${item.color}-400 group-hover:scale-110 transition-transform`}>
                        {item.icon}
                      </div>
                      <span className="text-zinc-300 group-hover:text-white transition-colors">
                        {item.text}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
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
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-6 bg-zinc-900/50"
                >
                  <div className="mx-auto max-w-3xl px-4 flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600">
                      <HardHat className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex items-center">
                      <div className="flex space-x-1">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                          className="h-2 w-2 rounded-full bg-emerald-500"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                          className="h-2 w-2 rounded-full bg-emerald-500"
                        />
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                          className="h-2 w-2 rounded-full bg-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-zinc-800/50 bg-zinc-950">
          <ChatInput
            onSend={handleSend}
            disabled={isLoading || (user.plan !== 'enterprise' && user.tokens < TOKEN_COST_PER_MESSAGE)}
            onFileUpload={() => setShowFileUpload(true)}
            onVoiceRecord={handleVoiceRecord}
          />
          {user.plan !== 'enterprise' && user.tokens < TOKEN_COST_PER_MESSAGE && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-4 mb-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-amber-400" />
                <span className="text-amber-400 text-sm">You&apos;ve run out of tokens</span>
              </div>
              <Link
                href="/pricing"
                className="text-sm font-medium text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                Buy more <ChevronRight className="h-4 w-4" />
              </Link>
            </motion.div>
          )}
        </div>
      </div>

      {/* No Tokens Modal */}
      <AnimatePresence>
        {showNoTokensModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowNoTokensModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-md w-full text-center"
            >
              <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Coins className="h-8 w-8 text-amber-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Out of Tokens</h3>
              <p className="text-zinc-400 mb-6">
                You&apos;ve used all your free tokens. Upgrade your plan to continue using the AI assistant.
              </p>
              <div className="flex flex-col gap-3">
                <Link
                  href="/pricing"
                  className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-500 transition-colors flex items-center justify-center gap-2"
                >
                  View Pricing Plans
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <button
                  onClick={() => setShowNoTokensModal(false)}
                  className="w-full py-3 bg-zinc-800 text-zinc-300 font-semibold rounded-xl hover:bg-zinc-700 transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
