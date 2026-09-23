import { JkaReference } from "../types/jka";

export const JKA_DISCLAIMER = 
  "Estas informações são referências administrativas publicadas pela JKA Brasil. A confirmação de inscrição, elegibilidade e autorização para exame deve ser feita com o Sensei responsável e conforme o edital vigente.";

export const jkaReferences: JkaReference[] = [
  {
    id: "jka-graduation-guide",
    title: "Guia para Graduação Kyu/Dan — JKA Brasil",
    sourceType: "graduation",
    sourceName: "JKA Brasil (Japan Karate Association)",
    sourceUrl: "https://jkabrasil.com.br/guia-para-graduacao-kyu-dan/",
    sourceYear: 2026,
    notes: [
      "Sequência oficial de graduação do 10º Kyu ao Dan superior.",
      "Base do programa técnico de Kihon, Kata e Kumite do Dojo Digital."
    ]
  },
  {
    id: "jka-exam-admin-2026",
    title: "Exame de Grau JKA 2026 — Maringá",
    sourceType: "exam-admin",
    sourceName: "JKA Brasil",
    sourceUrl: "https://jkabrasil.com.br/wp-content/uploads/2026/01/5-Exame-de-Grau-JKA-2026-MARINGA-Investimentos.pdf",
    sourceYear: 2026,
    notes: [
      "Regras administrativas de exame de Dan vigentes para 2026.",
      "Critérios de carência e idade mínima publicada.",
      "Exigência de 16 horas em cursos oficiais de atualização técnica.",
      "Procedimentos de documentação, regularização e análise curricular (outras federações)."
    ]
  },
  {
    id: "jka-comp-paranaense-2026",
    title: "XIII Campeonato Paranaense de Karate-Do Shotokan JKA 2026",
    sourceType: "competition",
    sourceName: "JKA Brasil / Federação Paranaense JKA",
    sourceUrl: "https://jkabrasil.com.br/wp-content/uploads/2026/01/2-XIII-CAMPEONATO-PARANAENSE-DE-KARATE-DO-SHOTOKAN-JKA-2026-Regulamento-MARINGA-PR-.pdf",
    sourceYear: 2026,
    notes: [
      "Referência oficial de regulamento de campeonato com elegibilidade própria.",
      "Exemplo de critério de participação por graduação mínima (ex: a partir de 4º Kyu).",
      "Não constitui requisito de exame ou graduação."
    ]
  },
  {
    id: "jka-comp-copa-machida-2026",
    title: "Copa 80 Anos Shihan Yochizo Machida — Regulamento 2026",
    sourceType: "competition",
    sourceName: "JKA Brasil",
    sourceUrl: "https://jkabrasil.com.br/wp-content/uploads/2026/02/2.-COPA-80-ANOS-SHIHAN-YOCHIZO-MACHIDA-REGULAMENTO_rev2.pdf",
    sourceYear: 2026,
    notes: [
      "Referência complementar de competição por faixas etárias e grupos de graduação.",
      "Modalidades de Kumite e agrupamentos de Kata específicos de torneio.",
      "Não constitui requisito de exame ou graduação."
    ]
  }
];

export function getJkaReference(id: string): JkaReference | undefined {
  return jkaReferences.find(r => r.id === id);
}
