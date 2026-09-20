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
- **SPEC 04**: Loja V2 & Catálogo Integrado (*Liberada para desenvolvimento*).
- **SPECs Subsequentes**: Não iniciar SPEC 05 antes da aprovação explícita em Human Validation da SPEC 04.
