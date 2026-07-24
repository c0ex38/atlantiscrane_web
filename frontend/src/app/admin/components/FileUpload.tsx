"use client";

import React, { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { UploadCloud, Loader2, X, Video, Link2 } from "lucide-react";

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
        onChange(`${API_BASE_URL}${res.url}`);
      }
    } catch (err: any) {
      setError(err.message || "Dosya yüklenirken bir hata oluştu.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const isVideo = value?.match(/\.(mp4|webm|ogg)$/i) || value?.includes("youtube") || value?.includes("vimeo");

  return (
    <div className="w-full">
      {label && (
        <label className="block text-[11px] font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
          {label}
        </label>
      )}
      <div className="flex flex-col gap-2">
        {/* URL Input + Upload Button */}
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 px-3 py-2.5 bg-background border border-border/70 rounded-lg focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
            <Link2 className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
            <input
              type="text"
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="flex-1 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground/40 min-w-0"
            />
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="p-0.5 text-muted-foreground/50 hover:text-foreground rounded transition-colors shrink-0"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-1.5 px-3 py-2.5 bg-muted border border-border/70 rounded-lg text-[12px] font-semibold text-foreground hover:bg-muted/80 disabled:opacity-50 transition-all whitespace-nowrap"
          >
            {isUploading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <UploadCloud className="h-3.5 w-3.5" />
            )}
            <span>{isUploading ? "Yükleniyor" : "Yükle"}</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={accept}
            className="hidden"
          />
        </div>

        {/* Preview — only shown when there's a value */}
        {value && (
          <div className="relative w-full rounded-lg overflow-hidden border border-border/60 bg-black/5 group">
            {isVideo ? (
              <div className="relative">
                <video
                  src={value}
                  controls
                  className="w-full max-h-[200px] object-contain bg-black"
                />
                <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/60 text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                  <Video className="h-3 w-3" />
                  <span>Video</span>
                </div>
              </div>
            ) : (
              <img
                src={value}
                alt="Preview"
                className="w-full max-h-[200px] object-contain bg-muted/30"
              />
            )}
          </div>
        )}

        {error && (
          <p className="text-xs text-red-500 flex items-center gap-1">
            <span>⚠</span> {error}
          </p>
        )}
      </div>
    </div>
  );
}
