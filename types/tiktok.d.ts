interface TikTokTrackOptions {
  event_id?: string;
  [key: string]: any;
}

interface TikTokAnalytics {
  track: (
    event: string,
    params?: Record<string, any>,
    options?: TikTokTrackOptions
  ) => void;
  page: () => void;
  identify: (params?: Record<string, any>) => void;
  load: (pixelId: string, options?: Record<string, any>) => void;
  instances?: (instanceId: string) => any;
  methods?: string[];
  [key: string]: any;
}

declare global {
  interface Window {
    ttq?: TikTokAnalytics;
    TiktokAnalyticsObject?: string;
  }
}

export {};
