import { Link } from "react-router-dom";
import { BookOpen, ArrowRight, Play, Layers, Compass, Clock } from "lucide-react";
import { Kata } from "../../types";

interface FundamentalKatasShowcaseProps {
  katas: Kata[];
  totalKatas?: number;
}

export function FundamentalKatasShowcase({ katas, totalKatas }: FundamentalKatasShowcaseProps) {
  // Fundamental katas for foundational study: Heian 1-5 + Tekki Shodan
  const fundamentalIds = [
    "heian-shodan",
    "heian-nidan",
    "heian-sandan",
    "heian-yondan",
    "heian-godan",
    "tekki-shodan"
  ];

  const fundamentalKatas = fundamentalIds
    .map(id => katas.find(k => k.id === id))
    .filter((k): k is Kata => k !== undefined);

  const displayedTotalKatas = totalKatas ?? katas.length;

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-neutral-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-karate-red font-bold text-xs uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" />
            <span>Fundamentos do Estilo</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-jp tracking-tight text-neutral-900">
            Katas Fundamentais
          </h2>
          <p className="text-sm text-neutral-500 mt-0.5">
            A base técnica do Shotokan. Os 5 Katas da série Heian e o Tekki Shodan para fortalecimento de postura e embusen.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/kata-series"
            className="text-xs font-bold text-neutral-600 hover:text-karate-red transition-colors"
          >
            Série Heian em Vídeo
          </Link>
          <span className="text-neutral-300">•</span>
          <Link
            to="/katas"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-karate-red hover:text-red-700 transition-colors group"
          >
            <span>Ver todos os {displayedTotalKatas} Katas</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Grid of Fundamental Katas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {fundamentalKatas.map((kata, index) => (
          <Link
            key={kata.id}
            to={`/katas/${kata.id}`}
            className="group bg-white rounded-2xl p-5 sm:p-6 border border-neutral-200 shadow-sm hover:shadow-md hover:border-karate-red/30 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Top Meta: Group, Movements & Estimated Duration */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200/80 group-hover:border-karate-red/30 group-hover:text-karate-red transition-colors">
                  {kata.group}
                </span>

                <div className="flex items-center gap-2.5 text-xs font-mono text-neutral-500 font-medium">
                  <span className="flex items-center gap-1" title="Número de movimentos">
                    <Layers className="w-3.5 h-3.5 text-neutral-400" />
                    {kata.movementsCount} mov.
                  </span>
                  <span className="text-neutral-300">•</span>
                  <span className="flex items-center gap-1" title="Tempo médio de execução">
                    <Clock className="w-3.5 h-3.5 text-karate-gold" />
                    {kata.estimatedDuration || "Tempo pendente"}
                  </span>
                </div>
              </div>

              {/* Title & Meaning */}
              <h3 className="text-xl font-black font-jp text-neutral-900 group-hover:text-karate-red transition-colors flex items-center justify-between">
                <span>{kata.name}</span>
                <span className="text-neutral-300 font-serif italic text-lg group-hover:text-karate-red/40 transition-colors">
                  {index + 1}
                </span>
              </h3>

              <p className="text-xs text-neutral-500 italic mt-1 line-clamp-1">
                "{kata.meaning}"
              </p>

              <p className="text-xs text-neutral-600 mt-3 line-clamp-2 leading-relaxed">
                {kata.description}
              </p>
            </div>

            {/* Bottom Action Footer */}
            <div className="pt-5 mt-5 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-neutral-700 group-hover:text-karate-red transition-colors">
              <span className="flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 fill-current text-karate-red" />
                <span>Estudar Kata e Movimentos</span>
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
