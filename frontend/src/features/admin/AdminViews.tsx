import React from "react";
import { SettingsView as SettingsComponent } from "./SettingsView";
import { SeoAdminView } from "./seo/SeoAdminView";
import { AnalyticsView as AnalyticsComponent } from "./analytics/AnalyticsView";
import { NotificationsView as NotificationsComponent } from "./notifications/NotificationsView";

export const AppearanceView: React.FC = () => {
  return <SettingsComponent initialTab="branding" />;
};

export const SeoView: React.FC = () => {
  return <SeoAdminView />;
};

export const AnalyticsView: React.FC = () => {
  return <AnalyticsComponent />;
};

export const NotificationsView: React.FC = () => {
  return <NotificationsComponent />;
};

export const SettingsView: React.FC = () => {
  return <SettingsComponent initialTab="general" />;
};

