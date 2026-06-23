import { useEffect, useState } from "react";

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStage(1), 500);
    const timer2 = setTimeout(() => setStage(2), 2500);
    const timer3 = setTimeout(() => {
      onComplete();
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-50 bg-[#111111] flex flex-col items-center justify-center transition-opacity duration-500 ${stage === 2 ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
      <div className={`flex flex-col items-center transition-all duration-1000 transform ${stage >= 1 ? "translate-y-0 opacity-100 scale-100" : "translate-y-8 opacity-0 scale-95"}`}>
        <div className="w-32 h-32 md:w-48 md:h-48 rounded-full flex items-center justify-center mb-6 overflow-hidden bg-white shadow-2xl shadow-karate-red/20">
          <img src="https://i.imgur.com/FFeA342.png" alt="Madeira Karate Logo" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-white text-2xl md:text-3xl font-bold tracking-widest uppercase text-center leading-tight">
          Madeira<br/><span className="text-karate-gold text-sm md:text-base mt-2 block">Karate Shotokan &<br/>Artes Marciais</span>
        </h1>
        <div className="mt-12 text-karate-red font-jp text-4xl tracking-[0.5em] opacity-80 animate-pulse">
          空手道
        </div>
      </div>
    </div>
  );
}
