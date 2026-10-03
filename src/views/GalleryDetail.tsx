import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, Images, Loader2, X, AlertCircle } from "lucide-react";

type GalleryPhoto = {
  id: string;
  name: string;
  thumbnailUrl: string;
  url: string;
  viewUrl?: string;
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

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError("");

    fetch(`/api/gallery-photos?galleryId=${encodeURIComponent(id)}`)
      .then(async res => {
        const payload = await res.json();
        if (!res.ok) throw new Error(payload?.error || "Erro ao carregar galeria.");
        return payload;
      })
      .then(setData)
      .catch(err => setError(err.message || "Erro ao carregar galeria."))
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
        <span className="text-sm">Carregando fotos do Google Drive...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-karate-red mx-auto" />
        <h1 className="text-xl font-black">Não foi possível abrir esta galeria</h1>
        <p className="text-sm text-neutral-500">{error}</p>
        <Link to="/events" className="inline-flex items-center gap-2 text-sm font-bold text-karate-red hover:underline">
          <ArrowLeft className="w-4 h-4" /> Voltar para Eventos & Fotos
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
            Eventos & Fotos
          </Link>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500">
            <Images className="w-4 h-4" />
            {data.total} fotos
          </span>
        </div>

        <div className="border-b border-neutral-200 pb-5">
          <span className="text-[10px] uppercase tracking-[0.22em] text-karate-red font-bold">Galeria</span>
          <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 mt-1">{data.gallery.titulo}</h1>
          {data.gallery.descricao && (
            <p className="text-sm text-neutral-500 mt-2 max-w-2xl">{data.gallery.descricao}</p>
          )}
        </div>

        {data.photos.length === 0 ? (
          <div className="bg-white border border-neutral-200 rounded-2xl p-12 text-center">
            <Images className="w-10 h-10 mx-auto text-neutral-300 mb-3" />
            <p className="text-sm text-neutral-500">Esta pasta ainda não possui fotos publicadas.</p>
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
                <img
                  src={photo.thumbnailUrl}
                  alt={photo.name || `Foto ${index + 1}`}
                  className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  loading="lazy"
                />
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
            aria-label="Fechar foto"
          >
            <X className="w-6 h-6" />
          </button>

          {data.photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setSelectedIndex((selectedIndex - 1 + data.photos.length) % data.photos.length)}
                className="absolute left-3 sm:left-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
                aria-label="Foto anterior"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
              <button
                type="button"
                onClick={() => setSelectedIndex((selectedIndex + 1) % data.photos.length)}
                className="absolute right-3 sm:right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
                aria-label="Próxima foto"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            </>
          )}

          <div className="max-w-6xl max-h-[90vh] w-full flex flex-col items-center gap-3 px-10">
            <img
              src={selected.url}
              alt={selected.name}
              className="max-w-full max-h-[82vh] object-contain rounded-lg"
            />
            <span className="text-xs text-white/70">
              {selectedIndex + 1} de {data.photos.length}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
