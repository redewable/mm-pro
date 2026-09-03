import { readContentUncached } from "@/lib/content/server";
import NavManager from "./NavManager";

export const metadata = { title: "Menu Links" };

export default async function NavPage() {
  const c = await readContentUncached();
  return <NavManager initial={c.nav} />;
}
