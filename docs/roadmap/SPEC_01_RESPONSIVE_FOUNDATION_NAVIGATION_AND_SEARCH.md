# SPEC 01 — Responsive Foundation, Navigation & Global Search

## 1. Objetivo
Estabelecer a fundação responsiva universal, a estrutura ergonômica de navegação e o mecanismo de busca global em tempo real do Dojo Digital Madeira Karate Shotokan & Artes Marciais.

---

## 2. Requisitos & Critérios de Aceite

### 2.1. Responsividade Global Universal
- **Matriz de Viewports**: Validação sem rolagem horizontal ou quebras em:
  - Mobile Pequeno: 320x568 (iPhone SE gen 1), 360x640, 390x844 (iPhone 12/13/14)
  - Tablet: 768x1024 (iPad Portrait), 1024x768 (iPad Landscape)
  - Desktop: 1366x768, 1440x900, 1920x1080
- **Segurança de Layout**:
  - `overflow-x: hidden` no contêiner raiz.
  - Salvaguarda flexível `min-w-0` em nós de texto e títulos longos para prevenir cortes truncados.
  - Tabelas de horários (`/schedule`) com scroll horizontal isolado no mobile/tablet.
  - Alvos de toque com área mínima de 44x44px e respeito às safe-areas de dispositivos modernos (`env(safe-area-inset-bottom)`).

### 2.2. Splash Screen V2 Responsiva
- **Tempo de Exibição**: Duração total de ~3 segundos (reduzida da versão anterior).
- **Layout Adaptativo**:
  - Mobile e Tablet: Composição vertical equilibrada (Escudo superior + Tipografia centralizada).
  - Notebook e Desktop (`lg:`): Composição horizontal alinhada ao centro.
- **Microinterações Marcias**:
  - Fade-in suave com entrada única dos caracteres japoneses (空手道).
  - Sem looping infinito de animação ou pulso cansativo.
  - Respeito às diretrizes de acessibilidade para redução de movimento (`prefers-reduced-motion`).

### 2.3. Modal Adaptativo de Mídia & Avisos
- **Tratamento Universal de Proporções**:
  - Suporte sem corte cego por `object-cover` para imagens em 16:9, 3:2, 1:1, 4:5 e 9:16.
  - Carregamento assíncrono com indicador visual (`Loader2`).
  - Fallback elegante com mensagem informativa caso a imagem esteja offline ou inacessível.
  - Preservação estrita da integração com `InstagramEmbed` (postagens e vídeos do Instagram).

### 2.4. Navegação Desktop Reorganizada
- **Estrutura Semântica da Sidebar (Fixa à Esquerda)**:
  - **PRINCIPAL**: Início (`/`), Mural (`/mural`), Eventos (`/events`), Grade de Horários (`/schedule`), Loja (`/store`).
  - **TREINAMENTO**: Katas (`/katas`), Técnicas (`/techniques`), Faixas (`/belts`), Série de Katas (`/kata-series`).
  - **CONHECIMENTO**: Vocabulário (`/vocabulary`), O que é Kata? (`/what-is-kata`), Dojo Kun (`/dojo-kun`), História (`/history`).
- **Identidade Visual**:
  - Proporção rigorosa 1:1 para o emblema Madeira Karate, sem deformações e sem fundo branco artificial.
  - Tipografia de alto contraste com destaque em vermelho marcial (`#BC002D`) e dourado (`#D4AF37`).

### 2.5. Navegação Mobile Revisada
- **Barra Inferior Fixa**:
  - 4 atalhos prioritários (*Início*, *Mural*, *Katas*, *Loja*) + botão *Menu*.
  - Indicador ativo destacado e ícones limpos em `lucide-react`.
- **Drawer Lateral Completo**:
  - Acesso a 100% das 13 rotas do dojo digital sem exceções.
  - Campo de busca integrado em 1 toque no topo do menu móvel.
  - Trava automática de rolagem do body quando o drawer estiver aberto.

### 2.6. Busca Global em Tempo Real com Navegação por Teclado
- **Cobertura de 8 Categorias**: Katas, Técnicas (Kihon/Stances), Faixas de Graduação, Vocabulário Tradicional, Dojo Kun, História do Shotokan, Avisos do Mural e Eventos.
- **Normalização Textual**: Suporte a buscas sem acento e com acento (ex: "carater" encontra "caráter", "gedan barai" encontra "Gedan Barai").
- **Navegação Completa por Teclado**:
  - `ArrowDown`: Seleciona o próximo resultado, sem ultrapassar o limite da lista (`filteredResults.length - 1`).
  - `ArrowUp`: Seleciona o resultado anterior, sem descer abaixo de 0.
  - `Enter`: Abre imediatamente a rota correspondente ao resultado atualmente selecionado.
  - `Escape`: Fecha o modal de busca e retorna o foco.
  - `⌘K` / `Ctrl+K`: Atalho universal para acionar a busca de qualquer página.
- **Comportamento & Sincronização**:
  - Troca de aba de categoria redefine o índice de seleção para `0`.
  - Alteração na consulta (digitação ou limpeza) redefine a seleção para `0`.
  - Elemento ativo recebe destaque visual evidente (`border-karate-gold`, `ring-1`, badge `ENTER ↵`).
  - Rolagem automática do item ativo (`scrollIntoView({ block: "nearest" })`).
  - O ouvinte de teclado fica ativo apenas enquanto o modal estiver aberto, não interferindo na navegação geral da aplicação quando fechado.

---

## 3. Matriz de Testes & Validação Técnica
- `npm run lint`: Zero erros e zero advertências de tipagem TypeScript (`tsc --noEmit`).
- `npm run build`: Compilação de produção bem-sucedida sem quebras de pacotes ou caminhos órfãos.
- Compatibilidade testada em navegadores baseados em Chromium, WebKit (Safari/iOS) e Gecko (Firefox).

