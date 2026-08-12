import { useState } from "react";
import { useAppData } from "../contexts/AppDataContext";
import { Image as ImageIcon, Camera } from "lucide-react";
import { NoticeModal } from "../components/NoticeModal";

export function Events() {
  const { events, loading } = useAppData();
  const [selectedEventIndex, setSelectedEventIndex] = useState<number | null>(null);

  if (loading) {
    return (
      <div className="p-8 text-center text-neutral-500 flex flex-col items-center">
        <Camera className="w-12 h-12 mb-4 opacity-20" />
        <p>Carregando eventos...</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="p-8 text-center text-neutral-500 flex flex-col items-center">
        <Camera className="w-12 h-12 mb-4 opacity-20" />
        <p>Nenhum evento no momento.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto w-full pb-24">
        <div className="flex items-center gap-3 border-b border-neutral-200 pb-4">
          <ImageIcon className="w-8 h-8 text-karate-red" />
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight">Eventos & Fotos</h2>
            <p className="text-neutral-500 text-sm">Confira as galerias de fotos dos nossos eventos.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {events.map((eventItem, index) => (
            <div 
              key={eventItem.id} 
              onClick={() => setSelectedEventIndex(index)}
              className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm border border-neutral-100 hover:shadow-md transition-shadow group flex flex-col cursor-pointer"
            >
              <div className="w-full aspect-[4/5] bg-neutral-100 overflow-hidden relative">
                {eventItem.image ? (
                  <img 
                    src={eventItem.image} 
                    alt={eventItem.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 p-6 text-center">
                    <Camera className="w-12 h-12 mb-2 opacity-50" />
                    <span className="text-sm">Sem imagem</span>
                  </div>
                )}
                {eventItem.showPopup && (
                  <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-karate-red text-white text-[9px] sm:text-[10px] font-bold px-2 py-1 sm:px-3 rounded-full uppercase tracking-widest shadow-lg">
                    Destaque
                  </div>
                )}
              </div>
              
              {eventItem.title && (
                <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
                  <h3 className="font-bold text-sm sm:text-base text-[#111111] leading-tight group-hover:text-karate-red transition-colors line-clamp-2">
                    {eventItem.title}
                  </h3>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <NoticeModal 
        notices={events}
        currentIndex={selectedEventIndex ?? 0}
        isOpen={selectedEventIndex !== null}
        onClose={() => setSelectedEventIndex(null)}
        onNavigate={setSelectedEventIndex}
      />
    </>
  );
}
