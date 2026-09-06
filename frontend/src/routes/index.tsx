import { createBrowserRouter } from "react-router-dom";
import { PublicLayout } from "../layouts/PublicLayout";
import { AdminLayout } from "../layouts/AdminLayout";
import { ProtectedRoute } from "../features/auth/components/ProtectedRoute";
import { HomeView } from "../features/public/HomeView";
import { PortfolioView } from "../features/public/PortfolioView";
import { ProjectStoryView } from "../features/public/ProjectStoryView";
import { AboutView } from "../features/public/AboutView";
import { ContactView } from "../features/public/ContactView";
import { ShortlistView } from "../features/public/ShortlistView";
import { LegalPolicyView } from "../features/public/LegalPolicyView";
import { LoginView } from "../features/admin/LoginView";
import { DashboardView } from "../features/admin/DashboardView";
import { CategoriesView } from "../features/admin/CategoriesView";
import { PhotosView } from "../features/admin/PhotosView";
import { ProjectsView } from "../features/admin/ProjectsView";
import { HomepageView } from "../features/admin/HomepageView";
import { AboutAdminView } from "../features/admin/AboutAdminView";
import { InquiriesView } from "../features/admin/InquiriesView";
import { MediaLibraryView } from "../features/admin/media/MediaLibraryView";
import { SecurityLogsView } from "../features/admin/security/SecurityLogsView";
import { SystemHealthView } from "../features/admin/security/SystemHealthView";
import {
  AppearanceView,
  SeoView,
  SettingsView,
  AnalyticsView,
  NotificationsView,
} from "../features/admin/AdminViews";
import { NotFound } from "../components/common/NotFound";

export const router = createBrowserRouter([
  // Public Routes
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomeView /> },
      { path: "portfolio", element: <PortfolioView /> },
      { path: "portfolio/:slug", element: <ProjectStoryView /> },
      { path: "project/:slug", element: <ProjectStoryView /> },
      { path: "shortlist", element: <ShortlistView /> },
      { path: "about", element: <AboutView /> },
      { path: "contact", element: <ContactView /> },
      { path: "privacy-policy", element: <LegalPolicyView type="privacy" /> },
      { path: "terms", element: <LegalPolicyView type="terms" /> },
      { path: "*", element: <NotFound /> },
    ],
  },

  // Admin Login Route (Independent public layout)
  {
    path: "/admin/login",
    element: <LoginView />,
  },

  // Protected Admin CMS Routes
  {
    path: "/admin",
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <DashboardView /> },
          { path: "dashboard", element: <DashboardView /> },
          { path: "analytics", element: <AnalyticsView /> },
          { path: "photos", element: <PhotosView /> },
          { path: "media", element: <MediaLibraryView /> },
          { path: "projects", element: <ProjectsView /> },
          { path: "categories", element: <CategoriesView /> },
          { path: "homepage", element: <HomepageView /> },
          { path: "about", element: <AboutAdminView /> },
          { path: "appearance", element: <AppearanceView /> },
          { path: "messages", element: <InquiriesView /> },
          { path: "inquiries", element: <InquiriesView /> },
          { path: "notifications", element: <NotificationsView /> },
          { path: "security/logs", element: <SecurityLogsView /> },
          { path: "system/health", element: <SystemHealthView /> },
          { path: "seo", element: <SeoView /> },
          { path: "settings", element: <SettingsView /> },
          { path: "*", element: <NotFound /> },
        ],
      },
    ],
  },
]);
