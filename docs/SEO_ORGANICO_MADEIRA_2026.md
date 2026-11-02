# SEO Orgânico, Descoberta Educativa e Captação de Alunos

## Objetivo
Tornar pesquisáveis conteúdos institucionais e educativos do Madeira Karate, sem substituir a experiência do Dojo Digital nem inventar dados comerciais.

## Entregas desenvolvidas (02/11/2026)
1. Página de história do Shotokan com HTML indexável.
2. Página de fundamentos com kihon, kata, kumite e Dojo Kun.
3. Página de faixas e graduação, sem inventar regras específicas da academia.
4. Página de modalidades com acesso à grade atual do aplicativo.
5. Ligações visíveis a partir da página inicial.
6. Sitemap ampliado com URLs canônicas individuais.
7. Metadados e JSON-LD WebPage individualizados em cada página.

## Limites e precauções
- As páginas públicas são em português brasileiro; não anunciam versões EN/JA inexistentes.
- A grade de horários permanece no aplicativo e não foi copiada para evitar desatualização.
- Endereço e localização não foram inventados. SEO geográfico depende de confirmar informações institucionais e Perfil da Empresa.
- Não alterar nem indexar páginas de administração, pedidos e área do aluno.
- Não migrar HashRouter nem comprometer as rotas existentes nesta etapa.

## Homologação obrigatória
- Build Vite e typecheck (npm run lint); testes de HTML, canonical e sitemap.
- Acessar as quatro URLs diretamente via HTTPS na Preview, confirmar 200 e conteúdo no HTML inicial, sem redirecionar para SPA.
- Conferir navegação, links, visualização mobile e fonte dos dados de horários.
- Confirmar que PT/EN/JA da aplicação existente não sofreu regressões; a nova seção na Home deve ser traduzida antes de aprovação multilíngue.
- Confirmar zero alteração dos fluxos loja, PIN, campeonato, área do aluno.
- Publicação em main somente com autorização expressa.

## Search Console após publicação autorizada
- Reenviar /sitemap.xml uma vez.
- Inspecionar cada nova URL, realizar teste ativo e solicitar indexação apenas se necessário.
- Acompanhar consultas, impressões, cliques e posição média; indexação não significa posicionamento garantido.
