"use client";

import { trackConversion } from "@/lib/tracking";

// A tel: link that records a phone-call conversion for Google Ads / GA4.
export default function PhoneLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a href={href} className={className} onClick={() => trackConversion("phone")}>
      {children}
    </a>
  );
}
