import { useEffect, useState } from "react";
import { useAppData } from "../contexts/AppDataContext";

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState(0);
  const { config } = useAppData();

  useEffect(() => {
    // Transição de entrada suave
    const timer1 = setTimeout(() => setStage(1), 80);
    // Pausa prolongada para contemplação da marca (início da saída suave aos 4.5s)
    const timer2 = setTimeout(() => setStage(2), 4500);
    // Finalização e liberação completa aos 5.2s
    const timer3 = setTimeout(() => {
      onComplete();
    }, 5200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setStage(2);
    setTimeout(() => {
      onComplete();
    }, 400);
  };

  return (
    <aside 
      aria-label="Abertura Madeira Karate"
      onClick={handleSkip}
      className={`fixed inset-0 z-50 bg-[#111111] flex items-center justify-center p-4 sm:p-6 lg:p-12 overflow-hidden select-none transition-opacity duration-700 ease-in-out cursor-pointer motion-reduce:transition-none ${
        stage === 2 ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col lg:flex-row items-center justify-center gap-4 sm:gap-6 lg:gap-10 xl:gap-12 w-full max-w-4xl mx-auto">
        {/* Marca Circular Madeira Karate */}
        <div 
          className={`shrink-0 rounded-full overflow-hidden flex items-center justify-center relative aspect-square shadow-2xl shadow-karate-red/10 transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
            stage >= 1 ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-3 scale-95"
          }`}
          style={{
            width: "clamp(85px, 20vw, 210px)",
            height: "clamp(85px, 20vw, 210px)"
          }}
        >
          <img 
            src={config.logo || undefined} 
            alt="Madeira Karate Logo" 
            className="w-full h-full object-contain" 
          />
        </div>

        {/* Divisor Vertical Elegante para Notebook/Desktop */}
        <div 
          className={`hidden lg:block w-[1px] h-28 xl:h-36 bg-gradient-to-b from-transparent via-neutral-700/60 to-transparent shrink-0 transition-opacity duration-700 delay-100 ${
            stage >= 1 ? "opacity-100" : "opacity-0"
          }`} 
        />

        {/* Identidade Textual */}
        <div 
          className={`flex flex-col items-center lg:items-start text-center lg:text-left transition-all duration-700 delay-100 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
            stage >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
        >
          {/* Título Principal */}
          <h1 className="text-white font-black tracking-[0.16em] sm:tracking-[0.22em] uppercase leading-none text-[clamp(1.6rem,4vw,3.25rem)]">
            Madeira
          </h1>

          {/* Subtítulo */}
          <div className="mt-1.5 sm:mt-2 lg:mt-2.5 flex flex-col items-center lg:items-start">
            <span className="text-karate-gold font-semibold tracking-wider sm:tracking-widest uppercase text-[clamp(0.68rem,1.5vw,0.95rem)] leading-tight">
              Karate Shotokan &amp;
            </span>
            <span className="text-karate-gold font-semibold tracking-wider sm:tracking-widest uppercase text-[clamp(0.68rem,1.5vw,0.95rem)] leading-tight">
              Artes Marciais
            </span>
          </div>

          {/* Kanji Japonês - Entrada Suave sem animate-pulse contínuo */}
          <div 
            className={`mt-3 sm:mt-4 lg:mt-5 text-karate-red font-jp text-[clamp(1.3rem,2.8vw,2.1rem)] tracking-[0.35em] font-normal leading-none opacity-90 transition-all duration-700 delay-200 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
              stage >= 1 ? "opacity-90 translate-y-0" : "opacity-0 translate-y-2"
            }`}
          >
            空手道
          </div>
        </div>
      </div>
    </aside>
  );
}
