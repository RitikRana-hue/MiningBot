"use client";

import { X, Moon, Sun, Bell, Database, Trash2, Globe, MessageSquare, Shield, Palette } from "lucide-react";
import { useEffect, useState } from "react";

export interface Settings {
  theme: "dark" | "light";
  notifications: boolean;
  saveHistory: boolean;
  mineLocation: string;
  units: "metric" | "imperial";
  language: "english" | "spanish" | "chinese";
  autoSave: boolean;
  soundEnabled: boolean;
  fontSize: "small" | "medium" | "large";
  responseSpeed: "fast" | "normal" | "slow";
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onSave: (settings: Settings) => void;
  onClearHistory: () => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onSave,
  onClearHistory,
}: SettingsModalProps) {
  const [localSettings, setLocalSettings] = useState<Settings>(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  useEffect(() => {
    if (localSettings.theme === "light") {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }
  }, [localSettings.theme]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-700">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-700">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Settings</h2>
          <button
            onClick={onClose}
            className="p-1 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Theme */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Theme</label>
            <div className="flex gap-2">
              <button
                onClick={() => setLocalSettings({ ...localSettings, theme: "dark" })}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition-colors ${localSettings.theme === "dark"
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400"
                  : "border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  }`}
              >
                <Moon className="h-4 w-4" />
                Dark
              </button>
              <button
                onClick={() => setLocalSettings({ ...localSettings, theme: "light" })}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border transition-colors ${localSettings.theme === "light"
                  ? "border-blue-500 bg-blue-50 text-blue-600"
                  : "border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  }`}
              >
                <Sun className="h-4 w-4" />
                Light
              </button>
            </div>
          </div>

          {/* Language */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Language</label>
            <select
              value={localSettings.language}
              onChange={(e) =>
                setLocalSettings({ ...localSettings, language: e.target.value as any })
              }
              className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-lg text-zinc-900 dark:text-zinc-100 focus:border-blue-500 focus:outline-none"
            >
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
              <option value="chinese">Chinese</option>
            </select>
          </div>

          {/* Mine Location */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Mine Location</label>
            <input
              type="text"
              value={localSettings.mineLocation}
              onChange={(e) => setLocalSettings({ ...localSettings, mineLocation: e.target.value })}
              placeholder="Enter your mine location"
              className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-lg text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Units */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Units</label>
            <select
              value={localSettings.units}
              onChange={(e) =>
                setLocalSettings({ ...localSettings, units: e.target.value as "metric" | "imperial" })
              }
              className="w-full px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded-lg text-zinc-900 dark:text-zinc-100 focus:border-blue-500 focus:outline-none"
            >
              <option value="metric">Metric (tonnes, meters)</option>
              <option value="imperial">Imperial (tons, feet)</option>
            </select>
          </div>

          {/* Font Size */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Font Size</label>
            <div className="flex gap-2">
              {[
                { value: "small", label: "Small" },
                { value: "medium", label: "Medium" },
                { value: "large", label: "Large" }
              ].map((size) => (
                <button
                  key={size.value}
                  onClick={() => setLocalSettings({ ...localSettings, fontSize: size.value as any })}
                  className={`flex-1 p-2 rounded-lg border transition-colors ${localSettings.fontSize === size.value
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400"
                    : "border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                    }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                <span className="text-sm text-zinc-900 dark:text-zinc-100">Notifications</span>
              </div>
              <button
                onClick={() =>
                  setLocalSettings({ ...localSettings, notifications: !localSettings.notifications })
                }
                className={`w-11 h-6 rounded-full transition-colors ${localSettings.notifications ? "bg-blue-500" : "bg-zinc-300 dark:bg-zinc-600"
                  }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${localSettings.notifications ? "translate-x-5" : "translate-x-0.5"
                    }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                <span className="text-sm text-zinc-900 dark:text-zinc-100">Save chat history</span>
              </div>
              <button
                onClick={() =>
                  setLocalSettings({ ...localSettings, saveHistory: !localSettings.saveHistory })
                }
                className={`w-11 h-6 rounded-full transition-colors ${localSettings.saveHistory ? "bg-blue-500" : "bg-zinc-300 dark:bg-zinc-600"
                  }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${localSettings.saveHistory ? "translate-x-5" : "translate-x-0.5"
                    }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                <span className="text-sm text-zinc-900 dark:text-zinc-100">Auto-save</span>
              </div>
              <button
                onClick={() =>
                  setLocalSettings({ ...localSettings, autoSave: !localSettings.autoSave })
                }
                className={`w-11 h-6 rounded-full transition-colors ${localSettings.autoSave ? "bg-blue-500" : "bg-zinc-300 dark:bg-zinc-600"
                  }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${localSettings.autoSave ? "translate-x-5" : "translate-x-0.5"
                    }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                <span className="text-sm text-zinc-900 dark:text-zinc-100">Sound effects</span>
              </div>
              <button
                onClick={() =>
                  setLocalSettings({ ...localSettings, soundEnabled: !localSettings.soundEnabled })
                }
                className={`w-11 h-6 rounded-full transition-colors ${localSettings.soundEnabled ? "bg-blue-500" : "bg-zinc-300 dark:bg-zinc-600"
                  }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${localSettings.soundEnabled ? "translate-x-5" : "translate-x-0.5"
                    }`}
                />
              </button>
            </div>
          </div>

          {/* Clear History */}
          <button
            onClick={() => {
              if (confirm("Are you sure you want to clear all chat history?")) {
                onClearHistory();
              }
            }}
            className="w-full flex items-center justify-center gap-2 p-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Clear all chat history
          </button>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
