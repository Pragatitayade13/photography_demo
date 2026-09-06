import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  CheckCheck,
  Trash2,
  ExternalLink,
  Mail,
  AlertCircle,
  Clock,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { notificationApi } from "../../../services/notificationApi";
import { InAppNotification } from "../../../types/notifications";

export const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationApi.getInAppNotifications(10);
      setNotifications(data.items || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      console.error("Failed to load in-app notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // 30s polling
    return () => clearInterval(interval);
  }, []);

  // Close when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markInAppRead(undefined, true);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all read:", err);
    }
  };

  const handleNotificationClick = async (n: InAppNotification) => {
    if (!n.is_read) {
      try {
        await notificationApi.markInAppRead([n.id]);
        setNotifications((prev) =>
          prev.map((item) => (item.id === n.id ? { ...item, is_read: true } : item))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (err) {
        console.error("Failed to mark read:", err);
      }
    }
    setIsOpen(false);
    if (n.link_url) {
      navigate(n.link_url);
    }
  };

  const handleClearRead = async () => {
    try {
      await notificationApi.clearReadInApp();
      setNotifications((prev) => prev.filter((n) => !n.is_read));
    } catch (err) {
      console.error("Failed to clear read:", err);
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHr / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHr > 0) return `${diffHr}h ago`;
    if (diffMin > 0) return `${diffMin}m ago`;
    return "just now";
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-secondary hover:text-primary hover:bg-surface-raised/80 rounded-full transition-colors focus:outline-none"
        title="Notifications"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-black shadow-sm animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-96 max-w-[90vw] bg-surface border border-surface-border rounded-xl shadow-2xl z-50 overflow-hidden backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="px-4 py-3.5 border-b border-surface-border flex items-center justify-between bg-surface-raised/40">
            <div className="flex items-center space-x-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="bg-accent/15 text-accent text-[10px] font-semibold px-2 py-0.5 rounded-full border border-accent/30">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={fetchNotifications}
                disabled={loading}
                className="p-1 text-secondary hover:text-primary rounded hover:bg-surface-raised transition-colors"
                title="Refresh notifications"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="p-1 text-secondary hover:text-accent rounded hover:bg-surface-raised transition-colors text-[11px] flex items-center space-x-1"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                </button>
              )}
              {notifications.some((n) => n.is_read) && (
                <button
                  onClick={handleClearRead}
                  className="p-1 text-secondary hover:text-danger rounded hover:bg-surface-raised transition-colors text-[11px]"
                  title="Clear read alerts"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* List items */}
          <div className="max-h-80 overflow-y-auto divide-y divide-surface-border/50">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-10 h-10 rounded-full bg-surface-raised mx-auto flex items-center justify-center text-secondary/60 mb-2">
                  <Bell className="w-5 h-5" />
                </div>
                <p className="text-xs font-medium text-secondary">No notifications right now</p>
                <p className="text-[11px] text-secondary/60 mt-0.5">
                  New commission inquiries and system dispatches will appear here.
                </p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`p-3.5 cursor-pointer transition-colors flex items-start space-x-3 hover:bg-surface-raised/70 ${
                    !item.is_read ? "bg-accent/5" : ""
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                      item.type === "ENQUIRY_NEW"
                        ? "bg-accent/15 text-accent border border-accent/20"
                        : item.type === "ENQUIRY_STATUS"
                        ? "bg-blue-500/15 text-blue-400 border border-blue-500/20"
                        : "bg-surface-raised text-secondary border border-surface-border"
                    }`}
                  >
                    {item.type === "ENQUIRY_NEW" ? (
                      <Sparkles className="w-4 h-4" />
                    ) : item.type === "ENQUIRY_STATUS" ? (
                      <Mail className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p
                        className={`text-xs font-semibold truncate ${
                          !item.is_read ? "text-primary" : "text-secondary"
                        }`}
                      >
                        {item.title}
                      </p>
                      <span className="text-[10px] text-secondary/60 shrink-0 flex items-center space-x-1">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{formatTimeAgo(item.created_at)}</span>
                      </span>
                    </div>
                    <p className="text-[11px] text-secondary line-clamp-2 leading-relaxed">
                      {item.message}
                    </p>
                    {item.priority === "URGENT" || item.priority === "HIGH" ? (
                      <span className="inline-block mt-1 text-[9px] uppercase tracking-wider font-semibold text-accent bg-accent/10 px-1.5 py-0.2 rounded border border-accent/20">
                        {item.priority}
                      </span>
                    ) : null}
                  </div>

                  {!item.is_read && (
                    <span className="w-2 h-2 rounded-full bg-accent shrink-0 mt-2" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 border-t border-surface-border bg-surface-raised/30 flex items-center justify-between text-xs">
            <Link
              to="/admin/notifications"
              onClick={() => setIsOpen(false)}
              className="text-secondary hover:text-accent font-medium flex items-center space-x-1.5 transition-colors px-2 py-1"
            >
              <span>Manage Notifications & Templates</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
