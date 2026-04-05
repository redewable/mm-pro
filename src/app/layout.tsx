import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "M&M Pro Construction | General Contractor College Station TX",
    template: "%s | M&M Pro Construction",
  },
  description:
    "Professional general contractor in College Station, TX. Commercial build-outs, new construction, outdoor living spaces, and custom lighting. Serving Brazos, Burleson, Grimes & Robertson County.",
  keywords: [
    "general contractor College Station TX",
    "commercial contractor Bryan TX",
    "outdoor living contractor Brazos County",
    "general contractor Robertson County TX",
    "custom pergola builder College Station",
    "remodeling contractor College Station",
    "commercial build-out Bryan College Station",
  ],
  openGraph: {
    title: "M&M Pro Construction | General Contractor College Station TX",
    description:
      "Professional general contractor in College Station, TX. Commercial build-outs, outdoor living, custom lighting.",
    url: "https://mnmproconstruction.com",
    siteName: "M&M Pro Construction",
    locale: "en_US",
    type: "website",
  },
  metadataBase: new URL("https://mnmproconstruction.com"),
};

/* LocalBusiness + Service structured data for Google */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "GeneralContractor",
  name: "M&M Pro Construction",
  url: "https://mnmproconstruction.com",
  telephone: "+19795873639",
  email: "mram@mmproconstruction.com",
  description:
    "Professional general contractor in College Station, TX. Commercial build-outs, new construction, outdoor living spaces, and custom lighting.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "College Station",
    addressRegion: "TX",
    addressCountry: "US",
  },
  areaServed: [
    { "@type": "AdministrativeArea", name: "Brazos County, TX" },
    { "@type": "AdministrativeArea", name: "Burleson County, TX" },
    { "@type": "AdministrativeArea", name: "Grimes County, TX" },
    { "@type": "AdministrativeArea", name: "Robertson County, TX" },
  ],
  founder: {
    "@type": "Person",
    name: "Michael Ramirez",
  },
  sameAs: [
    "https://www.facebook.com/profile.php?id=61581997151917",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Construction Services",
    itemListElement: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Commercial Build-Outs" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "New Construction" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Outdoor Living Spaces" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Custom Lighting" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Remodeling & Renovation" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Concrete & Flatwork" } },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Skip to main content — accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-gold focus:text-navy focus:px-4 focus:py-2 focus:rounded focus:font-semibold"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
