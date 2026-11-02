import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Megaphone, Shield, Award, Sparkles } from "lucide-react";
import { useAppData } from "../../contexts/AppDataContext";
import { useLanguage } from "../../i18n/LanguageContext";

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
  const { language } = useLanguage();
  const copy = language === "en"
    ? { traditional: "Traditional JKA Shotokan", digital: "Digital Dojo", title1: "From White to Black:", title2: "Discipline, Tradition and Technique", intro: "Welcome to the official educational portal of Madeira Karate Shotokan. Explore essential Kata, Kihon fundamentals and grading requirements within the principles of JKA Karate-Do.", training: "Explore Training", notices: "News Board", katas: "View Kata Catalog", groups: "Heian, Tekki & Advanced", levels: "Levels", beltPath: "From White Belt to Dan", lineage: "Traditional Lineage", principles: "Principles", dojo: "Fundamental Dojo Kun" }
    : language === "ja"
    ? { traditional: "伝統的 JKA Shotokan", digital: "デジタル道場", title1: "白帯から黒帯へ", title2: "規律・伝統・技術", intro: "Madeira Karate Shotokan の公式学習ポータルへようこそ。形、基本（Kihon）、昇級・昇段に関する学習内容を JKA Karate-Do の考え方に沿って確認できます。", training: "稽古内容を見る", notices: "お知らせ", katas: "形一覧を見る", groups: "平安・鉄騎・上級形", levels: "段階", beltPath: "白帯から段位まで", lineage: "伝統の系譜", principles: "原則", dojo: "道場訓" }
    : { traditional: "JKA Shotokan Tradicional", digital: "Dojo Digital", title1: "Do Branco ao Preto:", title2: "Disciplina, Tradição e Técnica", intro: "Bem-vindo ao portal educacional oficial do Madeira Karate Shotokan. Explore os katas essenciais, os fundamentos do Kihon e os requisitos de cada graduação sob os preceitos do Karate-Do JKA.", training: "Explorar Treinamento", notices: "Quadro de Avisos", katas: "Ver Catálogo de Katas", groups: "Heian, Tekki e Superiores", levels: "Níveis", beltPath: "Da Faixa Branca ao Dan", lineage: "Linhagem Tradicional", principles: "Princípios", dojo: "Dojo Kun Fundamental" };
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
            {copy.traditional}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-neutral-800/90 text-neutral-300 border border-neutral-700/80">
            <Sparkles className="w-3.5 h-3.5 text-karate-gold" />
            {copy.digital}
          </span>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="max-w-3xl space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-jp tracking-tight leading-[1.1] text-white">
            {copy.title1} <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-karate-gold">
              {copy.title2}
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-neutral-300 leading-relaxed max-w-2xl font-normal">
            {copy.intro}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <button
            onClick={onScrollToBelts}
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-karate-red hover:bg-red-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-karate-red/25 hover:shadow-karate-red/40 transition-all group"
          >
            <span>{copy.training}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onScrollToAnnouncements}
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-neutral-800/90 hover:bg-neutral-800 text-neutral-200 hover:text-white font-bold text-sm sm:text-base border border-neutral-700/80 transition-all"
          >
            <Megaphone className="w-4 h-4 text-karate-gold" />
            <span>{copy.notices}</span>
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
            <span>{copy.katas}</span>
          </Link>
        </div>

        {/* Bottom Metrics Bar */}
        <div className="mt-8 sm:mt-10 pt-6 border-t border-neutral-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
          <div className="space-y-0.5">
            <p className="text-xl sm:text-2xl font-black text-white font-mono">{totalKatas} Katas</p>
            <p className="text-xs text-neutral-300 font-medium">{copy.groups}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xl sm:text-2xl font-black text-karate-gold font-mono">{totalBelts} {copy.levels}</p>
            <p className="text-xs text-neutral-300 font-medium">{copy.beltPath}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xl sm:text-2xl font-black text-white font-mono">JKA</p>
            <p className="text-xs text-neutral-300 font-medium">Linhagem Tradicional</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xl sm:text-2xl font-black text-karate-red font-mono">5 {copy.principles}</p>
            <p className="text-xs text-neutral-300 font-medium">Dojo Kun Fundamental</p>
          </div>
        </div>
      </div>
    </section>
  );
}
