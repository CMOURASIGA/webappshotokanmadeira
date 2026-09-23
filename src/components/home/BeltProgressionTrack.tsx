import { useState } from "react";
import { Link } from "react-router-dom";
import { Award, ArrowRight, CheckCircle2, Sparkles, ExternalLink } from "lucide-react";
import { Belt } from "../../types";

interface BeltProgressionTrackProps {
  belts: Belt[];
}

export function BeltProgressionTrack({ belts }: BeltProgressionTrackProps) {
  // Trilha oficial JKA: 10º Kyu (Branca) até 1º Dan (Preta / Shodan)
  const primaryBelts = belts.filter(b => 
    b.id === "white" || 
    b.id === "yellow" || 
    b.id === "orange" || 
    b.id === "green" || 
    b.id === "light-blue" || 
    b.id === "purple" || 
    b.id === "dark-blue" || 
    b.id === "brown-3" || 
    b.id === "brown-2" || 
    b.id === "brown-1" || 
    b.id === "black-1"
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
            <span>Trilha Oficial JKA Brasil</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-jp tracking-tight text-neutral-900">
            A Jornada das Faixas
          </h2>
          <p className="text-sm text-neutral-600 mt-0.5">
            Do 10º Kyu (Faixa Branca) ao 1º Dan (Faixa Preta Shodan). Toque em uma faixa para ver o programa técnico.
          </p>
        </div>

        <Link
          to="/belts"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-karate-red hover:text-red-700 transition-colors shrink-0 group"
        >
          <span>Ver todas as graduações e Dans superiores</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Horizontal Belts Track */}
      <div className="bg-neutral-900 p-3 sm:p-4 rounded-2xl border border-neutral-800 shadow-sm overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-[850px] justify-between">
          {primaryBelts.map((belt) => {
            const isSelected = belt.id === selectedBeltId;
            return (
              <button
                key={belt.id}
                onClick={() => setSelectedBeltId(belt.id)}
                className={`flex-1 flex flex-col items-center p-2.5 sm:p-3 rounded-xl transition-all relative group cursor-pointer ${
                  isSelected 
                    ? "bg-neutral-800 ring-2 ring-karate-gold shadow-md scale-[1.03]" 
                    : "hover:bg-neutral-800/60"
                }`}
              >
                {/* Belt Color Swatch */}
                <div 
                  className="w-full h-8 sm:h-9 rounded-lg shadow-inner border-2 flex items-center justify-center transition-transform group-hover:scale-105"
                  style={{ 
                    backgroundColor: belt.color,
                    borderColor: belt.id === "white" ? "#999999" : belt.id.startsWith("black") ? "#444444" : "rgba(255,255,255,0.2)"
                  }}
                >
                  {belt.id.startsWith("black") && (
                    <span className="text-white text-[10px] font-bold font-jp tracking-widest">初段</span>
                  )}
                  {belt.id === "white" && (
                    <span className="text-neutral-900 text-[10px] font-bold font-jp">無級</span>
                  )}
                </div>

                {/* Name & Kyu */}
                <p className={`text-[11px] sm:text-xs font-bold mt-2 text-center transition-colors truncate max-w-full ${
                  isSelected ? "text-karate-gold font-extrabold" : "text-white"
                }`}>
                  {belt.name}
                </p>
                <p className="text-[9px] sm:text-[10px] text-neutral-400 font-mono">
                  {belt.level.split("(")[0].trim()}
                </p>

                {/* Active Indicator dot */}
                {isSelected && (
                  <div className="w-1.5 h-1.5 rounded-full bg-karate-gold mt-1 animate-pulse" />
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
                {selectedBelt.id.startsWith("black") && (
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
                {selectedBelt.meaning && (
                  <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-xl italic">
                    "{selectedBelt.meaning}"
                  </p>
                )}
              </div>
            </div>

            <Link
              to={`/belts#belt-${selectedBelt.id}`}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs sm:text-sm font-bold transition-colors shrink-0"
            >
              <span>Ver Ficha Oficial Completa</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Requirements Grid */}
          <div className="pt-5 space-y-4">
            <h3 className="text-xs uppercase font-bold tracking-wider text-neutral-600 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-karate-red" />
              Requisitos Oficiais JKA Brasil
            </h3>

            {/* Kihon, Kata, Kumite Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Kihon */}
              {selectedBelt.kihon && selectedBelt.kihon.length > 0 && (
                <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-karate-red block">
                    Kihon ({selectedBelt.kihon.length} técnicas)
                  </span>
                  <div className="space-y-1 font-mono text-xs text-neutral-800">
                    {selectedBelt.kihon.slice(0, 3).map((k, i) => (
                      <div key={i} className="truncate">• {k}</div>
                    ))}
                    {selectedBelt.kihon.length > 3 && (
                      <div className="text-[11px] text-neutral-400 font-sans italic">
                        +{selectedBelt.kihon.length - 3} mais...
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Kata */}
              {selectedBelt.kata && selectedBelt.kata.length > 0 && (
                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 block">
                    Kata Exigido
                  </span>
                  <div className="space-y-1 font-mono text-xs text-amber-950 font-bold">
                    {selectedBelt.kata.map((k, i) => (
                      <div key={i} className="truncate">🥋 {k}</div>
                    ))}
                  </div>
                </div>
              )}

              {/* Kumite */}
              {selectedBelt.kumite && selectedBelt.kumite.length > 0 && (
                <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900 block">
                    Kumite
                  </span>
                  <div className="space-y-1 font-mono text-xs text-blue-950">
                    {selectedBelt.kumite.map((ku, i) => (
                      <div key={i} className="truncate">• {ku}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Dan Rules se Shodan */}
            {selectedBelt.danRules && (
              <div className="p-3 rounded-xl bg-neutral-100 border border-neutral-200 text-xs text-neutral-700">
                <strong>Regras Administrativas (JKA 2026):</strong> Carência mínima: {selectedBelt.danRules.minimumTime} | Graduação anterior: {selectedBelt.danRules.previousGrade} | Idade mínima: {selectedBelt.danRules.minimumAge}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
