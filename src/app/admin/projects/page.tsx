import { readContentUncached } from "@/lib/content/server";
import ProjectsManager from "./ProjectsManager";

export const metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const c = await readContentUncached();
  return <ProjectsManager initial={c.projects} videos={c.videos} />;
}
