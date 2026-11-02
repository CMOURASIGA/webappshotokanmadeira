import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";

const seriesByLanguage = {
  pt: [
    { name: "Série Heian (平安)", meaning: "Paz e Tranquilidade", description: "Série de 5 Katas fundamentais associados ao trabalho de Mestre Itosu. Formam uma base importante do Shotokan, desenvolvendo posturas, defesas, ataques e deslocamentos progressivamente.", katas: ["Heian Shodan", "Heian Nidan", "Heian Sandan", "Heian Yondan", "Heian Godan"] },
    { name: "Série Tekki (鉄騎)", meaning: "Cavaleiro de Ferro", description: "Série de 3 Katas caracterizada pelo deslocamento lateral e pelo uso marcante de Kiba Dachi. Trabalha estabilidade, força e ações em curta distância.", katas: ["Tekki Shodan", "Tekki Nidan", "Tekki Sandan"] },
    { name: "Bassai (抜塞)", meaning: "Romper a Fortaleza", description: "Família de Katas marcada por ações vigorosas, mudanças de ritmo e transições fortes.", katas: ["Bassai Dai", "Bassai Sho"] },
    { name: "Kanku (観空)", meaning: "Contemplar o Céu", description: "Kanku Dai e Kanku Sho apresentam sequências extensas e variadas. O gesto inicial de Kanku Dai é uma de suas características mais reconhecidas.", katas: ["Kanku Dai", "Kanku Sho"] },
    { name: "Outros Katas Avançados", meaning: "Características diversas", description: "O repertório avançado reúne Katas com ritmos, princípios técnicos e características próprias.", katas: ["Empi", "Jion", "Jitte", "Hangetsu", "Gankaku", "Unsu", "Meikyo", "Sochin", "Gojushiho Dai", "Gojushiho Sho", "Chinte", "Nijushiho", "Wankan"] }
  ],
  en: [
    { name: "Heian Series (平安)", meaning: "Peace and Tranquility", description: "A series of five fundamental Kata associated with Master Itosu's work. They form an important Shotokan foundation, progressively developing stances, defenses, attacks and movement.", katas: ["Heian Shodan", "Heian Nidan", "Heian Sandan", "Heian Yondan", "Heian Godan"] },
    { name: "Tekki Series (鉄騎)", meaning: "Iron Horse", description: "A series of three Kata characterized by lateral movement and prominent use of Kiba Dachi. They develop stability, strength and close-range actions.", katas: ["Tekki Shodan", "Tekki Nidan", "Tekki Sandan"] },
    { name: "Bassai (抜塞)", meaning: "To Penetrate a Fortress", description: "A family of Kata marked by vigorous actions, changes of rhythm and strong transitions.", katas: ["Bassai Dai", "Bassai Sho"] },
    { name: "Kanku (観空)", meaning: "To View the Sky", description: "Kanku Dai and Kanku Sho contain long and varied sequences. The opening gesture of Kanku Dai is one of its most recognizable characteristics.", katas: ["Kanku Dai", "Kanku Sho"] },
    { name: "Other Advanced Kata", meaning: "Distinct characteristics", description: "The advanced repertoire includes Kata with their own rhythm, technical principles and distinctive characteristics.", katas: ["Empi", "Jion", "Jitte", "Hangetsu", "Gankaku", "Unsu", "Meikyo", "Sochin", "Gojushiho Dai", "Gojushiho Sho", "Chinte", "Nijushiho", "Wankan"] }
  ],
  ja: [
    { name: "平安シリーズ", meaning: "平安", description: "糸洲安恒師の系譜に関係する五つの基本形です。Shotokan の重要な基礎として、立ち方、受け、攻撃、移動を段階的に学びます。", katas: ["Heian Shodan", "Heian Nidan", "Heian Sandan", "Heian Yondan", "Heian Godan"] },
    { name: "鉄騎シリーズ", meaning: "鉄騎", description: "横方向の演武線と騎馬立ちを特徴とする三つの形です。安定性、力、近い間合いでの動作を養います。", katas: ["Tekki Shodan", "Tekki Nidan", "Tekki Sandan"] },
    { name: "抜塞 (Bassai)", meaning: "抜塞", description: "力強い動作、緩急、強い転換を特徴とする形の系列です。", katas: ["Bassai Dai", "Bassai Sho"] },
    { name: "観空 (Kanku)", meaning: "空を観る", description: "Kanku Dai と Kanku Sho は長く多様な動作を含みます。Kanku Dai の冒頭動作は特に知られています。", katas: ["Kanku Dai", "Kanku Sho"] },
    { name: "その他の上級形", meaning: "多様な特徴", description: "上級の形には、それぞれ異なるリズム、技術原理、特徴があります。", katas: ["Empi", "Jion", "Jitte", "Hangetsu", "Gankaku", "Unsu", "Meikyo", "Sochin", "Gojushiho Dai", "Gojushiho Sho", "Chinte", "Nijushiho", "Wankan"] }
  ]
} as const;

export function KataSeries() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const copy = language === "en"
    ? { title: "Shotokan Kata Groups", subtitle: "Progression and organization of forms", intro: "Shotokan training includes a broad repertoire of Kata, from foundational forms to advanced practice. Each Kata has its own rhythm, technical emphasis and training purpose." }
    : language === "ja"
    ? { title: "Shotokan の形", subtitle: "形の段階と分類", intro: "Shotokan には、基本から上級まで幅広い形があります。それぞれの形には固有のリズム、技術的な重点、稽古上の目的があります。" }
    : { title: "Katas do Shotokan", subtitle: "A progressão e classificação das formas", intro: "O treinamento Shotokan reúne um repertório amplo de Katas, das formas fundamentais às práticas avançadas. Cada Kata possui ritmo, ênfase técnica e objetivos de treinamento próprios." };

  const series = seriesByLanguage[language];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-neutral-500 hover:text-karate-red font-medium transition-colors">
        <ArrowLeft className="w-4 h-4" /> {t("common.back")}
      </button>

      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-bold font-jp">{copy.title}</h2>
        <p className="text-neutral-500 text-lg">{copy.subtitle}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden p-8 md:p-12">
        <p className="text-neutral-700 leading-relaxed text-lg mb-10 text-center max-w-3xl mx-auto">{copy.intro}</p>
        <div className="grid md:grid-cols-2 gap-8">
          {series.map((s) => (
            <div key={s.name} className="bg-neutral-50 rounded-xl p-6 border border-neutral-100 hover:border-karate-red/30 transition-colors">
              <h3 className="text-xl font-bold font-jp text-karate-black">{s.name}</h3>
              <p className="text-sm font-bold text-karate-red uppercase tracking-wider mb-3">{s.meaning}</p>
              <p className="text-neutral-600 text-sm mb-4">{s.description}</p>
              <div className="flex flex-wrap gap-2 mt-auto">
                {s.katas.map(k => <span key={k} className="bg-white border border-neutral-200 text-xs px-3 py-1.5 rounded-full text-neutral-700 shadow-sm">{k}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
