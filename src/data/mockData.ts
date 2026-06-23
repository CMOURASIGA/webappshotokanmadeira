import { Belt, Kata, Technique } from "../types";

export const belts: Belt[] = [
  { 
    id: "white", 
    name: "Branca", 
    color: "#FFFFFF", 
    level: "7º Kyu",
    meaning: "A cor branca representa a pureza, a ingenuidade e a mente limpa do iniciante, pronta para receber os ensinamentos.",
    requirements: ["Conhecimento básico de Dojo Kun", "Bases iniciais (Zenkutsu Dachi)", "Socos básicos (Oi Zuki)"]
  },
  { 
    id: "yellow", 
    name: "Amarela", 
    color: "#FFD700", 
    level: "6º Kyu",
    meaning: "Representa o sol e a luz, o despertar do praticante para os novos conhecimentos e o início do caminho.",
    requirements: ["Heian Shodan", "Kihon Básico", "Defesas essenciais (Gedan Barai, Age Uke)"]
  },
  { 
    id: "red", 
    name: "Vermelha", 
    color: "#BC002D", 
    level: "5º Kyu",
    meaning: "Simboliza o fogo, a paixão, a energia vital e a força de vontade do praticante em evoluir.",
    requirements: ["Heian Nidan", "Kihon Ido (Básicos em movimento)", "Chutes fundamentais (Mae Geri, Yoko Geri)"]
  },
  { 
    id: "orange", 
    name: "Laranja", 
    color: "#F27D26", 
    level: "4º Kyu",
    meaning: "A força do sol se pondo ou nascendo, energia vibrante, crescimento contínuo e consolidação da base.",
    requirements: ["Heian Sandan", "Gohon Kumite (Combate combinado)", "Kiba Dachi"]
  },
  { 
    id: "green", 
    name: "Verde", 
    color: "#4CAF50", 
    level: "3º Kyu",
    meaning: "A floresta, a natureza, o crescimento vigoroso. O praticante começa a criar raízes firmes e a florescer.",
    requirements: ["Heian Yondan", "Kihon Kumite", "Kakiwake Uke"]
  },
  { 
    id: "purple", 
    name: "Roxa", 
    color: "#800080", 
    level: "2º Kyu",
    meaning: "Simboliza o respeito, a dignidade e a maturidade. O conhecimento se torna mais profundo e refinado.",
    requirements: ["Heian Godan", "Jiyu Ippon Kumite (Combate semi-livre)", "Tobi (saltos) e combinações"]
  },
  { 
    id: "brown", 
    name: "Marrom", 
    color: "#8B4513", 
    level: "1º Kyu",
    meaning: "A cor da terra. Representa a solidez, estabilidade e uma fundação inabalável, preparando-se para o mestrado.",
    requirements: ["Tekki Shodan", "Katas Avançados", "Jiyu Kumite (Combate livre)"]
  },
  { 
    id: "black", 
    name: "Preta", 
    color: "#111111", 
    level: "1º Dan",
    meaning: "A junção de todas as cores. Representa a mente vazia (mushin), humildade, e o início de uma nova jornada como mestre e eterno aprendiz.",
    requirements: ["Domínio completo dos Heian e Tekki", "Bunkai avançado", "Maturidade e conduta exemplar", "Dedicação e ensino"]
  },
];

export const techniques: Technique[] = [
  // BASES
  {
    id: "t1",
    nameJp: "Zenkutsu Dachi",
    namePt: "Base Avançada",
    category: "Base",
    recommendedBeltId: "white",
    description: "Base longa e forte para frente. O peso é distribuído 60% na perna da frente e 40% na perna de trás.",
    steps: [
      "Posicione a perna da frente flexionada, com o joelho alinhado ao dedão do pé.",
      "A perna de trás deve estar esticada e travada.",
      "Pés afastados na largura dos ombros.",
      "O pé da frente aponta para frente, o de trás levemente para fora (cerca de 30 a 45 graus)."
    ],
    commonErrors: [
      "Base muito estreita (um pé atrás do outro).",
      "Joelho da frente caindo para dentro.",
      "Calcanhar de trás levantado."
    ],
    application: "Base principal para ataques diretos fortes e defesas sólidas."
  },
  {
    id: "t2",
    nameJp: "Kokutsu Dachi",
    namePt: "Base Recuada",
    category: "Base",
    recommendedBeltId: "yellow",
    description: "Base recuada, ideal para defesas. O peso é distribuído 70% na perna de trás e 30% na perna da frente.",
    steps: [
      "Os calcanhares ficam na mesma linha.",
      "Pé de trás apontado para fora a 90 graus, pé da frente apontado para a frente.",
      "Ambos os joelhos flexionados e tensionados para fora.",
      "Tronco reto, meio de lado."
    ],
    commonErrors: [
      "Peso excessivo na perna da frente.",
      "Joelho de trás caindo para dentro.",
      "Tronco inclinado."
    ],
    application: "Bloqueios recuados e preparação para contra-ataques com a perna da frente (como Mae Geri)."
  },
  {
    id: "t3",
    nameJp: "Kiba Dachi",
    namePt: "Base do Cavaleiro",
    category: "Base",
    recommendedBeltId: "orange",
    description: "Base forte lateral, com o peso distribuído igualmente (50/50) nas duas pernas.",
    steps: [
      "Pés paralelos, afastados a cerca de duas vezes a largura dos ombros.",
      "Joelhos flexionados e forçados para fora.",
      "Costas retas, quadril encaixado e baixo."
    ],
    commonErrors: [
      "Pés apontados para fora (formando um 'V').",
      "Joelhos caídos para dentro.",
      "Quadril empinado para trás."
    ],
    application: "Ataques laterais, como Yoko Geri e Empi Uchi, e defesas de perfil."
  },

  // SOCOS / ATAQUES DE BRAÇO
  {
    id: "t4",
    nameJp: "Oi Zuki",
    namePt: "Soco Avançando",
    category: "Soco",
    recommendedBeltId: "white",
    description: "Soco direto executado com o braço do mesmo lado da perna que avança.",
    steps: [
      "Inicie na base Zenkutsu Dachi.",
      "Avance a perna de trás, mantendo a altura do quadril.",
      "Enquanto avança, prepare o soco com a mão na cintura (hikite).",
      "Gire o quadril e estenda o braço simultaneamente com o passo final.",
      "Trave a postura e o golpe ao mesmo tempo (Kime)."
    ],
    commonErrors: [
      "Levantar o corpo durante o passo.",
      "Socar antes de terminar o passo.",
      "Ombros tensos e altos."
    ],
    application: "Ataque fulminante usando o peso do corpo avançando contra o oponente."
  },
  {
    id: "t5",
    nameJp: "Gyaku Zuki",
    namePt: "Soco Contrário",
    category: "Soco",
    recommendedBeltId: "yellow",
    description: "Soco executado com o braço contrário à perna que está na frente.",
    steps: [
      "O poder vem da rotação do quadril (hanmi para shomen).",
      "Empurre a perna de trás firmemente contra o chão.",
      "Gire o quadril para a frente de forma explosiva.",
      "O soco acompanha o movimento do quadril enquanto o outro braço puxa o hikite."
    ],
    commonErrors: [
      "Bater apenas com a força do braço, sem usar o quadril.",
      "Levantar o calcanhar da perna de trás.",
      "Mover a perna da frente durante o golpe."
    ],
    application: "O golpe de contra-ataque mais comum e poderoso no Karate (Ikken Hissatsu)."
  },
  {
    id: "t6",
    nameJp: "Kizami Zuki",
    namePt: "Soco com a Mão da Frente",
    category: "Soco",
    recommendedBeltId: "orange",
    description: "Soco rápido e de alcance, executado com o braço da frente enquanto o quadril vira de lado.",
    steps: [
      "A partir de uma postura de luta, estique o braço da frente em direção ao alvo.",
      "Vire o quadril e os ombros (hanmi) para maximizar o alcance e minimizar seu alvo.",
      "Empurre o chão com o pé de trás para gerar velocidade."
    ],
    commonErrors: [
      "Não virar o quadril o suficiente (perda de alcance).",
      "Deixar a guarda cair.",
      "Inclinar a cabeça para a frente."
    ],
    application: "Interceptar o ataque do oponente, fintar ou pontuar rapidamente em competições."
  },
  {
    id: "t7",
    nameJp: "Nukite",
    namePt: "Mão de Lança",
    category: "Mão Aberta",
    recommendedBeltId: "green",
    description: "Ataque penetrante usando as pontas dos dedos esticadas e unidas.",
    steps: [
      "A mão é mantida aberta com os dedos rígidos e o polegar dobrado.",
      "O movimento de estocada é semelhante ao de um soco direto.",
      "Geralmente executado visando pontos vitais (garganta, plexo solar)."
    ],
    commonErrors: [
      "Dedos relaxados, risco de lesão.",
      "Dobra no pulso durante o impacto."
    ],
    application: "Ataque focado em áreas macias e vitais que não requer força bruta, mas precisão."
  },
  {
    id: "t8",
    nameJp: "Uraken Uchi",
    namePt: "Batida com as Costas do Punho",
    category: "Mão Aberta",
    recommendedBeltId: "purple",
    description: "Um golpe em chicote realizado com as costas da mão fechada (punho).",
    steps: [
      "O cotovelo serve como eixo do movimento.",
      "O antebraço é lançado para fora em um movimento circular e rápido.",
      "O punho deve ser recolhido imediatamente após o impacto."
    ],
    commonErrors: [
      "Mover o ombro em vez do cotovelo.",
      "Não fazer o movimento de chicote (recolher)."
    ],
    application: "Ataque rápido ao rosto ou têmpora, muito útil a curta distância."
  },

  // DEFESAS
  {
    id: "t9",
    nameJp: "Gedan Barai",
    namePt: "Defesa Baixa",
    category: "Defesa",
    recommendedBeltId: "white",
    description: "Defesa com varredura do braço de cima para baixo, protegendo a área do baixo ventre.",
    steps: [
      "Cruze os braços na altura do peito, com o braço que vai defender por cima, próximo à orelha oposta.",
      "Desça o braço em um movimento semicircular bloqueando o ataque.",
      "O braço oposto puxa vigorosamente para a cintura (hikite).",
      "O movimento termina a cerca de um palmo da coxa da frente."
    ],
    commonErrors: [
      "Movimento reto, sem o giro final do antebraço.",
      "Puxada fraca do hikite.",
      "Braço terminando muito longe ou encostado na perna."
    ],
    application: "Bloquear chutes frontais ou ataques baixos direcionados ao abdômen inferior."
  },
  {
    id: "t10",
    nameJp: "Age Uke",
    namePt: "Defesa Alta Ascendente",
    category: "Defesa",
    recommendedBeltId: "white",
    description: "Defesa direcionada para cima para proteger a cabeça de ataques verticais ou frontais.",
    steps: [
      "O braço que defende sobe cruzando à frente do corpo.",
      "Ao chegar acima da cabeça, o antebraço gira fortemente para fora.",
      "O braço fica acima da testa, ligeiramente inclinado para desviar o impacto."
    ],
    commonErrors: [
      "O braço fica muito próximo da testa (o golpe passa).",
      "Ombro levantado (tensão excessiva).",
      "Não cruzar os braços na preparação."
    ],
    application: "Bloquear ataques direcionados ao rosto (Jodan) como socos altos ou batidas de bastão."
  },
  {
    id: "t11",
    nameJp: "Soto Uke",
    namePt: "Defesa de Fora para Dentro",
    category: "Defesa",
    recommendedBeltId: "yellow",
    description: "Bloqueio de nível médio, trazendo o braço de fora do corpo para o centro.",
    steps: [
      "Levante o braço defensor ao lado da orelha (cotovelo na altura do ombro).",
      "Traga o braço em arco em direção ao centro do corpo.",
      "O antebraço gira na hora do impacto, desviando o golpe.",
      "Termina na altura do ombro oposto com o cotovelo a um palmo das costelas."
    ],
    commonErrors: [
      "Movimento apenas de braço, sem envolver o quadril (hanmi).",
      "Cotovelo muito aberto ao final da defesa.",
      "Bater no golpe em vez de desviar."
    ],
    application: "Defender socos ou ataques diretos à região do tórax/estômago (Chudan)."
  },
  {
    id: "t12",
    nameJp: "Uchi Uke",
    namePt: "Defesa de Dentro para Fora",
    category: "Defesa",
    recommendedBeltId: "yellow",
    description: "Bloqueio de nível médio, onde o braço se move do centro do corpo para fora.",
    steps: [
      "O braço que defende cruza debaixo do braço do hikite na altura da axila oposta.",
      "O braço é projetado para frente e para fora em um arco semicircular.",
      "O antebraço gira para fora, bloqueando com a parte externa."
    ],
    commonErrors: [
      "Não puxar bem o braço na preparação (axila).",
      "Fazer a defesa muito curta ou muito estendida.",
      "Ombros desalinhados."
    ],
    application: "Desviar golpes na região do tronco empurrando o ataque para o exterior da linha do corpo."
  },
  {
    id: "t13",
    nameJp: "Shuto Uke",
    namePt: "Defesa com a Faca da Mão",
    category: "Defesa",
    recommendedBeltId: "orange",
    description: "A clássica defesa em base Kokutsu Dachi usando a borda externa da mão aberta.",
    steps: [
      "A mão de defesa vai até a orelha oposta, mão aberta.",
      "O braço desce varrendo para frente e para o lado.",
      "A mão do hikite vai para o plexo solar (aberta).",
      "A batida final é feita com a borda externa (faca) da mão."
    ],
    commonErrors: [
      "Mão do hikite indo para a faixa ao invés do plexo.",
      "Dedos separados ou frouxos.",
      "Cortar para baixo em vez de para a frente e para fora."
    ],
    application: "Bloqueio forte que instantaneamente posiciona a mão para agarrar o adversário ou contra-atacar."
  },

  // CHUTES
  {
    id: "t14",
    nameJp: "Mae Geri",
    namePt: "Chute Frontal",
    category: "Chute",
    recommendedBeltId: "yellow",
    description: "Chute reto para frente utilizando a bola do pé (Koshi).",
    steps: [
      "Eleve o joelho o mais alto e rápido possível (k抱ekomi).",
      "Estenda a perna fortemente em direção ao alvo usando o quadril.",
      "Acerte com a bola do pé, mantendo os dedos retraídos.",
      "Puxe o pé rapidamente de volta (hiki-ashi) antes de pisar no chão."
    ],
    commonErrors: [
      "Não puxar a perna de volta, caindo para a frente.",
      "Bater com os dedos em vez da base do pé.",
      "Inclinar o corpo muito para trás."
    ],
    application: "Ataque incisivo ao abdômen, virilha ou queixo."
  },
  {
    id: "t15",
    nameJp: "Mawashi Geri",
    namePt: "Chute Circular",
    category: "Chute",
    recommendedBeltId: "green",
    description: "Um chute que vem de fora para dentro num movimento circular, acertando com a bola do pé ou peito do pé.",
    steps: [
      "Levante o joelho lateralmente.",
      "Gire o pé de apoio, abrindo os quadris.",
      "Solte a perna em um movimento chicoteante de fora para dentro.",
      "Acerte o alvo e recolha a perna."
    ],
    commonErrors: [
      "Não girar o pé de apoio, causando tensão no joelho.",
      "Fazer o movimento como um chute frontal que apenas vira no final.",
      "Falta de hiki-ashi (recolhimento)."
    ],
    application: "Golpear as laterais do corpo: costelas, pernas ou a lateral da cabeça."
  },
  {
    id: "t16",
    nameJp: "Yoko Geri (Keage / Kekomi)",
    namePt: "Chute Lateral",
    category: "Chute",
    recommendedBeltId: "orange",
    description: "Chute desferido para o lado, atingindo o alvo com a faca do pé (Sokuto). Keage é ascendente/chicote, Kekomi é penetrante.",
    steps: [
      "Para ambos, levante o joelho da perna que vai chutar na frente do corpo, virando o pé de apoio.",
      "Keage: o pé chicoteia para cima e para fora.",
      "Kekomi: o pé é empurrado em linha reta perfurando o alvo.",
      "Impacto sempre com a borda externa do pé (Sokuto)."
    ],
    commonErrors: [
      "Bater com a sola do pé inteira ou calcanhar sem posicionar o Sokuto.",
      "No Kekomi, não empurrar com o quadril."
    ],
    application: "Ataque extremamente forte para afastar oponentes ou focar em costelas e joelhos."
  }
];

export const katas: Kata[] = [
  {
    id: "heian-shodan",
    name: "Heian Shodan",
    meaning: "Paz e Tranquilidade - Nível Inicial",
    group: "Heian",
    level: "Iniciante",
    recommendedBeltId: "yellow",
    movementsCount: 21,
    description: "O primeiro kata da série Heian, foca em bases sólidas (Zenkutsu e Kokutsu Dachi), defesas básicas e socos no nível Chudan e Jodan.",
    movements: [
      "1. Olhe para a esquerda, Gedan Barai (Zenkutsu Dachi)",
      "2. Avance com Oi Zuki Chudan (Zenkutsu Dachi)",
      "3. Gire 180º, Gedan Barai (Zenkutsu Dachi) para a direita",
      "4. Puxe pé, Tetsui Uchi Jodan",
      "5. Avance com Oi Zuki Chudan (Zenkutsu Dachi)",
      "6. Olhe para frente, Gedan Barai (Zenkutsu Dachi)",
      "7. Avance com Age Uke Jodan (Zenkutsu Dachi)",
      "8. Avance com Age Uke Jodan (Zenkutsu Dachi)",
      "9. Avance com Age Uke Jodan (Zenkutsu Dachi) - KIAI",
      "10. Gire 270º para esquerda, Gedan Barai (Zenkutsu Dachi)",
      "11. Avance Oi Zuki Chudan",
      "12. Gire 180º direita, Gedan Barai",
      "13. Avance Oi Zuki Chudan",
      "14. Olhe para trás, Gedan Barai",
      "15. Avance Oi Zuki",
      "16. Avance Oi Zuki",
      "17. Avance Oi Zuki - KIAI",
      "18. Gire 270º, Shuto Uke (Kokutsu Dachi)",
      "19. Avance Shuto Uke (Kokutsu Dachi em 45º)",
      "20. Gire 135º direita, Shuto Uke (Kokutsu Dachi)",
      "21. Avance Shuto Uke (Kokutsu Dachi em 45º)"
    ],
    mainTechniques: ["Zenkutsu Dachi", "Gedan Barai", "Oi Zuki", "Age Uke", "Kokutsu Dachi", "Shuto Uke"],
    bunkai: "Defesa contra múltiplos atacantes agarrando e socando. Ensina transição de peso e contra-ataques diretos.",
    attentionPoints: [
      "Postura correta nas transições de Zenkutsu para Kokutsu Dachi.",
      "Força no hikite ao realizar os Age Uke.",
      "Giro rápido e firme do quadril."
    ],
    commonErrors: [
      "Olhar para o chão.",
      "Base fraca ou desalinhada.",
      "Falta de kime (foco) ao finalizar os golpes."
    ]
  },
  {
    id: "heian-nidan",
    name: "Heian Nidan",
    meaning: "Paz e Tranquilidade - Nível 2",
    group: "Heian",
    level: "Iniciante",
    recommendedBeltId: "red",
    movementsCount: 26,
    description: "Segundo kata da série Heian. Introduz chutes (Yoko Geri e Mae Geri) e combinações mais elaboradas como a defesa dupla no início.",
    movements: [
      "1. Esquerda Kokutsu Dachi, Jodan Haiwan Uke e Jodan Kamae",
      "2. Mesma base, Tetsui Uchi / Jodan Uke duplo",
      "3. Direita Kokutsu Dachi, Jodan Haiwan Uke e Jodan Kamae",
      "4. Mesma base, Tetsui Uchi / Jodan Uke duplo",
      "5. ...",
      "(Abreviado para o mock)"
    ],
    mainTechniques: ["Kokutsu Dachi", "Haiwan Uke", "Yoko Geri", "Mae Geri", "Gyaku Zuki"],
    bunkai: "Combinações de bloqueios com contra-ataques simultâneos, libertação de agarres.",
    attentionPoints: [
      "Equilíbrio durante os chutes.",
      "Coordenação braço/perna."
    ],
    commonErrors: [
      "Levantar nos chutes.",
      "Kokutsu muito curto."
    ]
  },
  {
    id: "heian-sandan",
    name: "Heian Sandan",
    meaning: "Paz e Tranquilidade - Nível 3",
    group: "Heian",
    level: "Iniciante",
    recommendedBeltId: "orange",
    movementsCount: 20,
    description: "Terceiro kata da série. Introduz a base Kiba Dachi (Base do Cavaleiro) de forma mais predominante.",
    movements: ["(Abreviado para o mock)"],
    mainTechniques: ["Kiba Dachi", "Uchi Uke", "Nukite"],
    bunkai: "Libertação de imobilizações (agarrões de pulso).",
    attentionPoints: ["Firmeza na base Kiba Dachi."],
    commonErrors: ["Kiba Dachi muito alta."]
  },
  {
    id: "heian-yondan",
    name: "Heian Yondan",
    meaning: "Paz e Tranquilidade - Nível 4",
    group: "Heian",
    level: "Iniciante",
    recommendedBeltId: "green",
    movementsCount: 27,
    description: "Quarto kata da série. Foco em movimentos abertos, duplos e introduz técnicas de chute com as mãos (Kakiwake Uke).",
    movements: ["(Abreviado para o mock)"],
    mainTechniques: ["Kakiwake Uke", "Mae Geri", "Shuto Uke"],
    bunkai: "Defesa e contra-ataque contra múltiplos agressores em curta distância.",
    attentionPoints: ["Movimentação fluida entre as defesas duplas."],
    commonErrors: ["Perda de equilíbrio no Mae Geri pós Kakiwake Uke."]
  },
  {
    id: "heian-godan",
    name: "Heian Godan",
    meaning: "Paz e Tranquilidade - Nível 5",
    group: "Heian",
    level: "Iniciante",
    recommendedBeltId: "purple",
    movementsCount: 23,
    description: "Último kata da série Heian. Introduz salto (tobi) e várias bases e posições corporais avançadas.",
    movements: ["(Abreviado para o mock)"],
    mainTechniques: ["Mizu Nagare Kamae", "Tobi", "Mikazuki Geri"],
    bunkai: "Defesa contra bastão (bo) e varreduras.",
    attentionPoints: ["Aterrissagem do salto."],
    commonErrors: ["Pousar desequilibrado após o Tobi."]
  },
  {
    id: "tekki-shodan",
    name: "Tekki Shodan",
    meaning: "Cavaleiro de Ferro - Nível 1",
    group: "Tekki",
    level: "Intermediário",
    recommendedBeltId: "brown",
    movementsCount: 29,
    description: "Kata executado linearmente e focado em combates laterais e à curta distância em Kiba Dachi.",
    movements: ["(Abreviado para o mock)"],
    mainTechniques: ["Kiba Dachi", "Nami Gaeshi"],
    bunkai: "Defesas baixas (varreduras) e combates em espaços confinados (costas na parede).",
    attentionPoints: ["Altura constante do quadril."],
    commonErrors: ["Levantar nos Nami Gaeshi."]
  },
  {
    id: "bassai-dai",
    name: "Bassai Dai",
    meaning: "Romper a Fortaleza (Maior)",
    group: "Avançado",
    level: "Avançado",
    recommendedBeltId: "black",
    movementsCount: 42,
    description: "Representa a superação de obstáculos, executado com forte espírito de quebra (penetração de defesas).",
    movements: ["(Abreviado para o mock)"],
    mainTechniques: ["Sochin Dachi", "Soto Uke", "Yama Zuki"],
    bunkai: "Transições de defesas poderosas para ataques definitivos.",
    attentionPoints: ["Diferenciação clara entre movimentos rápidos e lentos."],
    commonErrors: ["Falta de força no Yama Zuki."]
  },
  {
    id: "kanku-dai",
    name: "Kanku Dai",
    meaning: "Contemplar o Céu (Maior)",
    group: "Avançado",
    level: "Avançado",
    recommendedBeltId: "black",
    movementsCount: 65,
    description: "Kata muito longo. É considerado o kata principal do qual surgiram os Heians.",
    movements: ["(Abreviado para o mock)"],
    mainTechniques: ["Shuto Uke", "Manji Uke", "Nidan Geri"],
    bunkai: "Diversos cenários defensivos, simula combates em todas as direções.",
    attentionPoints: ["Resistência e manutenção do kime até o final do kata."],
    commonErrors: ["Perda de foco ou energia no terço final."]
  },
  {
    id: "empi",
    name: "Empi",
    meaning: "O Voo da Andorinha",
    group: "Avançado",
    level: "Avançado",
    recommendedBeltId: "black",
    movementsCount: 37,
    description: "Kata muito rápido com subidas e descidas ágeis que lembram o voo de uma andorinha.",
    movements: ["(Abreviado para o mock)"],
    mainTechniques: ["Age Zuki", "Tobi"],
    bunkai: "Agarrões na gola e evasões ágeis contra oponentes maiores.",
    attentionPoints: ["Agilidade e mudança repentina de altura."],
    commonErrors: ["Aterrissar pesado no salto final."]
  },
  {
    id: "jion",
    name: "Jion",
    meaning: "Nome do Templo (Amor e Bondade)",
    group: "Avançado",
    level: "Avançado",
    recommendedBeltId: "black",
    movementsCount: 47,
    description: "Kata forte, baseado em bases sólidas e técnicas retilíneas. Relacionado à tradição budista.",
    movements: ["(Abreviado para o mock)"],
    mainTechniques: ["Zenkutsu Dachi", "Manji Uke", "Teisho Uchi"],
    bunkai: "Lutas potentes contra ataques frontais e laterais simultâneos.",
    attentionPoints: ["Bases extremamente longas e força constante."],
    commonErrors: ["Bases encurtadas."]
  }
  // Os outros katas são listados na prática, mas para manter o mockData rápido, deixamos 10 exemplos primários.
];
