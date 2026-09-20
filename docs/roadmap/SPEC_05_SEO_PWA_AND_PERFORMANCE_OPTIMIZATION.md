# SPEC 05 — SEO, PWA & Otimização de Performance

> **Status:** LIBERADA PARA DESENVOLVIMENTO APÓS APROVAÇÃO DA SPEC 04 EM HUMAN VALIDATION EM 19/09/2026.

---

## 1. Objetivo

Consolidar tecnicamente o Dojo Digital Madeira Karate como uma aplicação web progressiva, instalável, indexável, acessível e performática, sem quebrar os fluxos implementados nas SPECs anteriores.

Esta SPEC é de consolidação técnica e não deve introduzir conteúdo institucional fictício, alterações funcionais desnecessárias ou mudanças de regra de negócio.

---

## 2. Princípios obrigatórios

- Preservar integralmente as funcionalidades aprovadas nas SPECs 01 a 04.
- Não introduzir mock, placeholder institucional ou dados inventados.
- Não alterar fluxos de Loja, Área do Aluno, Eventos, Mural ou Busca sem necessidade técnica comprovada.
- Priorizar compatibilidade com o deploy atual em Vite.
- Toda otimização deve ser mensurável e documentada.
- SEO deve refletir apenas informações reais da Madeira Karate.
- Dados estruturados devem usar apenas dados institucionais efetivamente conhecidos/configurados.

---

## 3. PWA

Implementar suporte PWA real.

### Manifest

Criar manifesto com:

- nome completo;
- nome curto;
- descrição;
- start_url;
- display standalone;
- theme_color;
- background_color;
- orientation quando aplicável;
- ícones 192x192;
- ícones 512x512;
- ícone maskable quando disponível.

Não criar ícones genéricos de terceiros. Utilizar identidade visual da Madeira Karate.

### Service Worker

Implementar estratégia de cache adequada.

Requisitos:

- app shell pode ser cacheado;
- assets estáticos versionados podem ser cacheados;
- páginas/conteúdos teóricos podem ter estratégia offline;
- dados dinâmicos institucionais não devem ficar indefinidamente obsoletos;
- Google Sheets deve preferir network-first ou estratégia equivalente;
- WhatsApp, Instagram e recursos externos não devem ser tratados como conteúdo offline garantido.

### Offline

Quando sem conexão:

- conteúdos já cacheados podem continuar acessíveis;
- telas dependentes de dados dinâmicos devem informar indisponibilidade de atualização;
- não apresentar dados antigos como se fossem atuais sem indicação apropriada.

---

## 4. Instalação

Preparar experiência instalável em navegadores compatíveis.

- Capturar beforeinstallprompt quando disponível.
- Exibir convite de instalação discreto e não invasivo.
- Não bloquear navegação.
- Permitir dispensar.
- Não repetir agressivamente após rejeição.
- Não simular instalação em navegadores que não suportam o fluxo.

---

## 5. SEO técnico

### Metadados globais

Revisar:

- title;
- meta description;
- canonical;
- robots;
- theme-color;
- language pt-BR;
- favicon;
- apple-touch-icon.

### Metadados por rota

Quando tecnicamente viável no SPA atual, definir títulos e descrições específicos para:

- Home;
- Katas;
- Técnicas;
- Faixas;
- Dojo Kun;
- História;
- Vocabulário;
- Loja;
- Eventos;
- Mural.

Rotas de conteúdo detalhado devem refletir o nome real do conteúdo.

### OpenGraph

Configurar:

- og:title;
- og:description;
- og:type;
- og:url;
- og:image;
- og:locale.

### Twitter / social card

Configurar metadados equivalentes para compartilhamento social.

Não utilizar imagem fictícia de produto ou evento como social card.

---

## 6. Sitemap e robots

Criar:

- sitemap.xml;
- robots.txt.

O sitemap deve incluir apenas rotas públicas válidas.

Para rotas dinâmicas, incluir somente páginas realmente existentes no conteúdo da aplicação.

Não indexar rotas técnicas, estados transitórios ou aliases desnecessários.

---

## 7. Dados estruturados

Implementar JSON-LD Schema.org apenas com informações validadas.

Preferência:

- SportsActivityLocation;
- SportsClub, se aplicável ao contexto;
- Organization, quando necessário;
- BreadcrumbList em páginas internas, se fizer sentido.

Antes de publicar endereço, telefone, horários ou perfis sociais em JSON-LD, usar somente dados reais já presentes na configuração ou validados no projeto.

Não inventar endereço, geolocalização, horário ou vínculo institucional.

---

## 8. Performance

### Code splitting

Aplicar lazy loading nas rotas pesadas utilizando React.lazy/Suspense ou estratégia equivalente.

Priorizar:

- Store;
- StudentArea;
- páginas de detalhe;
- conteúdo secundário;
- componentes pesados de mídia.

### Imagens

- usar loading="lazy" quando adequado;
- preservar proporção;
- evitar CLS;
- definir width/height ou aspect-ratio quando possível;
- evitar baixar imagens não visíveis;
- não degradar a qualidade institucional de logos.

### Bundle

Executar análise de bundle se a ferramenta atual permitir.

Objetivo:

- identificar dependências pesadas;
- evitar duplicações;
- remover imports não utilizados;
- reduzir JavaScript inicial sem comprometer UX.

---

## 9. Core Web Vitals

Alvos de referência:

- LCP < 2,5s;
- INP < 200ms;
- CLS < 0,1.

Os valores devem ser tratados como metas de qualidade, não como números inventados.

Quando o ambiente de medição não permitir garantir o resultado, registrar o valor medido e as condições da medição.

---

## 10. Lighthouse

Executar auditoria, preferencialmente em build de produção.

Registrar resultados para:

- Performance;
- Accessibility;
- Best Practices;
- SEO.

Meta desejada:

- 90+ em todas as categorias.

Se alguma categoria ficar abaixo de 90:

- não mascarar resultado;
- documentar causa;
- corrigir problemas controláveis;
- registrar limitações externas.

---

## 11. Acessibilidade

Revisar globalmente:

- contraste;
- navegação por teclado;
- foco visível;
- labels;
- aria-label;
- alt de imagens;
- landmarks;
- heading hierarchy;
- modais e drawers;
- elementos interativos mobile.

Garantir que alterações de PWA/performance não reduzam acessibilidade já existente.

---

## 12. Analytics e privacidade

Preservar Analytics existente.

Não enviar:

- anotações do aluno;
- conteúdo de personalização de produtos;
- mensagens completas de WhatsApp;
- dados pessoais armazenados localmente.

Eventos técnicos de performance podem ser coletados apenas se compatíveis com a infraestrutura atual.

---

## 13. Compatibilidade

Validar pelo menos:

- Chrome desktop;
- Chrome Android;
- Edge desktop;
- Safari iOS quando possível;
- modo standalone PWA quando suportado.

Validar viewports:

- 320x568;
- 360x800;
- 390x844;
- 768x1024;
- 1366x768;
- 1920x1080.

---

## 14. Critérios de aceite

A SPEC 05 somente pode ser considerada pronta quando:

- manifest válido estiver publicado;
- service worker estiver funcional;
- instalação PWA funcionar em navegador compatível;
- offline não gerar tela branca;
- dados dinâmicos não forem apresentados como atuais quando sem atualização;
- sitemap e robots estiverem publicados;
- metadados essenciais estiverem presentes;
- OpenGraph estiver configurado;
- JSON-LD usar somente dados reais;
- rotas pesadas estiverem lazy-loaded quando justificável;
- imagens tiverem tratamento adequado de carregamento;
- acessibilidade não tiver regressões graves;
- lint aprovado;
- build aprovado;
- Lighthouse executado e resultados informados;
- nenhuma funcionalidade aprovada nas SPECs 01 a 04 tiver regressão.

---

## 15. Human Validation

Validar no mínimo:

1. Instalação PWA no Chrome.
2. Abertura pelo ícone instalado.
3. Atualização de versão.
4. Navegação offline para conteúdo previamente acessado.
5. Comportamento da Loja sem internet.
6. Comportamento de Eventos/Mural sem internet.
7. Home.
8. Busca.
9. Área do Aluno.
10. Carrinho.
11. Metadados no HTML final.
12. OpenGraph.
13. sitemap.xml.
14. robots.txt.
15. JSON-LD.
16. Lighthouse.
17. Mobile.
18. Desktop.
19. Ausência de regressões funcionais.

Após aprovação desta SPEC, a fase UX Evolution V2 pode ser considerada concluída.
