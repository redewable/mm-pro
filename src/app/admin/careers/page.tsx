import { readContentUncached } from "@/lib/content/server";
import PositionsManager from "./PositionsManager";

export const metadata = { title: "Careers" };

export default async function CareersAdminPage() {
  const c = await readContentUncached();
  return <PositionsManager initial={c.positions} />;
}
