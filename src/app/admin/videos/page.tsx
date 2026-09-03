import { readContentUncached } from "@/lib/content/server";
import VideosManager from "./VideosManager";

export const metadata = { title: "Videos" };

export default async function VideosPage() {
  const c = await readContentUncached();
  return <VideosManager initial={c.videos} projects={c.projects} />;
}
