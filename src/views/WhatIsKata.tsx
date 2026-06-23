import { BookOpen, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function WhatIsKata() {
  const navigate = useNavigate();
  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-neutral-500 hover:text-karate-red font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar
      </button>

      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-bold font-jp">O que é Kata?</h2>
        <p className="text-neutral-500 text-lg">A essência e a forma do Karate-Do</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden p-8 md:p-12">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-karate-red rounded-full flex items-center justify-center text-white">
            <BookOpen className="w-8 h-8" />
          </div>
        </div>
        
        <div className="space-y-6 text-neutral-700 leading-relaxed text-lg">
          <p>
            <strong className="text-karate-black">Kata (型 ou 形)</strong> significa literalmente "forma". 
            Um kata é nada mais do que movimentos de Karate codificados com esmero, executados na mesma maneira e nas diversas direções. 
            É um Kihon encadeado em várias direções com vários graus de dificuldades. O plano é de enfrentarmos entre 08 a 10 adversários imaginários, na qual se adquire o domínio do corpo, da técnica, da coordenação motora, da postura, do olhar e do espírito.
          </p>

          <p>
            Os "Kata", além de formas de lutas imaginárias, trazem consigo a herança do Karate-Dô. Ao detalhe que é necessário aperfeiçoar um kata, o praticante estuda e cultiva a autodisciplina.
          </p>
          
          <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-100 my-8">
            <h3 className="text-xl font-bold font-jp text-karate-black mb-4">Para que serve o Kata?</h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <span className="text-karate-red font-bold">•</span>
                <span><strong>Treinamento Físico:</strong> Desenvolve base, equilíbrio, força, respiração (Ibuki) e coordenação motora.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-karate-red font-bold">•</span>
                <span><strong>Memória Muscular:</strong> A repetição constante condiciona o corpo a reagir instintivamente em situações reais.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-karate-red font-bold">•</span>
                <span><strong>Estudo do Bunkai:</strong> O Bunkai é a aplicação prática das técnicas do Kata. Onde o observador leigo vê uma dança, o praticante vê bloqueios, chaves, projeções e ataques letais.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-karate-red font-bold">•</span>
                <span><strong>Treinamento Mental:</strong> Exige extrema concentração (Zanshin) e intenção (Kime). Cada movimento deve ser executado com o espírito de um combate real.</span>
              </li>
            </ul>
          </div>

          <p>
            O Mestre Gichin Funakoshi dizia que o Kata é a base do Karate. Sem uma base sólida construída 
            através do estudo profundo dos Katas, o Kumite (combate) se torna apenas uma briga de rua sem propósito.
          </p>

          <p>
            No estilo Shotokan, praticamos oficialmente <strong>26 Katas</strong>, divididos entre formas 
            mais longas, pesadas e estabilizadas (como a série Shorei) e formas mais rápidas, leves e ágeis 
            (como a série Shorin). A jornada começa com os Katas <em>Heian</em> e se aprofunda pelos Katas avançados 
            exigidos para exames de Dan.
          </p>
        </div>
      </div>
    </div>
  );
}
