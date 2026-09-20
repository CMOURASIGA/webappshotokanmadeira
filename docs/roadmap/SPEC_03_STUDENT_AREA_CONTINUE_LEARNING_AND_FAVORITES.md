# SPEC 03 — Área do Aluno, Continuar Estudando & Favoritos

> **Status:** APROVADA EM HUMAN VALIDATION EM 19/09/2026.

---

## 1. Objetivo
Proporcionar ao praticante de Karate uma experiência personalizada de estudo autônomo, permitindo salvar katas e técnicas favoritas, acompanhar seu progresso de aprendizado e retomar seus estudos de onde parou.

---

## 2. Escopo Funcional

### 2.1. "Continuar Estudando" (Histórico Recente)
- Armazenamento local da última lição, kata ou técnica acessada pelo aluno.
- Barra de progresso visual indicando a cobertura do kata (ex: movimentos memorizados).
- Botão direto de retorno na Home ou na barra lateral para "Retomar Estudo".

### 2.2. Coleção de Favoritos do Aluno
- Botão de favoritar (ícone de estrela marcial) em cada ficha de Kata e Técnica.
- Aba dedicada na área do aluno reunindo todos os itens marcados para revisão rápida antes dos treinos presenciais.

### 2.3. Checklist de Exame de Graduação
- Ferramenta interativa onde o aluno seleciona sua graduação atual e visualiza a lista de requisitos para o próximo Kyu ou Dan.
- Checkboxes para autoavaliação (ex: Kihon dominado, Kata padrão memorizado, regras de Jiyu-Ippon Kumite compreendidas).

### 2.4. Bloco de Anotações Técnicas
- Campo para o aluno salvar observações individuais fornecidas pelo Sensei durante o treino presencial (ex: "Ajustar ângulo da postura Kokutsu-Dachi no Heian Nidan").
- Persistência em armazenamento local do dispositivo sem necessidade de login complexo.

---

## 3. Governança e Diretrizes de Implementação
- Totalmente funcional no cliente, sem requisições fantasmas ou quebra de privacidade do aluno.
- Interface responsiva e acessível com feedback visual imediato.


## 4. Governança
- SPEC 01 aprovada em Human Validation.
- SPEC 02 aprovada em Human Validation em 19/09/2026.
- Não iniciar SPEC 04 antes da Human Validation explícita desta SPEC.
- A política institucional de zero mock em produção permanece obrigatória.
