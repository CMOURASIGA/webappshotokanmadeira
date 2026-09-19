import { useState } from "react";
import { Link } from "react-router-dom";
import { Award, ArrowRight, CheckCircle2, ChevronRight, Sparkles } from "lucide-react";
import { Belt } from "../../types";

interface BeltProgressionTrackProps {
  belts: Belt[];
}

export function BeltProgressionTrack({ belts }: BeltProgressionTrackProps) {
  // We showcase the primary kyu-to-dan progression (White, Yellow, Red, Orange, Green, Purple, Brown, Black)
  const primaryBelts = belts.filter(b => 
    b.id === "white" || 
    b.id === "yellow" || 
    b.id === "red" || 
    b.id === "orange" || 
    b.id === "green" || 
    b.id === "purple" || 
    b.id === "brown" || 
    b.id === "black"
  );

  const [selectedBeltId, setSelectedBeltId] = useState<string>("white");
  const selectedBelt = primaryBelts.find(b => b.id === selectedBeltId) || primaryBelts[0];

  return (
    <section id="trilha-graduacao" className="space-y-6 scroll-mt-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-neutral-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-karate-red font-bold text-xs uppercase tracking-wider mb-1">
            <Award className="w-4 h-4" />
            <span>Trilha de Graduação Shotokan</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-jp tracking-tight text-neutral-900">
            A Jornada das Faixas
          </h2>
          <p className="text-sm text-neutral-500 mt-0.5">
            Do primeiro passo na faixa branca ao domínio técnico da faixa preta. Toque em uma faixa para ver os requisitos.
          </p>
        </div>

        <Link
          to="/belts"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-karate-red hover:text-red-700 transition-colors shrink-0 group"
        >
          <span>Ver todas as graduações e Dans</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Horizontal Belts Track */}
      <div className="bg-neutral-900 p-3 sm:p-4 rounded-2xl border border-neutral-800 shadow-sm overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 sm:gap-3 min-w-[700px] justify-between">
          {primaryBelts.map((belt, index) => {
            const isSelected = belt.id === selectedBeltId;
            return (
              <button
                key={belt.id}
                onClick={() => setSelectedBeltId(belt.id)}
                className={`flex-1 flex flex-col items-center p-3 rounded-xl transition-all relative group ${
                  isSelected 
                    ? "bg-neutral-800 ring-2 ring-karate-gold shadow-md scale-[1.03]" 
                    : "hover:bg-neutral-800/60"
                }`}
              >
                {/* Belt Color Swatch */}
                <div 
                  className="w-full h-8 sm:h-10 rounded-lg shadow-inner border-2 flex items-center justify-center transition-transform group-hover:scale-105"
                  style={{ 
                    backgroundColor: belt.color,
                    borderColor: belt.id === "white" ? "#999999" : belt.id === "black" ? "#444444" : "rgba(255,255,255,0.2)"
                  }}
                >
                  {belt.id === "black" && (
                    <span className="text-white text-[10px] font-bold font-jp tracking-widest">初段</span>
                  )}
                  {belt.id === "white" && (
                    <span className="text-neutral-900 text-[10px] font-bold font-jp">無級</span>
                  )}
                </div>

                {/* Name & Kyu */}
                <p className={`text-xs font-bold mt-2 transition-colors ${
                  isSelected ? "text-karate-gold font-extrabold" : "text-white"
                }`}>
                  {belt.name}
                </p>
                <p className="text-[10px] text-neutral-400 font-mono">
                  {belt.level}
                </p>

                {/* Active Indicator dot */}
                {isSelected && (
                  <div className="w-1.5 h-1.5 rounded-full bg-karate-gold mt-1.5 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Belt Detail Card */}
      {selectedBelt && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 sm:p-7 shadow-sm transition-all animate-in fade-in duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 border-b border-neutral-100 pb-5">
            <div className="flex items-center gap-4">
              <div 
                className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-2xl flex items-center justify-center border-4 shadow-sm"
                style={{ 
                  backgroundColor: selectedBelt.color,
                  borderColor: selectedBelt.id === "white" ? "#E5E5E5" : "rgba(0,0,0,0.15)"
                }}
              >
                {selectedBelt.id === "black" && (
                  <span className="text-white font-bold font-jp text-sm tracking-widest">黒帯</span>
                )}
                {selectedBelt.id === "white" && (
                  <span className="text-neutral-800 font-bold font-jp text-sm">白帯</span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl sm:text-2xl font-black font-jp text-neutral-900">
                    Faixa {selectedBelt.name}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-neutral-100 text-neutral-700 border border-neutral-200">
                    {selectedBelt.level}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-xl italic">
                  "{selectedBelt.meaning}"
                </p>
              </div>
            </div>

            <Link
              to="/belts"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs sm:text-sm font-bold transition-colors shrink-0"
            >
              <span>Ver Requisitos Completos</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Requirements Grid */}
          <div className="pt-5">
            <h4 className="text-xs uppercase font-bold tracking-wider text-neutral-400 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-karate-red" />
              Requisitos Principais de Exame
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {selectedBelt.requirements.map((req, i) => (
                <div 
                  key={i}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-neutral-50 border border-neutral-100"
                >
                  <CheckCircle2 className="w-4 h-4 text-karate-red shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-neutral-800 font-medium leading-snug">
                    {req}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
