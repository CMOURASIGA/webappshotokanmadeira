import { katas, techniques, belts } from "../data/mockData";
import { Notice } from "../contexts/AppDataContext";

export type SearchCategory = 
  | "kata" 
  | "technique" 
  | "vocabulary" 
  | "belt" 
  | "dojokun" 
  | "history" 
  | "notice" 
  | "event"
  | "student";

export interface SearchResultItem {
  id: string;
  category: SearchCategory;
  categoryLabel: string;
  title: string;
  subtitle?: string;
  description: string;
  path: string;
  badgeClass: string;
}

// Vocabulário tradicional Shotokan
export const staticVocabulary = [
  { jp: "Karate", pt: "Mãos vazias (Kara = vazio, Te = mão)", cat: "Termos Gerais" },
  { jp: "Do", pt: "Caminho filosófico e de autodesenvolvimento", cat: "Termos Gerais" },
  { jp: "Dojo", pt: "Local de treinamento (Lugar onde se pratica o caminho)", cat: "Termos Gerais" },
  { jp: "Sensei", pt: "Professor, Mestre (aquele que nasceu antes)", cat: "Termos Gerais" },
  { jp: "Sempai", pt: "Aluno mais graduado ou veterano", cat: "Termos Gerais" },
  { jp: "Kohai", pt: "Aluno menos graduado ou calouro", cat: "Termos Gerais" },
  { jp: "Gi / Karate-gi", pt: "Uniforme tradicional de treinamento de Karate", cat: "Termos Gerais" },
  { jp: "Obi", pt: "Faixa que amarra o kimono e representa a graduação", cat: "Termos Gerais" },
  { jp: "Kiai", pt: "Grito ou liberação concentrada de energia vital (Ki = energia, Ai = união)", cat: "Termos Gerais" },
  { jp: "Osu / Oss", pt: "Cumprimento marcial de respeito, perseverança, paciência e superação", cat: "Termos Gerais" },
  { jp: "Kihon", pt: "Treinamento dos fundamentos e técnicas básicas repetidas em linha", cat: "Termos Gerais" },
  { jp: "Kumite", pt: "Combate ou luta com adversário (Gohon, Sanbon, Jiyu Ippon, Jiyu)", cat: "Termos Gerais" },
  { jp: "Kata", pt: "Forma ou sequência pré-determinada de movimentos de defesa e ataque", cat: "Termos Gerais" },
  { jp: "Bunkai", pt: "Aplicação prática e estudo dos movimentos do Kata contra oponentes", cat: "Termos Gerais" },
  { jp: "Yoi", pt: "Atenção / Posição de prontidão e preparação", cat: "Comandos" },
  { jp: "Hajime", pt: "Começar / Iniciar o exercício ou combate", cat: "Comandos" },
  { jp: "Yame", pt: "Parar / Cessar o movimento imediatamente", cat: "Comandos" },
  { jp: "Mawatte", pt: "Virar / Executar meia volta girando pelo pé de trás", cat: "Comandos" },
  { jp: "Naore", pt: "Retornar à posição inicial e relaxar", cat: "Comandos" },
  { jp: "Yasume", pt: "Descansar mantendo a postura e o respeito", cat: "Comandos" },
  { jp: "Seiza", pt: "Sentar-se formalmente sobre os joelhos", cat: "Comandos" },
  { jp: "Mokuso", pt: "Meditação silenciosa para acalmar a mente antes ou após o treino", cat: "Comandos" },
  { jp: "Rei", pt: "Cumprimentar / Fazer reverência com respeito", cat: "Comandos" },
  { jp: "Kamaete", pt: "Assumir a postura de guarda ou posição de combate", cat: "Comandos" },
  { jp: "Ichi, Ni, San, Shi, Go", pt: "Contagem de um a cinco em japonês", cat: "Números" },
  { jp: "Roku, Shichi, Hachi, Kyu, Ju", pt: "Contagem de seis a dez em japonês", cat: "Números" }
];

// Princípios do Dojo Kun e Niju Kun
export const staticDojoKun = [
  {
    title: "1. Jinkaku kansei ni tsutomuru koto",
    subtitle: "一、人格完成に努むること",
    desc: "Esforçar-se para a formação do caráter. O objetivo supremo do Karate é o aprimoramento moral do praticante.",
    type: "Dojo Kun"
  },
  {
    title: "2. Makoto no michi o mamoru koto",
    subtitle: "一、誠の道を守ること",
    desc: "Fidelidade para com o verdadeiro caminho da razão. Ser honesto consigo mesmo e com o próximo.",
    type: "Dojo Kun"
  },
  {
    title: "3. Doryoku no seishin o yashinau koto",
    subtitle: "一、努力の精神を養うこと",
    desc: "Criar o intuito de esforço. Praticar com dedicação contínua, superando a preguiça e as dificuldades.",
    type: "Dojo Kun"
  },
  {
    title: "4. Reigi o omonzuru koto",
    subtitle: "一、礼儀を重んずること",
    desc: "Respeito acima de tudo. O Karate começa com cortesia e termina com cortesia (Rei).",
    type: "Dojo Kun"
  },
  {
    title: "5. Kekki no yu o imashimuru koto",
    subtitle: "一、血気の勇を戒むること",
    desc: "Conter o espírito de agressão. Dominar as emoções violentas e usar a arte apenas para autodefesa pacífica.",
    type: "Dojo Kun"
  },
  {
    title: "Niju Kun de Gichin Funakoshi",
    subtitle: "Os 20 Princípios Filosóficos",
    desc: "Preceitos deixados pelo Mestre Funakoshi para orientar o Karateka na vida diária dentro e fora do Dojo.",
    type: "Niju Kun"
  },
  {
    title: "Reigi Saho - Etiqueta do Dojo",
    subtitle: "Rituais e Conduta",
    desc: "Regras de respeito, saudação (Rei), limpeza do dojo (Soji) e conduta ética entre sensei e alunos.",
    type: "Etiqueta"
  }
];

// Tópicos Históricos
export const staticHistory = [
  {
    id: "gichin-funakoshi",
    title: "Mestre Gichin Funakoshi (1868–1957)",
    subtitle: "O Pai do Karate Moderno",
    desc: "Nascido em Shuri, Okinawa. Unificou o Shorei-ryu e Shorin-ryu e introduziu o Karate nas universidades do Japão continental."
  },
  {
    id: "significado-shotokan",
    title: "Significado de Shotokan (松濤館)",
    subtitle: "Sho (Pinheiro), To (Onda), Kan (Salão)",
    desc: "Shoto era o pseudônimo poético de Funakoshi. Shotokan significa 'A Casa onde o vento sopra nos pinheiros'."
  },
  {
    id: "jka-expansao",
    title: "Origem da JKA (Japan Karate Association)",
    subtitle: "Expansão Mundial do Shotokan",
    desc: "Fundada por discípulos de Funakoshi em 1949, responsável por padronizar o Karate e levá-lo para todos os continentes."
  },
  {
    id: "mestres-azato-itosu",
    title: "Mestres Yasutsune Azato e Anko Itosu",
    subtitle: "Os Professores de Funakoshi em Okinawa",
    desc: "Azato destacava a tática e esquiva; Itosu introduziu o Karate nas escolas de Okinawa e criou os Katas Heian (Pinan)."
  }
];

function normalizeText(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function searchAllData(
  query: string, 
  notices: Notice[] = [], 
  events: Notice[] = []
): SearchResultItem[] {
  const q = normalizeText(query);
  if (!q || q.length < 2) return [];

  const results: SearchResultItem[] = [];

  // 1. KATAS
  for (const kata of katas) {
    const hay = normalizeText(`${kata.name} ${kata.meaning} ${kata.group} ${kata.level} ${kata.description || ""} kata`);
    if (hay.includes(q)) {
      results.push({
        id: `kata-${kata.id}`,
        category: "kata",
        categoryLabel: "Kata",
        title: kata.name,
        subtitle: `${kata.movementsCount || kata.movements?.length || 0} movimentos • ${kata.level || "Shotokan"}`,
        description: kata.meaning || kata.description || "Kata tradicional do Karate Shotokan com embusen e técnicas fundamentais.",
        path: `/katas/${kata.id}`,
        badgeClass: "bg-red-50 text-karate-red border-red-200"
      });
    }
  }

  // 2. TÉCNICAS
  for (const tech of techniques) {
    const hay = normalizeText(`${tech.nameJp} ${tech.namePt} ${tech.category} ${tech.description || ""} tecnica golpe defesa ataque`);
    if (hay.includes(q)) {
      results.push({
        id: `tech-${tech.id}`,
        category: "technique",
        categoryLabel: "Técnica",
        title: tech.nameJp,
        subtitle: `${tech.namePt} • ${tech.category}`,
        description: tech.description || "Técnica fundamental de Kihon e Kumite do Karate Shotokan.",
        path: `/techniques/${tech.id}`,
        badgeClass: "bg-amber-50 text-amber-700 border-amber-200"
      });
    }
  }

  // 3. FAIXAS
  for (const belt of belts) {
    const hay = normalizeText(`faixa ${belt.name} ${belt.level} ${belt.meaning} ${(belt.requirements || []).join(" ")} graduacao`);
    if (hay.includes(q)) {
      results.push({
        id: `belt-${belt.id}`,
        category: "belt",
        categoryLabel: "Faixa",
        title: `Faixa ${belt.name} (${belt.level})`,
        subtitle: `Graduação Shotokan JKA`,
        description: belt.meaning || `Requisitos: ${(belt.requirements || []).slice(0, 2).join(", ")}`,
        path: `/belts#belt-${belt.id}`,
        badgeClass: "bg-blue-50 text-blue-700 border-blue-200"
      });
    }
  }

  // 4. VOCABULÁRIO
  for (const item of staticVocabulary) {
    const hay = normalizeText(`${item.jp} ${item.pt} ${item.cat} vocabulario termo palavra`);
    if (hay.includes(q)) {
      results.push({
        id: `vocab-${item.jp}`,
        category: "vocabulary",
        categoryLabel: "Vocabulário",
        title: item.jp,
        subtitle: item.cat,
        description: item.pt,
        path: `/vocabulary`,
        badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200"
      });
    }
  }

  // 5. DOJO KUN & NIJU KUN
  for (const dk of staticDojoKun) {
    const hay = normalizeText(`${dk.title} ${dk.subtitle || ""} ${dk.desc} ${dk.type} lema principio preceito`);
    if (hay.includes(q)) {
      results.push({
        id: `dk-${dk.title}`,
        category: "dojokun",
        categoryLabel: "Dojo Kun",
        title: dk.title,
        subtitle: dk.subtitle,
        description: dk.desc,
        path: `/dojo-kun`,
        badgeClass: "bg-purple-50 text-purple-700 border-purple-200"
      });
    }
  }

  // 6. HISTÓRIA
  for (const h of staticHistory) {
    const hay = normalizeText(`${h.title} ${h.subtitle || ""} ${h.desc} historia shotokan funakoshi jka`);
    if (hay.includes(q)) {
      results.push({
        id: `history-${h.id}`,
        category: "history",
        categoryLabel: "História",
        title: h.title,
        subtitle: h.subtitle,
        description: h.desc,
        path: `/history`,
        badgeClass: "bg-orange-50 text-orange-700 border-orange-200"
      });
    }
  }

  // 7. AVISOS DO MURAL
  for (const notice of notices) {
    const hay = normalizeText(`${notice.title || ""} aviso mural noticia informacao`);
    if (hay.includes(q)) {
      results.push({
        id: `notice-${notice.id}`,
        category: "notice",
        categoryLabel: "Aviso",
        title: notice.title || "Aviso do Mural",
        subtitle: "Mural de Avisos",
        description: "Aviso publicado no Mural Digital da academia.",
        path: `/mural`,
        badgeClass: "bg-rose-50 text-rose-700 border-rose-200"
      });
    }
  }

  // 8. EVENTOS
  for (const event of events) {
    const hay = normalizeText(`${event.title || ""} evento campeonato exame curso`);
    if (hay.includes(q)) {
      results.push({
        id: `event-${event.id}`,
        category: "event",
        categoryLabel: "Evento",
        title: event.title || "Evento",
        subtitle: "Eventos & Fotos",
        description: "Evento e fotos da academia Madeira Karate.",
        path: `/events`,
        badgeClass: "bg-teal-50 text-teal-700 border-teal-200"
      });
    }
  }

  // 9. ÁREA DO ALUNO E FERRAMENTAS DE APRENDIZADO
  const studentPages = [
    {
      id: "student-main",
      title: "Área do Aluno",
      subtitle: "Treinamento individual, histórico e metas",
      desc: "Área do aluno com retomada de estudos, checklist de exame de graduação, favoritos e anotações técnicas do Sensei.",
      path: "/student-area",
      keywords: "aluno area do aluno continuar estudando treino progresso meu dojo monkasei"
    },
    {
      id: "student-favorites",
      title: "Favoritos do Aluno",
      subtitle: "Katas e técnicas marcados",
      desc: "Coleção de katas e técnicas salvas para revisão rápida antes dos treinos presenciais.",
      path: "/student-area?tab=favorites",
      keywords: "favoritos estrela salvar revisao katas tecnicas"
    },
    {
      id: "student-exam",
      title: "Checklist de Exame de Faixa",
      subtitle: "Autoavaliação e requisitos JKA",
      desc: "Lista interativa de requisitos pedagógicos (Kihon, Kata e Kumite) para a próxima graduação.",
      path: "/student-area?tab=exam",
      keywords: "exame faixa checklist graduacao requisitos kyu dan teste avaliacao"
    },
    {
      id: "student-notes",
      title: "Caderno de Anotações Técnicas",
      subtitle: "Observações do Sensei",
      desc: "Registro pessoal de dicas, correções de postura e orientações do Sensei no dojo.",
      path: "/student-area?tab=notes",
      keywords: "anotacoes notas caderno correcao sensei dicas postura observacoes"
    }
  ];

  for (const sp of studentPages) {
    const hay = normalizeText(`${sp.title} ${sp.subtitle} ${sp.desc} ${sp.keywords}`);
    if (hay.includes(q)) {
      results.push({
        id: sp.id,
        category: "student",
        categoryLabel: "Área do Aluno",
        title: sp.title,
        subtitle: sp.subtitle,
        description: sp.desc,
        path: sp.path,
        badgeClass: "bg-purple-50 text-purple-700 border-purple-200"
      });
    }
  }

  // Ordenação por relevância: se o título começa com a query ou contém a palavra exata
  return results.sort((a, b) => {
    const aTitle = normalizeText(a.title);
    const bTitle = normalizeText(b.title);
    const aStartsWith = aTitle.startsWith(q);
    const bStartsWith = bTitle.startsWith(q);
    if (aStartsWith && !bStartsWith) return -1;
    if (!aStartsWith && bStartsWith) return 1;
    return a.title.localeCompare(b.title);
  });
}
