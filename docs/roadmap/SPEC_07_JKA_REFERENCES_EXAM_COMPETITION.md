# SPEC 07 — Referências JKA, Regras Administrativas de Exame e Base de Competição

> **Status:** IMPLEMENTADA — AGUARDANDO HUMAN VALIDATION.
>
> **Escopo:** manutenção pós-UX Evolution V2, sequencial à SPEC 06.
>
> **Dependência:** `docs/roadmap/SPEC_06_JKA_GRADUATION_ALIGNMENT.md`.

---

## 1. Objetivo

Criar uma camada clara e sustentável de referências oficiais da **JKA Brasil**, separando no Dojo Digital três domínios que não devem ser confundidos:

1. **Programa de Graduação** — conteúdo técnico por Kyu/Dan;
2. **Regras Administrativas de Exame** — carência, idade mínima, cursos, documentação e condições de inscrição;
3. **Regras de Competição** — elegibilidade, categorias, modalidade de Kumite/Kata e demais regras específicas de campeonatos.

Esta SPEC não altera o programa técnico da SPEC 06. Ela organiza metadados, vigência, fonte e apresentação das informações oficiais da JKA Brasil e prepara o projeto para atualizações anuais sem espalhar regras pelo código.

---

## 2. Princípio obrigatório

Não misturar:

- requisito técnico de graduação;
- requisito administrativo para inscrição em exame;
- regra de participação em campeonato;
- conteúdo editorial próprio do Madeira Karate.

Uma regra de campeonato não deve virar requisito de exame.

Uma regra administrativa de exame não deve virar requisito de Kihon/Kata/Kumite.

Quando a fonte tiver vigência anual, a interface deve informar o ano da referência.

Não apresentar uma regra de 2026 como regra permanente da JKA.

---

## 3. Fontes oficiais validadas

### 3.1 Programa de graduação
JKA Brasil — Guia para Graduação Kyu/Dan:

https://jkabrasil.com.br/guia-para-graduacao-kyu-dan/

Uso: sequência de graduação e programa técnico validado na SPEC 06.

### 3.2 Regras administrativas para Exame de Dan — 2026
JKA Brasil — Exame de Grau JKA 2026, Maringá:

https://jkabrasil.com.br/wp-content/uploads/2026/01/5-Exame-de-Grau-JKA-2026-MARINGA-Investimentos.pdf

Uso permitido nesta SPEC:

- tempo de carência;
- idade mínima quando publicada;
- exigência de participação em cursos oficiais/chancelados;
- documentação;
- regras de análise curricular;
- condições administrativas expressamente publicadas.

### 3.3 Referência de competição — 2026
JKA Brasil — XIII Campeonato Paranaense de Karate-Do Shotokan JKA 2026:

https://jkabrasil.com.br/wp-content/uploads/2026/01/2-XIII-CAMPEONATO-PARANAENSE-DE-KARATE-DO-SHOTOKAN-JKA-2026-Regulamento-MARINGA-PR-.pdf

Uso nesta SPEC:

- comprovar que regras de competição possuem elegibilidade própria;
- validar nomenclatura de graduação utilizada pela JKA;
- estruturar uma futura camada de competição sem confundir com exame.

### 3.4 Referência complementar de competição — 2026
JKA Brasil — Copa 80 Anos Shihan Yochizo Machida:

https://jkabrasil.com.br/wp-content/uploads/2026/02/2.-COPA-80-ANOS-SHIHAN-YOCHIZO-MACHIDA-REGULAMENTO_rev2.pdf

Uso nesta SPEC:

- referência para categorias por idade/graduação;
- modalidades de Kumite por faixa etária;
- agrupamentos de Kata por nível.

---

## 4. Regras administrativas de Exame de Dan — 2026

As regras abaixo devem ficar em domínio separado do programa técnico.

### Carência e idade mínima

| Graduação pretendida | Carência | Idade mínima publicada |
|---|---|---|
| 1º Dan | 2 anos no 3º Kyu Marrom | 12 anos |
| 2º Dan | 1 ano no 1º Dan | 18 anos |
| 3º Dan | 2 anos no 2º Dan | não informada na tabela |
| 4º Dan | 3 anos no 3º Dan | não informada na tabela |
| 5º Dan | 4 anos no 4º Dan | não informada na tabela |

Não preencher idade mínima ausente por inferência.

### Cursos oficiais

O documento de 2026 exige que os candidatos apresentem certificados ou comprovação de participação em **Cursos oficiais de atualização técnica da JKA Brasil ou sob sua chancela**, totalizando **16 horas**.

Essa regra deve ser registrada como:

- requisito administrativo;
- referência 2026;
- não como item técnico de Kihon/Kata/Kumite.

### Documentação

A fonte de 2026 também exige, conforme aplicável:

- comprovante de associado à JKA Brasil;
- documentação solicitada no processo de inscrição;
- certificados/comprovantes dos cursos oficiais;
- comprovação de graduações anteriores.

Para candidato sem certificados de Kyu da JKA Brasil, a fonte prevê regularização através do professor responsável JKA e instâncias administrativas correspondentes.

### Candidatos oriundos de outras federações

Para candidatos ao 2º a 4º Dan que possuam apenas diplomas de outras federações, o documento de 2026 prevê análise curricular com antecedência mínima de 90 dias e autorização conforme as condições publicadas.

Não generalizar essa regra para outros graus se a fonte não o fizer.

---

## 5. Vigência temporal

Toda regra administrativa deve possuir metadados mínimos de vigência.

Estrutura recomendada:

```ts
type JkaReference = {
  id: string;
  title: string;
  sourceType: "graduation" | "exam-admin" | "competition";
  sourceName: string;
  sourceUrl: string;
  sourceYear: number;
  validFrom?: string;
  validTo?: string;
  notes?: string[];
};
```

Quando não houver data exata de validade, usar apenas `sourceYear` e deixar claro na interface:

> Referência administrativa JKA Brasil — 2026.

Não inferir vigência futura.

---

## 6. Separação de domínio no código

Após a SPEC 06, não concentrar todas as informações JKA em um único objeto genérico.

Separar conceitualmente:

### Graduação
Exemplo:
`src/data/graduationRequirements.ts`

### Regras administrativas de exame
Exemplo:
`src/data/jkaExamRules.ts`

### Referências oficiais
Exemplo:
`src/data/jkaReferences.ts`

### Regras de competição
Não implementar uma tabela completa de campeonato como regra permanente nesta SPEC.

Se necessário, preparar apenas estrutura futura, por exemplo:

```ts
type CompetitionRuleReference = {
  eventName: string;
  year: number;
  sourceUrl: string;
  minimumGrade?: string;
  ageGroup?: string;
  modality?: string;
  notes?: string[];
};
```

---

## 7. Página de Faixas — bloco “Referência JKA”

Após a SPEC 06, a página `/belts` deverá apresentar uma área discreta de referência.

Para programa técnico:

> Programa de graduação conforme Guia para Graduação Kyu/Dan — JKA Brasil.

Para regras administrativas de Dan:

> Regras administrativas de exame conforme documento JKA Brasil 2026. Consulte sempre o edital vigente antes da inscrição.

O link oficial correspondente deve estar disponível.

Não reproduzir taxas financeiras no sistema como regra fixa.

Valores de inscrição/diploma variam por evento e ano e ficam fora do escopo desta SPEC.

---

## 8. Área do Aluno

Na área de Checklist de Exame:

- continuar usando o programa técnico consolidado pela SPEC 06;
- não transformar documentação/cursos/carência em checkboxes de domínio técnico;
- criar, quando aplicável, um bloco informativo separado chamado **“Informações administrativas para Exame de Dan”**;
- mostrar o ano da referência;
- incluir aviso para consultar o edital vigente da JKA Brasil e o Sensei responsável.

A autoavaliação técnica permanece separada da elegibilidade administrativa.

---

## 9. Regra de competição — separação obrigatória

A JKA Brasil publica regulamentos de competição com critérios próprios por:

- idade;
- graduação;
- modalidade;
- evento;
- ano.

Exemplo confirmado em regulamento de 2026:

- determinado campeonato exige no mínimo **4º Kyu / Azul Escuro** para participação geral;
- outros eventos organizam categorias de Kata em grupos de graduação;
- modalidades de Kumite podem variar por idade e graduação.

Essas regras NÃO devem ser utilizadas como regra de exame ou progressão de faixa.

Nesta SPEC, implementar apenas:

1. governança da informação;
2. metadados de fonte;
3. espaço futuro para competição;
4. prevenção de mistura com graduação.

Uma área completa de competição poderá ser criada em SPEC futura.

---

## 10. Auditoria do catálogo de Katas

Executar auditoria do catálogo atual do projeto em relação aos nomes de Katas usados nas fontes oficiais de competição JKA.

Verificar, sem inventar requisitos de graduação:

- Heian Shodan;
- Heian Nidan;
- Heian Sandan;
- Heian Yondan;
- Heian Godan;
- Tekki Shodan;
- Tekki Nidan;
- Tekki Sandan;
- Bassai Dai;
- Bassai Sho;
- Kanku Dai;
- Kanku Sho;
- Jion;
- Enpi;
- Jitte;
- Hangetsu;
- Gankaku;
- Nijushiho;
- Sochin;
- Meikyo;
- Gojushiho Dai;
- Gojushiho Sho;
- Unsu;
- Chinte;
- Wankan.

Objetivo:

- confirmar existência;
- revisar grafia;
- identificar duplicidades;
- identificar Katas ausentes;
- identificar registros com conteúdo placeholder.

Não preencher movimentos, bunkai ou requisitos técnicos apenas porque o Kata aparece em regulamento de competição.

---

## 11. Conteúdo placeholder existente

O projeto possui Katas avançados com conteúdo simplificado/placeholder em `mockData.ts`.

A auditoria desta SPEC deve identificar esses casos.

Não substituir placeholder por conteúdo inventado.

Se um Kata existir apenas como cadastro nominal, preferir sinalização neutra:

> Conteúdo técnico em catalogação.

ou ocultar campos não validados.

Não exibir textos como “movimentos do kata...” como se fossem conteúdo real.

---

## 12. Metadados de procedência

Para todo conteúdo oficial JKA incorporado nesta e nas próximas SPECs, permitir rastrear:

- organização fonte;
- documento/página;
- URL;
- ano;
- tipo da fonte;
- data de revisão interna, quando aplicável.

Objetivo: permitir atualização futura sem depender de memória ou conhecimento implícito do código.

---

## 13. Atualização anual

Criar regra de manutenção:

- conteúdo técnico de graduação só muda quando a fonte oficial correspondente mudar;
- regras administrativas devem ser revisadas quando a JKA Brasil publicar novo edital anual;
- regras de competição devem ser tratadas por evento/ano;
- não sobrescrever silenciosamente uma referência antiga sem atualizar o `sourceYear`.

O sistema não precisa de automação ou banco de dados para isso nesta etapa.

---

## 14. UX

Evitar transformar a página de Faixas em um regulamento burocrático.

A experiência deve priorizar:

1. graduação;
2. conteúdo técnico;
3. orientação pedagógica;
4. fonte;
5. regras administrativas, somente quando relevantes.

Usar accordions, cards ou blocos colapsáveis quando necessário.

Em mobile, não exigir tabela horizontal para leitura de carência/idade.

---

## 15. Segurança editorial

Não usar frases como:

- “você está apto para o exame”;
- “você pode prestar o exame”;
- “aprovado para graduação”;
- “elegível automaticamente”.

O sistema pode informar critérios publicados, mas a confirmação deve permanecer com a JKA/Sensei/organização responsável.

Texto recomendado:

> Estas informações são referências administrativas publicadas pela JKA Brasil. A confirmação de inscrição, elegibilidade e autorização para exame deve ser feita com o Sensei responsável e conforme o edital vigente.

---

## 16. Testes técnicos

Executar:

- lint;
- typecheck, se disponível;
- build;
- `git diff --check`.

Validar ausência de regressões em:

- Faixas;
- Área do Aluno;
- Katas;
- Busca;
- Home;
- PWA;
- mobile;
- desktop.

---

## 17. Human Validation

Validar manualmente:

1. fonte JKA visível no programa de graduação;
2. referência 2026 visível nas regras administrativas;
3. carências corretas de 1º a 5º Dan;
4. idades mínimas somente onde publicadas;
5. informação das 16 horas de cursos oficiais;
6. documentação sem extrapolações;
7. regra de outras federações apresentada somente no escopo publicado;
8. separação visual entre programa técnico e regras administrativas;
9. nenhuma regra de competição aparecendo como requisito de exame;
10. nenhuma taxa financeira apresentada como permanente;
11. catálogo de Katas auditado;
12. placeholders identificados e não apresentados como conteúdo oficial;
13. links oficiais funcionando;
14. mobile;
15. desktop;
16. lint/build;
17. ausência de regressões.

---

## 18. Fora de escopo

Não implementar nesta SPEC:

- banco de dados;
- login;
- backend;
- painel do Sensei;
- inscrição real em exame;
- inscrição real em competição;
- cálculo automático de elegibilidade;
- calendário oficial JKA sincronizado;
- taxas financeiras como dado permanente;
- regulamento completo de campeonato;
- programa técnico não publicado/validado;
- conteúdo técnico de Kata inventado.

---

## 19. Dependência e ordem de execução

A dependência da SPEC 06 foi atendida: a SPEC 06 foi concluída e aprovada em Human Validation em 23/09/2026. A SPEC 07 está liberada para desenvolvimento.

Fluxo obrigatório:

`SPEC 06 aprovada → SPEC 07 liberada para desenvolvimento → implementação → Human Validation`

A SPEC 07 pode ser iniciada. Não reabrir a SPEC 06 sem evidência de regressão ou necessidade de correção formal.

---

## 20. Critério de conclusão

A SPEC 07 somente poderá ser marcada como aprovada após:

- SPEC 06 aprovada em Human Validation;
- implementação publicada;
- fontes e anos rastreáveis;
- auditoria do catálogo de Katas concluída;
- testes técnicos aprovados;
- Human Validation explícita.

Não marcar automaticamente como concluída apenas por lint/build.
