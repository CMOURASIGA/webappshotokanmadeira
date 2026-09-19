# Madeira Karate UX Evolution V2

## Objetivo

Evoluir o site Madeira Karate de um portal predominantemente de estudo para uma experiência completa da academia, atendendo alunos atuais e novos visitantes.

A evolução deve preservar funcionalidades existentes, melhorar responsividade, navegação, descoberta de conteúdo, conversão, acessibilidade, performance e consistência visual.

## Princípios

- Mobile-first sem prejudicar tablet, notebook e desktop.
- Não quebrar fluxos existentes.
- Não reescrever o projeto inteiro.
- Entregas incrementais com preview e Human Validation.
- Preservar compatibilidade com Google Sheets quando possível.
- Nenhuma mudança de schema sem documentação.
- Componentes reutilizáveis e consistência visual.
- Evitar elementos que aparentem funcionalidade sem realmente funcionar.
- Imagens de conteúdo não devem ser cortadas quando houver risco de perda de texto, logos, datas ou pessoas.
- Respeitar prefers-reduced-motion e requisitos básicos de acessibilidade.

## Fases

### SPEC 01
Responsive Foundation, Navigation & Search

Arquivo:
docs/roadmap/SPEC_01_RESPONSIVE_FOUNDATION_NAVIGATION_AND_SEARCH.md

### SPEC 02
Home V2 & Visitor Experience

Arquivo:
docs/roadmap/SPEC_02_HOME_V2_AND_VISITOR_EXPERIENCE.md

### SPEC 03
Training Experience & Student Tools

Arquivo:
docs/roadmap/SPEC_03_TRAINING_EXPERIENCE_AND_STUDENT_TOOLS.md

### SPEC 04
Commerce, Events & Engagement

Arquivo:
docs/roadmap/SPEC_04_COMMERCE_EVENTS_AND_ENGAGEMENT.md

### SPEC 05
SEO, PWA, Performance & Quality

Arquivo:
docs/roadmap/SPEC_05_SEO_PWA_PERFORMANCE_AND_QUALITY.md

## Processo obrigatório

Cada SPEC deve seguir:

1. branch própria;
2. implementação incremental;
3. lint/typecheck/build;
4. preview;
5. Human Validation;
6. somente após aprovação iniciar a próxima SPEC.

Não iniciar SPEC 02 antes da aprovação humana da SPEC 01.
