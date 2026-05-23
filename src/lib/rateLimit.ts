type RateLimitEntry = {
  count: number;
  resetTime: number;
};

type RateLimitResult = {
  success: boolean;
  remaining: number;
};

export function rateLimit({
  interval,
  maxRequests,
}: {
  interval: number;
  maxRequests: number;
}) {
  const store = new Map<string, RateLimitEntry>();

  const cleanup = () => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (now >= entry.resetTime) {
        store.delete(key);
      }
    }
  };

  setInterval(cleanup, interval);

  return {
    check(ip: string): RateLimitResult {
      const now = Date.now();
      const entry = store.get(ip);

      if (!entry || now >= entry.resetTime) {
        store.set(ip, { count: 1, resetTime: now + interval });
        return { success: true, remaining: maxRequests - 1 };
      }

      if (entry.count >= maxRequests) {
        return { success: false, remaining: 0 };
      }

      entry.count++;
      return { success: true, remaining: maxRequests - entry.count };
    },
  };
}

export const registrationLimiter = rateLimit({
  interval: 15 * 60 * 1000,
  maxRequests: 5,
});

export const contactLimiter = rateLimit({
  interval: 10 * 60 * 1000,
  maxRequests: 3,
});

export const newsletterLimiter = rateLimit({
  interval: 10 * 60 * 1000,
  maxRequests: 2,
});

export const apiLimiter = rateLimit({
  interval: 60 * 1000,
  maxRequests: 30,
});

export const bookingLimiter = rateLimit({
  interval: 15 * 60 * 1000,
  maxRequests: 3,
});
