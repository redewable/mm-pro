"use client";

import { useState } from "react";
import SmartImage from "./SmartImage";
import { videoEmbed, videoThumbnail } from "@/lib/content/helpers";
import type { Video } from "@/lib/content/types";

// Uploaded files play in a native <video>. YouTube/Vimeo/Facebook show the
// thumbnail first and only load the (heavy) iframe when tapped, which keeps
// page speed scores high.
export default function VideoPlayer({
  video,
  autoPlay = false,
  className = "",
}: {
  video: Video;
  autoPlay?: boolean;
  className?: string;
}) {
  const embed = videoEmbed(video);
  const thumb = videoThumbnail(video);
  const [active, setActive] = useState(autoPlay);

  if (embed.kind === "file") {
    return (
      <div className={`relative aspect-video bg-black rounded-lg overflow-hidden ${className}`}>
        <video
          className="absolute inset-0 w-full h-full"
          controls
          playsInline
          preload="metadata"
          poster={thumb || undefined}
          autoPlay={autoPlay}
          muted={autoPlay}
        >
          <source src={embed.src} />
          Your browser does not support video playback.{" "}
          <a href={embed.src}>Download the video</a>.
        </video>
      </div>
    );
  }

  return (
    <div className={`relative aspect-video bg-black rounded-lg overflow-hidden ${className}`}>
      {active ? (
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`${embed.src}${embed.src.includes("?") ? "&" : "?"}autoplay=1`}
          title={embed.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          className="group absolute inset-0 w-full h-full flex items-center justify-center"
          aria-label={`Play ${video.title}`}
        >
          {thumb ? (
            <SmartImage
              src={thumb}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 900px"
              className="object-cover opacity-90 group-hover:opacity-100 transition-opacity"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-navy to-navy-dark" />
          )}
          <span className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-gold text-navy flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <svg className="w-7 h-7 md:w-8 md:h-8 ml-1" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
