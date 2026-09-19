# SPEC 04 - Commerce, Events & Engagement

## Status

PLANEJADA

## Pré-requisito

SPEC 03 aprovada em Human Validation.

## Objetivo

Melhorar Loja, Eventos, Mural, Instagram e contato com a academia.

## Escopo

### Loja V2
Antes do WhatsApp, permitir quando aplicável:

- produto;
- modelo;
- tamanho;
- quantidade.

Gerar mensagem contextual automaticamente.

Fluxo sugerido:

Escolher produto
> Escolher modelo/tamanho
> Pagamento
> Enviar comprovante

Manter PIX, botão copiar e preparar estrutura para QR Code futuro.

### Eventos V2
Suportar:

- título;
- data;
- tipo;
- imagem;
- link de álbum.

### Mural V2
Adicionar suporte a:

- data_publicacao;
- data_inicio;
- data_fim;
- ativo;
- prioridade;
- mostrar_popup.

Não depender apenas da ordem da planilha.

### Popup inteligente
Regras:

- apenas ativos;
- respeitar período;
- ordenar por prioridade;
- limitar destaques;
- não repetir durante a mesma sessão.

### Instagram
Manter integração existente.

Criar seção "Acompanhe a Madeira" na Home quando adequado.

Fallback:
"Abrir no Instagram"

### Localização
Adicionar seção configurável por dados:

- endereço;
- referência;
- mapa/link;
- Como chegar.

Não hardcodear endereço.

### WhatsApp contextual
Mensagens específicas por:

- produto;
- evento;
- modalidade;
- turma;
- página.

## Critérios de aceite

- compra exige menos conversa manual;
- eventos têm data e ordenação;
- avisos expirados não aparecem;
- popup não fica invasivo;
- Instagram falho não quebra layout;
- localização configurável.

## Human Validation

Obrigatória antes da SPEC 05.
