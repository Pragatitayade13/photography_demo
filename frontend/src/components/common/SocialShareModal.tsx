import React, { useState } from "react";
import {
  X,
  Copy,
  Check,
  Share2,
  Sparkles,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import { trackEvent } from "../../utils/analyticsTracker";

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  url?: string;
  projectId?: string;
  imageUrl?: string;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  isOpen,
  onClose,
  title,
  description = "Visual monograph & fine art photography by Alex Mercer.",
  url = window.location.href,
  projectId,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedText = encodeURIComponent(`${title} — ${description}`);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      trackEvent("social_share", window.location.pathname, projectId, { platform: "copy_link" });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        });
        trackEvent("social_share", window.location.pathname, projectId, { platform: "native_share" });
      } catch {
        // User cancelled
      }
    }
  };

  const shareChannels = [
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "hover:border-emerald-500/50 hover:text-emerald-400",
      url: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`,
      platform: "whatsapp",
    },
    {
      name: "X (Twitter)",
      icon: Share2,
      color: "hover:border-sky-500/50 hover:text-sky-400",
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      platform: "twitter",
    },
    {
      name: "Facebook",
      icon: ExternalLink,
      color: "hover:border-indigo-500/50 hover:text-indigo-400",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      platform: "facebook",
    },
    {
      name: "LinkedIn",
      icon: ExternalLink,
      color: "hover:border-blue-500/50 hover:text-blue-400",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      platform: "linkedin",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-[#0e0e13] border border-white/[0.1] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-light text-primary">Share Story Monograph</h3>
              <p className="text-[10px] uppercase tracking-widest text-secondary/70 font-mono">
                Visual Curation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-secondary hover:text-primary rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Story Brief */}
        <div className="p-4 rounded-xl bg-surface border border-surface-border space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-wider text-accent font-bold">
            Target Story
          </span>
          <p className="text-xs font-serif text-primary truncate">{title}</p>
          <p className="text-[11px] text-secondary/70 font-mono truncate">{url}</p>
        </div>

        {/* Quick Copy Link Box */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase font-mono tracking-wider text-secondary">
            Direct Story Link
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              readOnly
              value={url}
              className="w-full bg-[#14141a] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-secondary font-mono focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className={`inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                copied
                  ? "bg-emerald-500 text-black shadow-lg shadow-emerald-500/20"
                  : "bg-accent text-background hover:bg-accent-hover"
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
        </div>

        {/* Channels Grid */}
        <div className="space-y-2 pt-2">
          <span className="text-[10px] uppercase font-mono tracking-wider text-secondary">
            Social Networks
          </span>
          <div className="grid grid-cols-2 gap-2.5">
            {shareChannels.map((ch) => {
              const Icon = ch.icon;
              return (
                <a
                  key={ch.name}
                  href={ch.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() =>
                    trackEvent("social_share", window.location.pathname, projectId, {
                      platform: ch.platform,
                    })
                  }
                  className={`flex items-center space-x-2.5 p-3 rounded-xl bg-surface border border-surface-border text-xs text-secondary hover:text-primary transition-all duration-200 ${ch.color}`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{ch.name}</span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Native Web Share fallback button if supported */}
        {typeof navigator !== "undefined" && "share" in navigator && (
          <button
            onClick={handleNativeShare}
            className="w-full py-2.5 rounded-xl bg-white/[0.05] border border-white/10 hover:border-accent/40 text-xs uppercase tracking-widest text-secondary hover:text-primary transition-all flex items-center justify-center space-x-2"
          >
            <Share2 className="w-3.5 h-3.5 text-accent" />
            <span>Open System Share Menu</span>
          </button>
        )}
      </div>
    </div>
  );
};
