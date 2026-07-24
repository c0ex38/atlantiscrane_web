"use client";

import React, { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { UploadCloud, Loader2, X, FileVideo, Image as ImageIcon } from "lucide-react";

interface FileUploadProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  placeholder?: string;
}

export function FileUpload({
  label = "Dosya Yolu / URL",
  value,
  onChange,
  accept = "image/*,video/*",
  placeholder = "Bir dosya yükleyin veya URL girin...",
}: FileUploadProps) {
  const { apiFetch } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "http://localhost:3001";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await apiFetch("/upload", {
        method: "POST",
        body: formData,
      }) as { success: boolean; url: string };

      if (res.success && res.url) {
        // Construct full URL if needed, or just keep relative and prefix with base in frontend
        // Assuming we want to store the relative URL /uploads/xxx
        onChange(`${API_BASE_URL}${res.url}`);
      }
    } catch (err: any) {
      setError(err.message || "Dosya yüklenirken bir hata oluştu.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const isVideo = value?.match(/\.(mp4|webm|ogg)$/i) || value?.includes("youtube") || value?.includes("vimeo");

  return (
    <div className="w-full">
      {label && <label className="block text-xs font-bold text-muted-foreground mb-2">{label}</label>}
      <div className="flex flex-col gap-3">
        {/* Preview Area */}
        {value ? (
          <div className="relative w-full aspect-video sm:aspect-[21/9] bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center group">
            {isVideo ? (
              <video src={value} controls className="w-full h-full object-contain bg-black" />
            ) : (
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
            )}
            
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-sm"
              title="Kaldır"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 hover:border-gray-400 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            {isUploading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
                <span className="text-sm font-medium text-gray-600">Yükleniyor...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <UploadCloud className="w-8 h-8 mb-2 text-gray-400" />
                <span className="text-sm font-medium">Dosya seçin veya sürükleyin</span>
                <span className="text-xs text-gray-400 mt-1">Resim veya Video</span>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-3 py-2 border border-border outline-none rounded-lg text-sm bg-card"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 disabled:opacity-50 transition-colors"
          >
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
            <span>Yükle</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={accept}
            className="hidden"
          />
        </div>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    </div>
  );
}
