# SPEC 08 — Gestão de Campeonatos, Inscrições e Pagamentos

> **Status:** IMPLEMENTADA — AGUARDANDO HUMAN VALIDATION (30/09/2026).
>
> **Escopo:** Módulo oficial de Gestão de Campeonatos Esportivos, Inscrições de Atletas e Conferência Financeira PIX.
>
> **Repositório:** `CMOURASIGA/webappshotokanmadeira`.

---

## 1. Objetivo e Diretrizes Gerais

Criar no site do **Madeira Karate Shotokan & Artes Marciais** um módulo completo de campeonatos esportivos que permita:

- Cadastrar e configurar campeonatos (com modalidades flexíveis, datas, locais e regulamentos);
- Divulgar campeonatos na Home e na Loja com direcionamento para página própria (sem tratar inscrições como produto de estoque no carrinho de compras);
- Receber inscrições de atletas com cálculo automático da idade na data exata da competição;
- Suporte a atletas menores de idade com coleta e autorização obrigatória de responsáveis legais;
- Gerar payload e QR Code PIX oficial válido (padrão EMVCo BR Code do Banco Central com CRC16);
- Direcionar envio de comprovante para o WhatsApp oficial do Dojo (reutilizando a configuração do `AppDataContext`);
- Permitir conferência manual do pagamento pelo Sensei e comissão organizadora;
- Manter separação estrita entre **Status de Inscrição** e **Status de Pagamento**;
- Permitir consulta e alteração controlada de dados pelo próprio atleta dentro do período de inscrições abertas;
- Gestão e atribuição manual de categorias;
- Integração com a Google Sheet oficial do Madeira Karate via exportação CSV compatível (com BOM UTF-8) e Webhook Google Apps Script para sincronização em tempo real;
- Centro de gestão administrativo na rota `/#/dashboard_campeonato` protegido por autenticação.

---

## 2. Estrutura dos Módulos Implementados

### 2.1 Dashboard Administrativo (`/#/dashboard_campeonato`)
- **Acesso Exclusivo / Autenticação:** Tela com controle de PIN do Sensei (institucional padrão `1926`, com possibilidade de alteração em tela) e persistência de sessão.
- **Abas do Painel:**
  1. **Visão Geral:** Indicadores derivados de dados reais:
     - Total de inscritos;
     - Inscrições aguardando pagamento (`AGUARDANDO_PAGAMENTO`);
     - Pagamentos aguardando conferência (`AGUARDANDO_CONFERENCIA`);
     - Inscrições confirmadas (`CONFIRMADA`);
     - Inscrições canceladas (`CANCELADA`);
     - Valor previsto (soma dos valores das inscrições ativas);
     - Valor confirmado (soma das inscrições com pagamento confirmado);
     - Participação esportiva unificada (100% dos atletas em Kata + Kumite) e proporção de menores vs. adultos;
     - Distribuição por faixa (contadores por Kyu/Dan);
     - Distribuição por categoria/chave de disputa (com indicador de atletas sem categoria).
  2. **Inscrições:** Tabela com busca textual (nome, código, telefone, e-mail), filtros por status de inscrição, status de pagamento e filtro "Apenas sem categoria". Coluna direta para alocação de Chave/Categoria pelo Sensei com 1 clique (sem coluna redundante de modalidade). Botão de exclusão definitiva de inscrição (ícone de lixeira com modal de confirmação) para casos de desistência do atleta, além de abertura de modal com detalhes completos, autorização de menor e histórico de auditoria.
  3. **Pagamentos:** Central de conferência financeira manual com ações diretas: "Confirmar Pagamento", "Marcar em Conferência", "Rejeitar Pagamento" (com justificativa), exibição da Chave/Categoria e atalho de conversa direta no WhatsApp do atleta.
  4. **Categorias (Chaves de Competição):** Central de organização técnica das Chaves do Campeonato (por idade mínima/máxima, sexo e peso máximo). Como todos os atletas fazem todas as modalidades (Kata e Kumite), as chaves são unificadas sem divisão artificial por modalidade, simplificando o chaveamento pelo Sensei.
  5. **Configurações:** Edição de dados do campeonato (nome, slug, datas de abertura e encerramento, data da competição, local, valor, modalidades dinâmicas, regulamento e política de menores), configuração da chave PIX, alteração do PIN administrativo e integração com Google Sheets.

---

### 2.2 Página Pública do Campeonato (`/#/campeonatos/:slug`)
- Informações completas do evento: data, local, modalidades disponíveis, valor da inscrição, badge de período de inscrição e regulamento técnico oficial.
- **Formulário de Inscrição Esportiva Simplificado:**
  - Nome completo, data de nascimento, sexo, graduação/faixa, peso corporal (kg), WhatsApp e e-mail.
  - **Participação Integral Unificada:** Não é exigida seleção de modalidade pelo atleta no formulário, pois todos os atletas inscritos competem em todas as modalidades (Kata e Kumite), com chaveamento organizado pela comissão técnica por categoria de idade, sexo e graduação.
  - **Remoção de Observações Médicas:** O formulário não requer mais observações médicas, tornando o preenchimento mais ágil, direto e acessível a pais e alunos.
  - **Cálculo de Idade Rigoroso:** Calcula e exibe em tempo real a idade do atleta na data da realização do campeonato (não apenas no dia de preenchimento).
  - **Validação de Menor de Idade (< 18 anos):** Ativa automaticamente campos obrigatórios para nome do responsável, WhatsApp do responsável e checkbox de autorização legal expressa.
  - **Persistência Garantida:** O código único só é gerado e retornado após a gravação real e confirmada no storage local e disparo de sincronização.
- **Tela de Confirmação & Pagamento:**
  - Código único sequencial gerado (ex: `CAM2026-0001`);
  - Status inicial claro: Inscrição `RECEBIDA` e Pagamento `AGUARDANDO_PAGAMENTO`;
  - Renderização do QR Code PIX oficial e botão "Copiar PIX Copia e Cola";
  - Botão "Enviar comprovante pelo WhatsApp" pré-configurado com os dados da inscrição (incluindo participação integral);
  - Botão "Já enviei o comprovante", que atualiza o status para `AGUARDANDO_CONFERENCIA`;
  - Nota explícita: abrir o WhatsApp não confirma o pagamento automaticamente.

---

### 2.3 Consulta e Alteração pelo Atleta (`/#/campeonatos/:slug/consulta`)
- Consulta segura via Código da Inscrição + Dado de validação (e-mail, data de nascimento ou telefone).
- Exibição do status em tempo real.
- Permissão de alteração cadastral (peso, telefone, e-mail, dados do responsável quando menor) estritamente enquanto as inscrições estiverem no período aberto (`INSCRICOES_ABERTAS`).
- Cancelamento restrito: o atleta não pode cancelar sua própria inscrição (o cancelamento é uma ação administrativa do Dojo).
- Registro de auditoria (`auditLogs`) a cada alteração efetuada.

---

### 2.4 PIX Oficial EMVCo BR Code (`src/lib/pixUtils.ts`)
- Geração em conformidade com as normas do Banco Central do Brasil.
- Cálculo oficial do CRC16-CCITT (polinômio `0x1021`, valor inicial `0xFFFF`).
- Formatação dos campos EMV (GUI `br.gov.bcb.pix`, chave, MCC, moeda BRL 986, valor formatado, país BR, nome e cidade do recebedor normalizados sem acentos, TxID da inscrição).
- Suporte a valor definido ou livre conforme configuração do Sensei.
- Geração nativa de imagem QR Code em DataURL.

---

### 2.5 Separação Estrita de Domínios de Status
- **Status da Inscrição:**
  - `RECEBIDA`: Inscrição registrada, aguardando validação de pagamento.
  - `CONFIRMADA`: Inscrição confirmada após conferência manual positiva do pagamento.
  - `CANCELADA`: Inscrição cancelada administrativamente pelo Sensei/Dojo com registro de motivo.
- **Status do Pagamento:**
  - `AGUARDANDO_PAGAMENTO`: Aguardando realização do PIX e envio do comprovante.
  - `AGUARDANDO_CONFERENCIA`: Comprovante enviado pelo atleta via WhatsApp, aguardando verificação pelo Dojo.
  - `PAGAMENTO_CONFIRMADO`: Pagamento identificado no extrato da conta bancária.
  - `PAGAMENTO_REJEITADO`: Comprovante divergente ou inválido com justificativa registrada.

---

### 2.6 Integração com a Planilha Oficial do Madeira Karate
- ID da Planilha Oficial conectada: `1cqiHLjSY7tCKnur0FMH8s5lU2EUbSGB4vC6g2ABTjCM`.
- **Exportação CSV:** Botão para download de planilha CSV estruturada com todas as colunas de atletas, responsáveis, status e valores, com codificação BOM UTF-8 (`\uFEFF`) e delimitador `;`, garantindo abertura direta sem perda de acentuação no Google Sheets e Microsoft Excel.
- **Google Apps Script Webhook:** Fornecido código completo e documentado pronto para colar no Apps Script da planilha institucional, aceitando requisições POST para inserção direta na aba `Inscrições`.
- Nenhuma credencial privada do Google exposta no frontend.

---

## 3. Arquivos Criados e Modificados

| Arquivo | Descrição |
| :--- | :--- |
| `src/types/championship.ts` | Definições TypeScript de campeonatos, inscrições, categorias, logs de auditoria e PIX. |
| `src/lib/pixUtils.ts` | Algoritmo EMVCo BR Code e cálculo CRC16 para QR Code e Pix Copia e Cola. |
| `src/services/championshipService.ts` | Camada de serviços, persistência, cálculo de idade, geração de IDs e exportação Google Sheets. |
| `src/views/ChampionshipDetail.tsx` | View pública do campeonato e formulário de inscrição de atletas. |
| `src/views/ChampionshipLookup.tsx` | View de consulta e alteração controlada de inscrições pelo atleta. |
| `src/views/ChampionshipDashboard.tsx` | Painel administrativo (`/#/dashboard_campeonato`) com as 5 abas de gestão. |
| `src/components/championship/ChampionshipPromoBanner.tsx` | Banner promocional reutilizável para divulgação na Home e na Loja. |
| `src/views/Home.tsx` | Inclusão do destaque oficial do campeonato. |
| `src/views/Store.tsx` | Divulgação do campeonato com direcionamento para a rota específica (sem carrinho da loja). |
| `src/components/Sidebar.tsx` | Inclusão do item "Campeonatos" e atalho para o painel administrativo. |
| `src/components/MobileNav.tsx` | Inclusão do item "Campeonatos" e atalho para o painel administrativo mobile. |
| `src/lib/searchIndex.ts` | Indexação do módulo de campeonatos na busca global. |
| `src/App.tsx` | Configuração das rotas `/campeonatos`, `/campeonatos/:slug`, `/campeonatos/:slug/consulta` e `/dashboard_campeonato`. |
| `AGENTS.md` | Atualização da governança do roadmap. |
