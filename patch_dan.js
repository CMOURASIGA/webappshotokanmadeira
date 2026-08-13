import fs from 'fs';
let data = fs.readFileSync('src/data/mockData.ts', 'utf8');

const blackBelt = `  { 
    id: "black", 
    name: "Preta", 
    color: "#111111", 
    level: "1º Dan (Shodan)",
    meaning: "A junção de todas as cores. Representa a mente vazia (mushin), humildade, e o início de uma nova jornada como mestre e eterno aprendiz.",
    requirements: ["Domínio completo dos Heian e Tekki", "Bunkai avançado", "Maturidade e conduta exemplar", "Dedicação e ensino"]
  },
  {
    id: "black-2",
    name: "Preta - Nidan",
    color: "#111111",
    level: "2º Dan",
    meaning: "Aprimoramento do espírito e da técnica. A fluidez começa a se manifestar naturalmente.",
    requirements: ["Kanku Dai / Jion / Enpi", "Hangetsu / Gankaku", "Jiyu Kumite (Excelência)"]
  },
  {
    id: "black-3",
    name: "Preta - Sandan",
    color: "#111111",
    level: "3º Dan",
    meaning: "O nível onde a técnica e o espírito se unem. O praticante torna-se um líder e exemplo vivo do Dojo Kun.",
    requirements: ["Katas Avançados Específicos (Nijushiho, Gojushiho)", "Tese Escrita", "Bunkai Aplicado Avançado"]
  },
  {
    id: "black-4",
    name: "Preta - Yondan",
    color: "#111111",
    level: "4º Dan",
    meaning: "Maestria técnica. O praticante transcende a mecânica e passa a entender a essência profunda do Karate-Do.",
    requirements: ["Domínio de todos os Katas", "Excelência Técnica e Filosófica", "Contribuição Significativa para a JKA"]
  },
  {
    id: "black-5",
    name: "Preta - Godan",
    color: "#111111",
    level: "5º Dan",
    meaning: "Renshi (Instrutor Avançado). Um nível de iluminação técnica e mental. Reconhecimento internacional da dedicação à arte.",
    requirements: ["Avaliação por painel de mestres JKA", "Vida dedicada ao ensino e difusão do Karate"]
  }`;

data = data.replace(
  /\{\s*id: "black"[\s\S]*?\},/,
  blackBelt
);

fs.writeFileSync('src/data/mockData.ts', data);
