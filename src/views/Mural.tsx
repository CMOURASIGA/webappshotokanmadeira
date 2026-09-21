import { useState } from "react";
import { useAppData } from "../contexts/AppDataContext";
import { Megaphone, Calendar } from "lucide-react";
import { NoticeModal } from "../components/NoticeModal";
import { InstagramEmbed } from "../components/InstagramEmbed";

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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {notices.map((notice, index) => (
            <div 
              key={notice.id} 
              onClick={() => setSelectedNoticeIndex(index)}
              className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm border border-neutral-100 hover:shadow-md transition-shadow group flex flex-col cursor-pointer"
            >
              <div className="w-full aspect-[4/5] bg-neutral-100 overflow-hidden relative">
                {notice.instagramUrl ? (
                  <div className="w-full h-full bg-gradient-to-br from-neutral-900 via-neutral-950 to-black flex flex-col items-center justify-center p-4 text-center transition-transform duration-300 group-hover:scale-105">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shadow-lg mb-2">
                      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </div>
                    <span className="text-[11px] font-bold text-neutral-200 tracking-wide uppercase">Vídeo / Publicação</span>
                    <span className="text-[10px] text-neutral-400 mt-0.5">Toque para ver no Dojo</span>
                  </div>
                ) : notice.image ? (
                  <div className="w-full h-full bg-neutral-950 relative flex items-center justify-center">
                    <div 
                      className="absolute inset-0 bg-cover bg-center filter blur-md opacity-25 scale-110 pointer-events-none" 
                      style={{ backgroundImage: `url(${notice.image})` }} 
                    />
                    <img 
                      src={notice.image} 
                      alt={notice.title} 
                      className="w-full h-full object-contain relative z-10 p-1 group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 p-6 text-center">
                    <Calendar className="w-12 h-12 mb-2 opacity-50" />
                    <span className="text-sm">Sem imagem</span>
                  </div>
                )}
                {notice.showPopup && (
                  <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-karate-red text-white text-[9px] sm:text-[10px] font-bold px-2 py-1 sm:px-3 rounded-full uppercase tracking-widest shadow-lg">
                    Destaque
                  </div>
                )}
              </div>
              
              {notice.title && (
                <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
                  <h3 className="font-bold text-sm sm:text-base text-[#111111] leading-tight group-hover:text-karate-red transition-colors line-clamp-2">
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
