import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  FolderKanban,
  Tags,
  Layers,
  Mail,
  X,
  Sparkles,
  CornerDownLeft,
} from "lucide-react";
import { apiClient } from "../../../services/apiClient";

interface SearchResultItem {
  id: string;
  type: "PROJECT" | "CATEGORY" | "MEDIA" | "ENQUIRY";
  title: string;
  subtitle: string;
  url: string;
  badge?: string;
}

interface SearchResponse {
  query: string;
  total: number;
  results: {
    projects: SearchResultItem[];
    categories: SearchResultItem[];
    media: SearchResultItem[];
    enquiries: SearchResultItem[];
  };
}

interface AdminGlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminGlobalSearchModal: React.FC<AdminGlobalSearchModalProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<SearchResponse["results"]>({
    projects: [],
    categories: [],
    media: [],
    enquiries: [],
  });
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  // Flattened list for keyboard arrow navigation
  const flatItems = [
    ...results.projects,
    ...results.categories,
    ...results.media,
    ...results.enquiries,
  ];

  const handleSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults({ projects: [], categories: [], media: [], enquiries: [] });
      setTotalCount(0);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await apiClient.get<SearchResponse>("/dashboard/global-search", {
        params: { q },
      });
      setResults(res.data.results);
      setTotalCount(res.data.total);
      setSelectedIndex(0);
    } catch (err) {
      console.error("Global search failed:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(query);
    }, 200);
    return () => clearTimeout(timer);
  }, [query, handleSearch]);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setResults({ projects: [], categories: [], media: [], enquiries: [] });
      setTotalCount(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < flatItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : flatItems.length - 1));
    } else if (e.key === "Enter" && flatItems[selectedIndex]) {
      e.preventDefault();
      handleSelect(flatItems[selectedIndex]);
    }
  };

  const handleSelect = (item: SearchResultItem) => {
    onClose();
    navigate(item.url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-background/80 backdrop-blur-md animate-in fade-in">
      <div
        className="w-full max-w-2xl bg-[#0e0e13] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onKeyDown={handleKeyDown}
      >
        {/* Search Header Bar */}
        <div className="p-4 border-b border-white/10 flex items-center space-x-3 bg-surface-raised/60">
          <Search className="w-5 h-5 text-accent shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, categories, media assets, enquiries... (type or arrow keys)"
            className="w-full bg-transparent text-sm text-primary placeholder:text-secondary/60 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-secondary hover:text-primary rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono text-secondary bg-white/5 border border-white/10 rounded">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="p-4 overflow-y-auto space-y-5 flex-grow">
          {isLoading ? (
            <div className="py-12 text-center text-xs text-secondary animate-pulse">
              Searching studio records across all modules...
            </div>
          ) : query && totalCount === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Search className="w-8 h-8 text-secondary/40 mx-auto" />
              <p className="text-xs text-primary font-medium">No matches found for "{query}"</p>
              <p className="text-[11px] text-secondary">
                Try searching by client name, project title, category, or file name.
              </p>
            </div>
          ) : !query ? (
            <div className="py-8 text-center space-y-2 text-secondary">
              <Sparkles className="w-6 h-6 text-accent/60 mx-auto" />
              <p className="text-xs text-primary font-medium">Spotlight Command Search</p>
              <p className="text-[11px] text-secondary">
                Quickly jump to any project, category, media file, or inquiry across the CMS.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Projects */}
              {results.projects.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase tracking-widest text-secondary font-bold px-2 flex items-center space-x-1.5">
                    <FolderKanban className="w-3.5 h-3.5 text-accent" />
                    <span>Projects & Stories</span>
                  </span>
                  <div className="space-y-1">
                    {results.projects.map((item) => {
                      const idx = flatItems.findIndex((f) => f.id === item.id);
                      const isSelected = selectedIndex === idx;
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleSelect(item)}
                          className={`p-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-accent/15 border border-accent/40 text-primary"
                              : "hover:bg-white/[0.04] text-secondary"
                          }`}
                        >
                          <div className="truncate">
                            <p className="text-xs font-medium text-primary">{item.title}</p>
                            <p className="text-[10px] text-secondary truncate">{item.subtitle}</p>
                          </div>
                          <div className="flex items-center space-x-2 shrink-0">
                            {item.badge && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-white/5 border border-white/10 text-accent">
                                {item.badge}
                              </span>
                            )}
                            <CornerDownLeft className="w-3.5 h-3.5 text-secondary/60" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Categories */}
              {results.categories.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase tracking-widest text-secondary font-bold px-2 flex items-center space-x-1.5">
                    <Tags className="w-3.5 h-3.5 text-accent" />
                    <span>Categories</span>
                  </span>
                  <div className="space-y-1">
                    {results.categories.map((item) => {
                      const idx = flatItems.findIndex((f) => f.id === item.id);
                      const isSelected = selectedIndex === idx;
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleSelect(item)}
                          className={`p-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-accent/15 border border-accent/40 text-primary"
                              : "hover:bg-white/[0.04] text-secondary"
                          }`}
                        >
                          <div className="truncate">
                            <p className="text-xs font-medium text-primary">{item.title}</p>
                            <p className="text-[10px] text-secondary truncate">{item.subtitle}</p>
                          </div>
                          <CornerDownLeft className="w-3.5 h-3.5 text-secondary/60" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Media */}
              {results.media.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase tracking-widest text-secondary font-bold px-2 flex items-center space-x-1.5">
                    <Layers className="w-3.5 h-3.5 text-accent" />
                    <span>Media Assets</span>
                  </span>
                  <div className="space-y-1">
                    {results.media.map((item) => {
                      const idx = flatItems.findIndex((f) => f.id === item.id);
                      const isSelected = selectedIndex === idx;
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleSelect(item)}
                          className={`p-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-accent/15 border border-accent/40 text-primary"
                              : "hover:bg-white/[0.04] text-secondary"
                          }`}
                        >
                          <div className="truncate">
                            <p className="text-xs font-medium text-primary">{item.title}</p>
                            <p className="text-[10px] text-secondary truncate">{item.subtitle}</p>
                          </div>
                          <CornerDownLeft className="w-3.5 h-3.5 text-secondary/60" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Enquiries */}
              {results.enquiries.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase tracking-widest text-secondary font-bold px-2 flex items-center space-x-1.5">
                    <Mail className="w-3.5 h-3.5 text-accent" />
                    <span>Client Enquiries</span>
                  </span>
                  <div className="space-y-1">
                    {results.enquiries.map((item) => {
                      const idx = flatItems.findIndex((f) => f.id === item.id);
                      const isSelected = selectedIndex === idx;
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleSelect(item)}
                          className={`p-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-accent/15 border border-accent/40 text-primary"
                              : "hover:bg-white/[0.04] text-secondary"
                          }`}
                        >
                          <div className="truncate">
                            <p className="text-xs font-medium text-primary">{item.title}</p>
                            <p className="text-[10px] text-secondary truncate">{item.subtitle}</p>
                          </div>
                          <CornerDownLeft className="w-3.5 h-3.5 text-secondary/60" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="p-3 bg-surface-raised/40 border-t border-white/5 flex items-center justify-between text-[11px] text-secondary">
          <div className="flex items-center space-x-3">
            <span>
              <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded font-mono text-[10px] mr-1">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded font-mono text-[10px] mr-1">↓</kbd>
              Navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded font-mono text-[10px] mr-1">↵</kbd>
              Open
            </span>
          </div>
          <span>{totalCount} total results</span>
        </div>
      </div>
    </div>
  );
};
