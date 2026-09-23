export type Belt = {
  id: string;
  name: string;
  color: string;
  level: string; // e.g., "10º Kyu", "1º Dan (Shodan)"
  meaning?: string;
  requirements?: string[];
  kihon?: string[];
  kata?: string[];
  kumite?: string[];
  notes?: string[];
  source?: {
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

export type TechniqueCategory = "Base" | "Soco" | "Defesa" | "Chute" | "Mão Aberta" | "Deslocamento" | "Combinação";

export type Technique = {
  id: string;
  nameJp: string;
  namePt: string;
  category: TechniqueCategory;
  recommendedBeltId: string;
  description: string;
  steps: string[];
  commonErrors: string[];
  application: string;
  imageUrl?: string;
  videoUrl?: string;
  relatedTechniqueIds?: string[];
};

export type KataGroup = "Heian" | "Tekki" | "Avançado" | "Sentei" | "Por Dan";

export type Kata = {
  id: string;
  name: string;
  meaning: string;
  group: KataGroup;
  level: string;
  recommendedBeltId: string;
  movementsCount: number;
  estimatedDuration?: string; // Campo opcional reservado para futura validação pedagógica oficial
  description: string;
  embusenImageUrl?: string;
  movements: string[];
  mainTechniques: string[];
  bunkai: string;
  attentionPoints: string[];
  videoUrl?: string;
  commonErrors: string[];
};
