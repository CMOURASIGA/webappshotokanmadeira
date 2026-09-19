import { useState } from "react";
import { Link } from "react-router-dom";
import { Megaphone, Calendar, ArrowRight, ExternalLink, Sparkles, Image as ImageIcon } from "lucide-react";
import { Notice } from "../../contexts/AppDataContext";
import { InstagramEmbed } from "../InstagramEmbed";

interface DojoAnnouncementsSectionProps {
  notices: Notice[];
  events: Notice[];
  loading: boolean;
  onOpenNoticeModal: (noticeList: Notice[], index: number) => void;
}

export function DojoAnnouncementsSection({
  notices,
  events,
  loading,
  onOpenNoticeModal
}: DojoAnnouncementsSectionProps) {
  const [activeTab, setActiveTab] = useState<"notices" | "events">("notices");

  const currentList = activeTab === "notices" ? notices : events;
  const recentItems = currentList.slice(0, 4);

  return (
    <section id="mural-e-eventos" className="space-y-6 scroll-mt-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-neutral-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-karate-red font-bold text-xs uppercase tracking-wider mb-1">
            <Megaphone className="w-4 h-4" />
            <span>Comunicação & Calendário</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-jp tracking-tight text-neutral-900">
            Avisos & Próximos Eventos
          </h2>
          <p className="text-sm text-neutral-500 mt-0.5">
            Fique por dentro das novidades, exames de faixa, seminários e horários especiais do dojo.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center bg-neutral-100 p-1 rounded-xl border border-neutral-200 self-start sm:self-auto shrink-0">
          <button
            onClick={() => setActiveTab("notices")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "notices"
                ? "bg-white text-karate-black shadow-sm"
                : "text-neutral-500 hover:text-neutral-800"
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
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-karate-gold" />
            <span>Eventos ({events.length})</span>
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
      ) : recentItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-200 p-8 sm:p-12 text-center max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
            {activeTab === "notices" ? <Megaphone className="w-6 h-6" /> : <Calendar className="w-6 h-6" />}
          </div>
          <h3 className="text-base font-bold text-neutral-800">
            {activeTab === "notices" ? "Nenhum comunicado recente" : "Nenhum evento agendado"}
          </h3>
          <p className="text-xs text-neutral-500">
            Novos avisos e datas de seminários serão anunciados aqui e no quadro de avisos presencial.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {recentItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => onOpenNoticeModal(currentList, index)}
              className="group bg-white rounded-2xl overflow-hidden border border-neutral-200 shadow-sm hover:shadow-md hover:border-neutral-300 transition-all cursor-pointer flex flex-col justify-between"
            >
              {/* Media Preview */}
              <div className="w-full aspect-[4/3] bg-neutral-950 relative overflow-hidden flex items-center justify-center">
                {item.instagramUrl ? (
                  <div className="w-full h-full pointer-events-none">
                    <InstagramEmbed
                      url={item.instagramUrl}
                      title={item.title}
                      compact
                    />
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
                    <span className="text-xs">Ver comunicado</span>
                  </div>
                )}

                {/* Badge Type */}
                <div className="absolute top-2.5 left-2.5 z-20">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider shadow-sm ${
                    activeTab === "notices" 
                      ? "bg-karate-red text-white" 
                      : "bg-karate-gold text-neutral-900"
                  }`}>
                    {activeTab === "notices" ? "Aviso" : "Evento"}
                  </span>
                </div>
              </div>

              {/* Text info */}
              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-bold text-sm text-neutral-900 line-clamp-2 group-hover:text-karate-red transition-colors leading-snug">
                    {item.title}
                  </h3>
                </div>

                <div className="pt-3 mt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-neutral-500 group-hover:text-karate-black transition-colors">
                  <span>Abrir arte completa</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Action Footer */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-xs text-neutral-500">
          Mostrando os comunicados mais recentes da academia.
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
