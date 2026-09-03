import Image, { type ImageProps } from "next/image";

// next/image only optimizes hosts listed in next.config.ts remotePatterns.
// Owner-entered URLs can point anywhere, so fall back to unoptimized for
// hosts we don't know about instead of throwing at render time.
const OPTIMIZED_HOSTS = [
  /\.public\.blob\.vercel-storage\.com$/,
  /\.supabase\.co$/,
  /\.supabase\.in$/,
  /^i\.ytimg\.com$/,
  /^img\.youtube\.com$/,
  /^i\.vimeocdn\.com$/,
];

export function isOptimizableSrc(src: string): boolean {
  if (!src) return false;
  if (src.startsWith("/")) return true;
  try {
    const host = new URL(src).hostname;
    return OPTIMIZED_HOSTS.some((re) => re.test(host));
  } catch {
    return false;
  }
}

type Props = Omit<ImageProps, "src"> & { src: string };

export default function SmartImage({ src, alt, ...rest }: Props) {
  if (!src) return null;
  const optimizable = isOptimizableSrc(src);
  return (
    <Image
      src={src}
      alt={alt ?? ""}
      unoptimized={!optimizable || rest.unoptimized}
      {...rest}
    />
  );
}
