import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Language = "pt" | "en" | "ja";

type Messages = Record<string, string>;

const translations: Record<Language, Messages> = {
  pt: {
    "language.label": "Idioma",
    "nav.main": "PRINCIPAL",
    "nav.training": "TREINAMENTO",
    "nav.knowledge": "CONHECIMENTO",
    "nav.home": "Início",
    "nav.wall": "Mural",
    "nav.events": "Eventos",
    "nav.championships": "Campeonatos",
    "nav.schedule": "Grade de Horários",
    "nav.officialStore": "Loja Oficial",
    "nav.madeiraStore": "MadeiraStore",
    "nav.studentArea": "Área do Aluno",
    "nav.katas": "Katas",
    "nav.techniques": "Técnicas",
    "nav.belts": "Faixas",
    "nav.kataSeries": "Série de Katas",
    "nav.vocabulary": "Vocabulário",
    "nav.whatIsKata": "O que é Kata?",
    "nav.dojoKun": "Dojo Kun",
    "nav.history": "História",
    "nav.menu": "Menu",
    "nav.dojoMenu": "Menu do Dojo",
    "nav.search": "Buscar",
    "nav.searchPlaceholder": "Buscar técnica, kata, faixa...",
    "header.digitalDojo": "Dojo Digital",
    "header.studyDiscipline": "Estudo e Disciplina",
    "header.cart": "Carrinho",
    "header.studentArea": "Área do Aluno",
    "header.search": "Buscar técnica ou kata...",
    "footer.educationDisclaimer": "O conteúdo educativo não substitui a orientação presencial de um sensei qualificado.",
    "footer.developedBy": "Desenvolvido por",
    "common.back": "Voltar",
    "common.available": "Disponível",
    "common.unavailable": "Indisponível",
    "common.products": "Produtos",
    "events.title": "Eventos & Fotos",
    "events.subtitle": "Galerias gerais e fotos dos eventos da Madeira Karate.",
    "history.title": "História do Shotokan",
    "history.subtitle": "A origem da escola de Mestre Gichin Funakoshi",
    "history.masterTitle": "O Mestre Gichin Funakoshi",
    "history.masterP1": "O estilo Shotokan foi fundado pelo Mestre Gichin Funakoshi (1868–1957), amplamente considerado o Pai do Karate Moderno. Nascido em Okinawa, berço da arte marcial, ele treinou sob a tutela de dois lendários mestres locais: Yasutsune Azato e Yasutsune Itosu.",
    "history.masterP2": "Funakoshi unificou técnicas de Okinawa (Tode/Okinawa-te) e as estruturou como um sistema educacional, com foco não apenas na autodefesa, mas também no desenvolvimento espiritual e moral, associado ao conceito de Do, o Caminho.",
    "history.meaningTitle": "O Significado de Shotokan",
    "history.sho": "Significa pinheiro.",
    "history.to": "Significa onda ou vento.",
    "history.kan": "Significa casa, edifício ou salão.",
    "history.meaningP": "Shoto era o pseudônimo literário usado por Funakoshi em seus poemas. Referia-se ao som do vento atravessando as copas dos pinheiros. Shotokan significa, portanto, Casa de Shoto, nome dado por seus alunos ao primeiro dojo oficial construído em Tóquio, em 1936.",
    "history.legacyTitle": "A Expansão e o Legado",
    "history.legacyP1": "Em 1922, Funakoshi foi convidado para demonstrar Karate no Japão continental. Após a demonstração, permaneceu em Tóquio para ensinar.",
    "history.legacyP2": "O estilo ficou conhecido por bases fortes e alongadas, como Zenkutsu Dachi, e movimentos amplos e potentes. Mais tarde, a JKA, Japan Karate Association, foi fundada por seus discípulos, com Funakoshi como instrutor chefe honorário, contribuindo para a difusão mundial do Shotokan.",
    "vocab.title": "Vocabulário",
    "vocab.subtitle": "Terminologia essencial do Karate Shotokan",
    "vocab.intro": "Compreender a terminologia japonesa é fundamental para o treinamento. Os termos conectam o praticante às raízes tradicionais da arte marcial.",
    "vocab.general": "Termos Gerais",
    "vocab.commands": "Comandos",
    "vocab.numbers": "Números",
    "schedule.title": "Grade de Horários",
    "schedule.subtitle": "Confira as turmas e horários disponíveis na Madeira Artes Marciais",
    "schedule.info": "INFORMAÇÕES",
    "schedule.plans": "PLANOS NA RECEPÇÃO.",
    "day.mon": "Segunda",
    "day.tue": "Terça",
    "day.wed": "Quarta",
    "day.thu": "Quinta",
    "day.fri": "Sexta",
    "day.sat": "Sábado",
    "day.time": "HORÁRIO",
    "store.area": "Área Comercial Madeira",
    "store.subtitle": "Produtos selecionados para alunos e comunidade Madeira Karate.",
    "store.description": "Produtos, itens de treino, acessórios e produtos de parceiros. Faça seu pedido com checkout formal, receba o PIX com o valor exato e retire no dojo.",
    "store.lookup": "Consultar Pedido",
    "store.cart": "Carrinho",
    "store.viewCart": "Ver Carrinho",
    "store.search": "Buscar produtos na MadeiraStore...",
    "store.allProducts": "Todos os Produtos",
    "store.productFound": "produto encontrado",
    "store.productsFound": "produtos encontrados",
    "store.none": "Nenhum produto encontrado",
    "store.noneHint": "Não há produtos cadastrados para a MadeiraStore neste momento.",
    "store.clearFilters": "Limpar Filtros",
    "store.paymentTitle": "Pagamento Seguro PIX",
    "store.paymentText": "Chave oficial com conferência manual da secretaria.",
    "store.pickupTitle": "Retirada no Dojo",
    "store.pickupText": "Produtos conferidos e retirados presencialmente no dojo.",
    "store.trackingTitle": "Acompanhamento",
    "store.trackingText": "Consulte seu código de pedido a qualquer momento."
  },
  en: {
    "language.label": "Language",
    "nav.main": "MAIN",
    "nav.training": "TRAINING",
    "nav.knowledge": "KNOWLEDGE",
    "nav.home": "Home",
    "nav.wall": "News Board",
    "nav.events": "Events",
    "nav.championships": "Championships",
    "nav.schedule": "Class Schedule",
    "nav.officialStore": "Official Store",
    "nav.madeiraStore": "MadeiraStore",
    "nav.studentArea": "Student Area",
    "nav.katas": "Katas",
    "nav.techniques": "Techniques",
    "nav.belts": "Belts",
    "nav.kataSeries": "Kata Series",
    "nav.vocabulary": "Vocabulary",
    "nav.whatIsKata": "What is Kata?",
    "nav.dojoKun": "Dojo Kun",
    "nav.history": "History",
    "nav.menu": "Menu",
    "nav.dojoMenu": "Dojo Menu",
    "nav.search": "Search",
    "nav.searchPlaceholder": "Search technique, kata, belt...",
    "header.digitalDojo": "Digital Dojo",
    "header.studyDiscipline": "Study and Discipline",
    "header.cart": "Cart",
    "header.studentArea": "Student Area",
    "header.search": "Search technique or kata...",
    "footer.educationDisclaimer": "Educational content does not replace in-person guidance from a qualified sensei.",
    "footer.developedBy": "Developed by",
    "common.back": "Back",
    "common.available": "Available",
    "common.unavailable": "Unavailable",
    "common.products": "Products",
    "events.title": "Events & Photos",
    "events.subtitle": "General galleries and photos from Madeira Karate events.",
    "history.title": "History of Shotokan",
    "history.subtitle": "The origins of Master Gichin Funakoshi's school",
    "history.masterTitle": "Master Gichin Funakoshi",
    "history.masterP1": "Shotokan was founded by Master Gichin Funakoshi (1868–1957), widely regarded as the Father of Modern Karate. Born in Okinawa, one of the cradles of Karate, he trained under two renowned local masters, Yasutsune Azato and Yasutsune Itosu.",
    "history.masterP2": "Funakoshi systematized Okinawan methods, often referred to as Tode or Okinawa-te, into an educational approach focused not only on self-defense but also on spiritual and moral development associated with Do, the Way.",
    "history.meaningTitle": "The Meaning of Shotokan",
    "history.sho": "Means pine tree.",
    "history.to": "Means waves or wind.",
    "history.kan": "Means house, building or hall.",
    "history.meaningP": "Shoto was the literary pen name Funakoshi used when signing his poems, evoking the sound of wind passing through pine trees. Shotokan therefore means House of Shoto, the name his students gave to the first official dojo built in Tokyo in 1936.",
    "history.legacyTitle": "Expansion and Legacy",
    "history.legacyP1": "In 1922, Funakoshi was invited to demonstrate Karate on mainland Japan. After the demonstration, he remained in Tokyo to teach.",
    "history.legacyP2": "The style became known for strong, extended stances such as Zenkutsu Dachi and broad, powerful movements. Later, the JKA, Japan Karate Association, was founded by his students, with Funakoshi as honorary chief instructor, helping spread Shotokan worldwide.",
    "vocab.title": "Vocabulary",
    "vocab.subtitle": "Essential Shotokan Karate terminology",
    "vocab.intro": "Understanding Japanese terminology is an important part of training. These terms connect practitioners with the traditional roots of the martial art.",
    "vocab.general": "General Terms",
    "vocab.commands": "Commands",
    "vocab.numbers": "Numbers",
    "schedule.title": "Class Schedule",
    "schedule.subtitle": "See the classes and times available at Madeira Artes Marciais",
    "schedule.info": "INFORMATION",
    "schedule.plans": "PLANS AVAILABLE AT RECEPTION.",
    "day.mon": "Monday",
    "day.tue": "Tuesday",
    "day.wed": "Wednesday",
    "day.thu": "Thursday",
    "day.fri": "Friday",
    "day.sat": "Saturday",
    "day.time": "TIME",
    "store.area": "Madeira Commercial Area",
    "store.subtitle": "Products selected for Madeira Karate students and community.",
    "store.description": "Products, training items, accessories and partner products. Place your order, receive the exact PIX amount and collect it at the dojo.",
    "store.lookup": "Track Order",
    "store.cart": "Cart",
    "store.viewCart": "View Cart",
    "store.search": "Search MadeiraStore products...",
    "store.allProducts": "All Products",
    "store.productFound": "product found",
    "store.productsFound": "products found",
    "store.none": "No products found",
    "store.noneHint": "There are no products currently listed in MadeiraStore.",
    "store.clearFilters": "Clear Filters",
    "store.paymentTitle": "Secure PIX Payment",
    "store.paymentText": "Official payment key with manual confirmation by the staff.",
    "store.pickupTitle": "Pickup at the Dojo",
    "store.pickupText": "Products are checked and collected in person at the dojo.",
    "store.trackingTitle": "Order Tracking",
    "store.trackingText": "Check your order code at any time."
  },
  ja: {
    "language.label": "言語",
    "nav.main": "メイン",
    "nav.training": "稽古",
    "nav.knowledge": "知識",
    "nav.home": "ホーム",
    "nav.wall": "お知らせ",
    "nav.events": "イベント",
    "nav.championships": "大会",
    "nav.schedule": "稽古時間",
    "nav.officialStore": "公式ストア",
    "nav.madeiraStore": "MadeiraStore",
    "nav.studentArea": "会員エリア",
    "nav.katas": "形",
    "nav.techniques": "技術",
    "nav.belts": "帯",
    "nav.kataSeries": "形シリーズ",
    "nav.vocabulary": "用語集",
    "nav.whatIsKata": "形とは？",
    "nav.dojoKun": "道場訓",
    "nav.history": "歴史",
    "nav.menu": "メニュー",
    "nav.dojoMenu": "道場メニュー",
    "nav.search": "検索",
    "nav.searchPlaceholder": "技、形、帯を検索...",
    "header.digitalDojo": "デジタル道場",
    "header.studyDiscipline": "学びと規律",
    "header.cart": "カート",
    "header.studentArea": "会員エリア",
    "header.search": "技または形を検索...",
    "footer.educationDisclaimer": "教育コンテンツは、資格ある先生による対面指導の代わりにはなりません。",
    "footer.developedBy": "開発",
    "common.back": "戻る",
    "common.available": "在庫あり",
    "common.unavailable": "在庫なし",
    "common.products": "商品",
    "events.title": "イベント・写真",
    "events.subtitle": "Madeira Karate のイベント写真とギャラリーです。",
    "history.title": "Shotokan の歴史",
    "history.subtitle": "船越義珍師範の流派の起源",
    "history.masterTitle": "船越義珍師範",
    "history.masterP1": "Shotokan は、近代空手の父として広く知られる船越義珍師範（1868–1957）によって築かれました。沖縄に生まれ、安里安恒と糸洲安恒という二人の著名な師から学びました。",
    "history.masterP2": "船越師範は、唐手や沖縄手と呼ばれた沖縄の技法を教育体系として整理し、護身だけでなく、道という考え方に基づく精神面と人格の育成も重視しました。",
    "history.meaningTitle": "Shotokan の意味",
    "history.sho": "松、つまり松の木を表します。",
    "history.to": "濤、波や風を表します。",
    "history.kan": "館、建物や道場を表します。",
    "history.meaningP": "「松濤」は船越師範が詩に用いた雅号で、松林を渡る風の音を表しています。「松濤館」は松濤の館という意味で、1936年に東京に建てられた最初の正式な道場に門下生が付けた名称です。",
    "history.legacyTitle": "普及と継承",
    "history.legacyP1": "1922年、船越師範は本土で空手を紹介するために招かれました。その後、東京に残って指導を続けました。",
    "history.legacyP2": "Shotokan は、前屈立ちなどの安定した長い立ち方と、大きく力強い動作で知られるようになりました。後に門下生によって JKA、Japan Karate Association が設立され、船越師範は名誉主席師範となり、Shotokan の世界的な普及に大きく貢献しました。",
    "vocab.title": "用語集",
    "vocab.subtitle": "Shotokan Karate の基本用語",
    "vocab.intro": "日本語の用語を理解することは稽古の大切な一部です。用語を通して、武道の伝統的な背景への理解を深めます。",
    "vocab.general": "基本用語",
    "vocab.commands": "号令",
    "vocab.numbers": "数",
    "schedule.title": "稽古時間",
    "schedule.subtitle": "Madeira Artes Marciais のクラスと時間をご確認ください",
    "schedule.info": "お問い合わせ",
    "schedule.plans": "料金プランは受付でご案内します。",
    "day.mon": "月曜日",
    "day.tue": "火曜日",
    "day.wed": "水曜日",
    "day.thu": "木曜日",
    "day.fri": "金曜日",
    "day.sat": "土曜日",
    "day.time": "時間",
    "store.area": "Madeira 商業エリア",
    "store.subtitle": "Madeira Karate の会員とコミュニティ向けの商品です。",
    "store.description": "トレーニング用品、アクセサリー、提携商品の注文ができます。注文確定後に正確な PIX 金額を確認し、道場で商品を受け取ります。",
    "store.lookup": "注文確認",
    "store.cart": "カート",
    "store.viewCart": "カートを見る",
    "store.search": "MadeiraStore の商品を検索...",
    "store.allProducts": "すべての商品",
    "store.productFound": "件の商品",
    "store.productsFound": "件の商品",
    "store.none": "商品が見つかりません",
    "store.noneHint": "現在 MadeiraStore に登録されている商品はありません。",
    "store.clearFilters": "条件をクリア",
    "store.paymentTitle": "安全な PIX 決済",
    "store.paymentText": "公式の決済キーを使用し、スタッフが手動で確認します。",
    "store.pickupTitle": "道場で受け取り",
    "store.pickupText": "商品を確認後、道場で直接お受け取りいただけます。",
    "store.trackingTitle": "注文状況",
    "store.trackingText": "注文コードを使っていつでも状況を確認できます。"
  }
};

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  locale: string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = "madeira_language";

function validLanguage(value: string | null | undefined): value is Language {
  return value === "pt" || value === "en" || value === "ja";
}

function initialLanguage(): Language {
  if (typeof window === "undefined") return "pt";
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get("lang");
  if (validLanguage(fromUrl)) return fromUrl;

  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (validLanguage(saved)) return saved;

  const browser = String(window.navigator.language || "").toLowerCase();
  if (browser.startsWith("ja")) return "ja";
  if (browser.startsWith("en")) return "en";
  return "pt";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(initialLanguage);

  const setLanguage = (next: Language) => {
    setLanguageState(next);
    window.localStorage.setItem(STORAGE_KEY, next);

    const url = new URL(window.location.href);
    url.searchParams.set("lang", next);
    window.history.replaceState({}, "", url.toString());
  };

  useEffect(() => {
    document.documentElement.lang =
      language === "pt" ? "pt-BR" : language === "en" ? "en" : "ja";
    document.documentElement.dir = "ltr";
  }, [language]);

  const value = useMemo<LanguageContextValue>(() => ({
    language,
    setLanguage,
    t: (key: string) => translations[language][key] || translations.pt[key] || key,
    locale: language === "pt" ? "pt-BR" : language === "en" ? "en-US" : "ja-JP"
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}
