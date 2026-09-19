# SPEC 05 — SEO, PWA & Otimização de Performance

> **Status:** PLANEJADA (Etapa final de consolidação técnica).

---

## 1. Objetivo
Tornar o Dojo Digital Madeira Karate uma aplicação web progressiva (PWA) de alto desempenho, instalável em dispositivos móveis e desktops, com excelente indexação nos mecanismos de busca e experiência offline para estudos técnicos de Karate.

---

## 2. Escopo Funcional

### 2.1. Configuração PWA Completa
- **Web App Manifest**: Configuração rigorosa de nome, descrição, cores do tema (`theme_color: "#BC002D"` e `background_color: "#121212"`), ícones em múltiplos formatos (192x192, 512x512, maskable) e orientação preferencial.
- **Service Worker & Cache Offline**:
  - Cache prioritário para páginas de estudo (Katas, Vocabulário, Faixas e Dojo Kun).
  - Capacidade de consulta do catálogo de katas mesmo em locais com sinal fraco ou sem internet (ex: ginásios de competição).
- **Banner de Instalação**: Prompt nativo sutil e discreto convidando o aluno a adicionar o aplicativo à tela inicial do celular.

### 2.2. SEO Avançado & Social Share Cards
- **Metatags OpenGraph & Twitter**: Imagens de pré-visualização, títulos descritivos e metadados para compartilhamento no WhatsApp, Instagram e redes sociais.
- **Dados Estruturados Schema.org**: Marcação de `SportsClub` e `MartialArtsSchool` com dados de endereço, horários de treino e modalidades ensinadas.
- **Sitemap & Robots**: Estruturação completa para indexação de todas as rotas públicas.

### 2.3. Otimização de Performance & Acessibilidade
- **Code Splitting & Lazy Loading**: Divisão sob demanda dos módulos de rota e mídia pesada.
- **Métricas Core Web Vitals**: LCP < 2.5s, FID/INP < 200ms, CLS < 0.1.
- **Pontuação Alvo no Google Lighthouse**: > 90 pontos em Performance, Acessibilidade, Melhores Práticas e SEO.
