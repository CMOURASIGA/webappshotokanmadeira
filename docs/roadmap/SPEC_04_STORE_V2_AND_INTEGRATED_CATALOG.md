# SPEC 04 — Loja V2 & Catálogo Integrado

> **Status:** APROVADA EM HUMAN VALIDATION EM 19/09/2026.

---

## 1. Objetivo

Modernizar a Loja do Madeira Karate, transformando-a em um catálogo comercial simples, responsivo e confiável, com seleção de variações, carrinho local e fechamento do pedido pelo WhatsApp oficial configurado no sistema.

A Loja não realizará cobrança online nesta SPEC. O objetivo é organizar a escolha dos produtos e reduzir o trabalho manual no atendimento.

---

## 2. Princípios obrigatórios

- Utilizar somente produtos reais cadastrados na fonte oficial da aplicação.
- Nunca criar produtos, preços, estoque, tamanhos, cores ou disponibilidade fictícios.
- Se a fonte estiver vazia, exibir EmptyState.
- Erro de integração deve ser diferente de catálogo vazio.
- O WhatsApp deve vir da configuração existente no AppDataContext, nunca hardcoded em novos componentes.
- Não implementar checkout por cartão, gateway de pagamento ou reserva real de estoque nesta SPEC.
- O carrinho é apenas uma preparação do pedido para envio à secretaria.
- Informações não cadastradas não devem ser inferidas.

---

## 3. Fonte de dados e evolução do schema

A aba Produtos do Google Sheets continua sendo a fonte de verdade.

Preservar compatibilidade com os campos atuais:

- id
- nome
- descricao
- preco
- imagem1
- imagem2
- imagem3

Adicionar suporte opcional, sem quebrar produtos existentes, para:

- categoria
- tamanhos
- cores
- variacoes
- personalizado
- disponibilidade
- ordem
- ativo

Os campos adicionais devem ser opcionais.

Produtos sem um campo opcional continuam funcionando normalmente.

### Regras de parsing

- listas podem ser cadastradas de forma simples e documentada;
- valores devem ser normalizados antes da renderização;
- preço inválido não deve resultar em NaN na interface;
- imagens inválidas devem utilizar fallback visual;
- produto sem id não deve ser renderizado;
- produto explicitamente inativo não deve aparecer.

Documentar o schema efetivamente adotado.

---

## 4. Catálogo Visual

Reestruturar /store.

### Cabeçalho

Exibir:

- título da Loja Madeira Karate;
- texto curto explicando que o pedido é finalizado com a secretaria;
- acesso ao carrinho com contador de itens.

### Categorias

Quando houver dados reais de categoria, permitir filtro por categorias existentes.

Exemplos de categorias são apenas referências de UX e NÃO devem gerar conteúdo:

- Uniformes / Dogis
- Faixas
- Proteções
- Vestuário
- Acessórios

Não exibir filtro vazio ou categorias inventadas.

### Cards de produto

Cada card deve poder apresentar, conforme os dados disponíveis:

- imagem;
- nome;
- descrição curta;
- preço;
- categoria;
- indicador de disponibilidade;
- botão Ver detalhes / Selecionar.

As imagens devem preservar o produto principal. Evitar object-cover quando causar corte inadequado.

---

## 5. Detalhe e seleção do produto

Ao abrir um produto, permitir selecionar somente atributos realmente cadastrados.

Exemplo:

- tamanho;
- cor;
- variação;
- personalização;
- quantidade.

### Regra

Se um produto não possui tamanhos cadastrados, não mostrar seletor de tamanho.

Se não possui cores, não mostrar seletor de cor.

Não usar listas universais hardcoded como A1-A4 para todos os produtos.

### Quantidade

- mínimo 1;
- impedir zero ou número negativo;
- permitir ajuste simples + / -.

### Personalização

Somente mostrar campo de bordado/personalização quando o produto estiver marcado como personalizável.

Nesta SPEC, personalização não altera preço automaticamente, a menos que exista regra/dado real configurado.

---

## 6. Carrinho local

Implementar carrinho no cliente.

Pode utilizar localStorage, deixando claro que o carrinho fica salvo naquele navegador.

Cada item deve registrar:

- productId;
- nome;
- preço unitário;
- quantidade;
- atributos selecionados;
- subtotal.

Funções:

- adicionar;
- alterar quantidade;
- remover item;
- limpar carrinho;
- calcular subtotal;
- calcular total estimado.

### Identidade de item

O mesmo produto com variações diferentes deve ser tratado como linhas diferentes.

Exemplo:

Camisa Madeira / G / Preta

é diferente de:

Camisa Madeira / M / Preta

---

## 7. Finalização via WhatsApp

Criar uma mensagem automática clara para a secretaria.

Exemplo conceitual:

Olá! Gostaria de solicitar estes itens da Loja Madeira Karate:

1. Camisa Madeira
   Tamanho: G
   Cor: Preta
   Quantidade: 2
   Subtotal: R$ 160,00

2. Faixa
   Tamanho: 280 cm
   Quantidade: 1
   Subtotal: R$ 35,00

Total estimado: R$ 195,00

Gostaria de confirmar disponibilidade, pagamento e retirada.

### Regras

- utilizar o WhatsApp oficial vindo de config;
- URL-encode correto da mensagem;
- não afirmar que o pedido está confirmado;
- não afirmar reserva de estoque;
- usar termos como Solicitar pedido ou Enviar pedido;
- deixar claro que disponibilidade e fechamento serão confirmados pela secretaria.

---

## 8. PIX e pagamento

A aplicação já possui configuração de PIX.

Nesta SPEC:

- manter a informação apenas se fizer sentido no fluxo atual;
- não obrigar o aluno a pagar antes da confirmação de disponibilidade;
- não afirmar pagamento confirmado;
- não implementar conciliação automática;
- não implementar comprovante como confirmação automática.

Preferência de fluxo:

Catálogo
→ seleção
→ carrinho
→ WhatsApp
→ secretaria confirma disponibilidade e forma de pagamento.

Se o fluxo atual de PIX permanecer visível, deve ser revisado para não induzir pagamento antes da confirmação do pedido.

---

## 9. Estados de interface

### Loading
Skeleton simples e consistente.

### Catálogo vazio
Título:
Nenhum produto disponível no momento

Mensagem:
Novos produtos da Madeira Karate serão publicados aqui.

### Erro
Título:
Não foi possível carregar a loja

Ação:
Tentar novamente

Lista vazia e erro técnico permanecem estados distintos.

### Imagem indisponível
Exibir fallback amigável sem ícone quebrado do navegador.

---

## 10. Responsividade

Validar:

- 320x568
- 360x800
- 390x844
- 768x1024
- 1024x768
- 1366x768
- 1440x900
- 1920x1080

### Mobile

- cards legíveis;
- seletores com targets adequados;
- carrinho fácil de acessar;
- resumo de pedido sem overflow;
- botão WhatsApp acessível.

### Desktop

- aproveitar largura sem criar cards excessivamente largos;
- grade equilibrada;
- painel/carrinho legível;
- imagens preservadas.

---

## 11. Acessibilidade

Garantir:

- labels em seletores;
- aria-label em botões apenas com ícone;
- foco visível;
- navegação por teclado;
- feedback textual ao adicionar/remover;
- contraste adequado;
- não depender apenas de cor para disponibilidade.

---

## 12. Analytics

Se a infraestrutura atual de Analytics permitir, preparar eventos:

- view_store
- view_product
- add_to_cart
- remove_from_cart
- update_cart_quantity
- begin_whatsapp_order
- click_copy_pix

Não incluir dados pessoais, mensagem completa do WhatsApp ou conteúdo personalizado nos eventos.

---

## 13. Critérios de aceite

A SPEC 04 somente pode ser considerada pronta quando:

- nenhum produto fictício for exibido;
- catálogo vazio apresentar EmptyState;
- produtos reais da planilha forem renderizados;
- atributos opcionais não quebrarem produtos antigos;
- carrinho funcionar e persistir localmente;
- variações diferentes forem mantidas como itens distintos;
- total estimado estiver correto;
- WhatsApp utilizar número configurado;
- mensagem refletir exatamente os itens do carrinho;
- pedido não for apresentado como confirmado antes da resposta da secretaria;
- fluxo atual de PIX não induzir pagamento prematuro;
- mobile e desktop estiverem responsivos;
- lint e build aprovados.

---

## 14. Human Validation

Validar no mínimo:

1. Loja vazia.
2. Produto simples sem variações.
3. Produto com tamanho.
4. Produto com tamanho e cor.
5. Produto personalizável.
6. Duas variações do mesmo produto no carrinho.
7. Alteração de quantidade.
8. Remoção de item.
9. Persistência após refresh.
10. Limpeza do carrinho.
11. WhatsApp com um produto.
12. WhatsApp com múltiplos produtos.
13. Imagem inválida.
14. Erro da fonte de dados.
15. Mobile.
16. Desktop.

Não iniciar SPEC 05 antes da aprovação explícita em Human Validation da SPEC 04.
