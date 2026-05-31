// Performance monitoring utilities for Core Web Vitals

export interface PerformanceMetric {
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  timestamp: number;
}

// Core Web Vitals thresholds
const THRESHOLDS = {
  CLS: { good: 0.1, poor: 0.25 },
  FID: { good: 100, poor: 300 },
  FCP: { good: 1800, poor: 3000 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 },
} as const;

function getRating(
  name: string,
  value: number,
): "good" | "needs-improvement" | "poor" {
  const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS];
  if (!threshold) return "good";

  if (value <= threshold.good) return "good";
  if (value <= threshold.poor) return "needs-improvement";
  return "poor";
}

export function reportWebVitals(metric: any) {
  const performanceMetric: PerformanceMetric = {
    name: metric.name,
    value: metric.value,
    rating: getRating(metric.name, metric.value),
    timestamp: Date.now(),
  };

  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.log("Web Vital:", performanceMetric);
  }

  // In production, you could send to analytics service
  // Example: sendToAnalytics(performanceMetric);
}

// Measure custom performance metrics
export function measurePerformance<T>(
  name: string,
  fn: () => T | Promise<T>,
): T | Promise<T> {
  const start = performance.now();

  const result = fn();

  if (result instanceof Promise) {
    return result.finally(() => {
      const duration = performance.now() - start;
      console.log(`${name}: ${duration.toFixed(2)}ms`);
    });
  } else {
    const duration = performance.now() - start;
    console.log(`${name}: ${duration.toFixed(2)}ms`);
    return result;
  }
}

// Preload critical resources
export function preloadResource(href: string, as: string, type?: string) {
  if (typeof document === "undefined") return;

  const link = document.createElement("link");
  link.rel = "preload";
  link.href = href;
  link.as = as;
  if (type) link.type = type;

  document.head.appendChild(link);
}

// Prefetch next page resources
export function prefetchResource(href: string) {
  if (typeof document === "undefined") return;

  const link = document.createElement("link");
  link.rel = "prefetch";
  link.href = href;

  document.head.appendChild(link);
}

// Check if user prefers reduced motion
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Optimize images based on device capabilities
export function getOptimalImageFormat(): "webp" | "avif" | "jpeg" {
  if (typeof window === "undefined") return "jpeg";

  // Check for AVIF support
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;

  if (canvas.toDataURL("image/avif").indexOf("data:image/avif") === 0) {
    return "avif";
  }

  // Check for WebP support
  if (canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0) {
    return "webp";
  }

  return "jpeg";
}

// Memory usage monitoring
export function getMemoryUsage() {
  if (typeof window === "undefined" || !("memory" in performance)) {
    return null;
  }

  const memory = (performance as any).memory;
  return {
    used: Math.round(memory.usedJSHeapSize / 1048576), // MB
    total: Math.round(memory.totalJSHeapSize / 1048576), // MB
    limit: Math.round(memory.jsHeapSizeLimit / 1048576), // MB
  };
}
