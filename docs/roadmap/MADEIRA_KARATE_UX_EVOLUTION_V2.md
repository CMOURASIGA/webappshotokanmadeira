# Madeira Karate UX Evolution V2 — Roadmap Oficial

## 1. Visão Geral do Produto
O **Dojo Digital Madeira Karate Shotokan & Artes Marciais** é uma plataforma educacional e institucional dedicada ao ensino, preservação e difusão do Karate-Do tradicional estilo Shotokan (linhagem JKA).

A iniciativa **UX Evolution V2** visa transformar a plataforma em uma referência de experiência de usuário, com foco em:
1. **Fidelidade e Respeito Marcial**: Preservação da tradição do Karate Shotokan (Kihon, Kata, Kumite, Dojo Kun e Niju Kun).
2. **Design Editorial e Ergonomia**: Interface fluida, tipografia legível, ausência de poluição visual e suporte responsivo universal (de mobile compacto 320px a ultrawide).
3. **Didática e Aprendizado Real**: Facilidade para alunos e praticantes consultarem katas, termos técnicos, graduações por faixa e novidades do dojo.
4. **Nenhum Placeholder ou Recurso Inativo**: Cada componente, botão e fluxo implementado deve ser 100% funcional.

---

## 2. Princípios de Governança & Execução
- **Execução Sequencial Estrita (Fase por Fase)**: Nenhuma SPEC subsequente pode ser iniciada antes da conclusão e **Human Validation explícita** da SPEC corrente.
- **Preservação de Integridade Técnica**:
  - Todas as rotas existentes (`/`, `/mural`, `/events`, `/schedule`, `/store`, `/katas`, `/katas/:id`, `/techniques`, `/techniques/:id`, `/belts`, `/kata-series`, `/vocabulary`, `/what-is-kata`, `/dojo-kun`, `/history`) devem permanecer íntegras e acessíveis.
  - Compatibilidade com mídias do Instagram (`InstagramEmbed`) e vídeos do YouTube.
  - Testes rigorosos de `npm run lint` e `npm run build` a cada entrega.
- **Transparência de Evidências**: Apresentação de relatórios técnicos de compilação, testes e URLs de validação antes de submeter para aprovação humana.

---

## 3. Matriz de Entregas — SPECs 01 a 05

| SPEC | Nome do Módulo | Status | Descrição Resumida |
| :--- | :--- | :---: | :--- |
| **SPEC 01** | **Responsive Foundation, Navigation & Global Search** | **Aprovada** | Fundação responsiva (320px a 1920px), Splash V2 de 3s, Modal adaptativo de mídia, reorganização de menus (Desktop e Mobile) e Busca Global em tempo real com suporte a teclado. |
| **SPEC 02** | **Home V2 & Experiência de Aprendizado** | **Aprovada** | Reformulação da página inicial: Hero institucional, trilha visual de graduação, atalhos de katas fundamentais, feed do mural e próximos eventos. |
| **SPEC 03** | **Área do Aluno, Continuar Estudando & Favoritos** | **Liberada para desenvolvimento** | Persistência local de progresso, histórico do último kata estudado, marcação de favoritos e checklist de requisitos para exame de faixa. |
| **SPEC 04** | **Loja V2 & Catálogo Integrado** | **Planejada** | Catálogo interativo de kimonos/dogis, faixas, proteções e acessórios do dojo, com carrinho de compras e fechamento direto via WhatsApp oficial. |
| **SPEC 05** | **SEO, PWA & Otimização de Performance** | **Planejada** | Progressive Web App instalável com cache offline de conteúdos teóricos, dados estruturados Schema.org, metadados sociais e pontuação Lighthouse > 90. |

---

## 4. Detalhamento Estrutural das SPECs

### SPEC 01: Responsive Foundation, Navigation & Global Search
- **Responsividade Global**: Eliminação de transbordamento horizontal em todas as viewports (320x568 até 1920x1080).
- **Splash Screen V2**: Duração de 3 segundos, layout vertical no mobile/tablet e horizontal no desktop, kanji discreto sem animação infinita de pulso.
- **Modal Universal de Mídia**: Detecção de aspect ratios (16:9, 3:2, 1:1, 4:5, 9:16) sem corte arbitrário por `object-cover`, fallback amigável de erro e suporte a posts/vídeos do Instagram.
- **Navegação Desktop**: Barra lateral organizada nas seções **PRINCIPAL**, **TREINAMENTO** e **CONHECIMENTO**, com logo em proporção 1:1 sem fundo artificial.
- **Navegação Mobile**: Barra inferior com 4 rotas prioritárias + Drawer completo contendo todas as páginas da academia.
- **Busca Global**: Indexação em tempo real de Katas, Técnicas, Faixas, Vocabulário, Dojo Kun, História, Avisos e Eventos. Navegação completa por teclado (`ArrowDown`, `ArrowUp`, `Enter`, `Escape`) com limite de índice e retorno visual.

### SPEC 02: Home V2 & Experiência de Aprendizado *(Aprovada)*
- **Hero Editorial**: Proposta de valor clara ("Do Branco ao Preto: Disciplina, Tradição e Excelência Técnica").
- **Trilha de Graduação**: Visualização dinâmica da escala de faixas Shotokan com direcionamento para os requisitos de exame.
- **Vitrine de Katas Fundamentais**: Destaque para a série Heian (Shodan a Godan) e Tekki Shodan com contagem de movimentos e embusen.
- **Dojo Kun em Destaque**: Cartão interativo com os 5 princípios éticos do Karateca.
- **Integração Viva**: Cards dinâmicos com os comunicados mais recentes do Mural e avisos de exames/seminários.

### SPEC 03: Área do Aluno, Continuar Estudando & Favoritos *(Liberada)*
- **Registro Local de Progresso**: Armazenamento seguro de katas e técnicas marcados como praticados.
- **Seção "Continuar Estudando"**: Retomada imediata do último conteúdo visualizado pelo aluno na sessão anterior.
- **Favoritos do Karateca**: Coleção rápida de katas e técnicas para revisão pré-treino.
- **Checklist de Exame**: Relação de kihon, kata e kumite exigidos para a graduação seguinte do aluno.

### SPEC 04: Loja V2 & Catálogo Integrado *(Futura)*
- **Catálogo Organizado**: Divisão em Uniformes (Dogis/Kimonos), Faixas Oficiais, Proteções (Protetores bucais, caneleiras, luvas) e Acessórios (Squeezes, Mochilas).
- **Filtros e Detalhes**: Seleção por tamanho (A1 a A4, infantil), cor e tecido.
- **Carrinho e Checkout WhatsApp**: Geração automática de mensagem estruturada para o WhatsApp da secretaria da academia com itens selecionados, tamanhos e valor total.

### SPEC 05: SEO, PWA & Otimização de Performance *(Futura)*
- **PWA Completo**: Manifesto Web, ícones de alta densidade, splash screen nativa de instalação e Service Worker configurado para cache offline de conteúdos teóricos (Katas, Vocabulário e Dojo Kun).
- **SEO & Social Share**: Configuração de metatags OpenGraph/Twitter e marcação Schema.org (`SportsClub`).
- **Performance e Acessibilidade**: Lazy loading de imagens, divisão inteligente de bundles e conformidade com WCAG AA.

