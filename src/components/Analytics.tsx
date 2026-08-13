import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAppData } from "../contexts/AppDataContext";

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export function Analytics() {
  const { config } = useAppData();
  const location = useLocation();

  // Initialize Google Analytics script only if ID is present
  useEffect(() => {
    if (!config.googleAnalyticsId) return;

    const trackingId = config.googleAnalyticsId;

    // Prevent adding scripts multiple times
    if (document.getElementById("ga-script")) return;

    // 1. Add gtag.js script tag
    const script1 = document.createElement("script");
    script1.id = "ga-script";
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
    document.head.appendChild(script1);

    // 2. Initialize directly in window to avoid inline script execution issues
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", trackingId, { send_page_view: false });
  }, [config.googleAnalyticsId]);

  // Track page views on route changes
  useEffect(() => {
    if (config.googleAnalyticsId && window.gtag) {
      window.gtag("config", config.googleAnalyticsId, {
        page_path: location.pathname + location.search,
      });
    }
  }, [location, config.googleAnalyticsId]);

  return null;
}
