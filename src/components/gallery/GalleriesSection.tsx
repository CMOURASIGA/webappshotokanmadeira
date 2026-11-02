import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FolderOpen, Images, Loader2, AlertCircle } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext";

type GallerySummary = {
  id: string;
  titulo: string;
  descricao?: string;
  data?: string;
  destaque?: boolean;
  coverUrl?: string;
  photoCount?: number;
  tipo?: "geral" | "evento";
};

export function GalleriesSection() {
  const { language } = useLanguage();
  const copy = language === "en"
    ? { featured: "Featured", items: "media", eyebrow: "Madeira Karate Gallery", title: "Photo & Video Albums", intro: "Choose a gallery to view photos and videos directly on the site.", loading: "Loading galleries...", error: "Galleries could not be loaded right now.", empty: "No gallery is currently published.", dojoTitle: "Dojo Moments", dojoText: "Training sessions, photos, videos and everyday moments from Madeira Karate.", eventTitle: "Event Galleries", eventText: "Championships, festivals, exams, seminars and other dojo events." }
    : language === "ja"
    ? { featured: "注目", items: "件", eyebrow: "Madeira Karate ギャラリー", title: "写真・動画アルバム", intro: "ギャラリーを選択して、サイト上で写真や動画をご覧ください。", loading: "ギャラリーを読み込み中...", error: "現在ギャラリーを読み込めません。", empty: "現在公開中のギャラリーはありません。", dojoTitle: "道場の様子", dojoText: "稽古、写真、動画、Madeira Karate の日常の記録です。", eventTitle: "イベントギャラリー", eventText: "大会、祭典、審査、講習会など道場イベントの記録です。" }
    : { featured: "Destaque", items: "mídias", eyebrow: "Galeria Madeira Karate", title: "Álbuns de Fotos e Vídeos", intro: "Escolha uma galeria para visualizar fotos e vídeos diretamente no site.", loading: "{copy.loading}", error: "{copy.error}", empty: "{copy.empty}", dojoTitle: "{copy.dojoTitle}", dojoText: "Treinos, fotos, vídeos e momentos do dia a dia da Madeira Karate.", eventTitle: "{copy.eventTitle}", eventText: "{copy.eventText}" };
  const [galleries, setGalleries] = useState<GallerySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    fetch(`/api/galleries?ts=${Date.now()}`, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" }
    })
      .then(async res => {
        if (!res.ok) throw new Error("Falha ao carregar galerias");
        return res.json();
      })
      .then(data => {
        if (active) setGalleries(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const generalGalleries = galleries.filter(g => (g.tipo || "geral") === "geral");
  const eventGalleries = galleries.filter(g => g.tipo === "evento");

  const renderGalleryGrid = (items: GallerySummary[]) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {items.map(gallery => (
        <Link
          key={gallery.id}
          to={`/galerias/${encodeURIComponent(gallery.id)}`}
          className="group bg-white rounded-2xl overflow-hidden border border-neutral-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all"
        >
          <div className="aspect-[16/10] bg-neutral-900 relative overflow-hidden">
            {gallery.coverUrl ? (
              <img
                src={gallery.coverUrl}
                alt={gallery.titulo}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-500">
                <FolderOpen className="w-12 h-12" />
              </div>
            )}
            {gallery.destaque && (
              <span className="absolute top-3 left-3 bg-karate-red text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                {copy.featured}
              </span>
            )}
            <span className="absolute bottom-3 right-3 bg-black/70 text-white text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
              <Images className="w-3 h-3" />
              {gallery.photoCount ?? 0} {copy.items}
            </span>
          </div>

          <div className="p-4">
            <h4 className="font-black text-neutral-900 group-hover:text-karate-red transition-colors">
              {gallery.titulo}
            </h4>
            {gallery.data && (
              <p className="text-[11px] font-semibold text-karate-red mt-1">
                {gallery.data}
              </p>
            )}
            {gallery.descricao && (
              <p className="text-xs text-neutral-500 mt-1.5 line-clamp-2">
                {gallery.descricao}
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );

  return (
    <section className="space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-karate-red">
            {copy.eyebrow}
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-neutral-900 mt-1">
            {copy.title}
          </h3>
          <p className="text-sm text-neutral-500 mt-1">
            {copy.intro}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="bg-white border border-neutral-200 rounded-2xl p-8 flex items-center justify-center gap-2 text-neutral-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Carregando galerias...</span>
        </div>
      ) : error ? (
        <div className="bg-white border border-red-200 rounded-2xl p-6 flex items-center gap-3 text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm">Não foi possível carregar as galerias agora.</span>
        </div>
      ) : galleries.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-2xl p-8 text-center text-neutral-500">
          <FolderOpen className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">Nenhuma galeria publicada no momento.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {generalGalleries.length > 0 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-lg font-black text-neutral-900">Momentos do Dojo</h4>
                <p className="text-sm text-neutral-500 mt-1">
                  {copy.dojoText}
                </p>
              </div>
              {renderGalleryGrid(generalGalleries)}
            </div>
          )}

          {eventGalleries.length > 0 && (
            <div className="space-y-4 pt-2 border-t border-neutral-200">
              <div>
                <h4 className="text-lg font-black text-neutral-900">Galerias de Eventos</h4>
                <p className="text-sm text-neutral-500 mt-1">
                  Campeonatos, festivais, exames, seminários e outros eventos do dojo.
                </p>
              </div>
              {renderGalleryGrid(eventGalleries)}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
