import Script from "next/script";
import type { TrackingSettings } from "@/lib/content/types";

// Google Tag Manager / GA4 / Google Ads / Meta Pixel / Clarity, all driven
// from the dashboard. Nothing loads unless an ID is filled in.
export default function Analytics({ tracking }: { tracking: TrackingSettings }) {
  const enabled = process.env.NODE_ENV === "production" || tracking.enabledInDev;
  if (!enabled) return null;

  const gtagIds = [tracking.ga4MeasurementId, tracking.googleAdsId]
    .map((s) => s.trim())
    .filter(Boolean);
  const cfg = {
    adsId: tracking.googleAdsId.trim(),
    formLabel: tracking.googleAdsFormConversionLabel.trim(),
    phoneLabel: tracking.googleAdsPhoneConversionLabel.trim(),
    ga4: tracking.ga4MeasurementId.trim(),
    pixel: tracking.metaPixelId.trim(),
  };

  return (
    <>
      <Script id="mm-tracking-config" strategy="afterInteractive">
        {`window.__mmTracking=${JSON.stringify(cfg)};`}
      </Script>

      {tracking.gtmContainerId && (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${tracking.gtmContainerId.trim()}');`}
        </Script>
      )}

      {gtagIds.length > 0 && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gtagIds[0]}`}
            strategy="afterInteractive"
          />
          <Script id="gtag-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());${gtagIds
              .map((id) => `gtag('config','${id}');`)
              .join("")}`}
          </Script>
        </>
      )}

      {tracking.metaPixelId && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${tracking.metaPixelId.trim()}');fbq('track','PageView');`}
        </Script>
      )}

      {tracking.microsoftClarityId && (
        <Script id="clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${tracking.microsoftClarityId.trim()}");`}
        </Script>
      )}
    </>
  );
}
