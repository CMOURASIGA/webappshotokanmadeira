type InstagramEmbedProps = {
  url: string;
  title: string;
  compact?: boolean;
};

const INSTAGRAM_HOSTS = new Set(["instagram.com", "www.instagram.com"]);
const SUPPORTED_PATHS = new Set(["p", "reel", "reels", "tv"]);

export function getInstagramEmbedUrl(rawUrl: string): string | null {
  if (!rawUrl) return null;

  try {
    const url = new URL(rawUrl.trim());
    const hostname = url.hostname.toLowerCase();
    const pathParts = url.pathname.split("/").filter(Boolean);

    if (!INSTAGRAM_HOSTS.has(hostname) || pathParts.length < 2) return null;
    if (!SUPPORTED_PATHS.has(pathParts[0].toLowerCase())) return null;

    const publicationType = pathParts[0].toLowerCase() === "reels" ? "reel" : pathParts[0].toLowerCase();
    const publicationCode = pathParts[1];

    return `https://www.instagram.com/${publicationType}/${publicationCode}/embed/captioned/`;
  } catch {
    return null;
  }
}

export function isInstagramPublicationUrl(url: string): boolean {
  return getInstagramEmbedUrl(url) !== null;
}

export function InstagramEmbed({ url, title, compact = false }: InstagramEmbedProps) {
  const embedUrl = getInstagramEmbedUrl(url);

  if (!embedUrl) return null;

  return (
    <iframe
      src={embedUrl}
      title={title || "Publicação do Instagram"}
      loading="lazy"
      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
      allowFullScreen
      className={compact
        ? "h-full w-full border-0 bg-white pointer-events-none"
        : "h-full min-h-[65vh] w-full border-0 bg-white"
      }
    />
  );
}
