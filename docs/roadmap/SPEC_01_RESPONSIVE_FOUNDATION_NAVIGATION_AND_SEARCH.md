# SPEC 01 - Responsive Foundation, Navigation & Search

## Status

PLANEJADA

## Objetivo

Estabelecer a fundação visual e responsiva do Madeira Karate antes das próximas evoluções.

Esta SPEC deve corrigir inconsistências atuais de responsividade, padronizar comportamento de imagens e modais, melhorar navegação desktop/mobile e transformar a busca atual em uma funcionalidade real.

Não iniciar Home V2 nesta etapa.

---

## 1. Auditoria responsiva global

Validar no mínimo:

- 320x568
- 360x800
- 390x844
- 768x1024
- 1024x768
- 1366x768
- 1440x900
- 1920x1080

Critérios:

- sem overflow horizontal;
- sem textos cortados;
- sem botões inacessíveis;
- sem imagens distorcidas;
- sem controles fora da viewport;
- targets touch adequados;
- safe-area mobile respeitada;
- conteúdo centralizado e com largura de leitura apropriada.

Revisar principalmente:

- Layout
- Sidebar
- MobileNav
- NoticeModal
- NoticePopup
- Mural
- Store
- Schedule
- listas e detalhes de Katas/Técnicas/Faixas

---

## 2. Splash Screen V2

Revisar src/components/SplashScreen.tsx.

### Mobile

Composição vertical:

LOGO

MADEIRA
KARATE SHOTOKAN &
ARTES MARCIAIS

空手道

### Tablet

Manter composição vertical com escala intermediária.

### Notebook/Desktop

A partir de breakpoint adequado, preferencialmente lg, usar composição horizontal:

LOGO | MADEIRA
     | KARATE SHOTOKAN &
     | ARTES MARCIAIS
     | 空手道

### Regras

- escala responsiva;
- evitar dimensões rígidas desnecessárias;
- preferir clamp() quando fizer sentido;
- não distorcer logo;
- remover animate-pulse contínuo do japonês;
- usar entrada discreta;
- respeitar prefers-reduced-motion;
- reduzir tempo atual da splash.

Meta aproximada:

- entrada completa até 1s;
- início da saída ~2,3s;
- aplicação disponível ~2,8 a 3s.

A splash não deve segurar artificialmente a aplicação se o conteúdo já estiver pronto.

---

## 3. Modal de Avisos/Eventos responsivo

Revisar src/components/NoticeModal.tsx.

Problema identificado:
o modal força formato vertical 4:5 e pode cortar imagens paisagem.

### Comportamento esperado

A imagem deve preservar sua proporção original.

Usar dimensões naturais da imagem:

- naturalWidth
- naturalHeight

Pode classificar orientação como:

- landscape
- portrait
- square

Mas evitar depender apenas de três aspect-ratios fixos quando width/height auto com max constraints resolver melhor.

### Regras

- paisagem deve permitir modal mais largo;
- retrato pode manter largura menor;
- quadrado deve preservar 1:1;
- max-width e max-height devem respeitar viewport;
- não cortar conteúdo relevante;
- preferir object-contain para artes;
- manter título;
- manter setas;
- manter dots;
- manter botão fechar;
- manter link de álbum;
- não quebrar InstagramEmbed.

Adicionar fallback para erro de imagem:

"Imagem temporariamente indisponível"

Não exibir apenas ícone nativo de imagem quebrada.

---

## 4. Padronização de imagens

Auditar usos de:

- aspect-[4/5]
- object-cover
- widths/heights rígidos

Regras:

### Artes, avisos e peças gráficas

Preferir object-contain.

### Fotografias de produto ou imagem puramente fotográfica

object-cover pode ser mantido quando o corte for aceitável.

### Produtos

Revisar Store para garantir que o item principal não seja cortado de forma inadequada.

### Fallback

Criar comportamento consistente para:

- URL inválida;
- timeout/falha;
- imagem ausente.

---

## 5. Navegação Desktop V2

A sidebar atual possui muitos itens em sequência.

Reorganizar em grupos.

Sugestão:

### PRINCIPAL
- Início
- Mural
- Eventos
- Grade de Horários
- Loja

### TREINAMENTO
- Katas
- Técnicas
- Faixas
- Série de Katas

### CONHECIMENTO
- Vocabulário
- O que é Kata?
- Dojo Kun
- História

Pode utilizar seções simples ou grupos expansíveis, desde que não prejudique descoberta.

### Regras

- manter item ativo evidente;
- manter scroll quando necessário;
- evitar poluição visual;
- preservar acesso a todas as rotas atuais;
- não remover funcionalidade.

---

## 6. Navegação Mobile V2

Manter barra inferior compacta.

Sugestão inicial:

- Início
- Mural
- Katas
- Horários
- Menu

A definição final pode considerar uso real, mas deve permanecer limitada.

Drawer:

- fechar ao selecionar item;
- permitir scroll;
- respeitar safe-area;
- destacar rota atual;
- manter todos os destinos acessíveis.

---

## 7. Busca Global funcional

O input atual no header não pode continuar apenas visual.

Implementar busca real em:

- Katas
- Técnicas
- Vocabulário
- Faixas
- Dojo Kun
- História
- Avisos
- Eventos

### Requisitos

- busca incremental;
- debounce;
- case-insensitive;
- tolerância básica a acentuação;
- agrupar resultados por categoria;
- exibir estado vazio;
- destacar o termo quando possível;
- Enter abre resultado;
- setas do teclado navegam resultados;
- ESC fecha;
- click/tap funciona;
- mobile e desktop.

Exemplo:

Busca:
heian

Resultados:
Katas
- Heian Shodan
- Heian Nidan
- Heian Sandan
- Heian Yondan
- Heian Godan

Busca:
mae geri

Resultados:
Técnicas
- Mae Geri

### Fallback

Se a busca não puder ser implementada nesta SPEC, remover temporariamente o campo. Não manter input sem ação.

---

## 8. Componentes básicos reutilizáveis

Criar ou consolidar componentes para reduzir divergência visual.

Avaliar:

- PageHeader
- SectionTitle
- EmptyState
- ErrorState
- Skeleton
- ImageFrame
- Modal
- SearchInput
- Badge
- Breadcrumb base, se necessário para futuras SPECs

Não criar abstrações excessivas. Extrair apenas padrões reais.

---

## 9. Loading, empty e error states

Padronizar estados.

Evitar apenas:

"Carregando..."

Quando fizer sentido, utilizar skeleton simples.

Casos mínimos:

- mural;
- produtos;
- dados do Google Sheets;
- busca;
- imagens;
- Instagram.

Erro de dados:

"Não foi possível carregar os dados."

Ação:
"Tentar novamente"

Se tecnicamente aplicável.

---

## 10. Acessibilidade mínima

Garantir:

- aria-label em botões apenas com ícone;
- foco visível;
- ordem de headings coerente;
- alt apropriado;
- teclado em navegação e busca;
- targets touch;
- contraste suficiente;
- prefers-reduced-motion.

Exemplo:

aria-label="Fechar aviso"

---

## 11. Critérios de aceite

SPEC 01 só pode ser considerada pronta quando:

- splash adaptativa;
- modal não corta imagem paisagem;
- navegação reorganizada;
- busca funcional ou removida temporariamente;
- sem overflow horizontal nas resoluções de validação;
- nenhuma rota existente perdida;
- mobile nav validada;
- sidebar validada;
- fallbacks básicos de imagem implementados;
- acessibilidade mínima aplicada;
- nenhuma regressão relevante no InstagramEmbed.

---

## 12. Validação técnica

Executar:

- npm ci ou npm install conforme lockfile;
- npm run lint;
- npm run build;

Se houver typecheck separado, executar.

Não entregar com erro relevante no console.

---

## 13. Human Validation obrigatória

Publicar preview.

Validar:

- Android mobile;
- iOS mobile, quando disponível;
- tablet;
- notebook;
- desktop.

Fluxos:

1. abrir aplicação;
2. splash;
3. navegar sidebar;
4. navegar mobile;
5. pesquisar kata;
6. pesquisar técnica;
7. abrir mural;
8. abrir imagem paisagem;
9. abrir imagem retrato;
10. navegar entre avisos;
11. abrir Instagram;
12. consultar horários;
13. abrir loja.

Não iniciar SPEC 02 antes da aprovação humana desta SPEC.
