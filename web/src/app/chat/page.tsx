"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import Sidebar, { ChatHistory } from "@/components/Sidebar";
import FileUpload from "@/components/FileUpload";
import SettingsModal, { Settings } from "@/components/SettingsModal";
import { useVoice } from "@/hooks/useVoice";
import {
  HardHat,
  Upload,
  X,
  Sparkles,
  Zap,
  Shield,
  BarChart3,
  Volume2,
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
  soundEnabled: true, // Enable sound by default for voice responses
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
  const [showFileUpload, setShowFileUpload] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Voice functionality
  const {
    isRecording,
    isSpeaking,
    startRecording,
    stopRecording,
    speak,
    stopSpeaking,
    isSupported: isVoiceSupported,
    error: voiceError,
    transcript
  } = useVoice();

  // When transcript changes and is not empty, send it
  useEffect(() => {
    if (transcript && transcript.trim() && !isRecording) {
      console.log("📝 Transcript ready:", transcript);
      // Always enable voice response when using voice input
      handleSend(transcript, true);
    }
  }, [transcript, isRecording]);

  // Show voice error notification
  useEffect(() => {
    if (voiceError) {
      console.error("Voice error:", voiceError);
      alert(voiceError);
    }
  }, [voiceError]);

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

  const handleSend = async (message: string, shouldSpeak: boolean = false) => {
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

        // Speak the response if voice was used or sound is enabled
        if (shouldSpeak && settings.soundEnabled && isVoiceSupported) {
          console.log("🔊 Speaking response...");
          try {
            await speak(data.response);
            console.log("✅ Finished speaking");
          } catch (err: any) {
            // Only log actual errors, not interruptions
            if (err.message && !err.message.includes('interrupted') && !err.message.includes('canceled')) {
              console.error("❌ Error speaking response:", err);
            } else {
              console.log("ℹ️ Speech was stopped by user");
            }
          }
        } else {
          if (!shouldSpeak) {
            console.log("ℹ️ Not speaking (text input used)");
          } else if (!settings.soundEnabled) {
            console.log("ℹ️ Not speaking (sound disabled in settings)");
          } else if (!isVoiceSupported) {
            console.log("ℹ️ Not speaking (voice not supported)");
          }
        }
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

  const handleStartRecording = () => {
    if (!isVoiceSupported) {
      alert("Voice input is not supported in your browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    // Stop any ongoing speech
    stopSpeaking();
    startRecording();
  };

  const handleStopRecording = () => {
    stopRecording();
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
        content: "Sorry, failed to process file. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-zinc-950 overflow-hidden flex">
      {/* Sidebar */}
      <Sidebar
        onNewChat={handleNewChat}
        onOpenSettings={() => setShowSettings(true)}
        onOpenProfile={() => { }} // Empty function since profile is removed
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
                  MineGPT
                </h1>
                <p className="text-zinc-400 mb-8">
                  Ask me anything about coal mining operations, safety protocols,
                  production analysis, and more!
                </p>

                {/* Quick action cards */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {[
                    { icon: <Sparkles className="h-4 w-4" />, text: "What is spontaneous combustion?", color: "emerald" },
                    { icon: <Shield className="h-4 w-4" />, text: "How to prevent coal fires?", color: "amber" },
                    { icon: <BarChart3 className="h-4 w-4" />, text: "What is gold mining?", color: "blue" },
                    { icon: <Zap className="h-4 w-4" />, text: "Open-pit vs underground mining", color: "purple" },
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
          {/* Voice status indicator */}
          <AnimatePresence>
            {(isRecording || isSpeaking) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="px-6 py-3 border-b border-zinc-800/50"
              >
                <div className="max-w-3xl mx-auto flex items-center gap-3">
                  {isRecording && (
                    <>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-3 h-3 rounded-full bg-red-500"
                      />
                      <span className="text-sm text-zinc-400">
                        Listening... Speak now
                      </span>
                    </>
                  )}
                  {isSpeaking && (
                    <>
                      <Volume2 className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm text-zinc-400">
                        Speaking response...
                      </span>
                      <button
                        onClick={stopSpeaking}
                        className="ml-auto text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                      >
                        Stop
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <ChatInput
            onSend={(msg) => handleSend(msg, false)}
            disabled={isLoading || isSpeaking}
            onFileUpload={() => setShowFileUpload(true)}
            isRecording={isRecording}
            onStartRecording={handleStartRecording}
            onStopRecording={handleStopRecording}
          />
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSave={saveSettings}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
}
