import { Instagram, ExternalLink, ShieldCheck } from "lucide-react";

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

  return (
    <div className="w-full h-full min-h-[320px] sm:min-h-[420px] flex flex-col items-center justify-center p-6 bg-gradient-to-b from-neutral-900 to-neutral-950 text-white select-text">
      <div className="max-w-md w-full bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center shadow-xl backdrop-blur-sm">
        {/* Instagram Gradient Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center shadow-lg shadow-rose-950/40 mb-4 ring-4 ring-neutral-800">
          <Instagram className="w-8 h-8 text-white" />
        </div>

        {/* Header Badges */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs font-medium mb-3">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
          <span>Instagram Oficial</span>
          <span className="text-neutral-500">•</span>
          <span className="font-mono text-[11px] text-neutral-300">@madeirakarateshotokan</span>
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-white mb-2 leading-snug">
          {title || "Comunicado Oficial no Instagram"}
        </h3>

        {/* Notice description */}
        <p className="text-sm text-neutral-300 mb-6 max-w-sm leading-relaxed">
          Para garantir velocidade de navegação e privacidade de dados, esta publicação é aberta diretamente no aplicativo ou web oficial do Instagram.
        </p>

        {/* CTA Button */}
        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-semibold text-sm transition-all shadow-lg shadow-red-950/40 hover:shadow-red-900/60 active:scale-98 cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
        >
          <span>Abrir Publicação Oficial</span>
          <ExternalLink className="w-4 h-4" />
        </a>

        {/* Security / Privacy guarantee */}
        <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 mt-5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Link seguro e verificado • Madeira Karate</span>
        </div>
      </div>
    </div>
  );
}

