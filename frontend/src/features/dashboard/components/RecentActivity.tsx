import React from "react";
import { ActivityLogItem } from "../types/dashboard.types";
import {
  Clock,
  Sparkles,
  Image,
  FolderKanban,
  Tags,
  Home,
  LogIn,
} from "lucide-react";

interface RecentActivityProps {
  activities: ActivityLogItem[];
  isLoading?: boolean;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities, isLoading }) => {
  const getActionIcon = (entityType: string) => {
    switch (entityType.toUpperCase()) {
      case "PHOTO":
        return <Image className="w-3.5 h-3.5 text-accent" />;
      case "PROJECT":
        return <FolderKanban className="w-3.5 h-3.5 text-primary" />;
      case "CATEGORY":
        return <Tags className="w-3.5 h-3.5 text-secondary" />;
      case "HOMEPAGE":
        return <Home className="w-3.5 h-3.5 text-accent" />;
      case "AUTH":
        return <LogIn className="w-3.5 h-3.5 text-success" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-accent" />;
    }
  };

  const formatTimestamp = (dateString: string | Date) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    return `${diffDays}d ago`;
  };

  return (
    <div className="bg-surface border border-surface-border rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-serif text-lg font-normal text-primary">
            Recent Activity
          </h3>
          <p className="text-xs text-secondary">
            Audit history of portfolio changes and publishing events.
          </p>
        </div>
        <div className="flex items-center space-x-1 text-xs text-secondary">
          <Clock className="w-3.5 h-3.5" />
          <span>Real-time Log</span>
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-xs text-secondary animate-pulse">
          Loading recent activities...
        </div>
      ) : activities.length === 0 ? (
        <div className="py-12 text-center text-xs text-secondary">
          No activity logs recorded yet.
        </div>
      ) : (
        <div className="divide-y divide-surface-border/60">
          {activities.map((item) => (
            <div key={item.id} className="py-3.5 flex items-start justify-between gap-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-full bg-surface-raised border border-surface-border mt-0.5 shrink-0">
                  {getActionIcon(item.entity_type)}
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs text-primary font-medium">
                    {item.description}
                  </p>
                  <div className="flex items-center space-x-2 text-[10px] text-secondary">
                    <span className="uppercase tracking-wider font-semibold text-accent/80">
                      {item.entity_type}
                    </span>
                    <span>•</span>
                    <span>Action: {item.action}</span>
                  </div>
                </div>
              </div>
              <span className="text-[11px] text-secondary/70 shrink-0 font-medium whitespace-nowrap">
                {formatTimestamp(item.created_at)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
