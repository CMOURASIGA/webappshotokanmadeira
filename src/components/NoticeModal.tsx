import { useEffect, useState, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, ExternalLink, ImageOff } from "lucide-react";
import { Notice } from "../contexts/AppDataContext";
import { InstagramEmbed } from "./InstagramEmbed";

interface NoticeModalProps {
  notices: Notice[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

type ImageOrientation = "landscape" | "portrait" | "square" | "unknown";

export function NoticeModal({
  notices,
  currentIndex,
  isOpen,
  onClose,
  onNavigate
}: NoticeModalProps) {
  const [orientation, setOrientation] = useState<ImageOrientation>("unknown");
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const currentNotice = notices[currentIndex];

  const nextNotice = useCallback(() => {
    if (notices.length <= 1) return;
    onNavigate((currentIndex + 1) % notices.length);
  }, [currentIndex, notices.length, onNavigate]);

  const prevNotice = useCallback(() => {
    if (notices.length <= 1) return;
    onNavigate((currentIndex - 1 + notices.length) % notices.length);
  }, [currentIndex, notices.length, onNavigate]);

  // Teclado: Escape para fechar, ArrowLeft e ArrowRight para navegar
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        prevNotice();
      } else if (e.key === "ArrowRight") {
        nextNotice();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, nextNotice, prevNotice, onClose]);

  // Detecção automática de proporções usando dimensões naturais
  useEffect(() => {
    if (!isOpen || !currentNotice) return;

    setImageError(false);
    setImageLoading(true);
    setOrientation("unknown");

    // Para avisos de Instagram, não alteramos o comportamento existente
    if (currentNotice.instagramUrl) {
      setImageLoading(false);
      return;
    }

    const imageUrl = currentNotice.image;
    if (!imageUrl) {
      setImageLoading(false);
      return;
    }

    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      const { naturalWidth, naturalHeight } = img;
      if (naturalWidth && naturalHeight) {
        const ratio = naturalWidth / naturalHeight;
        // Classificação:
        // paisagem: width > height (ratio > 1.15)
        // retrato: height > width (ratio < 0.88)
        // quadrada: ratio próximo de 1:1 (0.88 <= ratio <= 1.15)
        if (ratio > 1.15) {
          setOrientation("landscape");
        } else if (ratio < 0.88) {
          setOrientation("portrait");
        } else {
          setOrientation("square");
        }
      }
      setImageLoading(false);
      setImageError(false);
    };

    img.onerror = () => {
      setImageLoading(false);
      setImageError(true);
    };
  }, [isOpen, currentNotice?.id, currentNotice?.image, currentNotice?.instagramUrl]);

  if (!isOpen || notices.length === 0 || !currentNotice) return null;

  const isInstagramNotice = Boolean(currentNotice.instagramUrl);

  // Definição da largura máxima do container conforme a classificação
  let containerMaxWidthClass = "max-w-md";
  if (isInstagramNotice) {
    containerMaxWidthClass = "max-w-md";
  } else if (orientation === "landscape") {
    containerMaxWidthClass = "max-w-5xl";
  } else if (orientation === "square") {
    containerMaxWidthClass = "max-w-2xl";
  } else if (orientation === "portrait") {
    containerMaxWidthClass = "max-w-md";
  } else {
    containerMaxWidthClass = "max-w-lg";
  }

  const hasFooter = Boolean(currentNotice.title || currentNotice.link);

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full ${containerMaxWidthClass} max-w-[95vw] max-h-[92vh] bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl flex flex-col transition-all duration-300 mx-auto border border-neutral-800`}
      >
        {/* Botão Fechar no topo direito com alto contraste */}
        <button 
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-3 right-3 z-30 w-10 h-10 bg-black/60 hover:bg-black/90 active:scale-95 text-white rounded-full flex items-center justify-center transition-all shadow-lg border border-white/20 cursor-pointer backdrop-blur-sm"
        >
          <X size={20} />
        </button>

        {/* Área Central / Conteúdo */}
        <div className="relative flex-1 min-h-0 w-full flex items-center justify-center bg-neutral-950 overflow-hidden select-none">
          {isInstagramNotice ? (
            /* Comportamento já existente para Instagram sem alterações */
            <div className="min-h-0 flex-1 w-full overflow-y-auto bg-white">
              <InstagramEmbed
                url={currentNotice.instagramUrl!}
                title={currentNotice.title}
              />
            </div>
          ) : imageError ? (
            /* Fallback de erro elegante */
            <div className="w-full py-16 px-6 flex flex-col items-center justify-center text-neutral-400 gap-3 min-h-[240px]">
              <div className="w-14 h-14 rounded-full bg-neutral-800/80 border border-neutral-700 flex items-center justify-center text-neutral-400 shadow-inner">
                <ImageOff className="w-7 h-7 text-neutral-400" />
              </div>
              <div className="space-y-1 text-center">
                <p className="text-white font-medium text-base">Imagem temporariamente indisponível</p>
                <p className="text-xs text-neutral-500">Não foi possível carregar a arte deste aviso</p>
              </div>
            </div>
          ) : currentNotice.image ? (
            /* Imagem comum: não força aspect-[4/5] e usa object-contain */
            <div className="w-full h-full flex items-center justify-center relative p-1 sm:p-2">
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-neutral-950/50">
                  <div className="w-8 h-8 border-2 border-karate-red border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              <img 
                src={currentNotice.image} 
                alt={currentNotice.title || "Aviso"}
                onLoad={(e) => {
                  const { naturalWidth, naturalHeight } = e.currentTarget;
                  if (naturalWidth && naturalHeight) {
                    const ratio = naturalWidth / naturalHeight;
                    if (ratio > 1.15) setOrientation("landscape");
                    else if (ratio < 0.88) setOrientation("portrait");
                    else setOrientation("square");
                  }
                  setImageLoading(false);
                  setImageError(false);
                }}
                onError={() => {
                  setImageLoading(false);
                  setImageError(true);
                }}
                className={`max-w-full ${
                  hasFooter 
                    ? "max-h-[calc(92vh-130px)] sm:max-h-[calc(92vh-140px)]" 
                    : "max-h-[calc(92vh-40px)]"
                } w-auto h-auto object-contain block mx-auto transition-opacity duration-200 select-none ${
                  imageLoading ? "opacity-0" : "opacity-100"
                }`}
              />
            </div>
          ) : (
            <div className="w-full py-16 px-6 flex flex-col items-center justify-center text-neutral-500 text-center">
              Sem imagem disponível
            </div>
          )}
          
          {/* Controles de Navegação (Anterior / Próximo) */}
          {notices.length > 1 && (
            <>
              <button 
                onClick={(e) => { e.stopPropagation(); prevNotice(); }}
                aria-label="Aviso anterior"
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 bg-black/60 hover:bg-black/90 active:scale-95 text-white rounded-full flex items-center justify-center transition-all shadow-lg border border-white/20 cursor-pointer backdrop-blur-sm"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); nextNotice(); }}
                aria-label="Próximo aviso"
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-11 sm:h-11 bg-black/60 hover:bg-black/90 active:scale-95 text-white rounded-full flex items-center justify-center transition-all shadow-lg border border-white/20 cursor-pointer backdrop-blur-sm"
              >
                <ChevronRight size={24} />
              </button>

              {/* Indicadores de Página (Dots) com cápsula de contraste */}
              <div className="absolute bottom-3 left-0 right-0 flex justify-center items-center z-20 pointer-events-none">
                <div className="flex gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 pointer-events-auto">
                  {notices.map((_, idx) => (
                    <button 
                      key={idx}
                      onClick={() => onNavigate(idx)}
                      aria-label={`Ir para o aviso ${idx + 1}`}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === currentIndex 
                          ? "w-6 bg-karate-red" 
                          : "w-2 bg-white/50 hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Rodapé com Título e Botão quando existentes */}
        {hasFooter && (
          <div className="p-3.5 sm:p-4 bg-neutral-900 border-t border-neutral-800 shrink-0 flex flex-col items-center gap-2.5 z-10">
            {currentNotice.title && (
              <h3 className="text-white font-bold text-base sm:text-lg text-center leading-snug max-w-2xl px-2">
                {currentNotice.title}
              </h3>
            )}
            
            {currentNotice.link && (
              <a 
                href={currentNotice.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full max-w-sm bg-karate-red hover:bg-red-700 active:scale-[0.99] text-white font-bold py-2.5 px-4 rounded-xl transition-all text-center shadow-md flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <span>Ver Álbum Completo</span>
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
