export type GraduationRequirement = {
  id: string;
  level: string;
  beltName: string;
  color: string;
  meaning?: string;

  kihon: string[];
  kata: string[];
  kumite: string[];
  notes?: string[];

  source: {
    name: string;
    url: string;
  };

  danRules?: {
    previousGrade?: string;
    minimumTime?: string;
    minimumAge?: string;
    notes?: string[];
  };
};

export const JKA_SOURCE = {
  name: "Guia para Graduação Kyu/Dan — JKA Brasil",
  url: "https://jkabrasil.com.br/guia-para-graduacao-kyu-dan/"
};

export const JKA_DAN_RULES_SOURCE = {
  name: "Exame de Grau JKA Brasil 2026 — Regulamento Oficial",
  url: "https://jkabrasil.com.br/wp-content/uploads/2026/01/5-Exame-de-Grau-JKA-2026-MARINGA-Investimentos.pdf"
};

export const graduationRequirements: GraduationRequirement[] = [
  // 1. 10º Kyu — Branca
  {
    id: "white",
    level: "10º Kyu",
    beltName: "Branca",
    color: "#FFFFFF",
    meaning: "A cor branca representa a pureza, a ingenuidade e a mente limpa do iniciante, pronta para receber os ensinamentos.",
    kihon: [
      "Na posição básica de HACHIJI DACHI:",
      "1. CHUUDAN CHOKUZUKI",
      "2. JOUDAN AGEUKE",
      "3. CHUUDAN SOTOUKE",
      "4. MAEGERI (HEISOKU DACHI, GEDAN KAKIWAKE)"
    ],
    kata: [],
    kumite: [],
    notes: [
      "Comando “GOREI” — início pelo lado direito, alternando para cada técnica.",
      "Não há exigência de Kata ou Kumite para esta graduação no Guia JKA Brasil."
    ],
    source: JKA_SOURCE
  },

  // 2. 9º Kyu — Amarela
  {
    id: "yellow",
    level: "9º Kyu",
    beltName: "Amarela",
    color: "#FFD700",
    meaning: "Representa a terra fértil onde a semente do Karate é plantada, iniciando seu desenvolvimento.",
    kihon: [
      "Na posição básica de SHIZEN TAI para ZENKUTSU DACHI e retorno para SHIZEN TAI:",
      "1. CHUUDAN JUNZUKI",
      "2. JOUDAN AGEUKE",
      "3. CHUUDAN SOTOUKE",
      "4. KOKUTSU DACHI SHUTOU UKE",
      "5. MAEGERI (HEISOKU DACHI, GEDAN KAKIWAKE)"
    ],
    kata: [],
    kumite: [],
    notes: [
      "Comando “GOREI” — início pelo lado direito, duas ações por vez para cada técnica.",
      "Não há exigência de Kata ou Kumite para esta graduação no Guia JKA Brasil."
    ],
    source: JKA_SOURCE
  },

  // 3. 8º Kyu — Laranja
  {
    id: "orange",
    level: "8º Kyu",
    beltName: "Laranja",
    color: "#F27D26",
    meaning: "A força do sol nascente, energia vibrante, crescimento contínuo e consolidação da base.",
    kihon: [
      "1. CHUUDAN JUNZUKI (avançando)",
      "2. JOUDAN AGEUKE (avançando)",
      "3. CHUUDAN SOTOUKE (avançando)",
      "4. GEDAN BARAI (avançando)",
      "5. KOKUTSU SHUTOU UKE (avançando)",
      "6. MAEGERI (GEDAN KAKIWAKE) (avançando)"
    ],
    kata: [
      "TAIKYOKU SHOUDAN"
    ],
    kumite: [
      "GOHON KUMITE:",
      "• JOUDAN JUNZUKI",
      "• CHUUDAN JUNZUKI"
    ],
    notes: [],
    source: JKA_SOURCE
  },

  // 4. 7º Kyu — Verde
  {
    id: "green",
    level: "7º Kyu",
    beltName: "Verde",
    color: "#2E7D32",
    meaning: "O crescimento da planta, a natureza se expandindo. O praticante começa a criar raízes firmes.",
    kihon: [
      "1. CHUUDAN JUNZUKI (avançando)",
      "2. JOUDAN AGEUKE (recuando)",
      "3. CHUUDAN SOTOUKE (avançando)",
      "4. CHUUDAN UCHIUKE (recuando)",
      "5. KOUKUTSU SHUTOU UKE (avançando)",
      "6. MAEGERI (GEDAN KAKIWAKE) (avançando)",
      "7. YOKOGERI KEAGE (em HEISOKU DACHI, alternando lado direito e esquerdo)",
      "8. YOKOGERI KEKOMI (em HEISOKU DACHI, alternando lado direito e esquerdo)"
    ],
    kata: [
      "HEIAN SHODAN"
    ],
    kumite: [
      "GOHON KUMITE:",
      "• JOUDAN JUNZUKI",
      "• CHUUDAN JUNZUKI"
    ],
    notes: [],
    source: JKA_SOURCE
  },

  // 5. 6º Kyu — Azul Claro
  {
    id: "light-blue",
    level: "6º Kyu",
    beltName: "Azul Claro",
    color: "#0288D1",
    meaning: "O céu para onde a árvore se eleva. O horizonte de técnicas e controle corporal se expande.",
    kihon: [
      "1. CHUUDAN JUNZUKI (avançando)",
      "2. JOUDAN AGEUKE (recuando)",
      "3. CHUUDAN SOTOUKE (avançando)",
      "4. CHUUDAN UCHIUKE (recuando)",
      "5. KOUKUTSU SHUTOU UKE (avançando)",
      "6. MAEGERI (GEDAN KAKIWAKE) (avançando)",
      "7. YOKOGERI KEAGE (em KIBA DACHI, direita e esquerda) (avançando)",
      "8. YOKOGERI KEKOMI (em KIBA DACHI, direita e esquerda) (avançando)"
    ],
    kata: [
      "HEIAN NIDAN"
    ],
    kumite: [
      "KIHON IPPON KUMITE:",
      "• JOUDAN JUNZUKI — direita e esquerda",
      "• CHUUDAN JUNZUKI — direita e esquerda"
    ],
    notes: [],
    source: JKA_SOURCE
  },

  // 6. 5º Kyu — Roxa
  {
    id: "purple",
    level: "5º Kyu",
    beltName: "Roxa",
    color: "#7B1FA2",
    meaning: "A aurora e a maturidade dos fundamentos. Aprofundamento no ritmo, nas combinações e no tempo de reação.",
    kihon: [
      "1. CHUUDAN JUNZUKI (avançando)",
      "2. JOUDAN AGEUKE, GYAKU ZUKI (recuando)",
      "3. CHUUDAN SOTOUKE, GYAKU ZUKI (avançando)",
      "4. CHUUDAN UCHIUKE, CHUUDAN GYAKU ZUKI (recuando)",
      "5. KOUKUTSU SHUTOU UKE (avançando)",
      "6. MAEGERI (GEDAN KAKIWAKE) (avançando)",
      "7. YOKOGERI KEAGE (em KIBA DACHI, direita e esquerda) (avançando)",
      "8. YOKOGERI KEKOMI (em KIBA DACHI, direita e esquerda) (avançando)"
    ],
    kata: [
      "HEIAN SANDAN"
    ],
    kumite: [
      "KIHON IPPON KUMITE:",
      "• JOUDAN JUNZUKI — direita e esquerda",
      "• CHUUDAN JUNZUKI — direita e esquerda",
      "• CHUUDAN MAEGERI — direita e esquerda",
      "• GEDAN KAKIWAKE — direita e esquerda"
    ],
    notes: [],
    source: JKA_SOURCE
  },

  // 7. 4º Kyu — Azul Escura
  {
    id: "dark-blue",
    level: "4º Kyu",
    beltName: "Azul Escura",
    color: "#0D47A1",
    meaning: "As profundezas do oceano. O aluno adquire maior serenidade, precisão e estabilidade nas ações dinâmicas.",
    kihon: [
      "1. CHUUDAN JUNZUKI (avançando)",
      "2. SANBON RENZUKI (avançando)",
      "3. JOUDAN AGEUKE, GYAKU ZUKI (recuando)",
      "4. CHUUDAN SOTOUKE, GYAKU ZUKI (avançando)",
      "5. CHUUDAN UCHIUKE, GYAKU ZUKI (recuando)",
      "6. KOUKUTSU SHUTOU UKE, ZENKUTSU NUKITE (avançando)",
      "7. MAEGERI (GEDAN KAKIWAKE) (avançando)",
      "8. YOKOGERI KEAGE (em KIBA DACHI, direita e esquerda) (avançando)",
      "9. YOKOGERI KEKOMI (em ZENKUTSU DACHI, direita e esquerda) (avançando)"
    ],
    kata: [
      "HEIAN YONDAN"
    ],
    kumite: [
      "KIHON IPPON KUMITE:",
      "• JOUDAN JUNZUKI — direita e esquerda",
      "• CHUUDAN JUNZUKI — direita e esquerda",
      "• CHUUDAN MAEGERI em GEDAN KAKIWAKE — direita e esquerda",
      "• CHUUDAN YOKOGERI KEKOMI — direita e esquerda"
    ],
    notes: [],
    source: JKA_SOURCE
  },

  // 8. 3º Kyu — Marrom
  {
    id: "brown-3",
    level: "3º Kyu",
    beltName: "Marrom",
    color: "#8D6E63",
    meaning: "A terra firme. Início da fase de lapidação avançada com vistas à faixa preta.",
    kihon: [
      "1. CHUUDAN JUNZUKI (avançando)",
      "2. SANBON RENZUKI (avançando)",
      "3. JOUDAN AGEUKE, GYAKU ZUKI (avançando)",
      "4. CHUUDAN SOTOUKE, GYAKU ZUKI (recuando)",
      "5. CHUUDAN UCHIUKE, GYAKU ZUKI (em KOUKUTSU DACHI) (avançando)",
      "6. KOUKUTSU SHUTOU UKE, ZENKUTSU NUKITE (recuando)",
      "7. MAEGERI (GEDAN KAKIWAKE) (avançando)",
      "8. REN GERI (GEDAN KAKIWAKE CHUUDAN, JOUDAN) (avançando)",
      "9. MAWASHIGERI",
      "10. YOKOGERI KEAGE (em KIBA DACHI, direita e esquerda) (avançando)",
      "11. YOKOGERI KEKOMI (em KIBA DACHI, direita e esquerda) (avançando)"
    ],
    kata: [
      "HEIAN GODAN"
    ],
    kumite: [
      "KIHON IPPON KUMITE:",
      "• JOUDAN JUNZUKI — direita e esquerda",
      "• CHUUDAN JUNZUKI — direita e esquerda",
      "• CHUUDAN MAEGERI / GEDAN KAKIWAKE — direita e esquerda",
      "• CHUUDAN YOKOGERI KEKOMI — direita e esquerda"
    ],
    notes: [],
    source: JKA_SOURCE
  },

  // 9. 2º Kyu — Marrom
  {
    id: "brown-2",
    level: "2º Kyu",
    beltName: "Marrom",
    color: "#6D4C41",
    meaning: "Consolidação e amadurecimento das técnicas marrons em preparação para o combate semi-livre.",
    kihon: [
      "1. JOUDAN JUNZUKI, CHUUDAN GYAKUZUKI (avançando)",
      "2. JOUDAN AGEUKE, GYAKU ZUKI (recuando)",
      "3. CHUUDAN SOTOUKE, GYAKU ZUKI (avançando)",
      "4. CHUUDAN UCHIUKE, GYAKU ZUKI (recuando)",
      "5. KOUKUTSU SHUTOU UKE, ZENKUTSU NUKITE (avançando)",
      "6. MAEGERI (avançando)",
      "7. MAWASHI GERI (avançando)",
      "8. YOKOGERI KEAGE (em KIBA DACHI, direita e esquerda) (avançando)",
      "9. YOKOGERI KEKOMI (em ZENKUTSU DACHI) (avançando)"
    ],
    kata: [
      "TEKKI SHODAN"
    ],
    kumite: [
      "JIYUU IPPON KUMITE:",
      "• JOUDAN JUNZUKI",
      "• CHUUDAN JUNZUKI",
      "• CHUUDAN MAEGERI",
      "• CHUUDAN YOKOGERI KEKOMI",
      "• MAWASHIGERI",
      "• Direita e esquerda"
    ],
    notes: [
      "Informar sua escolha para JOUDAN ou CHUUDAN no MAWASHIGERI."
    ],
    source: JKA_SOURCE
  },

  // 10. 1º Kyu — Marrom
  {
    id: "brown-1",
    level: "1º Kyu",
    beltName: "Marrom",
    color: "#4E342E",
    meaning: "Último estágio antes da graduação Shodan. Domínio pleno de fundamentos, postura e controle.",
    kihon: [
      "1. JOUDAN JUNZUKI, CHUUDAN GYAKUZUKI (avançando)",
      "2. JOUDAN AGEUKE, GYAKU ZUKI (recuando)",
      "3. CHUUDAN SOTOUKE, YOKO ENPI (ZENKUTSU DACHI mudando para KIBA DACHI) (avançando)",
      "4. CHUUDAN UCHIUKE, GYAKU ZUKI (recuando)",
      "5. KOUKUTSU SHUTOU UKE, ZENKUTSU NUKITE (avançando)",
      "6. MAEGERI (parado/no local), MAEGERI (avançando)",
      "7. MAWASHIGERI (avançando)",
      "8. YOKOGERI KEAGE (em KIBA DACHI, direita e esquerda) (avançando)",
      "9. YOKOGERI KEKOMI (em ZENKUTSU DACHI) (avançando)"
    ],
    kata: [
      "BASSAI DAI"
    ],
    kumite: [
      "JIYUU IPPON KUMITE:",
      "• JOUDAN JUNZUKI",
      "• CHUUDAN JUNZUKI",
      "• CHUUDAN MAEGERI",
      "• CHUUDAN YOKOGERI KEKOMI",
      "• MAWASHIGERI",
      "• Direita e esquerda"
    ],
    notes: [
      "Informar sua escolha de JOUDAN ou CHUUDAN para MAWASHIGERI."
    ],
    source: JKA_SOURCE
  },

  // 11. 1º Dan — Preta / Shodan
  {
    id: "black-1",
    level: "1º Dan (Shodan)",
    beltName: "Preta",
    color: "#111111",
    meaning: "A junção de todas as cores. Shodan significa 'primeiro degrau' — início da jornada profunda como aprendiz e mestre de si mesmo.",
    kihon: [
      "1. SANBON RENZUKI (avançando)",
      "2. JOUDAN AGEUKE, GYAKUZUKI (recuando)",
      "3. CHUUDAN SOTOUKE, YOKO ENPI, YOKO URAKEN UCHI, GYAKUZUKI — ZENKUTSU DACHI mudando para KIBA DACHI e mudando para ZENKUTSU DACHI (avançando)",
      "4. CHUUDAN UCHIUKE, KIZAMI ZUKI, GYAKUZUKI — KOKUTSU DACHI mudando para ZENKUTSU DACHI (recuando)",
      "5. KOUKUTSU SHUTOU UKE, ZENKUTSU NUKITE (avançando)",
      "6. MAEGERI (parado/no local), MAEGERI (avançando)",
      "7. MAWASHIGERI (avançando)",
      "8. YOKOGERI KEAGE (KIBA DACHI — direita e esquerda) (avançando)",
      "9. YOKOGERI KEKOMI (ZENKUTSU DACHI) (avançando)"
    ],
    kata: [
      "Escolha oficial da banca entre: BASSAI DAI, KANKU DAI, ENPI ou JION"
    ],
    kumite: [
      "JIYUU IPPON KUMITE:",
      "• JOUDAN JUNZUKI",
      "• CHUUDAN JUNZUKI",
      "• CHUUDAN MAEGERI",
      "• CHUUDAN YOKOGERI KEKOMI",
      "• MAWASHI GERI",
      "• Direita e esquerda"
    ],
    notes: [
      "Informar sua escolha de JOUDAN ou CHUUDAN para MAWASHIGERI."
    ],
    source: JKA_SOURCE,
    danRules: {
      previousGrade: "3º Kyu Marrom",
      minimumTime: "2 anos de carência a partir do 3º Kyu Marrom",
      minimumAge: "12 anos completos",
      notes: [
        "Exame de grau realizado perante banca credenciada da JKA Brasil.",
        "Condições administrativas publicadas em edital oficial JKA Brasil 2026."
      ]
    }
  },

  // 12. 2º Dan — Preta / Nidan
  {
    id: "black-2",
    level: "2º Dan (Nidan)",
    beltName: "Preta",
    color: "#111111",
    meaning: "Segundo nível de graduação em Dan. Aprimoramento do espírito e fluidez técnica.",
    kihon: [],
    kata: [],
    kumite: [],
    notes: [],
    source: JKA_DAN_RULES_SOURCE,
    danRules: {
      previousGrade: "1º Dan (Shodan)",
      minimumTime: "1 ano de carência no 1º Dan",
      minimumAge: "18 anos completos",
      notes: [
        "Exame de grau realizado perante banca credenciada da JKA Brasil.",
        "Condições administrativas confirmadas em edital oficial JKA Brasil 2026."
      ]
    }
  },

  // 13. 3º Dan — Preta / Sandan
  {
    id: "black-3",
    level: "3º Dan (Sandan)",
    beltName: "Preta",
    color: "#111111",
    meaning: "Terceiro nível de graduação em Dan. Maturidade e consolidação da técnica com o espírito marcial.",
    kihon: [],
    kata: [],
    kumite: [],
    notes: [],
    source: JKA_DAN_RULES_SOURCE,
    danRules: {
      previousGrade: "2º Dan (Nidan)",
      minimumTime: "2 anos de carência no 2º Dan",
      notes: [
        "Exame de grau realizado perante banca credenciada da JKA Brasil.",
        "Condições administrativas confirmadas em edital oficial JKA Brasil 2026."
      ]
    }
  },

  // 14. 4º Dan — Preta / Yondan
  {
    id: "black-4",
    level: "4º Dan (Yondan)",
    beltName: "Preta",
    color: "#111111",
    meaning: "Quarto nível de graduação em Dan. Maestria técnica e compreensão profunda dos princípios Shotokan.",
    kihon: [],
    kata: [],
    kumite: [],
    notes: [],
    source: JKA_DAN_RULES_SOURCE,
    danRules: {
      previousGrade: "3º Dan (Sandan)",
      minimumTime: "3 anos de carência no 3º Dan",
      notes: [
        "Exame de grau realizado perante banca credenciada da JKA Brasil.",
        "Condições administrativas confirmadas em edital oficial JKA Brasil 2026."
      ]
    }
  },

  // 15. 5º Dan — Preta / Godan
  {
    id: "black-5",
    level: "5º Dan (Godan)",
    beltName: "Preta",
    color: "#111111",
    meaning: "Quinto nível de graduação em Dan. Excelência, liderança técnica e dedicação à arte.",
    kihon: [],
    kata: [],
    kumite: [],
    notes: [],
    source: JKA_DAN_RULES_SOURCE,
    danRules: {
      previousGrade: "4º Dan (Yondan)",
      minimumTime: "4 anos de carência no 4º Dan",
      notes: [
        "Exame de grau realizado perante banca credenciada da JKA Brasil.",
        "Condições administrativas confirmadas em edital oficial JKA Brasil 2026."
      ]
    }
  }
];

/**
 * Função utilitária para converter uma graduação em lista linear de requisitos marcáveis
 * para o Checklist da Área do Aluno, preservando a semântica de grupo (Kihon, Kata, Kumite).
 */
export type ChecklistGroup = {
  category: "kihon" | "kata" | "kumite";
  title: string;
  items: {
    id: string; // chave estável e determinística
    text: string;
  }[];
};

export type BeltChecklistSummary = {
  belt: GraduationRequirement;
  groups: ChecklistGroup[];
  totalCheckable: number;
  notes: string[];
};

export function getBeltChecklistGroups(beltOrId: GraduationRequirement | string): BeltChecklistSummary {
  const belt = typeof beltOrId === "string" 
    ? (graduationRequirements.find(g => g.id === beltOrId) || graduationRequirements[0])
    : beltOrId;

  const groups: ChecklistGroup[] = [];

  if (belt.kihon && belt.kihon.length > 0) {
    groups.push({
      category: "kihon",
      title: "Kihon (Fundamentos Técnicos)",
      items: belt.kihon.map((item, idx) => ({
        id: `${belt.id}_kihon_${idx}`,
        text: item
      }))
    });
  }

  if (belt.kata && belt.kata.length > 0) {
    groups.push({
      category: "kata",
      title: "Kata (Formas Exigidas)",
      items: belt.kata.map((item, idx) => ({
        id: `${belt.id}_kata_${idx}`,
        text: item
      }))
    });
  }

  if (belt.kumite && belt.kumite.length > 0) {
    groups.push({
      category: "kumite",
      title: "Kumite (Combate Combinado / Semi-Livre)",
      items: belt.kumite.map((item, idx) => ({
        id: `${belt.id}_kumite_${idx}`,
        text: item
      }))
    });
  }

  const totalCheckable = (belt.kihon?.length || 0) + (belt.kata?.length || 0) + (belt.kumite?.length || 0);

  return {
    belt,
    groups,
    totalCheckable,
    notes: belt.notes || []
  };
}

/**
 * Conta o total de itens avaliáveis de um determinado belt.
 */
export function getBeltTotalChecklistItems(beltOrId: GraduationRequirement | string): number {
  return getBeltChecklistGroups(beltOrId).totalCheckable;
}
