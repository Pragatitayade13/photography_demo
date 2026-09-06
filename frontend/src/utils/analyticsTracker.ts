import { analyticsApi } from "../services/analyticsApi";
import { AnalyticsEvent } from "../types/analytics";

/**
 * Privacy-friendly client-side analytics event dispatcher.
 * Handles deduplication of rapid duplicate events and respects Do-Not-Track.
 */
let lastEventKey = "";
let lastEventTimestamp = 0;

export const trackEvent = (
  eventName: AnalyticsEvent["event_name"],
  pagePath: string = window.location.pathname,
  projectId?: string,
  metadata?: Record<string, any>
) => {
  // Respect Do Not Track
  if (navigator.doNotTrack === "1" || (window as any).doNotTrack === "1") {
    return;
  }

  // Deduplicate identical events within 1.5 seconds
  const currentKey = `${eventName}:${pagePath}:${projectId || ""}`;
  const now = Date.now();
  if (currentKey === lastEventKey && now - lastEventTimestamp < 1500) {
    return;
  }

  lastEventKey = currentKey;
  lastEventTimestamp = now;

  analyticsApi.trackEvent(eventName, pagePath, projectId, metadata);
};
