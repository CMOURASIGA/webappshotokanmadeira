import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Megaphone, Calendar, ArrowRight, Image as ImageIcon, CheckCircle2, AlertCircle } from "lucide-react";
import { Notice } from "../../contexts/AppDataContext";
import { InstagramEmbed } from "../InstagramEmbed";

interface DojoAnnouncementsSectionProps {
  notices: Notice[];
  events: Notice[];
  loading: boolean;
  eventsError?: boolean;
  onOpenNoticeModal: (noticeList: Notice[], index: number) => void;
}

// Parses YYYY-MM-DD or DD/MM/YYYY into timestamp ms
function parseDateToTimestamp(dateStr?: string): number | null {
  if (!dateStr) return null;
  const trimmed = dateStr.trim();
  if (!trimmed) return null;

  // Handle ISO format YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
    const ts = new Date(trimmed).getTime();
    return isNaN(ts) ? null : ts;
  }

  // Handle Brazilian format DD/MM/YYYY
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

export function DojoAnnouncementsSection({
  notices,
  events,
  loading,
  eventsError,
  onOpenNoticeModal
}: DojoAnnouncementsSectionProps) {
  const [activeTab, setActiveTab] = useState<"notices" | "events">("notices");

  // Chronological event processing with preference for upcoming events
  const { sortedEvents, hasTemporalCriteria, hasFutureEvents } = useMemo(() => {
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

    const sorted = [...future, ...past, ...undated];
    const hasDates = events.some(e => Boolean(parseDateToTimestamp(e.date)));
    const hasUpcoming = future.length > 0;

    return {
      sortedEvents: sorted,
      hasTemporalCriteria: hasDates,
      hasFutureEvents: hasUpcoming
    };
  }, [events]);

  // Current active list: notices preserve original sheet order, events sorted chronologically
  const currentList = activeTab === "notices" ? notices : sortedEvents;
  const displayedItems = currentList.slice(0, 4);

  // Section title and subtitle based on temporal criteria
  const sectionTitle = activeTab === "notices"
    ? "Mural de Avisos"
    : hasFutureEvents
      ? "Próximos Eventos & Calendário"
      : hasTemporalCriteria
        ? "Eventos & Calendário do Dojo"
        : "Eventos & Galerias do Dojo";

  const sectionSubtitle = activeTab === "notices"
    ? "Fique por dentro dos informativos oficiais, recados e comunicados institucionais do dojo."
    : hasFutureEvents
      ? "Datas confirmadas e organizadas cronologicamente para exames de faixa, seminários e torneios."
      : "Calendário e histórico de atividades, exames de graduação e eventos marciais.";

  return (
    <section id="mural-e-eventos" className="space-y-6 scroll-mt-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-neutral-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-karate-red font-bold text-xs uppercase tracking-wider mb-1">
            {activeTab === "notices" ? <Megaphone className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
            <span>{activeTab === "notices" ? "Comunicação Oficial" : "Agenda & Atividades"}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-jp tracking-tight text-neutral-900">
            {sectionTitle}
          </h2>
          <p className="text-sm text-neutral-600 mt-0.5">
            {sectionSubtitle}
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center bg-neutral-100 p-1 rounded-xl border border-neutral-200 self-start sm:self-auto shrink-0">
          <button
            onClick={() => setActiveTab("notices")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "notices"
                ? "bg-white text-karate-black shadow-sm"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <Megaphone className="w-3.5 h-3.5 text-karate-red" />
            <span>Mural ({notices.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("events")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "events"
                ? "bg-white text-karate-black shadow-sm"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-karate-gold" />
            <span>
              {hasFutureEvents ? "Próximos Eventos" : "Eventos"} ({events.length})
            </span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="bg-neutral-100 rounded-2xl aspect-[4/5]" />
          ))}
        </div>
      ) : activeTab === "events" && eventsError ? (
        <div className="bg-white rounded-2xl border border-red-200 p-8 sm:p-12 text-center max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto text-karate-red">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-neutral-900">
            Não foi possível carregar os eventos
          </h3>
          <p className="text-xs text-neutral-500">
            Houve uma instabilidade temporária na comunicação com a planilha oficial.
          </p>
        </div>
      ) : displayedItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-8 sm:p-12 text-center max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
            {activeTab === "notices" ? <Megaphone className="w-6 h-6" /> : <Calendar className="w-6 h-6" />}
          </div>
          <h3 className="text-base font-bold text-neutral-800">
            {activeTab === "notices" ? "Nenhum comunicado recente" : "Nenhum evento publicado no momento"}
          </h3>
          <p className="text-xs text-neutral-500">
            {activeTab === "notices"
              ? "Novos avisos e recados serão anunciados aqui e no quadro de avisos do dojo."
              : "Novos eventos, seminários, exames e atividades da Madeira Karate serão divulgados aqui."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayedItems.map((item, index) => {
            const itemTimestamp = parseDateToTimestamp(item.date);
            const today = new Date().setHours(0, 0, 0, 0);
            const isFuture = itemTimestamp !== null && itemTimestamp >= today;
            const isPast = itemTimestamp !== null && itemTimestamp < today;

            return (
              <div
                key={item.id}
                onClick={() => onOpenNoticeModal(currentList, index)}
                className="group bg-white rounded-2xl overflow-hidden border border-neutral-200 shadow-sm hover:shadow-md hover:border-neutral-300 transition-all cursor-pointer flex flex-col justify-between"
              >
                {/* Media Preview */}
                <div className="w-full aspect-[4/3] bg-neutral-950 relative overflow-hidden flex items-center justify-center">
                  {item.instagramUrl ? (
                    <div className="w-full h-full bg-gradient-to-br from-neutral-900 via-neutral-950 to-black flex flex-col items-center justify-center p-4 text-center transition-transform duration-300 group-hover:scale-105">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shadow-lg mb-2">
                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </div>
                      <span className="text-[11px] font-bold text-neutral-200 tracking-wide uppercase">Vídeo / Publicação</span>
                      <span className="text-[10px] text-neutral-400 mt-0.5">Toque para ver no Dojo</span>
                    </div>
                  ) : item.image ? (
                    <>
                      <div 
                        className="absolute inset-0 bg-cover bg-center filter blur-md opacity-25 scale-110 pointer-events-none"
                        style={{ backgroundImage: `url(${item.image})` }}
                      />
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-contain relative z-10 transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-neutral-500 gap-2 p-4">
                      <ImageIcon className="w-8 h-8 opacity-40" />
                      <span className="text-xs">Ver imagem</span>
                    </div>
                  )}

                  {/* Badge Top Left */}
                  <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider shadow-sm ${
                      activeTab === "notices" 
                        ? "bg-karate-red text-white" 
                        : "bg-karate-gold text-neutral-900"
                    }`}>
                      {activeTab === "notices" ? "Aviso" : "Evento"}
                    </span>

                    {/* Status badge for events with dates */}
                    {activeTab === "events" && isFuture && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white shadow-sm flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Confirmado
                      </span>
                    )}
                    {activeTab === "events" && isPast && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-medium uppercase tracking-wider bg-neutral-800/80 text-neutral-300 border border-neutral-700/80">
                        Realizado
                      </span>
                    )}
                  </div>
                </div>

                {/* Text Info */}
                <div className="p-4 flex flex-col justify-between flex-1">
                  <div>
                    {/* Event Date Display on Card */}
                    {activeTab === "events" && (
                      <div className="flex items-center gap-1.5 text-xs text-neutral-600 font-semibold mb-2">
                        <Calendar className="w-3.5 h-3.5 text-karate-gold shrink-0" />
                        <span className="truncate">
                          {formatEventDisplayDate(item.date, item.formattedDate)}
                        </span>
                      </div>
                    )}

                    <h3 className="font-bold text-sm text-neutral-900 line-clamp-2 group-hover:text-karate-red transition-colors leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  <div className="pt-3 mt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-neutral-500 group-hover:text-karate-black transition-colors">
                    <span>{activeTab === "events" ? "Detalhes do evento" : "Abrir arte completa"}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom Action Footer */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2">
        <div className="text-xs text-neutral-600">
          {activeTab === "notices"
            ? "Mostrando os comunicados mais recentes da academia."
            : events.length > 0
              ? (hasFutureEvents
                ? "Mostrando os próximos eventos confirmados na agenda do dojo."
                : "Mostrando eventos e atividades do dojo.")
              : "Nenhum evento publicado no momento."}
        </div>
        <Link
          to={activeTab === "notices" ? "/mural" : "/events"}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-karate-red hover:text-red-700 transition-colors"
        >
          <span>{activeTab === "notices" ? "Ir para o Mural Completo" : "Ir para o Calendário de Eventos"}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
