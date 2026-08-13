const fs = require('fs');
let data = fs.readFileSync('src/data/mockData.ts', 'utf8');

// Add videoUrl to Heian Shodan
data = data.replace(
  '    description: "O primeiro kata da série Heian',
  '    videoUrl: "https://www.youtube.com/embed/9B4jM80-P7E",\n    description: "O primeiro kata da série Heian'
);

// Add videoUrl to Heian Nidan
data = data.replace(
  '    description: "Introduz chutes',
  '    videoUrl: "https://www.youtube.com/embed/yPxyW40vQO4",\n    description: "Introduz chutes'
);

fs.writeFileSync('src/data/mockData.ts', data);
