import React from "react";
import { Link } from "react-router-dom";
import { ImagePlus, FolderPlus, Tags, Mail, ArrowRight } from "lucide-react";

export const QuickActions: React.FC = () => {
  const actions = [
    {
      title: "Upload Photos",
      description: "Add new photographs and metadata to your gallery",
      path: "/admin/photos",
      icon: ImagePlus,
      color: "text-accent",
    },
    {
      title: "Create Project",
      description: "Bundle series into editorial stories & assignments",
      path: "/admin/projects",
      icon: FolderPlus,
      color: "text-primary",
    },
    {
      title: "Manage Categories",
      description: "Configure genres, slugs, and public filter tags",
      path: "/admin/categories",
      icon: Tags,
      color: "text-primary",
    },
    {
      title: "Client Inquiries",
      description: "Review incoming contact requests and WhatsApp leads",
      path: "/admin/messages",
      icon: Mail,
      color: "text-accent",
    },
  ];

  return (
    <div className="bg-surface border border-surface-border rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-serif text-lg font-normal text-primary">
            Quick Actions
          </h3>
          <p className="text-xs text-secondary">
            Direct shortcuts to primary studio operations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.title}
              to={action.path}
              className="group p-4 bg-surface-raised border border-surface-border rounded-lg hover:border-accent/40 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-md bg-surface border border-surface-border text-accent group-hover:scale-105 transition-transform">
                  <Icon className="w-4 h-4" />
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-secondary group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-primary group-hover:text-accent transition-colors">
                  {action.title}
                </h4>
                <p className="text-[11px] text-secondary mt-0.5 line-clamp-2">
                  {action.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
