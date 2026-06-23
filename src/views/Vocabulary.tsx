import { Book, Volume2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function Vocabulary() {
  const navigate = useNavigate();
  const dictionary = [
    { category: "Termos Gerais", items: [
      { jp: "Karate", pt: "Mãos vazias (Kara = vazio, Te = mão)" },
      { jp: "Do", pt: "Caminho (filosófico)" },
      { jp: "Dojo", pt: "Local de treinamento (Lugar do caminho)" },
      { jp: "Sensei", pt: "Professor, Mestre" },
      { jp: "Sempai", pt: "Aluno mais graduado / Veterano" },
      { jp: "Kohai", pt: "Aluno menos graduado / Calouro" },
      { jp: "Gi / Karate-gi", pt: "Uniforme de treinamento" },
      { jp: "Obi", pt: "Faixa" },
      { jp: "Kiai", pt: "Grito ou liberação de energia (Ki = energia, Ai = união)" },
      { jp: "Osu / Oss", pt: "Cumprimento de respeito, perseverança e paciência" }
    ]},
    { category: "Comandos (Avisos)", items: [
      { jp: "Yoi", pt: "Atenção / Preparar" },
      { jp: "Hajime", pt: "Começar" },
      { jp: "Yame", pt: "Parar" },
      { jp: "Mawatte", pt: "Virar / Meia volta" },
      { jp: "Naore", pt: "Retornar à posição inicial (relaxar)" },
      { jp: "Yasume", pt: "Descansar (em posição de respeito)" },
      { jp: "Seiza", pt: "Sentar-se de joelhos" },
      { jp: "Rei", pt: "Cumprimentar (reverência)" },
      { jp: "Kamaete", pt: "Assumir posição de guarda/luta" }
    ]},
    { category: "Números (Contagem)", items: [
      { jp: "Ichi", pt: "Um" },
      { jp: "Ni", pt: "Dois" },
      { jp: "San", pt: "Três" },
      { jp: "Shi / Yon", pt: "Quatro" },
      { jp: "Go", pt: "Cinco" },
      { jp: "Roku", pt: "Seis" },
      { jp: "Shichi / Nana", pt: "Sete" },
      { jp: "Hachi", pt: "Oito" },
      { jp: "Kyu", pt: "Nove" },
      { jp: "Ju", pt: "Dez" }
    ]}
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
        <h2 className="text-4xl md:text-5xl font-bold font-jp">Vocabulário</h2>
        <p className="text-neutral-500 text-lg">Terminologia essencial do Karate Shotokan</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-8 md:p-12">
        <p className="text-neutral-700 leading-relaxed text-lg mb-10 text-center max-w-2xl mx-auto">
          Compreender a terminologia japonesa é fundamental para o treinamento. 
          Os termos conectam o praticante às raízes tradicionais da arte marcial.
        </p>

        <div className="space-y-12">
          {dictionary.map((section, idx) => (
            <div key={idx}>
              <h3 className="text-2xl font-bold font-jp border-b-2 border-karate-red pb-2 mb-6 flex items-center gap-2">
                <Volume2 className="text-karate-red w-6 h-6" />
                {section.category}
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                {section.items.map((item, i) => (
                  <div key={i} className="flex flex-col bg-neutral-50 p-4 rounded-xl border border-neutral-100 hover:border-karate-red/30 transition-colors">
                    <span className="font-bold text-lg font-jp text-karate-black">{item.jp}</span>
                    <span className="text-sm text-neutral-600 mt-1">{item.pt}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
