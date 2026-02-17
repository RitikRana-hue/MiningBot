"use client";

import { motion } from "framer-motion";
import { Upload, X, FileText, Image, FileSpreadsheet, Sparkles, ArrowRight } from "lucide-react";
import { useRef, useState, DragEvent } from "react";

interface FileUploadProps {
  onUpload: (file: File) => void;
  disabled?: boolean;
}

export default function FileUpload({ onUpload, disabled }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <Image className="h-6 w-6" />;
    if (type.includes("spreadsheet") || type.includes("csv") || type.includes("excel"))
      return <FileSpreadsheet className="h-6 w-6" />;
    return <FileText className="h-6 w-6" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="p-4 mx-4 mb-4">
      {!selectedFile ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300
            ${isDragging
              ? "border-emerald-500 bg-emerald-500/10 scale-[1.02]"
              : "border-zinc-700 hover:border-emerald-500/50 hover:bg-zinc-800/30"
            }
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          {/* Animated background gradient */}
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-2xl"
            />
          )}

          <div className="relative z-10 flex flex-col items-center">
            <motion.div
              animate={{ y: isDragging ? -5 : 0 }}
              className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
                isDragging
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-zinc-800 text-zinc-400"
              }`}
            >
              <Upload className="h-8 w-8" />
            </motion.div>
            <p className="text-base font-medium text-zinc-200 mb-1">
              {isDragging ? "Drop your file here" : "Upload a file for analysis"}
            </p>
            <p className="text-sm text-zinc-500 mb-3">
              Drag & drop or <span className="text-emerald-400 hover:text-emerald-300">browse</span>
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {["Images", "CSV", "Excel", "JSON", "PDF"].map((type) => (
                <span
                  key={type}
                  className="px-2 py-1 text-xs bg-zinc-800 text-zinc-500 rounded-lg"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            accept="image/*,.csv,.xlsx,.xls,.json,.pdf,.txt"
            className="hidden"
            disabled={disabled}
          />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-4 p-4 bg-zinc-800/80 border border-zinc-700/50 rounded-2xl"
        >
          <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-xl text-emerald-400">
            {getFileIcon(selectedFile.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{selectedFile.name}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{formatFileSize(selectedFile.size)}</p>
          </div>
          <button
            onClick={handleClear}
            className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleUpload}
            disabled={disabled}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-medium rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            Analyze
            <ArrowRight className="h-4 w-4" />
          </motion.button>
        </motion.div>
      )}
    </div>
  );
}
