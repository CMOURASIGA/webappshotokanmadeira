# SPEC 06 — Alinhamento Oficial de Graduações Kyu/Dan com JKA Brasil

> **Status:** LIBERADA PARA DESENVOLVIMENTO.
>
> **Escopo:** manutenção pós-UX Evolution V2. Esta SPEC não reabre nem altera a aprovação da UX Evolution V2.

---

## 1. Objetivo

Corrigir e consolidar a estrutura de graduação exibida no Dojo Digital Madeira Karate para que a sequência de Kyu/Dan e o programa técnico utilizado pelo site estejam alinhados ao **Guia para Graduação Kyu/Dan da JKA Brasil**.

A mesma fonte de dados deverá alimentar:

- página de Faixas;
- Checklist de Exame da Área do Aluno;
- relações de graduação usadas por Katas e Técnicas;
- futuras evoluções de conteúdo pedagógico.

Não criar conteúdo técnico por inferência.

---

## 2. Fontes oficiais

### Fonte principal — programa Kyu/Dan
JKA Brasil — Guia para Graduação Kyu/Dan:

https://jkabrasil.com.br/guia-para-graduacao-kyu-dan/

O conteúdo de 10º Kyu a 1º Dan desta SPEC foi levantado por Human Review diretamente da página oficial da JKA Brasil.

### Fonte complementar — regras administrativas de Dan 2026
JKA Brasil — Exame de Grau JKA 2026:

https://jkabrasil.com.br/wp-content/uploads/2026/01/5-Exame-de-Grau-JKA-2026-MARINGA-Investimentos.pdf

Usar esta fonte apenas para carência, idade mínima e condições administrativas expressamente publicadas.

### Referência histórica — 6º Dan
Em 2025 houve evento oficial JKA Brasil/JKA Japão com exame até 6º Dan. Não tratar isso como regra vigente 2026 sem nova fonte oficial específica.

---

## 3. Regra fundamental

Não inventar, completar, reinterpretar ou apresentar como oficial qualquer requisito técnico não sustentado pelas fontes acima.

Quando uma graduação existir no sistema, mas o programa técnico ainda não tiver fonte validada, apresentar:

> Conteúdo técnico não cadastrado nesta versão.

Não substituir ausência de conteúdo por requisitos genéricos.

---

## 4. Problema atual

O projeto utiliza hoje dados de graduação em:

`src/data/mockData.ts`

A sequência atualmente cadastrada é incompatível com o guia JKA Brasil. Entre as divergências identificadas:

- Branca cadastrada como 7º Kyu;
- Amarela cadastrada como 6º Kyu;
- existência de faixa Vermelha na progressão atual;
- ausência de Azul Claro;
- ausência de Azul Escura;
- apenas uma faixa Marrom;
- requisitos genéricos que não correspondem ao programa JKA validado;
- requisitos de Dans superiores apresentados sem fonte técnica oficial validada.

Além disso, o conteúdo oficial de graduação não deve permanecer conceitualmente classificado como `mockData`.

---

## 5. Sequência oficial a implementar

| Ordem | Graduação | Faixa |
|---|---|---|
| 1 | 10º Kyu | Branca |
| 2 | 9º Kyu | Amarela |
| 3 | 8º Kyu | Laranja |
| 4 | 7º Kyu | Verde |
| 5 | 6º Kyu | Azul Claro |
| 6 | 5º Kyu | Roxa |
| 7 | 4º Kyu | Azul Escura |
| 8 | 3º Kyu | Marrom |
| 9 | 2º Kyu | Marrom |
| 10 | 1º Kyu | Marrom |
| 11 | 1º Dan | Preta |

Consequências obrigatórias:

- remover Vermelha da sequência oficial JKA exibida;
- adicionar Azul Claro;
- adicionar Azul Escura;
- representar separadamente 3º, 2º e 1º Kyu Marrom;
- corrigir todos os números de Kyu;
- manter 1º Dan como faixa Preta.

---

## 6. Modelo de dados

Criar uma fonte dedicada, por exemplo:

`src/data/graduationRequirements.ts`

Evitar manter o programa oficial dentro de `mockData.ts`.

Estrutura recomendada:

```ts
export type GraduationRequirement = {
  id: string;
  level: string;
  beltName: string;
  color: string;
  meaning?: string;

  kihon: string[];
  kata: string[];
  kumite: string[];
  notes?: string[];

  source: {
    name: string;
    url: string;
  };

  danRules?: {
    previousGrade?: string;
    minimumTime?: string;
    minimumAge?: string;
    notes?: string[];
  };
};
```

Kihon, Kata, Kumite e Observações devem permanecer semanticamente separados.

---

# 7. Programa técnico oficial — 10º Kyu a 1º Dan

## 10º Kyu — Branca

### Kihon
Na posição básica de HACHIJI DACHI:

1. CHUUDAN CHOKUZUKI
2. JOUDAN AGEUKE
3. CHUUDAN SOTOUKE
4. MAEGERI (HEISOKU DACHI, GEDAN KAKIWAKE)

### Observação
Comando “GOREI” — início pelo lado direito, alternando para cada técnica.

Não cadastrar Kata ou Kumite para esta graduação porque não aparecem na fonte validada.

---

## 9º Kyu — Amarela

### Kihon
Na posição básica de SHIZEN TAI para ZENKUTSU DACHI e retorno para SHIZEN TAI:

1. CHUUDAN JUNZUKI
2. JOUDAN AGEUKE
3. CHUUDAN SOTOUKE
4. KOKUTSU DACHI SHUTOU UKE
5. MAEGERI (HEISOKU DACHI, GEDAN KAKIWAKE)

### Observação
Comando “GOREI” — início pelo lado direito, duas ações por vez para cada técnica.

Não cadastrar Kata ou Kumite para esta graduação porque não aparecem na fonte validada.

---

## 8º Kyu — Laranja

### Kihon
1. CHUUDAN JUNZUKI (avançando)
2. JOUDAN AGEUKE (avançando)
3. CHUUDAN SOTOUKE (avançando)
4. GEDAN BARAI (avançando)
5. KOKUTSU SHUTOU UKE (avançando)
6. MAEGERI (GEDAN KAKIWAKE) (avançando)

### Kata
- TAIKYOKU SHOUDAN

### Kumite
GOHON KUMITE:
- JOUDAN JUNZUKI
- CHUUDAN JUNZUKI

---

## 7º Kyu — Verde

### Kihon
1. CHUUDAN JUNZUKI (avançando)
2. JOUDAN AGEUKE (recuando)
3. CHUUDAN SOTOUKE (avançando)
4. CHUUDAN UCHIUKE (recuando)
5. KOUKUTSU SHUTOU UKE (avançando)
6. MAEGERI (GEDAN KAKIWAKE) (avançando)
7. YOKOGERI KEAGE (em HEISOKU DACHI, alternando lado direito e esquerdo)
8. YOKOGERI KEKOMI (em HEISOKU DACHI, alternando lado direito e esquerdo)

### Kata
- HEIAN SHODAN

### Kumite
GOHON KUMITE:
- JOUDAN JUNZUKI
- CHUUDAN JUNZUKI

---

## 6º Kyu — Azul Claro

### Kihon
1. CHUUDAN JUNZUKI (avançando)
2. JOUDAN AGEUKE (recuando)
3. CHUUDAN SOTOUKE (avançando)
4. CHUUDAN UCHIUKE (recuando)
5. KOUKUTSU SHUTOU UKE (avançando)
6. MAEGERI (GEDAN KAKIWAKE) (avançando)
7. YOKOGERI KEAGE (em KIBA DACHI, direita e esquerda) (avançando)
8. YOKOGERI KEKOMI (em KIBA DACHI, direita e esquerda) (avançando)

### Kata
- HEIAN NIDAN

### Kumite
KIHON IPPON KUMITE:
- JOUDAN JUNZUKI — direita e esquerda
- CHUUDAN JUNZUKI — direita e esquerda

---

## 5º Kyu — Roxa

### Kihon
1. CHUUDAN JUNZUKI (avançando)
2. JOUDAN AGEUKE, GYAKU ZUKI (recuando)
3. CHUUDAN SOTOUKE, GYAKU ZUKI (avançando)
4. CHUUDAN UCHIUKE, CHUUDAN GYAKU ZUKI (recuando)
5. KOUKUTSU SHUTOU UKE (avançando)
6. MAEGERI (GEDAN KAKIWAKE) (avançando)
7. YOKOGERI KEAGE (em KIBA DACHI, direita e esquerda) (avançando)
8. YOKOGERI KEKOMI (em KIBA DACHI, direita e esquerda) (avançando)

### Kata
- HEIAN SANDAN

### Kumite
KIHON IPPON KUMITE:
- JOUDAN JUNZUKI — direita e esquerda
- CHUUDAN JUNZUKI — direita e esquerda
- CHUUDAN MAEGERI — direita e esquerda
- GEDAN KAKIWAKE — direita e esquerda

---

## 4º Kyu — Azul Escura

### Kihon
1. CHUUDAN JUNZUKI (avançando)
2. SANBON RENZUKI (avançando)
3. JOUDAN AGEUKE, GYAKU ZUKI (recuando)
4. CHUUDAN SOTOUKE, GYAKU ZUKI (avançando)
5. CHUUDAN UCHIUKE, GYAKU ZUKI (recuando)
6. KOUKUTSU SHUTOU UKE, ZENKUTSU NUKITE (avançando)
7. MAEGERI (GEDAN KAKIWAKE) (avançando)
8. YOKOGERI KEAGE (em KIBA DACHI, direita e esquerda) (avançando)
9. YOKOGERI KEKOMI (em ZENKUTSU DACHI, direita e esquerda) (avançando)

### Kata
- HEIAN YONDAN

### Kumite
KIHON IPPON KUMITE:
- JOUDAN JUNZUKI — direita e esquerda
- CHUUDAN JUNZUKI — direita e esquerda
- CHUUDAN MAEGERI em GEDAN KAKIWAKE — direita e esquerda
- CHUUDAN YOKOGERI KEKOMI — direita e esquerda

---

## 3º Kyu — Marrom

### Kihon
1. CHUUDAN JUNZUKI (avançando)
2. SANBON RENZUKI (avançando)
3. JOUDAN AGEUKE, GYAKU ZUKI (avançando)
4. CHUUDAN SOTOUKE, GYAKU ZUKI (recuando)
5. CHUUDAN UCHIUKE, GYAKU ZUKI (em KOUKUTSU DACHI) (avançando)
6. KOUKUTSU SHUTOU UKE, ZENKUTSU NUKITE (recuando)
7. MAEGERI (GEDAN KAKIWAKE) (avançando)
8. REN GERI (GEDAN KAKIWAKE CHUUDAN, JOUDAN) (avançando)
9. MAWASHIGERI
10. YOKOGERI KEAGE (em KIBA DACHI, direita e esquerda) (avançando)
11. YOKOGERI KEKOMI (em KIBA DACHI, direita e esquerda) (avançando)

### Kata
- HEIAN GODAN

### Kumite
KIHON IPPON KUMITE:
- JOUDAN JUNZUKI — direita e esquerda
- CHUUDAN JUNZUKI — direita e esquerda
- CHUUDAN MAEGERI / GEDAN KAKIWAKE — direita e esquerda
- CHUUDAN YOKOGERI KEKOMI — direita e esquerda

---

## 2º Kyu — Marrom

### Kihon
1. JOUDAN JUNZUKI, CHUUDAN GYAKUZUKI (avançando)
2. JOUDAN AGEUKE, GYAKU ZUKI (recuando)
3. CHUUDAN SOTOUKE, GYAKU ZUKI (avançando)
4. CHUUDAN UCHIUKE, GYAKU ZUKI (recuando)
5. KOUKUTSU SHUTOU UKE, ZENKUTSU NUKITE (avançando)
6. MAEGERI (avançando)
7. MAWASHI GERI (avançando)
8. YOKOGERI KEAGE (em KIBA DACHI, direita e esquerda) (avançando)
9. YOKOGERI KEKOMI (em ZENKUTSU DACHI) (avançando)

### Kata
- TEKKI SHODAN

### Kumite
JIYUU IPPON KUMITE:
- JOUDAN JUNZUKI
- CHUUDAN JUNZUKI
- CHUUDAN MAEGERI
- CHUUDAN YOKOGERI KEKOMI
- MAWASHIGERI
- direita e esquerda

### Observação
Informar sua escolha para JOUDAN ou CHUUDAN no MAWASHIGERI.

---

## 1º Kyu — Marrom

### Kihon
1. JOUDAN JUNZUKI, CHUUDAN GYAKUZUKI (avançando)
2. JOUDAN AGEUKE, GYAKU ZUKI (recuando)
3. CHUUDAN SOTOUKE, YOKO ENPI (ZENKUTSU DACHI mudando para KIBA DACHI) (avançando)
4. CHUUDAN UCHIUKE, GYAKU ZUKI (recuando)
5. KOUKUTSU SHUTOU UKE, ZENKUTSU NUKITE (avançando)
6. MAEGERI (parado/no local), MAEGERI (avançando)
7. MAWASHIGERI (avançando)
8. YOKOGERI KEAGE (em KIBA DACHI, direita e esquerda) (avançando)
9. YOKOGERI KEKOMI (em ZENKUTSU DACHI) (avançando)

### Kata
- BASSAI DAI

### Kumite
JIYUU IPPON KUMITE:
- JOUDAN JUNZUKI
- CHUUDAN JUNZUKI
- CHUUDAN MAEGERI
- CHUUDAN YOKOGERI KEKOMI
- MAWASHIGERI
- direita e esquerda

### Observação
Informar sua escolha de JOUDAN ou CHUUDAN para MAWASHIGERI.

---

## 1º Dan — Preta / Shodan

### Kihon
A página fonte apresenta uma inconsistência apenas na numeração visual dos itens. Normalizar a numeração na interface sem alterar o conteúdo técnico.

1. SANBON RENZUKI (avançando)
2. JOUDAN AGEUKE, GYAKUZUKI (recuando)
3. CHUUDAN SOTOUKE, YOKO ENPI, YOKO URAKEN UCHI, GYAKUZUKI — ZENKUTSU DACHI mudando para KIBA DACHI e mudando para ZENKUTSU DACHI (avançando)
4. CHUUDAN UCHIUKE, KIZAMI ZUKI, GYAKUZUKI — KOKUTSU DACHI mudando para ZENKUTSU DACHI (recuando)
5. KOUKUTSU SHUTOU UKE, ZENKUTSU NUKITE (avançando)
6. MAEGERI (parado/no local), MAEGERI (avançando)
7. MAWASHIGERI (avançando)
8. YOKOGERI KEAGE (KIBA DACHI — direita e esquerda) (avançando)
9. YOKOGERI KEKOMI (ZENKUTSU DACHI) (avançando)

### Kata
Escolha entre:
- BASSAI DAI
- KANKU DAI
- ENPI
- JION

### Kumite
JIYUU IPPON KUMITE:
- JOUDAN JUNZUKI
- CHUUDAN JUNZUKI
- CHUUDAN MAEGERI
- CHUUDAN YOKOGERI KEKOMI
- MAWASHI GERI
- direita e esquerda

### Observação
Informar sua escolha de JOUDAN ou CHUUDAN para MAWASHIGERI.

---

# 8. Dans superiores — 2º a 5º Dan

O projeto atual contém requisitos técnicos para 2º, 3º, 4º e 5º Dan que não estão sustentados pelas fontes técnicas validadas nesta SPEC.

Exemplos atualmente existentes que NÃO devem continuar sendo apresentados como programa oficial JKA sem fonte:

- “Kanku Dai / Jion / Enpi” como requisito de 2º Dan;
- “Hangetsu / Gankaku” como requisito de 2º Dan;
- “Nijushiho / Gojushiho” como requisito de 3º Dan;
- “Tese Escrita” como requisito de 3º Dan;
- “Domínio de todos os Katas” como requisito de 4º Dan;
- “Contribuição Significativa para a JKA” como requisito de 4º Dan;
- “Renshi” como classificação automática de 5º Dan;
- “Vida dedicada ao ensino” como requisito técnico oficial do 5º Dan.

Esses itens devem ser removidos/neutralizados da apresentação oficial até existir fonte específica.

## Regras administrativas confirmadas em documento JKA Brasil 2026

### 1º Dan
- carência: 2 anos no 3º Kyu Marrom;
- idade mínima: 12 anos.

### 2º Dan
- carência: 1 ano no 1º Dan;
- idade mínima: 18 anos.

### 3º Dan
- carência: 2 anos no 2º Dan.

### 4º Dan
- carência: 3 anos no 3º Dan.

### 5º Dan
- carência: 4 anos no 4º Dan.

O documento de 2026 também estabelece exigências administrativas/curriculares para candidatos e comprovação de participação em cursos oficiais JKA Brasil. Não transformar essas condições administrativas em conteúdo técnico de Kihon/Kata/Kumite.

Para 2º a 5º Dan, enquanto não houver programa técnico oficial cadastrado, exibir apenas os dados administrativos validados e a mensagem:

> Conteúdo técnico não cadastrado nesta versão.

---

## 9. 6º Dan

Fora do escopo técnico desta SPEC.

Existe referência oficial de evento JKA Brasil de 2025 com exame até 6º Dan, porém isso não constitui por si só programa técnico vigente de 2026.

Não adicionar requisitos técnicos de 6º Dan sem fonte específica atual.

---

## 10. Página de Faixas

Atualizar `/belts`.

Cada graduação deve apresentar de forma organizada:

- faixa;
- Kyu/Dan;
- Kihon;
- Kata;
- Kumite;
- Observações;
- regras administrativas de Dan, quando aplicável;
- fonte oficial.

Adicionar informação discreta:

> Programa de graduação conforme Guia para Graduação Kyu/Dan — JKA Brasil.

Com link para a página oficial.

Para 2º a 5º Dan, distinguir claramente “regras administrativas” de “programa técnico”.

---

## 11. Área do Aluno

O Checklist de Exame deve consumir exatamente a mesma fonte estruturada da página de Faixas.

Não manter uma segunda cópia independente dos requisitos.

Organizar o checklist por grupos:

### Kihon
☐ técnica 1  
☐ técnica 2

### Kata
☐ kata exigido

### Kumite
☐ modalidade/requisito

### Observações
Texto informativo, não obrigatoriamente marcável.

Manter o aviso pedagógico já aprovado:

> A autoavaliação serve para orientação do estudo individual. A autorização e aprovação oficial para exame de graduação são de exclusiva competência dos Senseis da Madeira Karate.

---

## 12. Persistência e migração de localStorage

O checklist atual utiliza chave derivada de:

`beltId + requirementIndex`

Como IDs, ordem e quantidade de requisitos serão alterados, existe risco de um item antigo marcado ser associado a um requisito novo diferente.

Obrigatório:

- versionar o schema do checklist;
- não reutilizar silenciosamente índices antigos para requisitos diferentes;
- implementar migração segura ou reset controlado apenas do checklist de graduação;
- preservar favoritos;
- preservar histórico de estudo;
- preservar progresso de Kata;
- preservar caderno de anotações.

Não limpar todo o localStorage.

---

## 13. Relações internas de Katas e Técnicas

Revisar todos os `recommendedBeltId` e referências equivalentes.

Hoje existem IDs vinculados à sequência antiga, inclusive `red`.

Após a correção:

- nenhuma referência pode apontar para uma graduação removida;
- a associação deve considerar a graduação real, não apenas a cor;
- três graduações Marrom devem possuir IDs distintos;
- não fazer substituição automática de cor sem análise pedagógica.

---

## 14. Dados reais versus mock

O conteúdo oficial JKA utilizado em produção não deve permanecer identificado como mock.

Separar:

- programa oficial de graduação;
- dados temporários de desenvolvimento;
- conteúdo educacional editorial próprio do projeto.

Preservar a regra institucional do projeto: nenhum mock deve funcionar como fallback de conteúdo oficial em produção.

---

## 15. Nomenclatura

A fonte apresenta variações de escrita, por exemplo:

- KOKUTSU / KOUKUTSU;
- GYAKUZUKI / GYAKU ZUKI;
- MAWASHIGERI / MAWASHI GERI.

Não “corrigir” silenciosamente o conteúdo técnico durante a implementação.

Se houver necessidade de normalização editorial, manter:
- valor/fonte original;
- valor de exibição normalizado;
- documentação explícita da normalização.

Não alterar significado técnico.

---

## 16. Testes técnicos

Executar:

- lint;
- typecheck, se disponível;
- build;
- `git diff --check`.

Validar que nenhuma alteração afete:

- Home;
- Busca;
- Katas;
- Técnicas;
- Área do Aluno;
- favoritos;
- progresso de Kata;
- anotações;
- PWA.

---

# 17. Human Validation obrigatória

Validar manualmente:

1. 10º Kyu — Branca;
2. 9º Kyu — Amarela;
3. 8º Kyu — Laranja;
4. 7º Kyu — Verde;
5. 6º Kyu — Azul Claro;
6. 5º Kyu — Roxa;
7. 4º Kyu — Azul Escura;
8. 3º Kyu — Marrom;
9. 2º Kyu — Marrom;
10. 1º Kyu — Marrom;
11. 1º Dan;
12. ausência da Vermelha na progressão JKA;
13. Kihon por graduação;
14. Kata por graduação;
15. Kumite por graduação;
16. observações;
17. regras administrativas de Dan;
18. ausência de programa técnico inventado para 2º a 5º Dan;
19. fonte JKA Brasil visível;
20. Checklist da Área do Aluno;
21. troca de graduação no checklist;
22. persistência correta;
23. migração/reset controlado do checklist antigo;
24. preservação dos demais dados locais;
25. relações de Katas/Técnicas;
26. mobile;
27. desktop;
28. ausência de regressões.

---

## 18. Fora de escopo

Não implementar nesta SPEC:

- banco de dados;
- autenticação;
- login;
- Área do Sensei;
- sincronização em nuvem;
- programa técnico de 2º a 5º Dan sem fonte;
- programa técnico de 6º Dan sem fonte;
- requisitos inventados;
- alterações não relacionadas ao alinhamento de graduação.

---

## 19. Critério de conclusão

A SPEC somente poderá ser marcada como concluída após:

- implementação publicada;
- testes técnicos aprovados;
- comparação com a fonte JKA Brasil;
- Human Validation explícita.

Não marcar automaticamente como aprovada apenas por lint/build.

