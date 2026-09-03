import { readContentUncached } from "@/lib/content/server";
import BusinessForm from "./BusinessForm";

export const metadata = { title: "Business Info" };

export default async function BusinessPage() {
  const c = await readContentUncached();
  return <BusinessForm initial={c.business} />;
}
