import { securityService } from "../features/admin/security/services/securityService";

let initialized = false;

export function initPerformanceTracker() {
  if (initialized || typeof window === "undefined" || !("performance" in window)) {
    return;
  }
  initialized = true;

  const deviceType = window.innerWidth <= 640 ? "mobile" : window.innerWidth <= 1024 ? "tablet" : "desktop";
  const connectionType = (navigator as any).connection?.effectiveType || "4g";

  // 1. Navigation Timing (TTFB & Page Load)
  window.addEventListener("load", () => {
    setTimeout(() => {
      try {
        const perfEntries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
        if (perfEntries && perfEntries.length > 0) {
          const nav = perfEntries[0];
          const ttfb = nav.responseStart - nav.requestStart;
          const domComplete = nav.domComplete;

          if (ttfb > 0) {
            securityService.recordMetric({
              metric_name: "TTFB",
              metric_value: parseFloat(ttfb.toFixed(2)),
              page_path: window.location.pathname,
              device_type: deviceType,
              connection_type: connectionType,
            });
          }

          if (domComplete > 0) {
            securityService.recordMetric({
              metric_name: "PAGE_LOAD_TIME",
              metric_value: parseFloat(domComplete.toFixed(2)),
              page_path: window.location.pathname,
              device_type: deviceType,
              connection_type: connectionType,
            });
          }
        }
      } catch {
        // ignore
      }
    }, 1000);
  });

  // 2. Paint Timing (FCP)
  if ("PerformanceObserver" in window) {
    try {
      const paintObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (entry.name === "first-contentful-paint") {
            securityService.recordMetric({
              metric_name: "FCP",
              metric_value: parseFloat(entry.startTime.toFixed(2)),
              page_path: window.location.pathname,
              device_type: deviceType,
              connection_type: connectionType,
            });
          }
        }
      });
      paintObserver.observe({ type: "paint", buffered: true });
    } catch {
      // ignore
    }
  }
}
