"use client";

import { Upload, X, FileText, Image, FileSpreadsheet } from "lucide-react";
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
    if (type.startsWith("image/")) return <Image className="h-5 w-5" />;
    if (type.includes("spreadsheet") || type.includes("csv") || type.includes("excel"))
      return <FileSpreadsheet className="h-5 w-5" />;
    return <FileText className="h-5 w-5" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="p-4 border-t border-zinc-700">
      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors
            ${isDragging
              ? "border-emerald-500 bg-emerald-500/10"
              : "border-zinc-600 hover:border-zinc-500 hover:bg-zinc-800/50"
            }
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          <Upload className={`h-8 w-8 mb-2 ${isDragging ? "text-emerald-400" : "text-zinc-400"}`} />
          <p className="text-sm text-zinc-300 mb-1">
            Drop files here or <span className="text-emerald-400">browse</span>
          </p>
          <p className="text-xs text-zinc-500">
            Supports: Images, CSV, Excel, JSON, PDF
          </p>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            accept="image/*,.csv,.xlsx,.xls,.json,.pdf,.txt"
            className="hidden"
            disabled={disabled}
          />
        </div>
      ) : (
        <div className="flex items-center gap-3 p-3 bg-zinc-800 rounded-lg">
          <div className="flex items-center justify-center w-10 h-10 bg-zinc-700 rounded-lg text-emerald-400">
            {getFileIcon(selectedFile.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-zinc-200 truncate">{selectedFile.name}</p>
            <p className="text-xs text-zinc-500">{formatFileSize(selectedFile.size)}</p>
          </div>
          <button
            onClick={handleClear}
            className="p-1 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            onClick={handleUpload}
            disabled={disabled}
            className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-500 transition-colors disabled:opacity-50"
          >
            Analyze
          </button>
        </div>
      )}
    </div>
  );
}
