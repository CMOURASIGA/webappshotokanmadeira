# SPEC 05 - SEO, PWA, Performance & Quality

## Status

PLANEJADA

## Pré-requisito

SPEC 04 aprovada em Human Validation.

## Objetivo

Consolidar qualidade técnica, indexação, performance, PWA, analytics e documentação.

## Escopo

### Rotas
Avaliar migração de HashRouter para rotas reais.

Antes de migrar:

- garantir fallback SPA no deploy;
- validar deep links;
- validar compartilhamento;
- evitar quebra de URLs existentes sem estratégia.

### SEO
Criar metadata por tela:

- title;
- description;
- Open Graph;
- Twitter Card;
- canonical.

Exemplo:

Heian Shodan | Madeira Karate Shotokan

### PWA
Revisar:

- manifest;
- icons;
- short_name;
- theme_color;
- background_color;
- apple-touch-icon;
- instalação;
- comportamento mobile.

Avaliar Service Worker para cache de conteúdo educativo.

### Performance
Revisar bundle e dependências.

Avaliar uso real de:

- @google/genai;
- motion;
- express;
- demais dependências.

Aplicar:

- route lazy loading;
- code splitting;
- image lazy loading;
- preload apenas do essencial.

### Analytics
Padronizar eventos:

- click_whatsapp;
- click_instagram;
- view_schedule;
- select_class;
- view_kata;
- view_technique;
- search;
- view_notice;
- view_event;
- view_product;
- click_buy;
- copy_pix.

Evitar coleta desnecessária de dados pessoais.

### Google Sheets
Documentar schema das abas e validar dados antes de renderizar.

Reduzir dependência de any[].

Criar tipos e normalizadores.

### Documentação
Criar ou atualizar:

- docs/UX_UI_GUIDELINES.md
- docs/GOOGLE_SHEETS_SCHEMA.md
- docs/RESPONSIVE_BREAKPOINTS.md
- docs/CONTENT_MANAGEMENT.md

### Footer V2
Revisar footer desktop com atalhos e manter versão compacta no mobile.

### Qualidade
Auditar:

- acessibilidade;
- erros de console;
- falhas de rede;
- imagens;
- Instagram;
- responsividade;
- build.

## Critérios de aceite

- deep links validados;
- metadata adequada;
- PWA validada;
- bundle revisado;
- eventos de analytics documentados;
- schema Google Sheets documentado;
- documentação operacional pronta;
- sem regressões funcionais.

## Human Validation

Obrigatória para encerramento da iniciativa Madeira Karate UX Evolution V2.
