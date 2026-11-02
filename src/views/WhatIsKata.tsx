import { BookOpen, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../i18n/LanguageContext";

const contentByLanguage = {
  pt: {
    title: "O que é Kata?",
    subtitle: "A essência e a forma do Karate-Do",
    intro: "Kata (型 ou 形) significa literalmente forma. Um Kata é uma sequência codificada de técnicas de Karate executadas em ordem e direções definidas. Pode ser entendido como Kihon encadeado, com mudanças de direção e diferentes graus de dificuldade. Na prática, o karateca trabalha como se enfrentasse vários adversários imaginários, desenvolvendo domínio corporal, técnica, coordenação motora, postura, olhar e espírito.",
    heritage: "Além de representar situações de combate imaginário, os Kata preservam e transmitem a herança técnica do Karate-Do. O aperfeiçoamento de um Kata exige repetição, atenção aos detalhes e autodisciplina.",
    purpose: "Para que serve o Kata?",
    physicalTitle: "Treinamento Físico",
    physical: "Desenvolve base, equilíbrio, força, respiração e coordenação motora.",
    muscleTitle: "Memória Motora",
    muscle: "A repetição constante ajuda o corpo a executar os movimentos com maior precisão e naturalidade.",
    bunkaiTitle: "Estudo do Bunkai",
    bunkai: "Bunkai é o estudo da aplicação das técnicas presentes no Kata, relacionando movimentos formais a situações práticas de defesa e contra-ataque.",
    mentalTitle: "Treinamento Mental",
    mental: "Exige concentração, Zanshin e Kime. Cada movimento deve ser executado com intenção, controle e consciência.",
    funakoshi: "Na tradição Shotokan, o estudo de Kata é uma base essencial do Karate e complementa o desenvolvimento do Kihon e do Kumite.",
    shotokan: "No Shotokan, o currículo tradicional inclui 26 Kata amplamente associados à prática JKA. O estudo normalmente começa pelos Heian e progride para formas mais avançadas conforme a graduação e a orientação técnica."
  },
  en: {
    title: "What is Kata?",
    subtitle: "The essence and form of Karate-Do",
    intro: "Kata (型 or 形) literally means form. A Kata is a codified sequence of Karate techniques performed in a defined order and directions. It can be understood as connected Kihon with changes of direction and different levels of difficulty. In practice, the karateka works as if facing several imaginary opponents, developing body control, technique, coordination, posture, visual focus and spirit.",
    heritage: "Beyond representing imagined combat situations, Kata preserve and transmit the technical heritage of Karate-Do. Refining a Kata requires repetition, attention to detail and self-discipline.",
    purpose: "What is Kata for?",
    physicalTitle: "Physical Training",
    physical: "Develops stance, balance, strength, breathing and motor coordination.",
    muscleTitle: "Motor Memory",
    muscle: "Consistent repetition helps the body execute movements with greater precision and naturalness.",
    bunkaiTitle: "Study of Bunkai",
    bunkai: "Bunkai is the study of the applications contained in Kata, relating formal movements to practical situations of defense and counterattack.",
    mentalTitle: "Mental Training",
    mental: "Requires concentration, Zanshin and Kime. Each movement should be performed with intention, control and awareness.",
    funakoshi: "In the Shotokan tradition, the study of Kata is an essential foundation of Karate and complements the development of Kihon and Kumite.",
    shotokan: "In Shotokan, the traditional curriculum includes 26 Kata widely associated with JKA practice. Study commonly begins with the Heian series and progresses to more advanced forms according to grade and technical guidance."
  },
  ja: {
    title: "形とは？",
    subtitle: "Karate-Do における形の本質",
    intro: "形（Kata、型または形）とは、空手の技を一定の順序と方向に組み合わせた体系的な稽古法です。方向転換や難易度の変化を含む、連続した基本（Kihon）として捉えることもできます。複数の仮想の相手を想定しながら、身体操作、技術、運動協調、姿勢、目付け、精神を養います。",
    heritage: "形は仮想の攻防を表すだけでなく、Karate-Do の技術的な伝統を保存し、次世代へ伝える役割も持っています。形を磨くには、反復、細部への注意、そして自己規律が必要です。",
    purpose: "形を稽古する目的",
    physicalTitle: "身体的な鍛錬",
    physical: "立ち方、バランス、力、呼吸、運動協調を養います。",
    muscleTitle: "動作の定着",
    muscle: "反復稽古によって、より正確で自然な動作を身につけます。",
    bunkaiTitle: "分解（Bunkai）の研究",
    bunkai: "Bunkai は、形に含まれる技の用法を研究し、形式的な動作と実際の防御・反撃の考え方を結び付けるものです。",
    mentalTitle: "精神的な鍛錬",
    mental: "集中力、残心（Zanshin）、極め（Kime）が求められます。一つ一つの動作を意図、制御、意識を持って行います。",
    funakoshi: "Shotokan の伝統では、形の稽古は空手の重要な基礎であり、基本（Kihon）と組手（Kumite）の修練を補完します。",
    shotokan: "Shotokan では、JKA の稽古と広く結び付けられている伝統的な26の形があります。通常は平安（Heian）から学び始め、級・段位と指導に応じて高度な形へ進みます。"
  }
} as const;

export function WhatIsKata() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const copy = contentByLanguage[language];

  const topics = [
    [copy.physicalTitle, copy.physical],
    [copy.muscleTitle, copy.muscle],
    [copy.bunkaiTitle, copy.bunkai],
    [copy.mentalTitle, copy.mental]
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-neutral-500 hover:text-karate-red font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> {t("common.back")}
      </button>

      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-bold font-jp">{copy.title}</h2>
        <p className="text-neutral-500 text-lg">{copy.subtitle}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden p-8 md:p-12">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-karate-red rounded-full flex items-center justify-center text-white">
            <BookOpen className="w-8 h-8" />
          </div>
        </div>

        <div className="space-y-6 text-neutral-700 leading-relaxed text-lg">
          <p>{copy.intro}</p>
          <p>{copy.heritage}</p>

          <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-100 my-8">
            <h3 className="text-xl font-bold font-jp text-karate-black mb-4">{copy.purpose}</h3>
            <ul className="space-y-4">
              {topics.map(([title, text]) => (
                <li key={title} className="flex gap-3">
                  <span className="text-karate-red font-bold">•</span>
                  <span><strong>{title}:</strong> {text}</span>
                </li>
              ))}
            </ul>
          </div>

          <p>{copy.funakoshi}</p>
          <p>{copy.shotokan}</p>
        </div>
      </div>
    </div>
  );
}
