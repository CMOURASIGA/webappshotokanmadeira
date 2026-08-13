import fs from 'fs';
let data = fs.readFileSync('src/data/mockData.ts', 'utf8');

// Yellow
data = data.replace(
  '    requirements: ["Conhecimento básico de Dojo Kun", "Bases iniciais (Zenkutsu Dachi)", "Socos básicos (Oi Zuki)"]',
  '    requirements: ["Heian Shodan", "Kihon (Bases Básicas)", "Gohon Kumite (5 Passos)"]'
);
// Red
data = data.replace(
  '    requirements: ["Heian Nidan", "Bases intermediárias", "Início do Kumite"]',
  '    requirements: ["Heian Nidan", "Kihon (Kokutsu Dachi)", "Kihon Ippon Kumite"]'
);
// Orange
data = data.replace(
  '    requirements: ["Heian Sandan", "Chutes avançados", "Combinações"]',
  '    requirements: ["Heian Sandan", "Kihon (Kiba Dachi)", "Kihon Ippon Kumite"]'
);
// Green
data = data.replace(
  '    requirements: ["Heian Yondan", "Refinamento técnico", "Kime"]',
  '    requirements: ["Heian Yondan", "Jiyu Ippon Kumite", "Yoko Geri Keage/Kekomi"]'
);
// Purple
data = data.replace(
  '    requirements: ["Heian Godan", "Técnicas de salto", "Início dos Tekkis"]',
  '    requirements: ["Heian Godan", "Tekki Shodan", "Jiyu Ippon Kumite (Firme)"]'
);
// Brown
data = data.replace(
  '    requirements: ["Tekki Shodan", "Katas Avançados", "Jiyu Kumite (Combate livre)"]',
  '    requirements: ["Bassai Dai", "Jion / Empi / Kanku Dai", "Jiyu Kumite (Combate Livre)"]'
);

fs.writeFileSync('src/data/mockData.ts', data);
