import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Trophy, Calendar, MapPin, ArrowRight, ShieldCheck, Clock } from "lucide-react";
import { championshipService, getEnrollmentPeriodState } from "../../services/championshipService";

interface ChampionshipPromoBannerProps {
  variant?: "home" | "store";
}

export function ChampionshipPromoBanner({ variant = "home" }: ChampionshipPromoBannerProps) {
  const championship = useMemo(() => {
    const list = championshipService.getChampionships();
    return list.find(c => c.status === "INSCRICOES_ABERTAS") || list[0] || null;
  }, []);

  if (!championship) return null;

  const periodState = getEnrollmentPeriodState(championship);

  if (variant === "store") {
    return (
      <div className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 border border-karate-gold/40 text-white rounded-2xl p-4 sm:p-5 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-karate-gold/20 text-karate-gold flex items-center justify-center shrink-0 mt-0.5">
            <Trophy className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-karate-gold/20 text-karate-gold px-2 py-0.5 rounded-full">
                Módulo Esportivo Oficial
              </span>
              <span className="text-[10px] text-neutral-400">
                Inscrição de atleta não é produto de estoque
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold font-jp text-white">
              {championship.nome}
            </h3>
            <p className="text-xs text-neutral-300 max-w-xl">
              As inscrições de atletas para o campeonato possuem formulário próprio, cálculo de idade oficial e conferência PIX direta.
            </p>
          </div>
        </div>

        <Link
          to={`/campeonatos/${championship.slug}`}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-karate-red hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 whitespace-nowrap"
        >
          <span>Acessar Página do Campeonato</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  // Variant: Home
  return (
    <section className="relative overflow-hidden rounded-3xl bg-neutral-950 text-white border border-neutral-800 shadow-2xl p-6 sm:p-8 md:p-10">
      <div className="absolute top-0 right-0 w-96 h-96 bg-karate-red/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-karate-red text-white">
              <Trophy className="w-3.5 h-3.5" /> Competição Oficial Madeira Karate
            </span>

            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              periodState.state === "OPEN"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-neutral-800 text-neutral-400 border border-neutral-700"
            }`}>
              {periodState.label}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-jp tracking-tight text-white leading-tight">
            {championship.nome}
          </h2>

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            {championship.descricao}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400 pt-1">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-karate-gold" />
              <span>
                {new Date(championship.dataCampeonato + "T00:00:00").toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric"
                })}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-karate-red" />
              <span className="truncate max-w-[200px]" title={championship.local}>{championship.local}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Inscrição: R$ {championship.valorInscricao.toFixed(2).replace(".", ",")}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
          <Link
            to={`/campeonatos/${championship.slug}`}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-karate-red hover:bg-red-700 text-white rounded-2xl text-xs sm:text-sm font-bold font-jp transition-all shadow-lg hover:shadow-xl text-center"
          >
            <span>Inscrever-se no Campeonato</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to={`/campeonatos/${championship.slug}/consulta`}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 rounded-2xl text-xs font-semibold transition-colors text-center"
          >
            <span>Já me inscrevi / Consultar</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
