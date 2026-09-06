import React from "react";
import { Link } from "react-router-dom";
import { ExternalLink, Database, ShieldCheck } from "lucide-react";

interface PortfolioStatusProps {
  publishedRatio: number;
  databaseStatus: string;
  uptime?: number;
}

export const PortfolioStatus: React.FC<PortfolioStatusProps> = ({
  publishedRatio,
  databaseStatus,
}) => {
  return (
    <div className="bg-surface border border-surface-border rounded-xl p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg font-normal text-primary">
          Showcase Status
        </h3>
        <Link
          to="/"
          target="_blank"
          className="inline-flex items-center space-x-1.5 text-xs text-accent hover:text-accent-hover font-medium transition-colors"
        >
          <span>View Public Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Published Content Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-secondary">Published Content Ratio</span>
          <span className="text-primary font-semibold">{publishedRatio}%</span>
        </div>
        <div className="w-full bg-surface-raised rounded-full h-2 overflow-hidden border border-surface-border">
          <div
            className="bg-accent h-full rounded-full transition-all duration-500"
            style={{ width: `${publishedRatio}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-surface-border/50 text-xs">
        <div className="flex items-center space-x-2 text-secondary">
          <Database className="w-4 h-4 text-accent" />
          <div>
            <p className="text-[10px] uppercase tracking-wider text-secondary/60 font-semibold">
              Database
            </p>
            <p className="text-xs text-primary font-medium capitalize">
              {databaseStatus}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-secondary">
          <ShieldCheck className="w-4 h-4 text-success" />
          <div>
            <p className="text-[10px] uppercase tracking-wider text-secondary/60 font-semibold">
              Security
            </p>
            <p className="text-xs text-primary font-medium">
              JWT Protected
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
