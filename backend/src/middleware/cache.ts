import { Request, Response, NextFunction } from "express";

interface CacheEntry {
  body: any;
  contentType: string;
  statusCode: number;
  expiry: number;
}

const memoryCache = new Map<string, CacheEntry>();

/**
 * Cache middleware for public read-only endpoints
 * @param ttlSeconds Time to live in seconds (default: 60)
 */
export const cacheResponse = (ttlSeconds: number = 60) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== "GET") {
      return next();
    }

    const key = `cache:${req.originalUrl || req.url}`;
    const cached = memoryCache.get(key);

    if (cached && cached.expiry > Date.now()) {
      res.setHeader("X-Cache-Status", "HIT");
      res.setHeader("Content-Type", cached.contentType || "application/json");
      return res.status(cached.statusCode).send(cached.body);
    }

    res.setHeader("X-Cache-Status", "MISS");

    // Intercept response send
    const originalSend = res.send.bind(res);
    res.send = (body: any): Response => {
      // Only cache successful 200 responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        memoryCache.set(key, {
          body,
          contentType: res.getHeader("Content-Type") as string || "application/json",
          statusCode: res.statusCode,
          expiry: Date.now() + ttlSeconds * 1000,
        });
      }
      return originalSend(body);
    };

    next();
  };
};

/**
 * Invalidate cached items matching a prefix/substring
 */
export const invalidateCache = (pattern?: string) => {
  if (!pattern) {
    memoryCache.clear();
    return;
  }
  for (const key of memoryCache.keys()) {
    if (key.includes(pattern)) {
      memoryCache.delete(key);
    }
  }
};
