import { Link } from "react-router-dom";
import { Shield, ArrowRight, Quote, ScrollText } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext";

export function DojoKunSection() {
  const { language } = useLanguage();
  const copy = language === "en"
    ? { ethics: "Martial Ethics", title: "Dojo Kun: Five Core Precepts", intro: "Recited at the end of training, these principles associated with Gichin Funakoshi guide the practitioner's conduct.", study: "Study Dojo Kun and Niju Kun", precept: "Precept", quote: "Karate begins and ends with respect. Never forget this.", founder: "Master Gichin Funakoshi, founder of Shotokan", history: "Learn the History of Shotokan" }
    : language === "ja"
    ? { ethics: "武道の倫理", title: "道場訓 五つの心得", intro: "稽古の終わりに唱える道場訓は、船越義珍師範の教えに基づき、日々の行動を導く心得です。", study: "道場訓と二十訓を学ぶ", precept: "心得", quote: "空手は礼に始まり礼に終る。", founder: "Shotokan を築いた船越義珍師範", history: "Shotokan の歴史を学ぶ" }
    : { ethics: "Código de Ética Marcial", title: "Dojo Kun: Os 5 Preceitos", intro: "Recitados ao final de cada treino, os princípios associados a Gichin Funakoshi orientam a formação e a conduta do praticante.", study: "Estudar Dojo Kun e Niju Kun", precept: "Preceito", quote: "O Karate começa e termina com respeito. Nunca se esqueça disso.", founder: "Mestre Gichin Funakoshi, fundador do Shotokan", history: "Conhecer a História do Shotokan" };
  const dojoKunItems = [
    {
      number: "一", numeral: "1", jp: "人格完成に努むること",
      romaji: "Hitotsu! Jinkaku kansei ni tsutomuru koto.",
      pt: "Esforçar-se para a formação do caráter.",
      en: "Seek perfection of character.",
      ja: "人格完成に努むること。",
      insightPt: "O aperfeiçoamento do caráter é parte central da prática, além do desenvolvimento técnico.",
      insightEn: "The development of character is central to practice, beyond technical improvement.",
      insightJa: "技術の向上だけでなく、人格を磨くことも稽古の大切な目的です。"
    },
    {
      number: "一", numeral: "2", jp: "誠の道を守ること",
      romaji: "Hitotsu! Makoto no michi o mamoru koto.",
      pt: "Ser fiel ao caminho da sinceridade.",
      en: "Be faithful to the path of sincerity.",
      ja: "誠の道を守ること。",
      insightPt: "A sinceridade e a integridade devem orientar a conduta dentro e fora do Dojo.",
      insightEn: "Sincerity and integrity should guide conduct inside and outside the Dojo.",
      insightJa: "誠実さと正しい行いを、道場の内外で大切にします。"
    },
    {
      number: "一", numeral: "3", jp: "努力の精神を養うこと",
      romaji: "Hitotsu! Doryoku no seishin o yashinau koto.",
      pt: "Cultivar o espírito de esforço.",
      en: "Cultivate a spirit of effort.",
      ja: "努力の精神を養うこと。",
      insightPt: "A evolução vem da prática constante, da perseverança e da atenção aos detalhes.",
      insightEn: "Progress comes from consistent practice, perseverance and attention to detail.",
      insightJa: "継続した稽古、忍耐、細部への注意が上達につながります。"
    },
    {
      number: "一", numeral: "4", jp: "礼儀を重んずること",
      romaji: "Hitotsu! Reigi o omonzuru koto.",
      pt: "Respeitar a etiqueta e a cortesia.",
      en: "Respect etiquette and courtesy.",
      ja: "礼儀を重んずること。",
      insightPt: "Rei expressa respeito pelo Sensei, pelos colegas, pelo Dojo e pela tradição.",
      insightEn: "Rei expresses respect for the Sensei, fellow practitioners, the Dojo and tradition.",
      insightJa: "礼は、先生、仲間、道場、そして伝統への敬意を表します。"
    },
    {
      number: "一", numeral: "5", jp: "血気の勇を戒むること",
      romaji: "Hitotsu! Kekki no yu o imashimuru koto.",
      pt: "Conter a impulsividade e a agressividade.",
      en: "Guard against reckless courage and aggression.",
      ja: "血気の勇を戒むること。",
      insightPt: "O autocontrole é essencial para que a força e a técnica sejam usadas com responsabilidade.",
      insightEn: "Self-control is essential so that strength and technique are used responsibly.",
      insightJa: "力と技を責任を持って使うために、自制心を大切にします。"
    }
  ].map(item => ({
    ...item,
    teaching: language === "en" ? item.en : language === "ja" ? item.ja : item.pt,
    insight: language === "en" ? item.insightEn : language === "ja" ? item.insightJa : item.insightPt
  }));

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-neutral-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-karate-red font-bold text-xs uppercase tracking-wider mb-1">
            <ScrollText className="w-4 h-4" />
            <span>{copy.ethics}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-jp tracking-tight text-neutral-900">
            {copy.title}
          </h2>
          <p className="text-sm text-neutral-600 mt-0.5">
            {copy.intro}
          </p>
        </div>

        <Link
          to="/dojo-kun"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-karate-red hover:text-red-700 transition-colors shrink-0 group"
        >
          <span>{copy.study}</span>
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
                  {copy.precept} {item.numeral}
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
                {item.teaching}
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
                ({copy.quote})
              </strong>
            </p>
            <p className="text-xs text-neutral-400 font-mono pt-1">
              — {copy.founder}
            </p>
          </div>
        </div>

        <Link
          to="/history"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs sm:text-sm font-bold border border-neutral-700/80 transition-colors shrink-0 relative z-10"
        >
          <span>{copy.history}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
