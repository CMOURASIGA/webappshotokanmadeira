import { useState } from "react";
import { Instagram, ExternalLink, Loader2 } from "lucide-react";

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
  const isInstagram = isInstagramPublicationUrl(url);
  if (!isInstagram && !url) return null;

  const targetUrl = url.trim();
  const embedUrl = getInstagramEmbedUrl(targetUrl);
  const [loaded, setLoaded] = useState(false);

  if (compact) {
    return (
      <a
        href={targetUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Abrir publicação "${title || 'Instagram'}" no Instagram oficial`}
        className="flex items-center justify-between p-3 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 transition-colors border border-neutral-800 group"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center shrink-0 shadow-sm">
            <Instagram className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold truncate text-neutral-100">{title || "Publicação Oficial"}</p>
            <p className="text-[10px] text-neutral-400 font-mono">@madeirakarateshotokan</p>
          </div>
        </div>
        <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-white transition-colors shrink-0 ml-2" />
      </a>
    );
  }

  if (!embedUrl) {
    return (
      <div className="w-full min-h-[320px] flex flex-col items-center justify-center p-6 bg-neutral-950 text-white">
        <Instagram className="w-10 h-10 mb-3 text-rose-500" />
        <p className="text-sm text-neutral-300 text-center mb-4">
          Não foi possível preparar a visualização incorporada desta publicação.
        </p>
        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-karate-red text-white font-semibold text-sm"
        >
          Abrir no Instagram
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    );
  }

  return (
    <div className="w-full bg-neutral-950 text-white flex flex-col items-center">
      <div className="relative w-full bg-white min-h-[520px] sm:min-h-[620px]">
        {!loaded && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-neutral-950 text-neutral-300 gap-3">
            <Loader2 className="w-7 h-7 animate-spin text-karate-red" />
            <span className="text-xs">Carregando publicação do Instagram...</span>
          </div>
        )}

        <iframe
          src={embedUrl}
          title={title || "Publicação do Instagram"}
          className="w-full h-[620px] sm:h-[720px] bg-white border-0"
          loading="lazy"
          allow="encrypted-media; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={() => setLoaded(true)}
        />
      </div>

      <div className="w-full p-3 bg-neutral-900 border-t border-neutral-800 flex justify-center">
        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-karate-red hover:bg-red-700 text-white font-semibold text-xs sm:text-sm transition-colors"
        >
          Abrir publicação no Instagram
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}

