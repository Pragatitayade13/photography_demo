import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Image,
  FolderKanban,
  Tags,
  Home,
  User,
  Palette,
  Mail,
  Search,
  Settings,
  LogOut,
  ExternalLink,
  BarChart3,
  Bell,
  Layers,
  ShieldAlert,
  Activity,
} from "lucide-react";
import { useAuth } from "../features/auth/hooks/useAuth";
import { NotificationCenter } from "../features/admin/notifications/NotificationCenter";
import { AdminGlobalSearchModal } from "../features/admin/components/AdminGlobalSearchModal";

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login", { replace: true });
  };

  const navGroups = [
    {
      label: "Overview",
      items: [
        { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
        { name: "Analytics", path: "/admin/analytics", icon: BarChart3 },
      ],
    },
    {
      label: "Content",
      items: [
        { name: "Photos", path: "/admin/photos", icon: Image },
        { name: "Media Assets", path: "/admin/media", icon: Layers },
        { name: "Projects", path: "/admin/projects", icon: FolderKanban },
        { name: "Categories", path: "/admin/categories", icon: Tags },
      ],
    },
    {
      label: "Website",
      items: [
        { name: "Homepage CMS", path: "/admin/homepage", icon: Home },
        { name: "About CMS", path: "/admin/about", icon: User },
        { name: "Appearance & Themes", path: "/admin/appearance", icon: Palette },
        { name: "SEO & Social", path: "/admin/seo", icon: Search },
      ],
    },
    {
      label: "Security & System",
      items: [
        { name: "Contact & Inquiries", path: "/admin/messages", icon: Mail },
        { name: "Notifications & Email", path: "/admin/notifications", icon: Bell },
        { name: "Security Logs", path: "/admin/security/logs", icon: ShieldAlert },
        { name: "System Diagnostics", path: "/admin/system/health", icon: Activity },
        { name: "Settings", path: "/admin/settings", icon: Settings },
      ],
    },
  ];

  return (
    <div className="h-screen max-h-screen overflow-hidden flex bg-background text-primary">
      {/* Fixed Sidebar */}
      <aside className="w-64 h-full bg-surface border-r border-surface-border flex flex-col justify-between shrink-0 overflow-y-auto select-none">
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-surface-border flex items-center justify-between sticky top-0 bg-surface z-10">
            <div>
              <h2 className="font-serif text-lg tracking-wider font-semibold text-primary">
                Alex Studio
              </h2>
              <p className="text-xs uppercase tracking-widest text-accent font-medium">
                Admin CMS
              </p>
            </div>
            <Link
              to="/"
              target="_blank"
              title="View Public Site"
              className="text-secondary hover:text-accent p-1 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-6">
            {navGroups.map((group) => (
              <div key={group.label} className="space-y-1">
                <span className="text-[10px] uppercase font-semibold tracking-widest text-secondary/60 px-3">
                  {group.label}
                </span>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.path === "/admin"
                      ? location.pathname === "/admin"
                      : location.pathname.startsWith(item.path);

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center space-x-3 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                        isActive
                          ? "bg-surface-raised text-accent font-semibold border-l-2 border-accent"
                          : "text-secondary hover:text-primary hover:bg-surface-raised/50"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer / User & Logout */}
        <div className="p-4 border-t border-surface-border sticky bottom-0 bg-surface">
          <div className="flex items-center justify-between px-2 py-2">
            <div className="truncate mr-2">
              <p className="text-xs font-medium text-primary truncate">
                {user?.name || "Alex Mercer"}
              </p>
              <p className="text-[10px] text-secondary truncate">
                {user?.email || "admin@example.com"}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="text-secondary hover:text-danger p-1.5 rounded transition-colors shrink-0"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Scrollable Content Area */}
      <div className="flex-1 h-full flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 shrink-0 bg-surface/50 backdrop-blur-md border-b border-surface-border px-8 flex items-center justify-between z-10">
          <div className="flex items-center space-x-4">
            <h1 className="text-sm font-semibold tracking-wide uppercase text-secondary">
              Management Portal
            </h1>
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="inline-flex items-center space-x-2.5 px-3 py-1.5 rounded-lg bg-surface-raised border border-white/10 text-secondary hover:text-primary text-xs hover:border-accent/40 transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-accent" />
              <span>Spotlight Search</span>
              <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-secondary">
                ⌘K
              </kbd>
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <NotificationCenter />
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success/10 text-success border border-success/20">
              Authenticated Session
            </span>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Spotlight Command Palette Modal */}
      <AdminGlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
};
