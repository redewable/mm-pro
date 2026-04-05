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
    "Professional general contractor in College Station, TX. Commercial build-outs, new construction, outdoor living spaces, and custom lighting. Serving Brazos, Burleson & Grimes County.",
  keywords: [
    "general contractor College Station TX",
    "commercial contractor Bryan TX",
    "outdoor living contractor Brazos County",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white text-navy">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
