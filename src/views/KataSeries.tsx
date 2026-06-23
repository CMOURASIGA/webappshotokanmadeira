import { BookOpen, Target, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export function KataSeries() {
  const navigate = useNavigate();
  const series = [
    {
      name: "Série Heian (平安)",
      meaning: "Paz e Tranquilidade",
      description: "Série de 5 Katas fundamentais desenvolvidos pelo Mestre Itosu. Servem como a fundação do Shotokan, ensinando bases, defesas, socos e chutes progressivamente.",
      katas: ["Heian Shodan", "Heian Nidan", "Heian Sandan", "Heian Yondan", "Heian Godan"]
    },
    {
      name: "Série Tekki (鉄騎)",
      meaning: "Cavaleiro de Ferro",
      description: "Série de 3 Katas executados inteiramente numa linha lateral em base Kiba Dachi. Focam em força, estabilidade e combate em curta distância.",
      katas: ["Tekki Shodan", "Tekki Nidan", "Tekki Sandan"]
    },
    {
      name: "Bassai (抜塞)",
      meaning: "Romper a Fortaleza",
      description: "Katas explosivos e poderosos, caracterizados por mudanças dinâmicas de velocidade e movimentos para 'quebrar' as defesas do oponente.",
      katas: ["Bassai Dai (Maior)", "Bassai Sho (Menor)"]
    },
    {
      name: "Kanku (観空)",
      meaning: "Contemplar o Céu",
      description: "Katas longos e majestosos. O Kanku Dai contém quase todas as técnicas dos Heians. O movimento inicial contempla os céus.",
      katas: ["Kanku Dai (Maior)", "Kanku Sho (Menor)"]
    },
    {
      name: "Katas Avançados Específicos",
      meaning: "Diversos Sentidos",
      description: "Katas superiores com especializações únicas. Incluem Empi (O Voo da Andorinha), Jion (Amor e Gratidão), Gankaku (A Garça Pousada na Pedra), entre outros.",
      katas: [
        "Empi (Voo da Andorinha)", 
        "Jion (Amor e Gratidão)", 
        "Jitte (Dez Mãos)",
        "Hangetsu (Meia Lua)",
        "Gankaku (A Garça Pousada na Pedra)",
        "Unsu (Mãos de Nuvem)",
        "Meikyo (Espelho Limpo)",
        "Sochin (Espírito Inabalável)",
        "Gojushiho Dai/Sho (54 Passos)",
        "Chinte (Mãos Estranhas)",
        "Nijushiho (24 Passos)",
        "Wankan (Coroa Real)"
      ]
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-neutral-500 hover:text-karate-red font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Voltar
      </button>

      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-bold font-jp">Os 26 Katas Shotokan</h2>
        <p className="text-neutral-500 text-lg">A progressão e classificação das formas</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden p-8 md:p-12">
        <p className="text-neutral-700 leading-relaxed text-lg mb-10 text-center max-w-3xl mx-auto">
          O currículo oficial do Karate Shotokan é composto por 26 Katas (além do Taikyoku Shodan, Kata de criação e introdução). 
          Estes são divididos entre formas base e formas avançadas. Cada kata possui sua própria personalidade, ritmo e especialização de técnicas.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {series.map((s, idx) => (
            <div key={idx} className="bg-neutral-50 rounded-xl p-6 border border-neutral-100 hover:border-karate-red/30 transition-colors">
              <h3 className="text-xl font-bold font-jp text-karate-black">{s.name}</h3>
              <p className="text-sm font-bold text-karate-red uppercase tracking-wider mb-3">{s.meaning}</p>
              <p className="text-neutral-600 text-sm mb-4">{s.description}</p>
              
              <div className="flex flex-wrap gap-2 mt-auto">
                {s.katas.map(k => (
                  <span key={k} className="bg-white border border-neutral-200 text-xs px-3 py-1.5 rounded-full text-neutral-700 shadow-sm">
                    {k}
                  </span>
                ))}
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
