# SPEC 01 - Responsive Foundation, Navigation & Global Search

## Objetivo
Criar a fundação responsiva e de navegação do Madeira Karate antes das demais evoluções.

## Itens do Escopo
1. **Responsividade Global**:
   - Resolução sem overflow horizontal ou corte em 320x568, 360x800, 390x844, 768x1024, 1024x768, 1366x768, 1440x900, 1920x1080.
   - Controles dentro da viewport, textos legíveis sem quebras espúrias.
2. **Splash Screen V2**:
   - Mobile e tablet: composição vertical.
   - Notebook e desktop: composição horizontal da identidade.
   - Duração total reduzida para aproximadamente 3 segundos.
   - Entrada discreta do kanji japonês sem pulso contínuo; suporte a `prefers-reduced-motion`.
3. **Modal Adaptativo & Padronização de Imagens**:
   - Tratamento universal para proporções 16:9, 3:2, 1:1, 4:5, 9:16 e demais sem cortes por object-cover forçado.
   - Fallback para imagens com erro ("Imagem temporariamente indisponível").
   - Compatibilidade estrita com `InstagramEmbed`.
4. **Navegação Desktop Reorganizada**:
   - PRINCIPAL: Início, Mural, Eventos, Grade de Horários, Loja.
   - TREINAMENTO: Katas, Técnicas, Faixas, Série de Katas.
   - CONHECIMENTO: Vocabulário, O que é Kata?, Dojo Kun, História.
5. **Navegação Mobile Revisada**:
   - Bottom bar enxuta + Drawer completo com todas as seções e rotas existentes acessíveis.
6. **Busca Global Realmente Funcional**:
   - Indexação real de Katas, Técnicas, Vocabulário, Faixas, Dojo Kun, História, Avisos e Eventos.
   - Estados de busca vazia, feedback em tempo real e navegação direta aos itens.
7. **Estados de Loading, Erro e Vazio**:
   - Padronização em buscas, listas e modais.
8. **Acessibilidade Básica & Navegabilidade**:
   - Foco, teclado, contraste e safe areas.
