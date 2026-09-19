# SPEC 02 — Home V2 & Experiência de Aprendizado

> **Status:** LIBERADA PARA DESENVOLVIMENTO APÓS APROVAÇÃO DA SPEC 01 EM HUMAN VALIDATION EM 19/09/2026.

---

## 1. Objetivo
Reformular a página inicial (`/`) do Dojo Digital Madeira Karate Shotokan, transformando-a em uma porta de entrada editorial e imersiva para o Karate-Do tradicional, integrando a progressão didática das faixas, atalhos de estudo para katas e os comunicados vivos do dojo.

---

## 2. Escopo Funcional & Arquitetura de Seções

### 2.1. Hero Editorial de Alta Fidelidade
- **Chamada de Valor**: Mensagem central com tipografia clássica, unindo tradição e marcialidade.
- **Ações Primárias**:
  - Botão principal: "Explorar Treinamento" (ancoragem suave ou navegação para Katas/Faixas).
  - Botão secundário: "Quadro de Avisos" (atalho para o Mural de Avisos com indicador de novos comunicados).
- **Emblema & Filosofia**: Integração da linhagem Shotokan (JKA) com os valores de disciplina, respeito e superação.

### 2.2. Trilha Visual de Graduação (Escala de Faixas)
- **Apresentação Didática**: Do 7º Kyu (Branca) ao Dan (Preta), com representação visual precisa das cores oficiais da JKA.
- **Interatividade**: Toque em qualquer faixa expande um resumo dos requisitos principais (Kihon fundamental, Katas exigidos e modalidade de Kumite correspondente).
- **Acesso Rápido**: Link direto para a visualização detalhada em `/belts`.

### 2.3. Vitrine dos Katas Fundamentais
- **Série Heian & Tekki**: Destaque visual dos primeiros katas (Heian Shodan, Nidan, Sandan, Yondan, Godan e Tekki Shodan).
- **Cards Informativos**: Número de movimentos, tempo médio de execução e significado conceitual.
- **Acesso em 1 Clique**: Navegação direta para a ficha técnica e vídeo oficial de cada kata em `/katas/:id`.

### 2.4. Painel de Comunicação Viva do Dojo
- **Últimos Comunicados do Mural**: Integração com os dados dinâmicos de avisos (exames de faixa, convocações, alterações de treino).
- **Próximos Eventos & Seminários**: Visualização compacta de datas marcadas no calendário do dojo.

### 2.5. Bloco de Ética Marcial (Dojo Kun)
- **Princípios do Mestre Gichin Funakoshi**: Apresentação dos 5 princípios (Caráter, Sinceridade, Esforço, Etiqueta e Autocontrole) com tradução e significado prático no dia a dia.

---

## 3. Governança de Implementação
- SPEC 01 aprovada em Human Validation em 19/09/2026.
- Implementar esta SPEC em branch própria, com PR e preview antes de qualquer merge na `main`.
- Não iniciar SPEC 03 antes da Human Validation explícita desta SPEC.
- Todas as alterações devem seguir a arquitetura estabelecida no `Layout.tsx` e no sistema de rotas já unificado.
