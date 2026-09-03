import { readContentUncached } from "@/lib/content/server";
import ServicesManager from "./ServicesManager";

export const metadata = { title: "Services" };

export default async function ServicesPage() {
  const c = await readContentUncached();
  return <ServicesManager initial={c.services} />;
}
