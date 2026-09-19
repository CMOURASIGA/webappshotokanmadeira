# SPEC 03 - Training Experience & Student Tools

## Status

PLANEJADA

## Pré-requisito

SPEC 02 aprovada em Human Validation.

## Objetivo

Melhorar a experiência recorrente do aluno dentro da área de estudo.

## Escopo

### Área do praticante consistente
Unificar padrão visual de:

- Katas;
- Técnicas;
- Faixas;
- Dojo Kun;
- Vocabulário;
- História.

### Breadcrumbs
Exemplos:

Início > Katas > Heian Shodan

Treinamento > Técnicas > Mae Geri

### Navegação contextual
Adicionar:

- voltar para lista;
- anterior;
- próximo;
- conteúdo relacionado.

### Continuar estudando
Registrar localmente itens vistos recentemente usando localStorage.

Na Home ou área do praticante exibir:

"Continue estudando"

Sem armazenar dados sensíveis.

### Favoritos
Permitir favoritar:

- Katas;
- Técnicas;
- Vocabulário.

Criar área:

"Meus favoritos"

Inicialmente local-first, sem autenticação.

### Compartilhamento
Adicionar botão Compartilhar usando Web Share API quando disponível.

Fallback:

"Copiar link"

### Vídeo e imagem
Padronizar estados:

- loading;
- indisponível;
- erro;
- fallback.

### Conteúdo relacionado
Conectar kata, técnica, faixa e vocabulário quando houver associação disponível.

## Critérios de aceite

- navegação de estudo mais rápida;
- usuário consegue retomar conteúdo;
- favoritos persistem localmente;
- compartilhamento funciona;
- nenhum dado pessoal é armazenado;
- nenhuma regressão de vídeo.

## Human Validation

Obrigatória antes da SPEC 04.
