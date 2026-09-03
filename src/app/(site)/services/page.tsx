import type { Metadata } from "next";
import BuilderPage from "@/components/BuilderPage";
import { pageMetadata } from "@/lib/page-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("services");
}

export default function Page() {
  return <BuilderPage slug="services" />;
}
