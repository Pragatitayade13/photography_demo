import React from "react";
import { Image, FolderKanban, Tags, Mail, RotateCw, AlertCircle } from "lucide-react";
import { useAuth } from "../auth/hooks/useAuth";
import { useDashboard } from "../dashboard/hooks/useDashboard";
import { StatCard } from "../dashboard/components/StatCard";
import { QuickActions } from "../dashboard/components/QuickActions";
import { RecentActivity } from "../dashboard/components/RecentActivity";
import { PortfolioStatus } from "../dashboard/components/PortfolioStatus";

export const DashboardView: React.FC = () => {
  const { user } = useAuth();
  const { stats, recentActivity, systemStatus, isLoading, error, refresh } = useDashboard();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-surface-border">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-accent">
            Studio Management Center
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-primary tracking-tight mt-1">
            {getGreeting()}, {user?.name?.split(" ")[0] || "Photographer"}.
          </h2>
          <p className="text-xs text-secondary mt-1">
            Here is the live operational status and recent activity for your photography showcase.
          </p>
        </div>

        <button
          onClick={refresh}
          disabled={isLoading}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-surface border border-surface-border text-xs uppercase tracking-widest text-secondary hover:text-accent hover:border-accent transition-all rounded-md self-start sm:self-center disabled:opacity-50"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-accent" : ""}`} />
          <span>{isLoading ? "Refreshing..." : "Refresh Status"}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-danger/10 border border-danger/20 rounded-lg text-danger text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Photographs"
          value={stats?.photos.total ?? 0}
          subValue={`${stats?.photos.published ?? 0} published online`}
          icon={Image}
          badgeText={`${stats?.photos.featured ?? 0} featured`}
        />

        <StatCard
          label="Project Stories"
          value={stats?.projects.total ?? 0}
          subValue={`${stats?.projects.published ?? 0} published stories`}
          icon={FolderKanban}
          badgeText={`${stats?.projects.featured ?? 0} featured`}
        />

        <StatCard
          label="Active Categories"
          value={stats?.categories.total ?? 0}
          subValue={`${stats?.categories.active ?? 0} live genres`}
          icon={Tags}
          badgeText="Catalog active"
        />

        <StatCard
          label="Client Inquiries"
          value={stats?.messages.total ?? 0}
          subValue={`${stats?.messages.unread ?? 0} unread messages`}
          icon={Mail}
          badgeText={stats?.messages.unread ? `${stats.messages.unread} new leads` : "Up to date"}
          highlight={Boolean(stats?.messages.unread && stats.messages.unread > 0)}
        />
      </div>

      {/* Quick Actions Shortcuts */}
      <QuickActions />

      {/* Split Grid: Recent Activity & Showcase Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <RecentActivity activities={recentActivity} isLoading={isLoading} />
        </div>
        <div className="lg:col-span-4">
          <PortfolioStatus
            publishedRatio={systemStatus?.publishedRatio ?? 100}
            databaseStatus={systemStatus?.database ?? "Connected"}
            uptime={systemStatus?.serverUptime ?? 0}
          />
        </div>
      </div>
    </div>
  );
};
