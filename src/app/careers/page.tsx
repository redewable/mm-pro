import type { Metadata } from "next";
import CareersClient from "./CareersClient";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join the M&M Pro Construction crew. We're hiring experienced helpers in the Brazos Valley — College Station, Bryan, and surrounding counties. Apply now.",
};

export default function CareersPage() {
  return <CareersClient />;
}
