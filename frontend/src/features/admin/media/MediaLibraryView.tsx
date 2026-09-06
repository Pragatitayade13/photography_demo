import React, { useState, useEffect, useCallback } from "react";
import {
  UploadCloud,
  Search,
  Grid,
  List,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Layers,
  X,
  Plus,
  FileText,
  Copy,
} from "lucide-react";
import { mediaService } from "./services/mediaService";
import {
  MediaAsset,
  MediaVisibility,
  MediaProcessingStatus,
} from "./types/media.types";
import { ResponsiveImage } from "../../../components/common/ResponsiveImage";

export const MediaLibraryView: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaAsset[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [visibilityFilter, setVisibilityFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Selection & Details Drawer
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeDrawerAsset, setActiveDrawerAsset] = useState<MediaAsset | null>(null);

  // Upload Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadAltText, setUploadAltText] = useState<string>("");
  const [uploadCaption, setUploadCaption] = useState<string>("");
  const [uploadVisibility, setUploadVisibility] = useState<MediaVisibility>("PUBLIC");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchMedia = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await mediaService.getAdminMediaList({
        page,
        limit: 18,
        search: searchQuery || undefined,
        visibility: visibilityFilter !== "ALL" ? (visibilityFilter as MediaVisibility) : undefined,
        processing_status: statusFilter !== "ALL" ? (statusFilter as MediaProcessingStatus) : undefined,
      });
      setMediaItems(res.items || []);
      setTotalCount(res.pagination.total);
      setTotalPages(res.pagination.totalPages);
    } catch (err) {
      console.error("Failed to load media assets:", err);
    } finally {
      setIsLoading(false);
    }
  }, [page, searchQuery, visibilityFilter, statusFilter]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      await mediaService.uploadMedia(uploadFile, {
        alt_text: uploadAltText,
        caption: uploadCaption,
        visibility: uploadVisibility,
      });
      setIsUploadModalOpen(false);
      setUploadFile(null);
      setUploadAltText("");
      setUploadCaption("");
      fetchMedia();
    } catch (err: any) {
      setUploadError(err.response?.data?.error?.message || err.message || "Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleVisibilityChange = async (id: string, newVisibility: MediaVisibility) => {
    try {
      const updated = await mediaService.updateVisibility(id, newVisibility);
      setMediaItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
      if (activeDrawerAsset?.id === id) setActiveDrawerAsset(updated);
    } catch (err: any) {
      alert(err.response?.data?.error?.message || err.message || "Failed to update visibility");
    }
  };

  const handleRetryProcessing = async (id: string) => {
    try {
      const updated = await mediaService.retryProcessing(id);
      setMediaItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
      if (activeDrawerAsset?.id === id) setActiveDrawerAsset(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this media asset?")) return;
    try {
      await mediaService.deleteMedia(id);
      setMediaItems((prev) => prev.filter((item) => item.id !== id));
      if (activeDrawerAsset?.id === id) setActiveDrawerAsset(null);
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    } catch (err) {
      console.error("Failed to delete media:", err);
    }
  };

  const handleBatchVisibility = async (visibility: MediaVisibility) => {
    for (const id of selectedIds) {
      try {
        await mediaService.updateVisibility(id, visibility);
      } catch {
        // ignore
      }
    }
    setSelectedIds([]);
    fetchMedia();
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-border">
        <div>
          <div className="flex items-center space-x-2 text-accent">
            <Layers className="w-4 h-4" />
            <span className="text-[10px] uppercase font-bold tracking-widest">
              Performance & Asset Pipeline
            </span>
          </div>
          <h2 className="font-serif text-3xl font-light text-primary tracking-tight mt-1">
            Media Asset Library
          </h2>
          <p className="text-xs text-secondary mt-1">
            Manage high-resolution photography assets, auto-generated responsive variants, and visibility controls.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchMedia}
            disabled={isLoading}
            className="p-2.5 bg-surface border border-surface-border text-secondary hover:text-accent rounded-md transition-colors"
            title="Refresh assets"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin text-accent" : ""}`} />
          </button>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-accent text-background text-xs uppercase tracking-widest font-semibold rounded-md hover:bg-accent-hover transition-colors shadow-lg shadow-accent/10"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Image</span>
          </button>
        </div>
      </div>

      {/* Filter and View Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search */}
        <div className="md:col-span-4 relative">
          <Search className="w-4 h-4 text-secondary absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by filename, caption, alt text..."
            className="w-full bg-surface border border-surface-border rounded-lg pl-9 pr-4 py-2 text-xs text-primary focus:outline-none focus:border-accent"
          />
        </div>

        {/* Visibility Filter */}
        <div className="md:col-span-3">
          <select
            value={visibilityFilter}
            onChange={(e) => setVisibilityFilter(e.target.value)}
            className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2 text-xs text-primary appearance-none focus:outline-none focus:border-accent cursor-pointer"
          >
            <option value="ALL">All Visibility States</option>
            <option value="PUBLIC">Public</option>
            <option value="PRIVATE">Private</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        {/* Processing Status Filter */}
        <div className="md:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-surface border border-surface-border rounded-lg px-3 py-2 text-xs text-primary appearance-none focus:outline-none focus:border-accent cursor-pointer"
          >
            <option value="ALL">All Processing Statuses</option>
            <option value="READY">Ready & Optimized</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="FAILED">Failed / Needs Retry</option>
          </select>
        </div>

        {/* View Toggle */}
        <div className="md:col-span-2 flex items-center justify-end space-x-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded border transition-colors ${
              viewMode === "grid"
                ? "bg-accent/10 border-accent/40 text-accent"
                : "bg-surface border-surface-border text-secondary hover:text-primary"
            }`}
            title="Grid View"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`p-2 rounded border transition-colors ${
              viewMode === "table"
                ? "bg-accent/10 border-accent/40 text-accent"
                : "bg-surface border-surface-border text-secondary hover:text-primary"
            }`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bulk Action Strip */}
      {selectedIds.length > 0 && (
        <div className="p-3 bg-surface-raised border border-accent/30 rounded-lg flex items-center justify-between animate-in fade-in">
          <span className="text-xs text-primary font-medium">
            {selectedIds.length} asset{selectedIds.length > 1 ? "s" : ""} selected
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleBatchVisibility("PUBLIC")}
              className="px-3 py-1 bg-white/5 hover:bg-white/10 text-xs text-emerald-400 border border-emerald-500/30 rounded"
            >
              Make Public
            </button>
            <button
              onClick={() => handleBatchVisibility("PRIVATE")}
              className="px-3 py-1 bg-white/5 hover:bg-white/10 text-xs text-secondary border border-white/10 rounded"
            >
              Make Private
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="px-3 py-1 text-xs text-secondary hover:text-primary"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* Main Asset Grid / Table */}
      {isLoading ? (
        <div className="py-24 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-accent animate-spin mx-auto" />
          <p className="text-xs text-secondary uppercase tracking-widest">
            Loading Media Library...
          </p>
        </div>
      ) : mediaItems.length === 0 ? (
        <div className="py-20 text-center space-y-4 bg-surface border border-surface-border rounded-xl">
          <UploadCloud className="w-12 h-12 text-secondary/40 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-primary">No Media Assets Found</h3>
            <p className="text-xs text-secondary max-w-sm mx-auto">
              Upload your high-resolution photographs to automatically generate responsive WebP variants.
            </p>
          </div>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2 bg-accent text-background text-xs uppercase tracking-widest font-semibold rounded hover:bg-accent-hover transition-colors"
          >
            Upload First Asset
          </button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {mediaItems.map((asset) => {
            const isSelected = selectedIds.includes(asset.id);
            return (
              <div
                key={asset.id}
                onClick={() => setActiveDrawerAsset(asset)}
                className={`group relative bg-surface border rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:border-accent/60 ${
                  isSelected ? "border-accent ring-2 ring-accent/30" : "border-surface-border"
                }`}
              >
                {/* Checkbox trigger */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIds((prev) =>
                      prev.includes(asset.id)
                        ? prev.filter((id) => id !== asset.id)
                        : [...prev, asset.id]
                    );
                  }}
                  className="absolute top-2 left-2 z-20 w-5 h-5 rounded bg-black/60 border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {isSelected && <div className="w-2.5 h-2.5 rounded-sm bg-accent" />}
                </div>

                {/* Status Badges */}
                <div className="absolute top-2 right-2 z-20 flex items-center space-x-1">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider font-bold backdrop-blur-md ${
                      asset.visibility === "PUBLIC"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : asset.visibility === "PRIVATE"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                        : "bg-secondary/20 text-secondary border border-secondary/30"
                    }`}
                  >
                    {asset.visibility}
                  </span>
                </div>

                {/* Image Container with ResponsiveImage */}
                <div className="aspect-[4/3] w-full overflow-hidden bg-[#101014]">
                  <ResponsiveImage
                    src={asset.storage_path}
                    alt={asset.alt_text || asset.original_filename}
                    className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Info Footer */}
                <div className="p-2.5 space-y-1 bg-surface-raised/90">
                  <p className="text-[11px] font-medium text-primary truncate" title={asset.original_filename}>
                    {asset.original_filename}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-secondary">
                    <span>{asset.width && asset.height ? `${asset.width}×${asset.height}` : "Auto"}</span>
                    <span>{formatBytes(asset.file_size)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-surface border border-surface-border rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-raised/50 border-b border-surface-border uppercase tracking-widest text-[10px] text-secondary font-semibold">
              <tr>
                <th className="p-3.5 pl-4">Asset</th>
                <th className="p-3.5">Visibility</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Dimensions</th>
                <th className="p-3.5">Size</th>
                <th className="p-3.5">Variants</th>
                <th className="p-3.5 text-right pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border text-secondary">
              {mediaItems.map((asset) => (
                <tr
                  key={asset.id}
                  onClick={() => setActiveDrawerAsset(asset)}
                  className="hover:bg-white/[0.02] cursor-pointer transition-colors"
                >
                  <td className="p-3 pl-4 flex items-center space-x-3">
                    <div className="w-12 h-9 rounded overflow-hidden bg-black/40 shrink-0 border border-surface-border">
                      <img src={asset.storage_path} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="truncate max-w-[200px]">
                      <p className="font-medium text-primary truncate">{asset.original_filename}</p>
                      <p className="text-[10px] text-secondary/60 uppercase tracking-wider">{asset.mime_type}</p>
                    </div>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                        asset.visibility === "PUBLIC"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-amber-500/10 text-amber-400"
                      }`}
                    >
                      {asset.visibility}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="flex items-center space-x-1.5 text-xs text-primary">
                      {asset.processing_status === "READY" ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                      )}
                      <span>{asset.processing_status}</span>
                    </span>
                  </td>
                  <td className="p-3 font-sans">
                    {asset.width && asset.height ? `${asset.width} × ${asset.height} px` : "—"}
                  </td>
                  <td className="p-3 font-sans">{formatBytes(asset.file_size)}</td>
                  <td className="p-3 font-sans">{asset.variants?.length || 0} sizes</td>
                  <td className="p-3 text-right pr-4 space-x-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleCopyUrl(asset.storage_path, asset.id)}
                      className="p-1.5 text-secondary hover:text-accent rounded"
                      title="Copy URL"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(asset.id)}
                      className="p-1.5 text-secondary hover:text-danger rounded"
                      title="Delete asset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-surface-border">
          <p className="text-xs text-secondary">
            Showing Page {page} of {totalPages} ({totalCount} total assets)
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded border border-surface-border text-xs text-secondary hover:text-primary disabled:opacity-40"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded border border-surface-border text-xs text-secondary hover:text-primary disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Metadata & Responsive Variants Inspector Drawer */}
      {activeDrawerAsset && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-surface border-l border-surface-border h-full overflow-y-auto p-6 space-y-6 flex flex-col justify-between shadow-2xl">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-surface-border">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-accent" />
                  <h3 className="font-serif text-lg text-primary">Asset Details</h3>
                </div>
                <button
                  onClick={() => setActiveDrawerAsset(null)}
                  className="p-1 text-secondary hover:text-primary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Preview Image */}
              <div className="rounded-lg overflow-hidden border border-surface-border bg-black/40">
                <img
                  src={activeDrawerAsset.storage_path}
                  alt={activeDrawerAsset.alt_text || ""}
                  className="w-full max-h-60 object-contain"
                />
              </div>

              {/* Visibility Switch */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-secondary font-bold">
                  Visibility State
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["PUBLIC", "PRIVATE", "DRAFT"] as MediaVisibility[]).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => handleVisibilityChange(activeDrawerAsset.id, v)}
                      className={`py-1.5 text-xs rounded border transition-all ${
                        activeDrawerAsset.visibility === v
                          ? "bg-accent text-background font-bold border-accent"
                          : "bg-surface-raised border-surface-border text-secondary hover:text-primary"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Metadata Info */}
              <div className="bg-surface-raised rounded-lg p-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-secondary">Filename</span>
                  <span className="text-primary font-mono truncate max-w-[200px]" title={activeDrawerAsset.original_filename}>
                    {activeDrawerAsset.original_filename}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Dimensions</span>
                  <span className="text-primary font-sans">
                    {activeDrawerAsset.width} × {activeDrawerAsset.height} px
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">File Size</span>
                  <span className="text-primary font-sans">{formatBytes(activeDrawerAsset.file_size)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">MIME Type</span>
                  <span className="text-primary font-mono">{activeDrawerAsset.mime_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary">Optimization</span>
                  <span className="text-emerald-400 font-medium">{activeDrawerAsset.processing_status}</span>
                </div>
              </div>

              {/* Generated Responsive Variants */}
              {activeDrawerAsset.variants && activeDrawerAsset.variants.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[11px] uppercase tracking-wider text-secondary font-bold">
                    Generated Responsive Variants ({activeDrawerAsset.variants.length})
                  </h4>
                  <div className="space-y-1.5">
                    {activeDrawerAsset.variants.map((v) => (
                      <div
                        key={v.id}
                        className="flex items-center justify-between p-2.5 rounded bg-surface-raised border border-white/5 text-xs"
                      >
                        <div>
                          <span className="capitalize font-semibold text-primary">{v.variant_name}</span>
                          <span className="text-secondary text-[11px] ml-2">({v.width}px wide)</span>
                        </div>
                        <button
                          onClick={() => handleCopyUrl(v.storage_path, v.id)}
                          className="text-[10px] text-accent uppercase font-bold tracking-wider hover:underline"
                        >
                          {copiedId === v.id ? "Copied!" : "Copy URL"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-surface-border flex items-center justify-between">
              <button
                onClick={() => handleRetryProcessing(activeDrawerAsset.id)}
                className="px-3 py-2 text-xs border border-surface-border rounded text-secondary hover:text-primary"
              >
                Regenerate Variants
              </button>
              <button
                onClick={() => handleDelete(activeDrawerAsset.id)}
                className="px-3 py-2 text-xs bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded hover:bg-rose-500 hover:text-white transition-colors"
              >
                Delete Asset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-surface border border-surface-border rounded-xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-surface-border">
              <div className="flex items-center space-x-2">
                <UploadCloud className="w-5 h-5 text-accent" />
                <h3 className="font-serif text-lg text-primary">Upload High-Res Media</h3>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-secondary hover:text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {uploadError && (
              <div className="p-3 bg-danger/10 border border-danger/30 rounded text-xs text-danger flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
                  Select Image File (JPEG, PNG, WebP, AVIF)
                </label>
                <input
                  type="file"
                  required
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="w-full bg-surface-raised border border-surface-border rounded p-2 text-xs text-primary file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-accent file:text-background"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
                  Alt Text (SEO & Accessibility)
                </label>
                <input
                  type="text"
                  value={uploadAltText}
                  onChange={(e) => setUploadAltText(e.target.value)}
                  placeholder="e.g. Bride editorial portrait sunset"
                  className="w-full bg-surface-raised border border-surface-border rounded px-3 py-2 text-xs text-primary focus:outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
                  Caption (Optional)
                </label>
                <textarea
                  rows={2}
                  value={uploadCaption}
                  onChange={(e) => setUploadCaption(e.target.value)}
                  placeholder="Brief story caption for gallery display"
                  className="w-full bg-surface-raised border border-surface-border rounded px-3 py-2 text-xs text-primary focus:outline-none focus:border-accent"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-secondary font-medium">
                  Initial Visibility
                </label>
                <select
                  value={uploadVisibility}
                  onChange={(e) => setUploadVisibility(e.target.value as MediaVisibility)}
                  className="w-full bg-surface-raised border border-surface-border rounded px-3 py-2 text-xs text-primary focus:outline-none focus:border-accent"
                >
                  <option value="PUBLIC">Public</option>
                  <option value="PRIVATE">Private</option>
                  <option value="DRAFT">Draft</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3 border-t border-surface-border">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 border border-surface-border rounded text-xs text-secondary hover:text-primary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading || !uploadFile}
                  className="px-6 py-2 bg-accent text-background rounded text-xs uppercase tracking-widest font-semibold hover:bg-accent-hover disabled:opacity-50 transition-colors"
                >
                  {isUploading ? "Uploading & Optimizing..." : "Start Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
