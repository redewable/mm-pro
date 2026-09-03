import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";
import JsonLd from "@/components/JsonLd";
import { getSiteContent } from "@/lib/content/server";
import { organizationJsonLd, websiteJsonLd, absoluteUrl } from "@/lib/seo";
import { telHref } from "@/lib/content/helpers";

export async function generateMetadata(): Promise<Metadata> {
  const c = await getSiteContent();
  const share = { url: absoluteUrl(c, c.seo.ogImage?.url || "/opengraph-image"), width: 1200, height: 630, alt: `${c.business.name} — ${c.business.tagline}` };
  return {
    metadataBase: new URL(c.seo.siteUrl),
    title: {
      default: c.seo.defaultTitle,
      template: c.seo.titleTemplate || `%s | ${c.business.name}`,
    },
    description: c.seo.description,
    keywords: c.seo.keywords,
    applicationName: c.business.name,
    openGraph: {
      title: c.seo.defaultTitle,
      description: c.seo.description,
      url: c.seo.siteUrl,
      siteName: c.business.name,
      locale: "en_US",
      type: "website",
      images: [share],
    },
    twitter: {
      card: "summary_large_image",
      images: [share.url],
      ...(c.seo.twitterHandle ? { site: c.seo.twitterHandle, creator: c.seo.twitterHandle } : {}),
    },
    verification: {
      ...(c.seo.googleSiteVerification ? { google: c.seo.googleSiteVerification } : {}),
      ...(c.seo.bingSiteVerification ? { other: { "msvalidate.01": c.seo.bingSiteVerification } } : {}),
    },
    robots: { index: true, follow: true, "max-image-preview": "large", "max-video-preview": -1 },
  };
}

export default async function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const c = await getSiteContent();
  const headerLinks = c.nav
    .filter((n) => n.visible && n.location !== "footer")
    .map((n) => ({ label: n.label, href: n.href }));

  return (
    <>
        <JsonLd data={[organizationJsonLd(c), websiteJsonLd(c)]} />
        <Analytics tracking={c.tracking} />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-gold focus:text-navy focus:px-4 focus:py-2 focus:rounded focus:font-semibold"
        >
          Skip to main content
        </a>
        <Header
          links={headerLinks}
          phone={c.business.phone}
          telHref={telHref(c.business.phoneE164, c.business.phone)}
          serviceAreaSummary={c.business.serviceAreaSummary}
          name={c.business.name}
        />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer content={c} />
    </>
  );
}
