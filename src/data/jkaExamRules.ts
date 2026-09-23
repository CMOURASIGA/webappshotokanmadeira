import { JkaDanExamAdminRule } from "../types/jka";
import { JKA_DISCLAIMER } from "./jkaReferences";

export { JKA_DISCLAIMER };

export const jkaDanExamRules: JkaDanExamAdminRule[] = [
  {
    danLevel: "1º Dan",
    targetBeltId: "black-1",
    previousGrade: "3º Kyu Marrom",
    minimumTime: "2 anos no 3º Kyu Marrom",
    minimumAge: "12 anos",
    courseHoursRequired: 16,
    courseNotes: "Participação obrigatória em Cursos oficiais de atualização técnica da JKA Brasil ou sob sua chancela (mínimo de 16 horas).",
    documentationRequirements: [
      "Comprovante de associado regular à JKA Brasil",
      "Documentação oficial solicitada no processo de inscrição do edital",
      "Certificados comprobatórios das 16 horas de cursos oficiais/chancelados",
      "Comprovação documental das graduações anteriores"
    ],
    regularizationNotes: "Candidatos sem certificados de Kyu emitidos pela JKA Brasil devem realizar processo prévio de regularização através do professor responsável credenciado e instâncias administrativas competentes.",
    sourceYear: 2026,
    sourceId: "jka-exam-admin-2026"
  },
  {
    danLevel: "2º Dan",
    targetBeltId: "black-2",
    previousGrade: "1º Dan",
    minimumTime: "1 ano no 1º Dan",
    minimumAge: "18 anos",
    courseHoursRequired: 16,
    courseNotes: "Participação obrigatória em Cursos oficiais de atualização técnica da JKA Brasil ou sob sua chancela (mínimo de 16 horas).",
    documentationRequirements: [
      "Comprovante de associado regular à JKA Brasil",
      "Documentação oficial solicitada no processo de inscrição do edital",
      "Certificados comprobatórios das 16 horas de cursos oficiais/chancelados",
      "Comprovação de diploma do 1º Dan JKA"
    ],
    crossFederationRules: {
      eligibleGrades: ["2º Dan", "3º Dan", "4º Dan"],
      advanceDaysNotice: 90,
      description: "Candidatos portadores de diplomas de outras federações devem solicitar análise curricular prévia com antecedência mínima de 90 dias junto à JKA Brasil, sujeita à autorização conforme as condições do edital."
    },
    sourceYear: 2026,
    sourceId: "jka-exam-admin-2026"
  },
  {
    danLevel: "3º Dan",
    targetBeltId: "black-3",
    previousGrade: "2º Dan",
    minimumTime: "2 anos no 2º Dan",
    minimumAge: undefined, // Não informada na tabela oficial publicada
    courseHoursRequired: 16,
    courseNotes: "Participação obrigatória em Cursos oficiais de atualização técnica da JKA Brasil ou sob sua chancela (mínimo de 16 horas).",
    documentationRequirements: [
      "Comprovante de associado regular à JKA Brasil",
      "Documentação oficial solicitada no processo de inscrição do edital",
      "Certificados comprobatórios das 16 horas de cursos oficiais/chancelados",
      "Comprovação de diploma do 2º Dan JKA"
    ],
    crossFederationRules: {
      eligibleGrades: ["2º Dan", "3º Dan", "4º Dan"],
      advanceDaysNotice: 90,
      description: "Candidatos portadores de diplomas de outras federações devem solicitar análise curricular prévia com antecedência mínima de 90 dias junto à JKA Brasil, sujeita à autorização conforme as condições do edital."
    },
    sourceYear: 2026,
    sourceId: "jka-exam-admin-2026"
  },
  {
    danLevel: "4º Dan",
    targetBeltId: "black-4",
    previousGrade: "3º Dan",
    minimumTime: "3 anos no 3º Dan",
    minimumAge: undefined, // Não informada na tabela oficial publicada
    courseHoursRequired: 16,
    courseNotes: "Participação obrigatória em Cursos oficiais de atualização técnica da JKA Brasil ou sob sua chancela (mínimo de 16 horas).",
    documentationRequirements: [
      "Comprovante de associado regular à JKA Brasil",
      "Documentação oficial solicitada no processo de inscrição do edital",
      "Certificados comprobatórios das 16 horas de cursos oficiais/chancelados",
      "Comprovação de diploma do 3º Dan JKA"
    ],
    crossFederationRules: {
      eligibleGrades: ["2º Dan", "3º Dan", "4º Dan"],
      advanceDaysNotice: 90,
      description: "Candidatos portadores de diplomas de outras federações devem solicitar análise curricular prévia com antecedência mínima de 90 dias junto à JKA Brasil, sujeita à autorização conforme as condições do edital."
    },
    sourceYear: 2026,
    sourceId: "jka-exam-admin-2026"
  },
  {
    danLevel: "5º Dan",
    targetBeltId: "black-5",
    previousGrade: "4º Dan",
    minimumTime: "4 anos no 4º Dan",
    minimumAge: undefined, // Não informada na tabela oficial publicada
    courseHoursRequired: 16,
    courseNotes: "Participação obrigatória em Cursos oficiais de atualização técnica da JKA Brasil ou sob sua chancela (mínimo de 16 horas).",
    documentationRequirements: [
      "Comprovante de associado regular à JKA Brasil",
      "Documentação oficial solicitada no processo de inscrição do edital",
      "Certificados comprobatórios das 16 horas de cursos oficiais/chancelados",
      "Comprovação de diploma do 4º Dan JKA"
    ],
    sourceYear: 2026,
    sourceId: "jka-exam-admin-2026"
  }
];

export function getDanExamAdminRule(beltIdOrDanLevel: string): JkaDanExamAdminRule | undefined {
  return jkaDanExamRules.find(
    r => r.targetBeltId === beltIdOrDanLevel || r.danLevel.toLowerCase() === beltIdOrDanLevel.toLowerCase()
  );
}
