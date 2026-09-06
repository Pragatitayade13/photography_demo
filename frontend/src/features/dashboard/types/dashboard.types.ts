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
  created_at: string;
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
