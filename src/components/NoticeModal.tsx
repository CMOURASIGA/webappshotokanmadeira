import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Notice } from "../contexts/AppDataContext";

interface NoticeModalProps {
  notices: Notice[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

export function NoticeModal({ notices, currentIndex, isOpen, onClose, onNavigate }: NoticeModalProps) {
  if (!isOpen || notices.length === 0) return null;

  const currentNotice = notices[currentIndex];

  const nextNotice = () => {
    onNavigate((currentIndex + 1) % notices.length);
  };

  const prevNotice = () => {
    onNavigate((currentIndex - 1 + notices.length) % notices.length);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black text-white rounded-full flex items-center justify-center transition-colors"
        >
          <X size={20} />
        </button>

        <div className="w-full aspect-[4/5] bg-neutral-800 relative">
          {currentNotice.image ? (
            <img 
              src={currentNotice.image} 
              alt={currentNotice.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-500 p-8 text-center">
              Sem imagem
            </div>
          )}
          
          {notices.length > 1 && (
            <>
              <button 
                onClick={prevNotice}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black text-white rounded-full flex items-center justify-center transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={nextNotice}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black text-white rounded-full flex items-center justify-center transition-colors"
              >
                <ChevronRight size={24} />
              </button>

              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {notices.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => onNavigate(idx)}
                    className={`w-2 h-2 rounded-full transition-colors ${idx === currentIndex ? 'bg-white' : 'bg-white/40 hover:bg-white/60'}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        
        {currentNotice.title && (
          <div className="p-4 text-center">
            <h3 className="text-white font-bold text-lg">{currentNotice.title}</h3>
          </div>
        )}
      </div>
    </div>
  );
}
