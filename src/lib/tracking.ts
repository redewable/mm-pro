// Client-side conversion helpers. Safe to call anywhere; they no-op when
// tracking isn't configured.

type TrackingConfig = {
  adsId: string;
  formLabel: string;
  phoneLabel: string;
  ga4: string;
  pixel: string;
};

declare global {
  interface Window {
    __mmTracking?: TrackingConfig;
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

function cfg(): TrackingConfig | undefined {
  return typeof window !== "undefined" ? window.__mmTracking : undefined;
}

export type ConversionKind = "form" | "phone" | "application";

export function trackConversion(kind: ConversionKind, extra: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const c = cfg();
  const eventName =
    kind === "form" ? "generate_lead" : kind === "phone" ? "phone_call" : "job_application";

  // GA4 / GTM event
  try {
    window.dataLayer?.push({ event: eventName, ...extra });
    window.gtag?.("event", eventName, extra);
  } catch {
    /* ignore */
  }

  // Google Ads conversion
  if (c?.adsId) {
    const label = kind === "phone" ? c.phoneLabel : c.formLabel;
    if (label) {
      try {
        window.gtag?.("event", "conversion", { send_to: `${c.adsId}/${label}` });
      } catch {
        /* ignore */
      }
    }
  }

  // Meta pixel
  if (c?.pixel) {
    try {
      window.fbq?.("track", kind === "phone" ? "Contact" : "Lead", extra);
    } catch {
      /* ignore */
    }
  }
}
