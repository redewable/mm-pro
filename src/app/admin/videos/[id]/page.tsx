import { notFound } from "next/navigation";
import { readContentUncached } from "@/lib/content/server";
import VideoEditor from "./VideoEditor";
import type { Video } from "@/lib/content/types";
import { newId, nowIso, todayIso } from "@/lib/ids";

export const metadata = { title: "Edit video" };

export default async function VideoEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const c = await readContentUncached();
  let video: Video | undefined;
  const isNew = id === "new";
  if (isNew) {
    video = {
      id: newId("vid"),
      slug: "",
      title: "",
      description: "",
      source: "upload",
      url: "",
      category: "",
      featured: false,
      published: true,
      publishedAt: todayIso(),
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
  } else {
    video = c.videos.find((v) => v.id === id);
  }
  if (!video) notFound();
  return <VideoEditor initial={video} isNew={isNew} allVideos={c.videos} projects={c.projects} />;
}
