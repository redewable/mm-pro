import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray package-lock.json in the home folder makes Next guess the wrong
  // workspace root; pin it so Tailwind and friends resolve from this project.
  turbopack: { root: __dirname },
  experimental: {
    serverActions: {
      // Dashboard saves send the whole content document (photos are uploaded
      // separately, straight to storage) so a few MB is plenty.
      bodySizeLimit: "8mb",
    },
  },
  images: {
    remotePatterns: [
      // Vercel Blob (uploaded photos / video posters)
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      // Supabase Storage
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "*.supabase.in" },
      // Video thumbnails
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "i.vimeocdn.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [
      {
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
