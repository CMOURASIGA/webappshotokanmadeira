const fs = require('fs');

const missingKatas = [
  { id: "tekki-nidan", name: "Tekki Nidan", group: "Tekki", meaning: "Cavaleiro de Ferro 2" },
  { id: "tekki-sandan", name: "Tekki Sandan", group: "Tekki", meaning: "Cavaleiro de Ferro 3" },
  { id: "bassai-sho", name: "Bassai Sho", group: "Avançado", meaning: "Romper a Fortaleza - Menor" },
  { id: "kanku-sho", name: "Kanku Sho", group: "Avançado", meaning: "Contemplar o Céu - Menor" },
  { id: "jitte", name: "Jitte", group: "Avançado", meaning: "Dez Mãos" },
  { id: "hangetsu", name: "Hangetsu", group: "Avançado", meaning: "Meia Lua" },
  { id: "gankaku", name: "Gankaku", group: "Avançado", meaning: "Grou sobre a rocha" },
  { id: "sochin", name: "Sochin", group: "Avançado", meaning: "Força e Calma / Imóvel na batalha" },
  { id: "chinte", name: "Chinte", group: "Avançado", meaning: "Mãos Raras / Mãos Incomuns" },
  { id: "jiin", name: "Jiin", group: "Avançado", meaning: "Amor do Templo / Terra do Templo" },
  { id: "nijushiho", name: "Nijushiho", group: "Avançado", meaning: "Vinte e quatro passos" },
  { id: "meikyo", name: "Meikyo", group: "Avançado", meaning: "Espelho Limpo" },
  { id: "unsu", name: "Unsu", group: "Avançado", meaning: "Mãos de Nuvem" },
  { id: "wankan", name: "Wankan", group: "Avançado", meaning: "Coroa do Rei" },
  { id: "gojushiho-dai", name: "Gojushiho Dai", group: "Avançado", meaning: "Cinquenta e quatro passos - Maior" },
  { id: "gojushiho-sho", name: "Gojushiho Sho", group: "Avançado", meaning: "Cinquenta e quatro passos - Menor" }
];

const newKatasString = missingKatas.map(k => `  {
    id: "${k.id}",
    name: "${k.name}",
    meaning: "${k.meaning}",
    group: "${k.group}",
    level: "Avançado / Superior",
    recommendedBeltId: "black",
    movementsCount: 0,
    videoUrl: "",
    description: "Kata superior do estilo Shotokan.",
    movements: ["1. Saudação inicial", "2. Movimentos do kata...", "3. Conclusão"],
    mainTechniques: [],
    bunkai: "Aplicações de defesa pessoal avançadas.",
    attentionPoints: ["Foco na dinâmica de contração e expansão."],
    commonErrors: ["Falta de entendimento das aplicações (Bunkai)."]
  }`).join(",\n");

let content = fs.readFileSync('src/data/mockData.ts', 'utf8');
content = content.replace(/\];\s*$/, ',\n' + newKatasString + '\n];\n');
fs.writeFileSync('src/data/mockData.ts', content);
console.log("Katas adicionados!");
