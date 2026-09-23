export type JkaSourceType = "graduation" | "exam-admin" | "competition";

export type JkaReference = {
  id: string;
  title: string;
  sourceType: JkaSourceType;
  sourceName: string;
  sourceUrl: string;
  sourceYear: number;
  validFrom?: string;
  validTo?: string;
  notes?: string[];
};

export type JkaDanExamAdminRule = {
  danLevel: string; // e.g., "1º Dan", "2º Dan", "3º Dan", "4º Dan", "5º Dan"
  targetBeltId: string; // e.g. "black-1", "black-2", etc.
  previousGrade: string;
  minimumTime: string; // Carência obrigatória
  minimumAge?: string; // Idade mínima quando expressamente publicada; undefined se ausente na tabela oficial
  courseHoursRequired: number; // Ex: 16 horas em cursos oficiais/chancelados
  courseNotes: string;
  documentationRequirements: string[];
  regularizationNotes?: string;
  crossFederationRules?: {
    eligibleGrades: string[]; // e.g. ["2º Dan", "3º Dan", "4º Dan"]
    advanceDaysNotice: number; // 90 dias
    description: string;
  };
  sourceYear: number;
  sourceId: string;
};

export type CompetitionRuleReference = {
  id: string;
  eventName: string;
  year: number;
  organization: string;
  sourceUrl: string;
  minimumGrade?: string;
  ageGroup?: string;
  modality?: string;
  notes?: string[];
};
