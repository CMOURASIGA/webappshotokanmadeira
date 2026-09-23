# Diretrizes Institucionais e Governança Técnica — Dojo Digital Madeira Karate

## Regra Fundamental de Dados Institucionais
> **NUNCA utilizar dados mockados como fallback de conteúdo institucional em produção.**
> - Se não houver dado real retornado pela fonte oficial (planilha/API), a aplicação deve exibir o respectivo **Estado Vazio (EmptyState)**.
> - Mock só pode ser usado em desenvolvimento ou em testes explicitamente isolados, **nunca** entrando automaticamente na experiência real do usuário.
> - Erro de integração técnica não deve ser interpretado como ausência de dados: **lista vazia ≠ erro de carregamento**. Esses dois estados devem sempre permanecer visual e logicamente distintos.

## Governança de Roadmap (UX Evolution V2)
- **SPEC 01**: Responsive Foundation, Navigation & Global Search (*Aprovada em Human Validation*).
- **SPEC 02**: Home V2 & Experiência de Aprendizado (*Aprovada em Human Validation*).
- **SPEC 03**: Área do Aluno, Continuar Estudando & Favoritos (*Aprovada em Human Validation*).
- **SPEC 04**: Loja V2 & Catálogo Integrado (*Aprovada em Human Validation*).
- **SPEC 05**: SEO, PWA & Otimização de Performance (*Aprovada em Human Validation*).
- **Encerramento**: UX Evolution V2 (*Concluída e aprovada em Human Validation em 21/09/2026*).


## Governança Pós-UX Evolution V2 — Referências JKA
- **SPEC 06 — Alinhamento Oficial de Graduações Kyu/Dan com JKA Brasil**: *Aprovada em Human Validation em 23/09/2026*.
- **SPEC 07 — Referências JKA, Regras Administrativas de Exame e Base de Competição**: *Implementada — Aguardando Human Validation em 23/09/2026*.
- A SPEC 07 deve preservar a separação entre programa técnico de graduação, regras administrativas de exame e regras de competição.
