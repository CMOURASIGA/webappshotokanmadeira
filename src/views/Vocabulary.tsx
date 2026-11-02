import { Volume2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage, type Language } from "../i18n/LanguageContext";

type VocabItem = { jp: string; pt: string; en: string; ja: string };

const sections: Array<{ key: "vocab.general" | "vocab.commands" | "vocab.numbers"; items: VocabItem[] }> = [
  {
    key: "vocab.general",
    items: [
      { jp: "Karate", pt: "Mãos vazias (Kara = vazio, Te = mão)", en: "Empty hands (Kara = empty, Te = hand)", ja: "空手。Kara は「空」、Te は「手」" },
      { jp: "Do", pt: "Caminho, no sentido filosófico", en: "The Way, in the philosophical sense", ja: "道。生き方や修行の道を表す" },
      { jp: "Dojo", pt: "Local de treinamento, lugar do caminho", en: "Training place, the place of the Way", ja: "道場。稽古を行う場所" },
      { jp: "Sensei", pt: "Professor, mestre", en: "Teacher, instructor", ja: "先生。指導者" },
      { jp: "Sempai", pt: "Aluno mais graduado ou veterano", en: "Senior student or practitioner", ja: "先輩。経験・在籍年数が上の人" },
      { jp: "Kohai", pt: "Aluno menos graduado ou mais novo na prática", en: "Junior student or practitioner", ja: "後輩。経験・在籍年数が下の人" },
      { jp: "Gi / Karate-gi", pt: "Uniforme de treinamento", en: "Training uniform", ja: "空手着。稽古用の道着" },
      { jp: "Obi", pt: "Faixa", en: "Belt", ja: "帯" },
      { jp: "Kiai", pt: "Expressão vocal associada à concentração de energia e intenção", en: "Vocal expression associated with focused energy and intent", ja: "気合。気力と意図を集中させる発声" },
      { jp: "Osu / Oss", pt: "Expressão usada em alguns dojos como saudação e sinal de perseverança", en: "Expression used in some dojos as a greeting and sign of perseverance", ja: "一部の道場で挨拶や忍耐を示す言葉として用いられる表現" }
    ]
  },
  {
    key: "vocab.commands",
    items: [
      { jp: "Yoi", pt: "Preparar", en: "Ready / prepare", ja: "用意。準備" },
      { jp: "Hajime", pt: "Começar", en: "Begin", ja: "始め。開始" },
      { jp: "Yame", pt: "Parar", en: "Stop", ja: "止め。停止" },
      { jp: "Mawatte", pt: "Virar, dar meia-volta", en: "Turn around", ja: "回って。方向転換" },
      { jp: "Naore", pt: "Retornar à posição inicial", en: "Return to the original position", ja: "直れ。元の姿勢に戻る" },
      { jp: "Yasume", pt: "Descansar", en: "Rest", ja: "休め。休息姿勢" },
      { jp: "Seiza", pt: "Sentar-se formalmente de joelhos", en: "Formal kneeling position", ja: "正座" },
      { jp: "Rei", pt: "Cumprimento, reverência", en: "Bow / salutation", ja: "礼。お辞儀・礼法" },
      { jp: "Kamaete", pt: "Assumir posição de guarda", en: "Assume a ready/guard position", ja: "構えて。構えを取る" }
    ]
  },
  {
    key: "vocab.numbers",
    items: [
      { jp: "Ichi", pt: "Um", en: "One", ja: "一" },
      { jp: "Ni", pt: "Dois", en: "Two", ja: "二" },
      { jp: "San", pt: "Três", en: "Three", ja: "三" },
      { jp: "Shi / Yon", pt: "Quatro", en: "Four", ja: "四" },
      { jp: "Go", pt: "Cinco", en: "Five", ja: "五" },
      { jp: "Roku", pt: "Seis", en: "Six", ja: "六" },
      { jp: "Shichi / Nana", pt: "Sete", en: "Seven", ja: "七" },
      { jp: "Hachi", pt: "Oito", en: "Eight", ja: "八" },
      { jp: "Kyu", pt: "Nove", en: "Nine", ja: "九" },
      { jp: "Ju", pt: "Dez", en: "Ten", ja: "十" }
    ]
  }
];

export function Vocabulary() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-neutral-500 hover:text-karate-red font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> {t("common.back")}
      </button>

      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-bold font-jp">{t("vocab.title")}</h2>
        <p className="text-neutral-500 text-lg">{t("vocab.subtitle")}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-8 md:p-12">
        <p className="text-neutral-700 leading-relaxed text-lg mb-10 text-center max-w-2xl mx-auto">
          {t("vocab.intro")}
        </p>

        <div className="space-y-12">
          {sections.map((section) => (
            <div key={section.key}>
              <h3 className="text-2xl font-bold font-jp border-b-2 border-karate-red pb-2 mb-6 flex items-center gap-2">
                <Volume2 className="text-karate-red w-6 h-6" />
                {t(section.key)}
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                {section.items.map((item) => (
                  <div key={item.jp} className="flex flex-col bg-neutral-50 p-4 rounded-xl border border-neutral-100 hover:border-karate-red/30 transition-colors">
                    <span className="font-bold text-lg font-jp text-karate-black">{item.jp}</span>
                    <span className="text-sm text-neutral-600 mt-1">{item[language as Language]}</span>
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
