import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <span className="text-accent font-serif text-6xl font-bold mb-4">404</span>
      <h1 className="font-serif text-3xl font-semibold tracking-wide text-primary mb-3">
        Frame Not Found
      </h1>
      <p className="text-secondary text-sm max-w-md mb-8">
        The photographic moment or page you are searching for might have been moved or archived.
      </p>
      <Link
        to="/"
        className="inline-flex items-center space-x-2 px-6 py-3 bg-surface border border-surface-border text-xs uppercase tracking-widest text-primary hover:text-accent hover:border-accent transition-all rounded"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Gallery</span>
      </Link>
    </div>
  );
};
