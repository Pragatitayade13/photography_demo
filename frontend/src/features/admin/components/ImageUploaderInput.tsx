import React, { useState, useRef } from "react";
import {
  Upload,
  X,
  RotateCw,
  Check,
  Link as LinkIcon,
  AlertCircle,
} from "lucide-react";
import { mediaService } from "../media/services/mediaService";
import { usePhotos } from "../../photos/hooks/usePhotos";

interface ImageUploaderInputProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  required?: boolean;
  helpText?: string;
  aspectRatio?: string;
}

export const ImageUploaderInput: React.FC<ImageUploaderInputProps> = ({
  label,
  value,
  onChange,
  placeholder = "https://... or upload from your computer",
  required = false,
  helpText,
  aspectRatio = "aspect-video",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [mode, setMode] = useState<"upload" | "url" | "library">("upload");

  const { photos } = usePhotos();

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file (JPEG, PNG, WebP, AVIF).");
      return;
    }

    // Max 25 MB
    if (file.size > 25 * 1024 * 1024) {
      setUploadError("Image file size exceeds 25 MB limit.");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // Try uploading to backend media service
      const res = await mediaService.uploadMedia(file, {
        alt_text: file.name.replace(/\.[^/.]+$/, ""),
        caption: "Uploaded via Studio CMS",
      });

      if (res) {
        const largeVariant = res.variants?.find((v) => v.variant_name === "large");
        const originalVariant = res.variants?.find((v) => v.variant_name === "original");
        const bestUrl = largeVariant?.storage_path || originalVariant?.storage_path || res.storage_path;
        onChange(bestUrl);
      } else {
        // Fallback: Read as Data URL so image works immediately in offline mode
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            onChange(e.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (err: any) {
      console.warn("Backend media upload failed, falling back to instant local DataURL:", err);
      // Fallback: Instant Base64 preview so user never gets blocked
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onChange(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      {/* Label and Mode Switcher */}
      <div className="flex items-center justify-between">
        <label className="text-[11px] uppercase tracking-wider text-secondary font-medium flex items-center space-x-1">
          <span>{label}</span>
          {required && <span className="text-accent">*</span>}
        </label>

        <div className="flex items-center space-x-1 text-[10px] uppercase tracking-wider font-mono">
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`px-2 py-0.5 rounded transition-colors ${
              mode === "upload" ? "bg-accent/20 text-accent font-bold" : "text-secondary hover:text-primary"
            }`}
          >
            Upload
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`px-2 py-0.5 rounded transition-colors ${
              mode === "url" ? "bg-accent/20 text-accent font-bold" : "text-secondary hover:text-primary"
            }`}
          >
            URL
          </button>
          {photos.length > 0 && (
            <>
              <span>•</span>
              <button
                type="button"
                onClick={() => setMode("library")}
                className={`px-2 py-0.5 rounded transition-colors ${
                  mode === "library" ? "bg-accent/20 text-accent font-bold" : "text-secondary hover:text-primary"
                }`}
              >
                Library
              </button>
            </>
          )}
        </div>
      </div>

      {/* Hidden native file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFileSelect(e.target.files[0]);
          }
        }}
        className="hidden"
      />

      {/* Upload Dropzone Mode */}
      {mode === "upload" && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all duration-300 ${
            isDragOver
              ? "border-accent bg-accent/10"
              : "border-white/10 hover:border-accent/50 bg-white/[0.02] hover:bg-white/[0.04]"
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center space-y-2 py-3 text-accent text-xs font-mono">
              <RotateCw className="w-6 h-6 animate-spin text-accent" />
              <span>Uploading & Optimizing Image from System...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2 py-2">
              <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-primary">
                  Click to select an image from your computer
                </p>
                <p className="text-[10px] text-secondary/70 mt-0.5 font-mono">
                  or drag & drop here (JPEG, PNG, WebP up to 25 MB)
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Direct URL Input Mode */}
      {mode === "url" && (
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <LinkIcon className="w-3.5 h-3.5 text-secondary/60 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="url"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full bg-surface-raised border border-surface-border rounded-md pl-9 pr-4 py-2 text-xs text-primary focus:outline-none focus:border-accent font-mono"
            />
          </div>
        </div>
      )}

      {/* Library Picker Mode */}
      {mode === "library" && photos.length > 0 && (
        <div className="p-3 bg-surface-raised border border-surface-border rounded-xl space-y-2">
          <span className="text-[10px] text-secondary font-mono">Select from uploaded photos:</span>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-36 overflow-y-auto pr-1">
            {photos.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onChange(p.image_url)}
                className={`relative aspect-square rounded-lg overflow-hidden border transition-all ${
                  value === p.image_url
                    ? "border-accent ring-2 ring-accent/40 scale-95"
                    : "border-white/10 hover:border-accent/60 opacity-80 hover:opacity-100"
                }`}
              >
                <img src={p.thumbnail_url || p.image_url} alt={p.title} className="w-full h-full object-cover" />
                {value === p.image_url && (
                  <div className="absolute inset-0 bg-accent/30 flex items-center justify-center text-white">
                    <Check className="w-4 h-4 text-accent" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <div className="p-2.5 bg-danger/10 border border-danger/20 rounded-lg flex items-center space-x-2 text-danger text-xs">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Active Image Preview Card */}
      {value && (
        <div className="relative rounded-xl overflow-hidden border border-white/15 bg-[#0e0e13] p-2 flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className={`w-16 h-12 rounded-lg overflow-hidden bg-black/50 border border-white/10 shrink-0 ${aspectRatio}`}>
              <img src={value} alt="Selected Preview" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-accent font-mono">
                Active Image
              </span>
              <p className="text-xs text-secondary truncate font-mono">
                {value.startsWith("data:") ? "Local system image (Loaded)" : value}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 pr-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-md bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-[10px] uppercase tracking-wider font-semibold text-primary transition-colors"
            >
              Replace
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="p-1.5 rounded-md hover:bg-danger/10 text-secondary hover:text-danger transition-colors"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {helpText && <p className="text-[10px] text-secondary/70">{helpText}</p>}
    </div>
  );
};
