import { Link } from "react-router-dom";
import { Shield, ArrowRight, Quote, ScrollText } from "lucide-react";

export function DojoKunSection() {
  const dojoKunItems = [
    {
      number: "一",
      numeral: "1",
      jp: "人格完成に努むること",
      romaji: "Hitotsu! Jinkaku kansei ni tsutomuru koto.",
      pt: "Esforçar-se para a formação do caráter.",
      insight: "O objetivo máximo do Karate não é a vitória sobre o oponente, mas o aperfeiçoamento moral de si mesmo."
    },
    {
      number: "一",
      numeral: "2",
      jp: "誠の道を守ること",
      romaji: "Hitotsu! Makoto no michi o mamoru koto.",
      pt: "Fidelidade para com o verdadeiro caminho da razão.",
      insight: "Agir com sinceridade, integridade e retidão de conduta dentro e fora do tatame."
    },
    {
      number: "一",
      numeral: "3",
      jp: "努力の精神を養うこと",
      romaji: "Hitotsu! Doryoku no seishin o yashinau koto.",
      pt: "Criar o intuito de esforço.",
      insight: "A dedicação contínua e a perseverança transformam repetições exaustivas em mestria."
    },
    {
      number: "一",
      numeral: "4",
      jp: "礼儀を重んずること",
      romaji: "Hitotsu! Reigi o omonzuru koto.",
      pt: "Respeito acima de tudo.",
      insight: "O Karate-Do começa com uma saudação (Rei) e termina com respeito a mestres, colegas e à vida."
    },
    {
      number: "一",
      numeral: "5",
      jp: "血気の勇を戒むること",
      romaji: "Hitotsu! Kekki no yu o imashimuru koto.",
      pt: "Conter o espírito de agressão.",
      insight: "A verdadeira coragem reside no autocontrole e na serenidade de não ceder à violência desmedida."
    }
  ];

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-neutral-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-karate-red font-bold text-xs uppercase tracking-wider mb-1">
            <ScrollText className="w-4 h-4" />
            <span>Código de Ética Marcial</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-jp tracking-tight text-neutral-900">
            Dojo Kun: Os 5 Preceitos Sagrados
          </h2>
          <p className="text-sm text-neutral-600 mt-0.5">
            Recitados ao final de cada treino no Madeira Karate, os princípios transmitidos por Gichin Funakoshi guiam a formação do praticante.
          </p>
        </div>

        <Link
          to="/dojo-kun"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-karate-red hover:text-red-700 transition-colors shrink-0 group"
        >
          <span>Estudar Dojo Kun e Niju Kun</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* 5 Principles Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {dojoKunItems.map((item) => (
          <div
            key={item.numeral}
            className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm flex flex-col justify-between hover:border-karate-gold/60 transition-all group"
          >
            <div>
              {/* Header with Kanji Number */}
              <div className="flex items-center justify-between mb-3 border-b border-neutral-100 pb-2">
                <span className="w-8 h-8 rounded-lg bg-neutral-900 text-karate-gold flex items-center justify-center font-jp font-bold text-sm">
                  {item.number}
                </span>
                <span className="text-xs font-mono font-bold text-neutral-600">
                  Preceito {item.numeral}
                </span>
              </div>

              {/* Japanese Kanji & Romaji */}
              <p className="text-xs font-jp text-neutral-600 line-clamp-1 mb-1 font-semibold">
                {item.jp}
              </p>
              <p className="text-[11px] font-mono text-neutral-600 italic mb-2 line-clamp-1">
                {item.romaji}
              </p>

              {/* Portuguese Core Teaching */}
              <h3 className="font-bold text-sm sm:text-base text-neutral-900 leading-snug group-hover:text-karate-red transition-colors">
                {item.pt}
              </h3>
            </div>

            {/* Daily life insight */}
            <div className="pt-3 mt-3 border-t border-neutral-100">
              <p className="text-[11px] text-neutral-600 leading-relaxed">
                {item.insight}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quote Banner */}
      <div className="bg-neutral-950 text-white rounded-2xl p-6 sm:p-8 border border-neutral-800 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-karate-red/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-start gap-4 relative z-10 max-w-2xl">
          <Quote className="w-8 h-8 text-karate-gold shrink-0 mt-1 opacity-80" />
          <div className="space-y-1">
            <p className="text-sm sm:text-base text-neutral-200 italic font-serif leading-relaxed">
              "Karate wa rei ni hajimari, rei ni owaru koto wo wasuruna."
              <br />
              <strong className="text-white font-sans not-italic text-sm">
                (O Karate começa e termina com respeito. Nunca se esqueça disso.)
              </strong>
            </p>
            <p className="text-xs text-neutral-400 font-mono pt-1">
              — Mestre Gichin Funakoshi, Fundador do Shotokan
            </p>
          </div>
        </div>

        <Link
          to="/history"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs sm:text-sm font-bold border border-neutral-700/80 transition-colors shrink-0 relative z-10"
        >
          <span>Conhecer a História do Shotokan</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
