import { useParams, Link, useNavigate } from "react-router-dom";
import { katas } from "../data/mockData";
import { ArrowLeft, Play, Shield, AlertTriangle } from "lucide-react";

export function KataDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const kata = katas.find(k => k.id === id);

  if (!kata) {
    return <div className="p-8 text-center">Kata não encontrado.</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-neutral-500 hover:text-karate-red font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
        <div className="bg-karate-dark text-white p-8 md:p-12 relative overflow-hidden">
           <div className="absolute right-0 top-0 opacity-10 text-[150px] leading-none font-jp font-black pointer-events-none translate-x-1/4 -translate-y-1/4">
            型
          </div>
          <div className="relative z-10">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider">{kata.group}</span>
              <span className="bg-karate-red px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider">{kata.level}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-jp mb-2">{kata.name}</h1>
            <p className="text-xl text-neutral-300 font-medium">{kata.meaning}</p>
          </div>
        </div>

        <div className="p-6 md:p-8 grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4 font-jp border-b border-neutral-100 pb-2">Sobre o Kata</h2>
              <p className="text-neutral-700 leading-relaxed">{kata.description}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 font-jp border-b border-neutral-100 pb-2 flex items-center gap-2">
                <Shield className="text-karate-red w-6 h-6" />
                Sequência de Movimentos ({kata.movementsCount})
              </h2>
              <div className="bg-neutral-50 rounded-xl p-6">
                <ul className="space-y-3">
                  {kata.movements.map((mov, i) => (
                    <li key={i} className="flex gap-4 items-start text-neutral-700">
                      <span className="text-karate-red font-bold text-sm min-w-[24px] mt-0.5">{i+1}.</span>
                      <span className="leading-snug">{mov.replace(/^\d+\.\s*/, '')}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 font-jp border-b border-neutral-100 pb-2 flex items-center gap-2">
                <AlertTriangle className="text-karate-gold w-6 h-6" />
                Bunkai (Aplicação)
              </h2>
              <p className="text-neutral-700 leading-relaxed bg-karate-gold/10 p-5 rounded-xl border border-karate-gold/20">
                {kata.bunkai}
              </p>
            </section>
          </div>

          <div className="space-y-6">
            <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-100">
              <h3 className="font-bold text-lg mb-4 text-karate-black">Técnicas Principais</h3>
              <div className="flex flex-wrap gap-2">
                {kata.mainTechniques.map(tech => (
                  <span key={tech} className="bg-white border border-neutral-200 text-neutral-700 text-sm px-3 py-1.5 rounded-full shadow-sm hover:border-karate-red hover:text-karate-red transition-colors cursor-pointer">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {kata.attentionPoints.length > 0 && (
              <div className="bg-karate-red/5 p-6 rounded-xl border border-karate-red/10">
                <h3 className="font-bold text-lg mb-3 text-karate-red">Pontos de Atenção</h3>
                <ul className="list-disc list-inside space-y-2 text-sm text-neutral-700">
                  {kata.attentionPoints.map((pt, i) => <li key={i}>{pt}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
