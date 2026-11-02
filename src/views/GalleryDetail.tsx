import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, Images, Loader2, X, AlertCircle, PlayCircle } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";

type GalleryPhoto = {
  id: string;
  name: string;
  thumbnailUrl: string;
  url: string;
  viewUrl?: string;
  previewUrl?: string;
  mimeType?: string;
  mediaType?: "image" | "video";
};

type GalleryPayload = {
  gallery: {
    id: string;
    titulo: string;
    descricao?: string;
    data?: string;
  };
  total: number;
  photos: GalleryPhoto[];
};

export function GalleryDetail() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<GalleryPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { language } = useLanguage();
  const copy = language === "en"
    ? { load: "Loading media from Google Drive...", loadError: "Unable to open this gallery", back: "Back to Events & Photos", events: "Events & Photos", photos: "items", gallery: "Gallery", empty: "This folder does not have published photos or videos yet.", close: "Close media", previous: "Previous item", next: "Next item", of: "of", error: "Error loading gallery." }
    : language === "ja"
    ? { load: "Google Drive から写真・動画を読み込み中...", loadError: "このギャラリーを開けませんでした", back: "イベント・写真に戻る", events: "イベント・写真", photos: "件", gallery: "ギャラリー", empty: "このフォルダにはまだ公開写真・動画がありません。", close: "メディアを閉じる", previous: "前へ", next: "次へ", of: "/", error: "ギャラリーの読み込みに失敗しました。" }
    : { load: "Carregando fotos e vídeos do Google Drive...", loadError: "Não foi possível abrir esta galeria", back: "Voltar para Eventos & Fotos", events: "Eventos & Fotos", photos: "itens", gallery: "Galeria", empty: "Esta pasta ainda não possui fotos ou vídeos publicados.", close: "Fechar mídia", previous: "Item anterior", next: "Próximo item", of: "de", error: "Erro ao carregar galeria." };

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError("");

    fetch(`/api/gallery-photos?galleryId=${encodeURIComponent(id)}`)
      .then(async res => {
        const payload = await res.json();
        if (!res.ok) throw new Error(payload?.error || copy.error);
        return payload;
      })
      .then(setData)
      .catch(err => setError(err.message || copy.error))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowLeft") {
        setSelectedIndex(current => {
          if (current === null || !data?.photos.length) return current;
          return (current - 1 + data.photos.length) % data.photos.length;
        });
      }
      if (e.key === "ArrowRight") {
        setSelectedIndex(current => {
          if (current === null || !data?.photos.length) return current;
          return (current + 1) % data.photos.length;
        });
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedIndex, data?.photos.length]);

  if (loading) {
    return (
      <div className="min-h-[55vh] flex items-center justify-center gap-3 text-neutral-500">
        <Loader2 className="w-6 h-6 animate-spin text-karate-red" />
        <span className="text-sm">{copy.load}</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-karate-red mx-auto" />
        <h1 className="text-xl font-black">{copy.loadError}</h1>
        <p className="text-sm text-neutral-500">{error}</p>
        <Link to="/events" className="inline-flex items-center gap-2 text-sm font-bold text-karate-red hover:underline">
          <ArrowLeft className="w-4 h-4" /> {copy.back}
        </Link>
      </div>
    );
  }

  const selected = selectedIndex !== null ? data.photos[selectedIndex] : null;

  return (
    <>
      <div className="space-y-7 pb-20">
        <div className="flex items-center justify-between gap-4">
          <Link to="/events" className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 hover:text-karate-red">
            <ArrowLeft className="w-4 h-4" />
            {copy.events}
          </Link>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500">
            <Images className="w-4 h-4" />
            {data.total} {copy.photos}
          </span>
        </div>

        <div className="border-b border-neutral-200 pb-5">
          <span className="text-[10px] uppercase tracking-[0.22em] text-karate-red font-bold">{copy.gallery}</span>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 mt-1">{data.gallery.titulo}</h1>
          {data.gallery.descricao && (
            <p className="text-sm text-neutral-500 mt-2 max-w-2xl">{data.gallery.descricao}</p>
          )}
        </div>

        {data.photos.length === 0 ? (
          <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center">
            <Images className="w-10 h-10 mx-auto text-neutral-300 mb-3" />
            <p className="text-sm text-neutral-500">{copy.empty}</p>
          </div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 sm:gap-4 space-y-3 sm:space-y-4">
            {data.photos.map((photo, index) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className="w-full block break-inside-avoid overflow-hidden rounded-xl bg-neutral-100 border border-neutral-200 group cursor-zoom-in"
              >
                <div className="relative">
                  <img
                    src={photo.thumbnailUrl}
                    alt={photo.name || `Mídia ${index + 1}`}
                    className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    loading="lazy"
                  />
                  {(photo.mediaType === "video" || photo.mimeType?.startsWith("video/")) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <PlayCircle className="w-12 h-12 text-white drop-shadow-lg" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selected && selectedIndex !== null && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-3 sm:p-6">
          <button
            type="button"
            onClick={() => setSelectedIndex(null)}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
            aria-label={copy.close}
          >
            <X className="w-6 h-6" />
          </button>

          {data.photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setSelectedIndex((selectedIndex - 1 + data.photos.length) % data.photos.length)}
                className="absolute left-3 sm:left-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
                aria-label={copy.previous}
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
              <button
                type="button"
                onClick={() => setSelectedIndex((selectedIndex + 1) % data.photos.length)}
                className="absolute right-3 sm:right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
                aria-label={copy.next}
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            </>
          )}

          <div className="max-w-6xl max-h-[90vh] w-full flex flex-col items-center gap-3 px-10">
            {(selected.mediaType === "video" || selected.mimeType?.startsWith("video/")) ? (
              <iframe
                src={selected.previewUrl || selected.url}
                title={selected.name}
                className="w-full max-w-5xl aspect-video rounded-lg bg-black"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <img
                src={selected.url}
                alt={selected.name}
                className="max-w-full max-h-[82vh] object-contain rounded-lg"
              />
            )}
            <span className="text-xs text-white/70">
              {selectedIndex + 1} {copy.of} {data.photos.length}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
