import { Shield, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function DojoKun() {
  const navigate = useNavigate();
  const dojoKun = [
    { jp: "一、人格完成に努むること", romaji: "Hitotsu! Jinkaku kansei ni tsutomuru koto.", pt: "Esforçar-se para a formação do caráter." },
    { jp: "一、誠の道を守ること", romaji: "Hitotsu! Makoto no michi o mamoru koto.", pt: "Fidelidade para com o verdadeiro caminho da razão." },
    { jp: "一、努力の精神を養うこと", romaji: "Hitotsu! Doryoku no seishin o yashinau koto.", pt: "Criar o intuito de esforço." },
    { jp: "一、礼儀を重んずること", romaji: "Hitotsu! Reigi o omonzuru koto.", pt: "Respeito acima de tudo." },
    { jp: "一、血気の勇を戒むること", romaji: "Hitotsu! Kekki no yu o imashimuru koto.", pt: "Conter o espírito de agressão." }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-neutral-500 hover:text-karate-red font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar
      </button>

      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-bold font-jp">Dojo Kun</h2>
        <p className="text-neutral-500 text-lg">Os Cinco Mandamentos do Karate</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden p-8 md:p-12">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-karate-red rounded-full flex items-center justify-center text-white">
            <Shield className="w-8 h-8" />
          </div>
        </div>
        
        <p className="text-neutral-700 leading-relaxed text-lg mb-12 text-center max-w-2xl mx-auto">
          O Dojo Kun é o conjunto de regras e princípios que norteiam a prática do Karate-Do. 
          Criado pelo Mestre Gichin Funakoshi, ele não é apenas recitado ao final de cada treino, 
          mas deve ser vivido e aplicado no dia a dia do praticante.
        </p>

        <div className="space-y-8">
          {dojoKun.map((item, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-4 items-center md:items-start text-center md:text-left bg-neutral-50 p-6 rounded-xl border border-neutral-100">
              <div className="text-4xl font-serif text-karate-red font-bold">
                {index + 1}
              </div>
              <div className="flex-1 space-y-2">
                <p className="text-2xl font-bold font-jp text-karate-black">{item.jp}</p>
                <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest">{item.romaji}</p>
                <p className="text-lg text-neutral-700 italic border-t border-neutral-200 pt-2 mt-2">"{item.pt}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
