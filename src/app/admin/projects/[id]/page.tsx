import { notFound } from "next/navigation";
import { readContentUncached } from "@/lib/content/server";
import ProjectEditor from "./ProjectEditor";
import type { Project } from "@/lib/content/types";
import { newId, nowIso } from "@/lib/ids";

export const metadata = { title: "Edit project" };

export default async function ProjectEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = await readContentUncached();
  let project: Project | undefined;
  let isNew = false;
  if (id === "new") {
    isNew = true;
    project = {
      id: newId("prj"),
      slug: "",
      title: "",
      category: "Outdoor Living",
      status: "in-progress",
      summary: "",
      description: "",
      scope: [],
      cover: { url: "", alt: "" },
      gallery: [],
      videoIds: [],
      updates: [],
      beforeAfter: [],
      location: "",
      completedAt: "",
      featured: false,
      published: true,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
  } else {
    project = c.projects.find((p) => p.id === id);
  }
  if (!project) notFound();
  const categories = Array.from(new Set([...c.projects.map((p) => p.category), ...c.services.map((s) => s.title)])).filter(Boolean);
  return <ProjectEditor initial={project} isNew={isNew} allProjects={c.projects} videos={c.videos} categories={categories} />;
}
