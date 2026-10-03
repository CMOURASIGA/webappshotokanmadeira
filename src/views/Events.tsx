import { Image as ImageIcon } from "lucide-react";
import { GalleriesSection } from "../components/gallery/GalleriesSection";

// Helper to parse YYYY-MM-DD or DD/MM/YYYY
function parseDateToTimestamp(dateStr?: string): number | null {
  if (!dateStr) return null;
  const trimmed = dateStr.trim();
  if (!trimmed) return null;

  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    const ts = new Date(trimmed).getTime();
    return isNaN(ts) ? null : ts;
  }

  const parts = trimmed.split("/");
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    const ts = new Date(year, month, day).getTime();
    return isNaN(ts) ? null : ts;
  }

  const ts = new Date(trimmed).getTime();
  return isNaN(ts) ? null : ts;
}

function formatEventDisplayDate(dateStr?: string, formattedDateFallback?: string): string {
  if (formattedDateFallback) return formattedDateFallback;
  if (!dateStr) return "Data a definir";
  const ts = parseDateToTimestamp(dateStr);
  if (!ts) return dateStr;
  const d = new Date(ts);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}

export function Events() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto w-full pb-24">
      <div className="flex items-center gap-3 border-b border-neutral-200 pb-4">
        <ImageIcon className="w-8 h-8 text-karate-red" />
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight">Eventos & Fotos</h2>
          <p className="text-neutral-500 text-sm">
            Galerias gerais e fotos dos eventos da Madeira Karate.
          </p>
        </div>
      </div>

      <GalleriesSection />
    </div>
  );
}
