import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Resume uploads on /careers can be up to 5 MB; allow headroom for
      // multipart overhead and the rest of the form fields.
      bodySizeLimit: "6mb",
    },
  },
};

export default nextConfig;
