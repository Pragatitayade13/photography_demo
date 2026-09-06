export interface DashboardStats {
  photos: {
    total: number;
    published: number;
    featured: number;
  };
  projects: {
    total: number;
    published: number;
    featured: number;
  };
  categories: {
    total: number;
    active: number;
  };
  messages: {
    total: number;
    unread: number;
  };
}

export interface ActivityLogItem {
  id: string;
  admin_id?: string | null;
  action: string;
  entity_type: string;
  entity_id?: string | null;
  description: string;
  created_at: string | Date;
}

export interface DashboardSummary {
  stats: DashboardStats;
  recentActivity: ActivityLogItem[];
  systemStatus: {
    database: string;
    serverUptime: number;
    environment: string;
    publishedRatio: number;
  };
}

export interface GlobalSearchResultItem {
  id: string;
  type: "PROJECT" | "CATEGORY" | "MEDIA" | "ENQUIRY";
  title: string;
  subtitle: string;
  url: string;
  badge?: string;
}

export interface GlobalSearchResponse {
  query: string;
  total: number;
  results: {
    projects: GlobalSearchResultItem[];
    categories: GlobalSearchResultItem[];
    media: GlobalSearchResultItem[];
    enquiries: GlobalSearchResultItem[];
  };
}

