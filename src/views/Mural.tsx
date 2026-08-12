import { useState } from "react";
import { useAppData } from "../contexts/AppDataContext";
import { Megaphone, Calendar } from "lucide-react";
import { NoticeModal } from "../components/NoticeModal";

export function Mural() {
  const { notices, loading } = useAppData();
  const [selectedNoticeIndex, setSelectedNoticeIndex] = useState<number | null>(null);

  if (loading) {
    return (
      <div className="p-8 text-center text-neutral-500 flex flex-col items-center">
        <Megaphone className="w-12 h-12 mb-4 opacity-20" />
        <p>Carregando mural...</p>
      </div>
    );
  }

  if (notices.length === 0) {
    return (
      <div className="p-8 text-center text-neutral-500 flex flex-col items-center">
        <Megaphone className="w-12 h-12 mb-4 opacity-20" />
        <p>Nenhum aviso no momento.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto w-full pb-24">
        <div className="flex items-center gap-3 border-b border-neutral-200 pb-4">
          <Megaphone className="w-8 h-8 text-karate-red" />
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight">Mural de Avisos</h2>
            <p className="text-neutral-500 text-sm">Fique por dentro das novidades e eventos.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notices.map((notice, index) => (
            <div 
              key={notice.id} 
              onClick={() => setSelectedNoticeIndex(index)}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-100 hover:shadow-md transition-shadow group flex flex-col cursor-pointer"
            >
              <div className="w-full aspect-[4/5] bg-neutral-100 overflow-hidden relative">
                {notice.image ? (
                  <img 
                    src={notice.image} 
                    alt={notice.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 p-6 text-center">
                    <Calendar className="w-12 h-12 mb-2 opacity-50" />
                    <span className="text-sm">Sem imagem</span>
                  </div>
                )}
                {notice.showPopup && (
                  <div className="absolute top-4 right-4 bg-karate-red text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                    Destaque
                  </div>
                )}
              </div>
              
              {notice.title && (
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <h3 className="font-bold text-lg text-[#111111] leading-tight group-hover:text-karate-red transition-colors">
                    {notice.title}
                  </h3>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <NoticeModal 
        notices={notices}
        currentIndex={selectedNoticeIndex ?? 0}
        isOpen={selectedNoticeIndex !== null}
        onClose={() => setSelectedNoticeIndex(null)}
        onNavigate={setSelectedNoticeIndex}
      />
    </>
  );
}
