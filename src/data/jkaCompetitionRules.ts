import { CompetitionRuleReference } from "../types/jka";

/**
 * Camada de Referência e Governança de Regras de Competição (JKA Brasil).
 * 
 * DIRETRIZ FUNDAMENTAL:
 * Regras de competição possuem regulamento e elegibilidade próprios (por evento, ano, idade e graduação).
 * NUNCA devem ser confundidas ou incorporadas como requisitos de exame ou de progressão de faixa.
 */
export const competitionReferences: CompetitionRuleReference[] = [
  {
    id: "comp-paranaense-2026",
    eventName: "XIII Campeonato Paranaense de Karate-Do Shotokan JKA 2026",
    year: 2026,
    organization: "JKA Brasil / Federação Paranaense JKA",
    sourceUrl: "https://jkabrasil.com.br/wp-content/uploads/2026/01/2-XIII-CAMPEONATO-PARANAENSE-DE-KARATE-DO-SHOTOKAN-JKA-2026-Regulamento-MARINGA-PR-.pdf",
    minimumGrade: "4º Kyu (Faixa Azul Escuro)",
    notes: [
      "Elegibilidade geral definida pelo regulamento oficial do evento.",
      "Regras de Kumite e Kata delimitadas por faixas etárias e divisões específicas do campeonato.",
      "Critérios exclusivos de participação esportiva, independentes do programa de graduação de Kyu/Dan."
    ]
  },
  {
    id: "comp-copa-machida-2026",
    eventName: "Copa 80 Anos Shihan Yochizo Machida — 2026",
    year: 2026,
    organization: "JKA Brasil",
    sourceUrl: "https://jkabrasil.com.br/wp-content/uploads/2026/02/2.-COPA-80-ANOS-SHIHAN-YOCHIZO-MACHIDA-REGULAMENTO_rev2.pdf",
    notes: [
      "Organização de categorias de Kata por blocos de graduação e faixas etárias.",
      "Modalidades de Kumite adaptadas conforme a maturidade técnica e idade dos atletas.",
      "Válido exclusivamente para a edição comemorativa de 2026."
    ]
  }
];

export const COMPETITION_GOVERNANCE_NOTICE = 
  "Regulamentos de competição da JKA Brasil definem critérios de elegibilidade esportiva específicos para cada campeonato, ano e categoria. Eles não se confundem com os critérios técnicos de exame de graduação.";
