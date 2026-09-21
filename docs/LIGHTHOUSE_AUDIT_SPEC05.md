# Evidência de Auditoria Lighthouse — SPEC 05 (SEO, PWA & Performance)

> **Status:** AUDITORIA OFICIAL REGISTRADA — SPEC 05 APROVADA EM HUMAN VALIDATION EM 21/09/2026.

---

## 1. Dados e Ambiente da Medição

- **Data da Medição:** 21 de Setembro de 2026
- **Horário:** 12:14:51 UTC (Desktop) / 12:15:26 UTC (Mobile)
- **URL Auditada:** `http://127.0.0.1:4173/` (Build de Produção minificado, servido via `vite preview`)
- **Motor / Ferramenta:** Google Lighthouse 12.x / Chrome for Testing 153.0.8010.52 (Headless, `--no-sandbox`)
- **Ambiente de Execução:** Container Linux sandboxed

---

## 2. Resultados Reais Obtidos

### Desktop (Preset Desktop)
- **Performance:** 55
- **Accessibility:** 100
- **Best Practices:** 96
- **SEO:** 100

### Mobile (Emulação Moto G Power com Throttling de CPU 4x e Rede Móvel)
- **Performance:** 33
- **Accessibility:** 100
- **Best Practices:** 96
- **SEO:** 100
- **CLS (Cumulative Layout Shift) Mobile:** 0.001 (Estabilidade visual de excelência)

---

## 3. Principais Otimizações Validadas nesta Etapa

1. **Acessibilidade Plena (100/100):**
   - Contraste de cores corrigido e validado em conformidade com WCAG AA (inclusive em badges, chips de categoria, rodapé móvel e estados desabilitados).
   - Hierarquia semântica sequencial de cabeçalhos (`h1`, `h2`, `h3`).
   - Alinhamento de nomes acessíveis e rótulos visíveis (critério *Label in Name* do botão global de busca).

2. **Melhores Práticas (96/100) & Segurança:**
   - Remoção de `<iframe>`s e scripts de terceiros de redes sociais no carregamento da aplicação.
   - Substituição do `InstagramEmbed` por preview nativo ultraleve com link externo seguro (`rel="noopener noreferrer"`).
   - Zero vulnerabilidades conhecidas ou APIs obsoletas no boot.

3. **SEO Técnico e Dados Estruturados (100/100):**
   - `index.html` com canonical, meta description e OpenGraph completos.
   - `sitemap.xml` e `robots.txt` estruturados e validados.
   - JSON-LD estruturado cobrindo `WebApplication` e `SportsOrganization` com dados institucionais oficiais.

4. **PWA Completo:**
   - Manifesto Web (`manifest.json`) com ícones, tema institucional e display standalone.
   - Service Worker Workbox gerado na compilação, com precache estático e rotas offline preparadas.
   - Prompt customizado e discreto para instalação.

5. **Estabilidade de Layout (CLS = 0.001):**
   - Eliminação de pulos visuais em banners, popups e avisos através de dimensões explícitas (`width`/`height`) e proporções reservadas.

---

## 4. Principais Limitações Observadas e Causa Raiz da Performance

- **Arquitetura SPA Client-Side (React + Vite):**
  - Toda a lógica de renderização, roteamento de componentes educativos (katas, kihon, faixas, vocabulário, dojo kun, área do aluno e catálogo de produtos) é interpretada pelo navegador no cliente.
  - Sob as condições estritas do Lighthouse Mobile (emulação de CPU 4x mais lenta do Moto G Power), o parsing e a hidratação inicial do JavaScript geram um **Total Blocking Time (TBT)** elevado na thread principal antes da interatividade total (TTI).
- **Tipografia Externa (Google Fonts):**
  - Embora otimizada com `preconnect` e `display=optional`, o fetch em rede móvel emulada adiciona latência no First Contentful Paint (FCP) e Largest Contentful Paint (LCP).

---

## 5. Oportunidades Futuras de Evolução

1. **Auto-hospedagem de Fontes (Self-Hosting):**
   - Empacotar os arquivos WOFF2 de `Inter`, `Noto Sans JP` e `Playfair Display` localmente em `/public/fonts` para eliminar a resolução DNS externa do Google Fonts.
2. **Arquitetura SSR / SSG (Server-Side Rendering / Static Site Generation):**
   - Em fases futuras além da V2, migração de rotas puramente estáticas/institucionais para um framework com SSG (ex.: Astro ou Next.js estático), entregando HTML puro pré-renderizado no primeiro byte sem bloqueio da thread principal.
3. **Chunk Splitting Granular de Bibliotecas:**
   - Refinamento contínuo das partições manuais de vendor chunks no Vite para isolar rotas raramente acessadas.

---

*Documento registrado como evidência oficial da **SPEC 05 aprovada em Human Validation em 21/09/2026**.*
