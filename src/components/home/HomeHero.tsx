import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Megaphone, Shield, Award, Sparkles } from "lucide-react";
import { useAppData } from "../../contexts/AppDataContext";

interface HomeHeroProps {
  totalKatas?: number;
  totalBelts?: number;
  onScrollToBelts: () => void;
  onScrollToAnnouncements: () => void;
}

export function HomeHero({
  totalKatas = 26,
  totalBelts = 8,
  onScrollToBelts,
  onScrollToAnnouncements
}: HomeHeroProps) {
  const { notices, events } = useAppData();
  const totalAnnouncements = notices.length + events.length;

  return (
    <section className="relative overflow-hidden rounded-3xl bg-neutral-950 border border-neutral-800 shadow-2xl text-white">
      {/* Background radial gradient & martial texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-950 to-black opacity-95" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-karate-red/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-karate-gold/10 rounded-full blur-2xl pointer-events-none -ml-20 -mb-20" />

      {/* Decorative Kanji in background */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 select-none pointer-events-none hidden xl:block opacity-[0.04]">
        <span className="text-[220px] font-black font-jp leading-none tracking-tighter">
          空手
        </span>
      </div>

      <div className="relative z-10 p-6 sm:p-8 md:p-12 lg:p-14 flex flex-col justify-between min-h-[460px]">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2.5 mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-karate-red text-white shadow-sm">
            <Shield className="w-3.5 h-3.5" />
            JKA Shotokan Tradicional
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-neutral-800/90 text-neutral-300 border border-neutral-700/80">
            <Sparkles className="w-3.5 h-3.5 text-karate-gold" />
            Dojo Digital
          </span>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="max-w-3xl space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-jp tracking-tight leading-[1.1] text-white">
            Do Branco ao Preto: <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-karate-gold">
              Disciplina, Tradição e Técnica
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-neutral-300 leading-relaxed max-w-2xl font-normal">
            Bem-vindo ao portal educacional oficial do <strong>Madeira Karate Shotokan</strong>. Explore os 
            katas essenciais, os fundamentos do Kihon e os requisitos de cada graduação sob os preceitos do Karate-Do JKA.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <button
            onClick={onScrollToBelts}
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-karate-red hover:bg-red-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-karate-red/25 hover:shadow-karate-red/40 transition-all group"
          >
            <span>Explorar Treinamento</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onScrollToAnnouncements}
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-neutral-800/90 hover:bg-neutral-800 text-neutral-200 hover:text-white font-bold text-sm sm:text-base border border-neutral-700/80 transition-all"
          >
            <Megaphone className="w-4 h-4 text-karate-gold" />
            <span>Quadro de Avisos</span>
            {totalAnnouncements > 0 && (
              <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-karate-red text-white font-mono">
                {totalAnnouncements}
              </span>
            )}
          </button>

          <Link
            to="/katas"
            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-neutral-400 hover:text-white text-sm font-semibold transition-colors sm:ml-auto"
          >
            <BookOpen className="w-4 h-4" />
            <span>Ver Catálogo de Katas</span>
          </Link>
        </div>

        {/* Bottom Metrics Bar */}
        <div className="mt-8 sm:mt-10 pt-6 border-t border-neutral-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
          <div className="space-y-0.5">
            <p className="text-xl sm:text-2xl font-black text-white font-mono">{totalKatas} Katas</p>
            <p className="text-xs text-neutral-400 font-medium">Heian, Tekki & Superiores</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xl sm:text-2xl font-black text-karate-gold font-mono">{totalBelts} Níveis</p>
            <p className="text-xs text-neutral-400 font-medium">Da Branca ao Dan</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xl sm:text-2xl font-black text-white font-mono">JKA</p>
            <p className="text-xs text-neutral-400 font-medium">Linhagem Tradicional</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xl sm:text-2xl font-black text-karate-red font-mono">5 Princípios</p>
            <p className="text-xs text-neutral-400 font-medium">Dojo Kun Fundamental</p>
          </div>
        </div>
      </div>
    </section>
  );
}
