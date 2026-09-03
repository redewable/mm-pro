import { readContentUncached } from "@/lib/content/server";
import MediaManager from "./MediaManager";

export const metadata = { title: "Photos & Files" };

export default async function MediaPage() {
  const c = await readContentUncached();
  return <MediaManager initial={c.media} />;
}
