import { useState, useEffect } from "react";
import { Project } from "../features/projects/types/project.types";

const SHORTLIST_STORAGE_KEY = "alex_mercer_portfolio_shortlist_v14";
const SHORTLIST_EVENT = "alex_mercer_shortlist_updated";

export const shortlistStore = {
  getShortlist(): Project[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(SHORTLIST_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  isShortlisted(projectId: string): boolean {
    const list = this.getShortlist();
    return list.some((p) => p.id === projectId || p.slug === projectId);
  },

  addToShortlist(project: Project): void {
    const list = this.getShortlist();
    if (!list.some((p) => p.id === project.id)) {
      list.unshift(project);
      localStorage.setItem(SHORTLIST_STORAGE_KEY, JSON.stringify(list));
      window.dispatchEvent(new CustomEvent(SHORTLIST_EVENT, { detail: list }));
    }
  },

  removeFromShortlist(projectId: string): void {
    const list = this.getShortlist().filter(
      (p) => p.id !== projectId && p.slug !== projectId
    );
    localStorage.setItem(SHORTLIST_STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent(SHORTLIST_EVENT, { detail: list }));
  },

  toggleShortlist(project: Project): boolean {
    if (this.isShortlisted(project.id)) {
      this.removeFromShortlist(project.id);
      return false;
    } else {
      this.addToShortlist(project);
      return true;
    }
  },

  clearShortlist(): void {
    localStorage.removeItem(SHORTLIST_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(SHORTLIST_EVENT, { detail: [] }));
  },
};

export function useShortlist() {
  const [shortlist, setShortlist] = useState<Project[]>(() => shortlistStore.getShortlist());

  useEffect(() => {
    const handleUpdate = () => {
      setShortlist(shortlistStore.getShortlist());
    };

    window.addEventListener(SHORTLIST_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener(SHORTLIST_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return {
    shortlist,
    count: shortlist.length,
    isShortlisted: (id: string) => shortlist.some((p) => p.id === id || p.slug === id),
    toggleShortlist: (project: Project) => shortlistStore.toggleShortlist(project),
    removeFromShortlist: (id: string) => shortlistStore.removeFromShortlist(id),
    clearShortlist: () => shortlistStore.clearShortlist(),
  };
}
