import { useState, useMemo } from "react";
import { useAppData } from "../contexts/AppDataContext";
import { Image as ImageIcon, Camera, Instagram, Calendar, AlertCircle, CheckCircle2 } from "lucide-react";
import { NoticeModal } from "../components/NoticeModal";

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
  const { events, loading, eventsError } = useAppData();
  const [selectedEventIndex, setSelectedEventIndex] = useState<number | null>(null);

  // Chronological sorting for real events if dates exist: future upcoming first, then recent past, then undated
  const sortedEvents = useMemo(() => {
    if (events.length === 0) return [];
    const today = new Date().setHours(0, 0, 0, 0);

    const withTimestamps = events.map(event => ({
      event,
      timestamp: parseDateToTimestamp(event.date)
    }));

    const future = withTimestamps
      .filter(item => item.timestamp !== null && item.timestamp >= today)
      .sort((a, b) => a.timestamp! - b.timestamp!)
      .map(item => item.event);

    const past = withTimestamps
      .filter(item => item.timestamp !== null && item.timestamp < today)
      .sort((a, b) => b.timestamp! - a.timestamp!)
      .map(item => item.event);

    const undated = withTimestamps
      .filter(item => item.timestamp === null)
      .map(item => item.event);

    return [...future, ...past, ...undated];
  }, [events]);

  return (
    <>
      <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto w-full pb-24">
        {/* Header Institucional */}
        <div className="flex items-center gap-3 border-b border-neutral-200 pb-4">
          <ImageIcon className="w-8 h-8 text-karate-red" />
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight">Eventos & Fotos</h2>
            <p className="text-neutral-500 text-sm">Confira as galerias de fotos dos nossos eventos.</p>
          </div>
        </div>

        {/* 1. Estado de Carregamento */}
        {loading ? (
          <div className="p-12 text-center text-neutral-500 flex flex-col items-center justify-center">
            <Camera className="w-10 h-10 mb-3 opacity-30 animate-pulse" />
            <p className="text-sm font-medium">Carregando eventos...</p>
          </div>
        ) : eventsError ? (
          /* 2. Estado de Erro Técnico de Integração */
          <div className="bg-white rounded-2xl border border-red-200 p-8 sm:p-12 text-center max-w-md mx-auto space-y-3 my-8">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto text-karate-red">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-neutral-900">
              Não foi possível carregar os eventos
            </h3>
            <p className="text-xs text-neutral-500">
              Houve uma instabilidade temporária na comunicação com a planilha oficial. Por favor, tente recarregar em instantes.
            </p>
          </div>
        ) : sortedEvents.length === 0 ? (
          /* 3. Estado Vazio Apropriado (Planilha conectada com sucesso porém sem registros cadastrados) */
          <div className="bg-white rounded-2xl border border-neutral-200 p-8 sm:p-16 text-center max-w-lg mx-auto space-y-4 my-8">
            <div className="w-14 h-14 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
              <Calendar className="w-7 h-7 text-neutral-400" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-neutral-900">
                Nenhum evento publicado no momento
              </h3>
              <p className="text-sm text-neutral-500 max-w-sm mx-auto leading-relaxed">
                Novos eventos, seminários, exames e atividades da Madeira Karate serão divulgados aqui.
              </p>
            </div>
          </div>
        ) : (
          /* 4. Grade de Eventos Reais */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {sortedEvents.map((eventItem, index) => {
              const isInstagram = Boolean(
                eventItem.instagramUrl ||
                (eventItem.image && eventItem.image.includes("instagram.com"))
              );
              const itemTimestamp = parseDateToTimestamp(eventItem.date);
              const today = new Date().setHours(0, 0, 0, 0);
              const isFuture = itemTimestamp !== null && itemTimestamp >= today;

              return (
                <div 
                  key={eventItem.id} 
                  onClick={() => setSelectedEventIndex(index)}
                  className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm border border-neutral-100 hover:shadow-md transition-shadow group flex flex-col cursor-pointer"
                >
                  <div className="w-full aspect-[4/5] bg-neutral-950 overflow-hidden relative flex items-center justify-center">
                    {isInstagram ? (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-neutral-900 to-neutral-950 text-white gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-md">
                          <Instagram className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-semibold text-neutral-300">Publicação Instagram</span>
                      </div>
                    ) : eventItem.image ? (
                      <>
                        <div 
                          className="absolute inset-0 bg-cover bg-center filter blur-md opacity-25 scale-110 pointer-events-none" 
                          style={{ backgroundImage: `url(${eventItem.image})` }} 
                        />
                        <img 
                          src={eventItem.image} 
                          alt={eventItem.title} 
                          className="w-full h-full object-contain relative z-10 p-1 group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 p-6 text-center">
                        <Camera className="w-12 h-12 mb-2 opacity-50" />
                        <span className="text-sm">Sem imagem</span>
                      </div>
                    )}
                    
                    {eventItem.showPopup && (
                      <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 bg-karate-red text-white text-[9px] sm:text-[10px] font-bold px-2 py-1 sm:px-3 rounded-full uppercase tracking-widest shadow-lg">
                        Destaque
                      </div>
                    )}

                    {isFuture && (
                      <div className="absolute top-2 left-2 z-20 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Confirmado
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
                    {eventItem.date && (
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-neutral-500 mb-1.5">
                        <Calendar className="w-3 h-3 text-karate-gold" />
                        <span>{formatEventDisplayDate(eventItem.date, eventItem.formattedDate)}</span>
                      </div>
                    )}
                    {eventItem.title && (
                      <h3 className="font-bold text-sm sm:text-base text-[#111111] leading-tight group-hover:text-karate-red transition-colors line-clamp-2">
                        {eventItem.title}
                      </h3>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <NoticeModal 
        notices={sortedEvents}
        currentIndex={selectedEventIndex ?? 0}
        isOpen={selectedEventIndex !== null}
        onClose={() => setSelectedEventIndex(null)}
        onNavigate={setSelectedEventIndex}
      />
    </>
  );
}

