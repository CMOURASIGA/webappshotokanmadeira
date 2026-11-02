import { Shield, ArrowLeft, ScrollText, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAppData } from "../contexts/AppDataContext";
import { useLanguage } from "../i18n/LanguageContext";

const copyByLanguage = {
  pt: {
    title: "Princípios e Rituais",
    subtitle: "A filosofia que guia o Karate-Do JKA",
    reigi: "Reigi (Etiqueta)",
    dojoIntro: "O Dojo Kun reúne princípios que orientam a prática do Karate-Do. Mais do que uma recitação ao final do treino, ele deve orientar a conduta diária do praticante.",
    nijuSubtitle: "Preceitos de Gichin Funakoshi (seleção)",
    reigiSubtitle: "Rituais e comportamento dentro do Dojo",
    seizaTitle: "Seiza & Mokuso",
    seiza: "Seiza é a postura formal japonesa de sentar-se sobre os calcanhares, com a coluna ereta e os ombros relaxados.",
    mokuso: "Mokuso é um momento de concentração realizado no início e no fim do treino. Ao comando, o praticante acalma a respiração e direciona a atenção para a prática.",
    greetings: "Cumprimentos (Rei)",
    shomen: "Cumprimento à frente do Dojo, expressando respeito à tradição.",
    sensei: "Cumprimento ao Sensei que conduz a aula.",
    otagai: "Cumprimento mútuo entre os praticantes.",
    obiTitle: "Como amarrar a faixa (Obi)",
    obi: "Amarrar corretamente o Obi faz parte da apresentação e da disciplina no Dojo. O nó deve ficar firme e as pontas equilibradas.",
    osuTitle: "Sobre o uso de Osu",
    osu: "Osu, também grafado Oss em alguns contextos, é uma expressão usada em muitos dojos como saudação, confirmação ou manifestação de perseverança. O uso varia entre organizações e tradições.",
    golden: "Regras de Ouro",
    rules: ["Cumprimente ao entrar e sair da área de treino.", "Mantenha o Karate-gi limpo e as unhas curtas.", "Mantenha atenção durante as explicações do Sensei.", "Use o conhecimento do Karate com responsabilidade dentro e fora do Dojo."]
  },
  en: {
    title: "Principles and Rituals",
    subtitle: "The philosophy guiding JKA Karate-Do",
    reigi: "Reigi (Etiquette)",
    dojoIntro: "Dojo Kun brings together principles that guide the practice of Karate-Do. More than words recited at the end of training, they are intended to guide the practitioner's daily conduct.",
    nijuSubtitle: "Precepts of Gichin Funakoshi (selection)",
    reigiSubtitle: "Rituals and conduct inside the Dojo",
    seizaTitle: "Seiza & Mokuso",
    seiza: "Seiza is the formal Japanese kneeling posture, sitting on the heels with the back upright and shoulders relaxed.",
    mokuso: "Mokuso is a moment of concentration practiced at the beginning and end of training. On command, the practitioner settles the breathing and directs attention to practice.",
    greetings: "Salutations (Rei)",
    shomen: "Bow toward the front of the Dojo, expressing respect for tradition.",
    sensei: "Bow to the Sensei conducting the class.",
    otagai: "Mutual bow among practitioners.",
    obiTitle: "How to tie the belt (Obi)",
    obi: "Tying the Obi correctly is part of presentation and discipline in the Dojo. The knot should be secure and the ends balanced.",
    osuTitle: "About the use of Osu",
    osu: "Osu, also written Oss in some contexts, is used in many dojos as a greeting, acknowledgment or expression of perseverance. Usage varies among organizations and traditions.",
    golden: "Core Etiquette",
    rules: ["Bow when entering and leaving the training area.", "Keep your Karate-gi clean and your nails short.", "Stay attentive during the Sensei's explanations.", "Use Karate knowledge responsibly inside and outside the Dojo."]
  },
  ja: {
    title: "理念と礼法",
    subtitle: "JKA Karate-Do の稽古を支える考え方",
    reigi: "礼儀",
    dojoIntro: "道場訓は、Karate-Do の稽古と日常の行動を導くための基本的な心得です。稽古の終わりに唱えるだけでなく、日々の実践につなげることが大切です。",
    nijuSubtitle: "船越義珍師範の教え（抜粋）",
    reigiSubtitle: "道場内での礼法と基本的な振る舞い",
    seizaTitle: "正座と黙想",
    seiza: "正座は日本の正式な座り方の一つです。かかとの上に座り、背筋を伸ばし、肩の力を抜きます。",
    mokuso: "黙想は稽古の始めと終わりに行う集中の時間です。呼吸を整え、意識を稽古に向けます。",
    greetings: "礼",
    shomen: "道場の正面に礼をし、伝統への敬意を表します。",
    sensei: "指導する先生に礼をします。",
    otagai: "稽古する者同士で互いに礼をします。",
    obiTitle: "帯の結び方",
    obi: "帯を正しく結ぶことは、道場での身だしなみと規律の一部です。結び目をしっかり締め、両端の長さを整えます。",
    osuTitle: "Osu について",
    osu: "Osu（Oss と表記される場合もあります）は、多くの道場で挨拶、応答、忍耐を表す言葉として使われます。使用法は団体や伝統によって異なります。",
    golden: "基本的な礼法",
    rules: ["稽古場に入る時と出る時に礼をします。", "Karate-gi を清潔に保ち、爪を短く整えます。", "先生の説明中は集中して聞きます。", "道場の内外を問わず、空手の知識を責任を持って扱います。"]
  }
} as const;

const dojoKun = [
  { jp: "一、人格完成に努むること", romaji: "Hitotsu! Jinkaku kansei ni tsutomuru koto.", pt: "人格の完成に努めること。", en: "Seek perfection of character.", ja: "人格完成に努むること。" },
  { jp: "一、誠の道を守ること", romaji: "Hitotsu! Makoto no michi o mamoru koto.", pt: "誠の道を守ること。", en: "Be faithful to the path of sincerity.", ja: "誠の道を守ること。" },
  { jp: "一、努力の精神を養うこと", romaji: "Hitotsu! Doryoku no seishin o yashinau koto.", pt: "努力の精神を養うこと。", en: "Cultivate a spirit of effort.", ja: "努力の精神を養うこと。" },
  { jp: "一、礼儀を重んずること", romaji: "Hitotsu! Reigi o omonzuru koto.", pt: "礼儀を重んずること。", en: "Respect etiquette.", ja: "礼儀を重んずること。" },
  { jp: "一、血気の勇を戒むること", romaji: "Hitotsu! Kekki no yu o imashimuru koto.", pt: "軽率な勇気や攻撃性を戒めること。", en: "Guard against reckless courage.", ja: "血気の勇を戒むること。" }
];

const nijuKun = [
  { jp: "空手道は礼に始まり礼に終る事を忘るな", romaji: "Karatedo wa rei ni hajimari, rei ni owaru koto o wasuruna.", pt: "O Karate-Do começa e termina com Rei.", en: "Do not forget that Karate-Do begins and ends with Rei.", ja: "空手道は礼に始まり礼に終る事を忘るな。" },
  { jp: "空手に先手なし", romaji: "Karate ni sente nashi.", pt: "No Karate não há primeiro ataque.", en: "There is no first attack in Karate.", ja: "空手に先手なし。" },
  { jp: "空手は義の補け", romaji: "Karate wa gi no tasuke.", pt: "O Karate está a serviço da justiça.", en: "Karate stands on the side of justice.", ja: "空手は義の補け。" },
  { jp: "先づ自己を知れ而して他を知れ", romaji: "Mazu jiko o shire, shikoshite ta o shire.", pt: "Conheça primeiro a si mesmo, depois conheça os outros.", en: "First know yourself, then know others.", ja: "先づ自己を知れ而して他を知れ。" },
  { jp: "技術より心術", romaji: "Gijutsu yori shinjutsu.", pt: "O espírito e a atitude precedem a técnica.", en: "Mental attitude comes before technique.", ja: "技術より心術。" }
];

export function DojoKun() {
  const navigate = useNavigate();
  const { config } = useAppData();
  const { language, t } = useLanguage();
  const copy = copyByLanguage[language];
  const [activeTab, setActiveTab] = useState<"dojokun" | "nijukun" | "reigi">("dojokun");

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto pb-12">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-neutral-500 hover:text-karate-red font-medium transition-colors">
        <ArrowLeft className="w-4 h-4" /> {t("common.back")}
      </button>

      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-bold font-jp">{copy.title}</h2>
        <p className="text-neutral-500 text-lg">{copy.subtitle}</p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center bg-white p-2 rounded-2xl shadow-sm border border-neutral-100">
        {[
          ["dojokun", Shield, "Dojo Kun"],
          ["nijukun", ScrollText, "Niju Kun"],
          ["reigi", Users, copy.reigi]
        ].map(([key, Icon, label]: any) => (
          <button key={key} onClick={() => setActiveTab(key)} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${activeTab === key ? "bg-karate-red text-white shadow-md" : "text-neutral-500 hover:bg-neutral-50 hover:text-karate-black"}`}>
            <Icon className="w-5 h-5" /><span>{label}</span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden p-8 md:p-12 min-h-[500px]">
        {activeTab === "dojokun" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-center mb-8"><div className="w-16 h-16 bg-karate-red rounded-full flex items-center justify-center text-white shadow-lg shadow-karate-red/20"><Shield className="w-8 h-8" /></div></div>
            <p className="text-neutral-700 leading-relaxed text-lg mb-12 text-center max-w-2xl mx-auto">{copy.dojoIntro}</p>
            <div className="space-y-8">
              {dojoKun.map((item, index) => (
                <div key={item.jp} className="flex flex-col md:flex-row gap-4 items-center md:items-start text-center md:text-left bg-neutral-50 p-6 rounded-xl border border-neutral-100">
                  <div className="text-4xl font-serif text-karate-red font-bold">{index + 1}</div>
                  <div className="flex-1 space-y-2">
                    <p className="text-2xl font-bold font-jp text-karate-black">{item.jp}</p>
                    <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest">{item.romaji}</p>
                    <p className="text-lg text-neutral-700 italic border-t border-neutral-200 pt-2 mt-2">"{item[language]}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "nijukun" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-jp">Niju Kun</h2>
              <p className="text-neutral-500 text-lg">{copy.nijuSubtitle}</p>
            </div>
            <div className="space-y-6">
              {nijuKun.map((item, index) => (
                <div key={item.jp} className="flex flex-col md:flex-row gap-4 items-center md:items-start text-center md:text-left bg-neutral-50 p-6 rounded-xl border border-neutral-100">
                  <div className="text-2xl font-serif text-karate-red font-bold min-w-[32px]">{index + 1}</div>
                  <div className="flex-1 space-y-2">
                    <p className="text-xl font-bold font-jp text-karate-black">{item.jp}</p>
                    <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest">{item.romaji}</p>
                    <p className="text-lg text-neutral-700 italic border-t border-neutral-200 pt-2 mt-2">"{item[language]}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "reigi" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-4 mb-12"><h2 className="text-3xl md:text-4xl font-bold font-jp">{copy.reigi}</h2><p className="text-neutral-500 text-lg">{copy.reigiSubtitle}</p></div>
            <div className="space-y-8">
              <section>
                <h3 className="text-2xl font-bold font-jp mb-4 text-karate-black border-b border-neutral-100 pb-2">{copy.seizaTitle}</h3>
                <p className="text-neutral-700 leading-relaxed mb-4"><strong>Seiza:</strong> {copy.seiza}</p>
                <p className="text-neutral-700 leading-relaxed mb-4"><strong>Mokuso:</strong> {copy.mokuso}</p>
              </section>
              <section>
                <h3 className="text-2xl font-bold font-jp mb-4 text-karate-black border-b border-neutral-100 pb-2">{copy.greetings}</h3>
                <ul className="space-y-4">
                  <li className="flex gap-4 items-start"><span className="font-bold text-karate-red w-32 shrink-0">Shomen ni Rei:</span><span className="text-neutral-700">{copy.shomen}</span></li>
                  <li className="flex gap-4 items-start"><span className="font-bold text-karate-red w-32 shrink-0">Sensei ni Rei:</span><span className="text-neutral-700">{copy.sensei}</span></li>
                  <li className="flex gap-4 items-start"><span className="font-bold text-karate-red w-32 shrink-0">Otagai ni Rei:</span><span className="text-neutral-700">{copy.otagai}</span></li>
                </ul>
              </section>
              <section>
                <h3 className="text-2xl font-bold font-jp mb-4 text-karate-black border-b border-neutral-100 pb-2">{copy.obiTitle}</h3>
                <p className="text-neutral-700 leading-relaxed mb-4">{copy.obi}</p>
                <div className="aspect-video w-full md:w-3/4 mx-auto rounded-2xl overflow-hidden shadow-sm border border-neutral-100 bg-karate-black">
                  <iframe width="100%" height="100%" src={config.beltVideoUrl || "https://www.youtube.com/embed/DE1YlRfdOSg"} title={copy.obiTitle} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
                </div>
              </section>
              <section>
                <h3 className="text-2xl font-bold font-jp mb-4 text-karate-black border-b border-neutral-100 pb-2">{copy.osuTitle}</h3>
                <p className="text-neutral-700 leading-relaxed mb-4">{copy.osu}</p>
              </section>
              <section className="bg-neutral-50 p-6 rounded-xl border border-neutral-100 mt-8">
                <h3 className="text-xl font-bold font-jp mb-2 text-karate-black">{copy.golden}</h3>
                <ul className="list-disc pl-5 space-y-2 text-neutral-700 text-sm">{copy.rules.map(rule => <li key={rule}>{rule}</li>)}</ul>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
