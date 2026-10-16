import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import Papa from 'papaparse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.resolve(__dirname, 'data', 'championships_store.json');
const GOOGLE_SHEET_ID = '1cqiHLjSY7tCKnur0FMH8s5lU2EUbSGB4vC6g2ABTjCM';
const DEFAULT_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzlvJ68P0WmpFeWiqeZ9lu26mskgkgmoLN4Rz5AVrZA8NaILcc_RBtffmsjQmiRucU/exec';

interface StoreData {
  championships: any[];
  registrations: any[];
  categories: any[];
  storeOrders: any[];
  storeOrderItems: any[];
  settings: {
    adminPin: string;
    googleSheetId: string;
    googleAppsScriptUrl: string;
    webhookSecret: string;
  };
}

function loadStore(): StoreData {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      return {
        championships: Array.isArray(parsed.championships) ? parsed.championships : [],
        registrations: Array.isArray(parsed.registrations) ? parsed.registrations : [],
        categories: Array.isArray(parsed.categories) ? parsed.categories : [],
        storeOrders: Array.isArray(parsed.storeOrders) ? parsed.storeOrders : [],
        storeOrderItems: Array.isArray(parsed.storeOrderItems) ? parsed.storeOrderItems : [],
        settings: {
          adminPin: parsed.settings?.adminPin || '1926',
          googleSheetId: parsed.settings?.googleSheetId || GOOGLE_SHEET_ID,
          googleAppsScriptUrl: parsed.settings?.googleAppsScriptUrl || DEFAULT_APPS_SCRIPT_URL,
          webhookSecret: parsed.settings?.webhookSecret || 'madeira_sensei_secret_2026'
        }
      };
    }
  } catch (err) {
    console.error('[Store] Error reading store file:', err);
  }

  return {
    championships: [],
    registrations: [],
    categories: [],
    storeOrders: [],
    storeOrderItems: [],
    settings: {
      adminPin: '1926',
      googleSheetId: GOOGLE_SHEET_ID,
      googleAppsScriptUrl: DEFAULT_APPS_SCRIPT_URL,
      webhookSecret: 'madeira_sensei_secret_2026'
    }
  };
}

function saveStore(data: StoreData) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Store] Error writing store file:', err);
  }
}

// Atomic Protocol ID generator
function generateNextProtocol(registrations: any[]): string {
  const year = new Date().getFullYear();
  const prefix = `CAM${year}-`;
  let maxSeq = 0;

  for (const reg of registrations) {
    if (reg.id && typeof reg.id === 'string') {
      if (reg.id.startsWith(prefix)) {
        const numPart = parseInt(reg.id.replace(prefix, ''), 10);
        if (!isNaN(numPart) && numPart > maxSeq) {
          maxSeq = numPart;
        }
      } else if (reg.id.startsWith(`MK-${year}-`)) {
        const numPart = parseInt(reg.id.replace(`MK-${year}-`, ''), 10);
        if (!isNaN(numPart) && numPart > maxSeq) {
          maxSeq = numPart;
        }
      }
    }
  }

  const nextSeq = maxSeq + 1;
  return `${prefix}${String(nextSeq).padStart(4, '0')}`;
}

// Atomic MadeiraStore Order Code generator (SPEC 09: MS2026-0001)
function generateNextStoreOrderCode(orders: any[]): string {
  const year = new Date().getFullYear();
  const prefix = `MS${year}-`;
  let maxSeq = 0;

  for (const order of orders) {
    const code = String(order.codigo || order.id || '');
    if (code.startsWith(prefix)) {
      const numPart = parseInt(code.replace(prefix, ''), 10);
      if (!isNaN(numPart) && numPart > maxSeq) {
        maxSeq = numPart;
      }
    }
  }

  const nextSeq = maxSeq + 1;
  return `${prefix}${String(nextSeq).padStart(4, '0')}`;
}

// Push to Google Apps Script Webhook securely from server
async function pushToGoogleSheets(action: string, payload: any, settings: StoreData['settings']) {
  const targetUrl = settings.googleAppsScriptUrl || DEFAULT_APPS_SCRIPT_URL;
  if (!targetUrl || !targetUrl.startsWith('http')) {
    console.warn('[Sheets Webhook] No valid Google Apps Script URL configured.');
    return;
  }
  try {
    const body = {
      secret: settings.webhookSecret,
      action,
      ...payload
    };
    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      redirect: 'follow'
    });
    console.log(`[Sheets Webhook] Pushed action "${action}", status: ${res.status}`);
  } catch (err) {
    console.warn('[Sheets Webhook] Error pushing to Google Apps Script:', err);
  }
}

// Pull and sync from official Google Sheets tabs
async function syncFromGoogleSheets(store: StoreData): Promise<{ championships: number; registrations: number; categories: number; storeOrders?: number }> {
  const sheetId = store.settings.googleSheetId || GOOGLE_SHEET_ID;
  let addedChamps = 0;
  let addedRegs = 0;
  let addedCats = 0;

  try {
    // 1. Tab: CAMPEONATOS
    const champsUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent('CAMPEONATOS')}`;
    const champsRes = await fetch(champsUrl);
    if (champsRes.ok) {
      const champsCsv = await champsRes.text();
      const parsed = Papa.parse(champsCsv, { header: true }).data as any[];
      if (parsed.length > 0 && ('dataCampeonato' in parsed[0] || 'slug' in parsed[0] || 'valorInscricao' in parsed[0])) {
        for (const row of parsed) {
          if (!row.id || !row.nome) continue;
          const existingIdx = store.championships.findIndex(c => c.id === row.id);
          const champObj = {
            id: String(row.id).trim(),
            slug: String(row.slug || row.id).trim(),
            nome: String(row.nome).trim(),
            descricao: String(row.descricao || '').trim(),
            dataCampeonato: String(row.dataCampeonato || '').trim(),
            local: String(row.local || '').trim(),
            aberturaInscricoes: String(row.aberturaInscricoes || '').trim(),
            encerramentoInscricoes: String(row.encerramentoInscricoes || '').trim(),
            status: String(row.status || 'INSCRICOES_ABERTAS').trim(),
            valorInscricao: parseFloat(String(row.valorInscricao || 0).replace(',', '.')) || 0,
            modalidades: row.modalidades 
              ? String(row.modalidades).split(/[,;]/).map((s: string) => s.trim()).filter(Boolean) 
              : ['Kata', 'Kumite'],
            configuracaoPix: {
              tipoChave: row.pixTipo || 'EMAIL',
              chave: row.pixChave || 'madeirakarateshotokan@gmail.com',
              nomeRecebedor: row.pixNome || 'MADEIRA KARATE',
              cidadeRecebedor: row.pixCidade || 'RIO DE JANEIRO',
              incluirValorNoQrCode: String(row.pixIncluirValor).toLowerCase() !== 'não',
              instrucoesAdicionais: 'Pagamento referente à inscrição no torneio.'
            },
            regulamento: String(row.regulamento || '').trim(),
            permiteMenores: String(row.permiteMenores).toLowerCase() !== 'não',
            idadeMinima: row.idadeMinima ? parseInt(String(row.idadeMinima), 10) : undefined,
            idadeMaxima: row.idadeMaxima ? parseInt(String(row.idadeMaxima), 10) : undefined,
            createdAt: row.createdAt || new Date().toISOString(),
            updatedAt: row.updatedAt || new Date().toISOString()
          };

          if (existingIdx >= 0) {
            store.championships[existingIdx] = { ...store.championships[existingIdx], ...champObj };
          } else {
            store.championships.push(champObj);
            addedChamps++;
          }
        }
      }
    }
  } catch (e) {
    console.warn('[Sync] Could not pull CAMPEONATOS tab:', e);
  }

  try {
    // 2. Tab: Inscrições (com fallback para INSCRICOES_CAMPEONATO)
    let regsCsv = '';
    for (const tabName of ['Inscrições', 'INSCRICOES_CAMPEONATO']) {
      try {
        const res = await fetch(`https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tabName)}`);
        if (res.ok) {
          const text = await res.text();
          if (text.includes('Código') || text.includes('Nome Completo') || text.includes('nomeCompleto') || text.includes('championshipId')) {
            regsCsv = text;
            break;
          }
        }
      } catch {}
    }

    if (regsCsv) {
      const parsed = Papa.parse(regsCsv, { header: true }).data as any[];
      for (const row of parsed) {
        const id = String(row['Código'] || row.id || '').trim();
        const nomeCompleto = String(row['Nome Completo'] || row.nomeCompleto || '').trim();
        if (!id || !nomeCompleto) continue;

        const existingIdx = store.registrations.findIndex(r => r.id === id);
        const regObj = {
          id,
          championshipId: String(row['Campeonato ID'] || row.championshipId || '').trim(),
          championshipName: String(row['Campeonato'] || row.championshipName || '').trim(),
          nomeCompleto,
          dataNascimento: String(row['Nascimento'] || row.dataNascimento || '').trim(),
          idadeNaDataCampeonato: parseInt(row['Idade'] || row.idadeNaDataCampeonato, 10) || 0,
          sexo: row['Sexo'] || row.sexo || 'Masculino',
          graduacao: row['Graduação'] || row.graduacao || 'Faixa Branca',
          peso: parseFloat(String(row['Peso (kg)'] || row.peso || 0).replace(',', '.')) || 0,
          modalidade: row['Participação'] || row.modalidade || 'Kata, Kumite',
          telefone: String(row['Telefone'] || row.telefone || '').trim(),
          email: String(row['E-mail'] || row.email || '').trim(),
          isMenor: String(row['Menor?'] || row.isMenor).toLowerCase() === 'sim' || String(row['Menor?'] || row.isMenor).toLowerCase() === 'true',
          nomeResponsavel: String(row['Responsável'] || row.nomeResponsavel || '').trim(),
          telefoneResponsavel: String(row['Tel Responsável'] || row.telefoneResponsavel || '').trim(),
          autorizacaoResponsavel: true,
          aceiteRegulamento: true,
          categoriaId: String(row['Categoria ID'] || row.categoriaId || '').trim(),
          categoriaNome: String(row['Chave/Categoria'] || row.categoriaNome || 'Sem Categoria').trim(),
          status: row['Status Inscrição'] || row.status || 'CONFIRMADA',
          paymentStatus: row['Status Pagamento'] || row.paymentStatus || 'PAGAMENTO_CONFIRMADO',
          valorInscricao: parseFloat(String(row['Valor'] || row.valorInscricao || 0).replace(',', '.')) || 0,
          dataHoraInscricao: row['Data/Hora Inscrição'] || row.dataHoraInscricao || new Date().toISOString(),
          conferidoEm: row['Data Confirmação'] || row.conferidoEm || '',
          conferidoPor: row['Confirmado Por'] || row.conferidoPor || '',
          comprovanteRecebido: String(row['Comprovante Recebido'] || row.comprovanteRecebido).toLowerCase() === 'sim' || String(row['Comprovante Recebido'] || row.comprovanteRecebido).toLowerCase() === 'true',
          observacoes: row['Observações'] || row.observacoes || '',
          auditLog: [
            {
              timestamp: row['Data/Hora Inscrição'] || new Date().toISOString(),
              actor: 'Planilha Oficial Google Sheets',
              action: 'SINCRONIZAÇÃO',
              notes: 'Importado da aba oficial de Inscrições.'
            }
          ]
        };

        if (existingIdx >= 0) {
          store.registrations[existingIdx] = { ...store.registrations[existingIdx], ...regObj };
        } else {
          store.registrations.push(regObj);
          addedRegs++;
        }
      }
    }
  } catch (e) {
    console.warn('[Sync] Could not pull Inscrições tab:', e);
  }

  try {
    // 3. Tab: CATEGORIAS_CAMPEONATO
    const catsUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent('CATEGORIAS_CAMPEONATO')}`;
    const catsRes = await fetch(catsUrl);
    if (catsRes.ok) {
      const catsCsv = await catsRes.text();
      const parsed = Papa.parse(catsCsv, { header: true }).data as any[];
      if (parsed.length > 0 && ('nome' in parsed[0] || 'idadeMinima' in parsed[0])) {
        for (const row of parsed) {
          if (!row.id || !row.nome) continue;
          const existingIdx = store.categories.findIndex(c => c.id === row.id);
          const catObj = {
            id: String(row.id).trim(),
            championshipId: String(row.campeonatoId || row.championshipId || '').trim(),
            nome: String(row.nome).trim(),
            modalidade: row.modalidade || 'Geral',
            idadeMinima: row.idadeMinima ? parseInt(String(row.idadeMinima), 10) : undefined,
            idadeMaxima: row.idadeMaxima ? parseInt(String(row.idadeMaxima), 10) : undefined,
            sexo: row.sexo || 'Misto',
            pesoMaximo: row.pesoMaximo ? parseFloat(String(row.pesoMaximo).replace(',', '.')) : undefined,
            observacoes: row.observacoes || ''
          };

          if (existingIdx >= 0) {
            store.categories[existingIdx] = { ...store.categories[existingIdx], ...catObj };
          } else {
            store.categories.push(catObj);
            addedCats++;
          }
        }
      }
    }
  } catch (e) {
    console.warn('[Sync] Could not pull CATEGORIAS_CAMPEONATO tab:', e);
  }

  // 4. Tab: PEDIDOS_LOJA & ITENS_PEDIDO_LOJA (SPEC 09)
  try {
    const ordersUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent('PEDIDOS_LOJA')}`;
    const ordersRes = await fetch(ordersUrl);
    if (ordersRes.ok) {
      const ordersCsv = await ordersRes.text();
      const parsedOrders = Papa.parse(ordersCsv, { header: true }).data as any[];
      for (const row of parsedOrders) {
        const id = String(row.id || row['Código'] || row.codigo || '').trim();
        const nomeCliente = String(row.nomeCliente || row['Nome Completo'] || row.cliente || '').trim();
        if (!id || !nomeCliente) continue;

        const existingIdx = store.storeOrders.findIndex(o => o.id === id || o.codigo === id);
        const orderObj = {
          id,
          codigo: String(row.codigo || id).trim(),
          nomeCliente,
          telefone: String(row.telefone || '').trim(),
          email: String(row.email || '').trim(),
          valorTotal: parseFloat(String(row.valorTotal || row.total || 0).replace(',', '.')) || 0,
          statusPedido: String(row.statusPedido || 'RECEBIDO').trim(),
          statusPagamento: String(row.statusPagamento || 'AGUARDANDO_PAGAMENTO').trim(),
          dataCriacao: String(row.dataCriacao || new Date().toISOString()).trim(),
          dataPagamento: row.dataPagamento ? String(row.dataPagamento).trim() : undefined,
          dataRetirada: row.dataRetirada ? String(row.dataRetirada).trim() : undefined,
          observacoes: String(row.observacoes || '').trim(),
          atualizadoEm: String(row.atualizadoEm || new Date().toISOString()).trim()
        };

        if (existingIdx >= 0) {
          store.storeOrders[existingIdx] = { ...store.storeOrders[existingIdx], ...orderObj };
        } else {
          store.storeOrders.push(orderObj);
        }
      }
    }
  } catch (e) {
    console.warn('[Sync] Could not pull PEDIDOS_LOJA tab (may not be created yet):', e);
  }

  try {
    const itemsUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent('ITENS_PEDIDO_LOJA')}`;
    const itemsRes = await fetch(itemsUrl);
    if (itemsRes.ok) {
      const itemsCsv = await itemsRes.text();
      const parsedItems = Papa.parse(itemsCsv, { header: true }).data as any[];
      for (const row of parsedItems) {
        const pedidoId = String(row.pedidoId || '').trim();
        const produtoNome = String(row.produtoNome || '').trim();
        if (!pedidoId || !produtoNome) continue;

        const itemId = String(row.id || `${pedidoId}_${row.produtoId || ''}_${row.tamanho || ''}_${row.variacao || ''}`).trim();
        const existingIdx = store.storeOrderItems.findIndex(i => (i.id && i.id === itemId) || (i.pedidoId === pedidoId && i.produtoNome === produtoNome && i.tamanho === row.tamanho && i.variacao === row.variacao));

        const itemObj = {
          id: itemId,
          pedidoId,
          produtoId: String(row.produtoId || '').trim(),
          produtoNome,
          categoria: String(row.categoria || '').trim() || undefined,
          quantidade: parseInt(String(row.quantidade || 1), 10) || 1,
          tamanho: String(row.tamanho || '').trim() || undefined,
          cor: String(row.cor || '').trim() || undefined,
          variacao: String(row.variacao || '').trim() || undefined,
          personalizacao: String(row.personalizacao || '').trim() || undefined,
          valorUnitario: parseFloat(String(row.valorUnitario || 0).replace(',', '.')) || 0,
          subtotal: parseFloat(String(row.subtotal || 0).replace(',', '.')) || 0
        };

        if (existingIdx >= 0) {
          store.storeOrderItems[existingIdx] = { ...store.storeOrderItems[existingIdx], ...itemObj };
        } else {
          store.storeOrderItems.push(itemObj);
        }
      }
    }
  } catch (e) {
    console.warn('[Sync] Could not pull ITENS_PEDIDO_LOJA tab (may not be created yet):', e);
  }

  saveStore(store);
  return { championships: addedChamps, registrations: addedRegs, categories: addedCats, storeOrders: store.storeOrders.length };
}

async function startServer() {
  const app = express();
  const PORT = 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // ----------------------------------------------------
  // API: Healthcheck
  // ----------------------------------------------------
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // ----------------------------------------------------
  // API: Admin Authentication
  // ----------------------------------------------------
  app.post('/api/admin/auth', (req, res) => {
    const { pin } = req.body;
    const store = loadStore();
    const correctPin = store.settings.adminPin || '1926';

    if (String(pin).trim() === String(correctPin).trim()) {
      return res.json({ 
        success: true, 
        token: `madeira_session_${Date.now()}`,
        disclaimer: 'Acesso operacional: autenticação por PIN administrativo do Dojo.' 
      });
    }

    return res.status(401).json({ success: false, message: 'PIN incorreto. Verifique com a comissão técnica.' });
  });

  // ----------------------------------------------------
  // API: Settings
  // ----------------------------------------------------
  app.get('/api/settings', (req, res) => {
    const store = loadStore();
    // Return settings without exposing webhook secret
    res.json({
      googleSheetId: store.settings.googleSheetId,
      googleAppsScriptUrl: store.settings.googleAppsScriptUrl,
      hasWebhook: Boolean(store.settings.googleAppsScriptUrl)
    });
  });

  app.post('/api/settings', (req, res) => {
    const store = loadStore();
    const { googleAppsScriptUrl, newAdminPin } = req.body;

    if (googleAppsScriptUrl !== undefined) {
      store.settings.googleAppsScriptUrl = String(googleAppsScriptUrl).trim();
    }
    if (newAdminPin && String(newAdminPin).trim().length >= 4) {
      store.settings.adminPin = String(newAdminPin).trim();
    }

    saveStore(store);
    res.json({ success: true, message: 'Configurações atualizadas com sucesso!' });
  });

  // ----------------------------------------------------
  // API: Championships
  // ----------------------------------------------------
  app.get('/api/championships', (req, res) => {
    const store = loadStore();
    res.json(store.championships);
  });

  app.post('/api/championships', (req, res) => {
    const store = loadStore();
    const champ = req.body.championship || req.body;
    if (req.body.googleAppsScriptUrl && typeof req.body.googleAppsScriptUrl === 'string' && req.body.googleAppsScriptUrl.startsWith('http')) {
      store.settings.googleAppsScriptUrl = req.body.googleAppsScriptUrl.trim();
    }

    if (!champ || !champ.nome) {
      return res.status(400).json({ error: 'Nome do campeonato é obrigatório.' });
    }

    const id = champ.id || `champ-${Date.now()}`;
    const cleanSlug = champ.slug || champ.nome
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || `torneio-${Date.now()}`;

    const newChamp = {
      ...champ,
      id,
      slug: cleanSlug,
      modalidades: Array.isArray(champ.modalidades) && champ.modalidades.length > 0 
        ? champ.modalidades 
        : ['Kata', 'Kumite', 'Kata + Kumite'],
      createdAt: champ.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const idx = store.championships.findIndex(c => c.id === id);
    if (idx >= 0) {
      store.championships[idx] = newChamp;
    } else {
      store.championships.push(newChamp);
    }

    saveStore(store);
    pushToGoogleSheets('SAVE_CHAMPIONSHIP', { championship: newChamp }, store.settings);

    res.status(201).json(newChamp);
  });

  app.delete('/api/championships/:id', (req, res) => {
    const store = loadStore();
    const id = req.params.id;

    // Check registrations
    const attachedRegs = store.registrations.filter(r => r.championshipId === id);
    if (attachedRegs.length > 0) {
      return res.status(400).json({ 
        error: `Não é possível excluir: existem ${attachedRegs.length} inscrição(ões) vinculadas a este campeonato.` 
      });
    }

    store.championships = store.championships.filter(c => c.id !== id);
    store.categories = store.categories.filter(c => c.championshipId !== id);
    saveStore(store);

    pushToGoogleSheets('DELETE_CHAMPIONSHIP', { championshipId: id }, store.settings);
    res.json({ success: true });
  });

  // ----------------------------------------------------
  // API: Registrations (Central Unique Protocol & Persistence)
  // ----------------------------------------------------
  app.get('/api/registrations', (req, res) => {
    const store = loadStore();
    const { championshipId } = req.query;

    if (championshipId) {
      const filtered = store.registrations.filter(r => r.championshipId === championshipId);
      return res.json(filtered);
    }

    res.json(store.registrations);
  });

  app.get('/api/registrations/:id', (req, res) => {
    const store = loadStore();
    const id = req.params.id;
    const found = store.registrations.find(r => r.id === id);

    if (!found) {
      return res.status(404).json({ error: 'Inscrição não encontrada.' });
    }

    res.json(found);
  });

  app.post('/api/registrations', (req, res) => {
    const store = loadStore();
    const data = req.body.registration || req.body;
    if (req.body.googleAppsScriptUrl && typeof req.body.googleAppsScriptUrl === 'string' && req.body.googleAppsScriptUrl.startsWith('http')) {
      store.settings.googleAppsScriptUrl = req.body.googleAppsScriptUrl.trim();
    }

    if (!data.championshipId) {
      return res.status(400).json({ error: 'ID do campeonato é obrigatório.' });
    }
    if (!data.nomeCompleto || !data.dataNascimento || !data.telefone) {
      return res.status(400).json({ error: 'Preencha os campos obrigatórios (nome, nascimento, telefone).' });
    }

    const champ = store.championships.find(c => c.id === data.championshipId);
    if (!champ) {
      return res.status(404).json({ error: 'Campeonato não encontrado no sistema oficial.' });
    }

    // Atomically generate unique protocol code centrally
    const protocolId = generateNextProtocol(store.registrations);

    const newRegistration = {
      id: protocolId,
      championshipId: champ.id,
      championshipName: champ.nome,
      nomeCompleto: data.nomeCompleto.trim(),
      dataNascimento: data.dataNascimento,
      idadeNaDataCampeonato: data.idadeNaDataCampeonato || 0,
      sexo: data.sexo || 'Masculino',
      graduacao: data.graduacao || 'Faixa Branca',
      peso: data.peso || 0,
      modalidade: data.modalidade || (champ.modalidades?.[0] || 'Kata'),
      telefone: data.telefone.trim(),
      email: data.email?.trim() || '',
      isMenor: Boolean(data.isMenor),
      nomeResponsavel: data.nomeResponsavel || '',
      telefoneResponsavel: data.telefoneResponsavel || '',
      autorizacaoResponsavel: Boolean(data.autorizacaoResponsavel),
      aceiteRegulamento: Boolean(data.aceiteRegulamento),
      categoriaId: data.categoriaId || '',
      categoriaNome: data.categoriaNome || 'Sem Categoria',
      status: 'RECEBIDA',
      paymentStatus: 'AGUARDANDO_PAGAMENTO',
      valorInscricao: champ.valorInscricao,
      dataHoraInscricao: new Date().toISOString(),
      comprovanteRecebido: false,
      observacoes: data.observacoes || '',
      auditLog: [
        {
          timestamp: new Date().toISOString(),
          actor: 'Atleta / Responsável',
          action: 'INSCRIÇÃO_CRIADA',
          notes: `Inscrição gerada centralmente com protocolo ${protocolId}.`
        }
      ]
    };

    store.registrations.push(newRegistration);
    saveStore(store);

    // Push to Google Sheets webhook
    pushToGoogleSheets('ADD_REGISTRATION', { registration: newRegistration }, store.settings);

    // Return confirmed registration ONLY after central persistence
    res.status(201).json(newRegistration);
  });

  app.patch('/api/registrations/:id/payment', (req, res) => {
    const store = loadStore();
    const id = req.params.id;
    const { paymentStatus, notes } = req.body;

    const idx = store.registrations.findIndex(r => r.id === id);
    if (idx < 0) {
      return res.status(404).json({ error: 'Inscrição não encontrada.' });
    }

    const reg = store.registrations[idx];
    reg.paymentStatus = paymentStatus;
    if (paymentStatus === 'PAGAMENTO_CONFIRMADO') {
      reg.status = 'CONFIRMADA';
      reg.dataHoraConfirmacao = new Date().toISOString();
    }

    reg.auditLog = reg.auditLog || [];
    reg.auditLog.push({
      timestamp: new Date().toISOString(),
      actor: 'Comissão Técnica / Sensei',
      action: `STATUS_PAGAMENTO_${paymentStatus}`,
      notes: notes || 'Conferência manual de pagamento realizada no dashboard.'
    });

    store.registrations[idx] = reg;
    saveStore(store);

    pushToGoogleSheets('ADD_REGISTRATION', { registration: reg }, store.settings);
    res.json(reg);
  });

  app.patch('/api/registrations/:id/receipt', (req, res) => {
    const store = loadStore();
    const id = req.params.id;

    const idx = store.registrations.findIndex(r => r.id === id);
    if (idx < 0) {
      return res.status(404).json({ error: 'Inscrição não encontrada.' });
    }

    const reg = store.registrations[idx];
    if (reg.paymentStatus === 'AGUARDANDO_PAGAMENTO') {
      reg.paymentStatus = 'AGUARDANDO_CONFERENCIA';
    }
    reg.comprovanteRecebido = true;
    reg.comprovanteEnviadoEm = new Date().toISOString();
    reg.auditLog = reg.auditLog || [];
    reg.auditLog.push({
      timestamp: new Date().toISOString(),
      actor: 'Atleta / Responsável',
      action: 'COMPROVANTE_ENVIADO',
      notes: 'Atleta informou envio do comprovante PIX pelo WhatsApp.'
    });

    store.registrations[idx] = reg;
    saveStore(store);

    pushToGoogleSheets('ADD_REGISTRATION', { registration: reg }, store.settings);
    res.json(reg);
  });

  app.patch('/api/registrations/:id', (req, res) => {
    const store = loadStore();
    const id = req.params.id;
    const updates = req.body;

    const idx = store.registrations.findIndex(r => r.id === id);
    if (idx < 0) {
      return res.status(404).json({ error: 'Inscrição não encontrada.' });
    }

    const reg = {
      ...store.registrations[idx],
      ...updates,
      id // preserve central protocol
    };

    store.registrations[idx] = reg;
    saveStore(store);

    pushToGoogleSheets('ADD_REGISTRATION', { registration: reg }, store.settings);
    res.json(reg);
  });

  app.delete('/api/registrations/:id', (req, res) => {
    const store = loadStore();
    const id = req.params.id;

    store.registrations = store.registrations.filter(r => r.id !== id);
    saveStore(store);

    pushToGoogleSheets('DELETE_REGISTRATION', { registrationId: id }, store.settings);
    res.json({ success: true });
  });

  // ----------------------------------------------------
  // API: Categories (Manual Management)
  // ----------------------------------------------------
  app.get('/api/categories', (req, res) => {
    const store = loadStore();
    const { championshipId } = req.query;

    if (championshipId) {
      const filtered = store.categories.filter(c => c.championshipId === championshipId);
      return res.json(filtered);
    }

    res.json(store.categories);
  });

  app.post('/api/categories', (req, res) => {
    const store = loadStore();
    const cat = req.body.category || req.body;
    if (req.body.googleAppsScriptUrl && typeof req.body.googleAppsScriptUrl === 'string' && req.body.googleAppsScriptUrl.startsWith('http')) {
      store.settings.googleAppsScriptUrl = req.body.googleAppsScriptUrl.trim();
    }

    if (!cat.nome || !cat.championshipId) {
      return res.status(400).json({ error: 'Nome e ID do campeonato são obrigatórios para a categoria.' });
    }

    const id = cat.id || `cat-${Date.now()}`;
    const newCat = { ...cat, id };

    const idx = store.categories.findIndex(c => c.id === id);
    if (idx >= 0) {
      store.categories[idx] = newCat;
    } else {
      store.categories.push(newCat);
    }

    saveStore(store);
    pushToGoogleSheets('SAVE_CATEGORY', { category: newCat }, store.settings);

    res.status(201).json(newCat);
  });

  app.delete('/api/categories/:id', (req, res) => {
    const store = loadStore();
    const id = req.params.id;

    store.categories = store.categories.filter(c => c.id !== id);
    saveStore(store);

    pushToGoogleSheets('DELETE_CATEGORY', { categoryId: id }, store.settings);
    res.json({ success: true });
  });

  // ----------------------------------------------------
  // API: MadeiraStore Orders (SPEC 09)
  // ----------------------------------------------------
  app.get('/api/store/orders', (req, res) => {
    const store = loadStore();
    const ordersWithItems = store.storeOrders.map(order => {
      const items = store.storeOrderItems.filter(item => item.pedidoId === order.id || item.pedidoId === order.codigo);
      return { ...order, itens: items };
    });
    // Mais recentes primeiro
    ordersWithItems.sort((a, b) => new Date(b.dataCriacao || 0).getTime() - new Date(a.dataCriacao || 0).getTime());
    res.json(ordersWithItems);
  });

  app.get('/api/store/orders/:id', (req, res) => {
    const store = loadStore();
    const id = req.params.id;
    const order = store.storeOrders.find(o => o.id === id || o.codigo === id);
    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado.' });
    }
    const items = store.storeOrderItems.filter(item => item.pedidoId === order.id || item.pedidoId === order.codigo);
    res.json({ ...order, itens: items });
  });

  app.post('/api/store/orders', (req, res) => {
    const store = loadStore();
    const { nomeCliente, telefone, email, observacoes, itens } = req.body;

    if (!nomeCliente || !telefone || !email) {
      return res.status(400).json({ error: 'Nome completo, telefone e e-mail são obrigatórios.' });
    }

    if (!Array.isArray(itens) || itens.length === 0) {
      return res.status(400).json({ error: 'O pedido deve conter pelo menos um produto.' });
    }

    // Gerar código oficial sequencial e atômico (ex: MS2026-0001)
    const orderCode = generateNextStoreOrderCode(store.storeOrders);
    const nowIso = new Date().toISOString();

    let totalAmount = 0;
    const createdItems = itens.map((item: any, idx: number) => {
      const qty = parseInt(String(item.quantidade || 1), 10) || 1;
      const unitPrice = parseFloat(String(item.valorUnitario || item.preco || 0).replace(',', '.')) || 0;
      const itemSubtotal = qty * unitPrice;
      totalAmount += itemSubtotal;

      return {
        id: `${orderCode}-item-${idx + 1}`,
        pedidoId: orderCode,
        produtoId: String(item.produtoId || '').trim(),
        produtoNome: String(item.produtoNome || item.name || '').trim(),
        categoria: String(item.categoria || item.category || '').trim() || undefined,
        quantidade: qty,
        tamanho: item.tamanho ? String(item.tamanho).trim() : undefined,
        cor: item.cor ? String(item.cor).trim() : undefined,
        variacao: item.variacao ? String(item.variacao).trim() : undefined,
        personalizacao: item.personalizacao ? String(item.personalizacao).trim() : undefined,
        valorUnitario: unitPrice,
        subtotal: itemSubtotal
      };
    });

    const newOrder = {
      id: orderCode,
      codigo: orderCode,
      nomeCliente: String(nomeCliente).trim(),
      telefone: String(telefone).trim(),
      email: String(email).trim().toLowerCase(),
      valorTotal: totalAmount,
      statusPedido: 'RECEBIDO',
      statusPagamento: 'AGUARDANDO_PAGAMENTO',
      dataCriacao: nowIso,
      dataPagamento: undefined,
      dataRetirada: undefined,
      observacoes: observacoes ? String(observacoes).trim() : '',
      atualizadoEm: nowIso
    };

    store.storeOrders.push(newOrder);
    store.storeOrderItems.push(...createdItems);
    saveStore(store);

    // Enviar ao webhook da planilha Google Sheets
    pushToGoogleSheets('CREATE_STORE_ORDER', { order: newOrder, items: createdItems }, store.settings);

    res.status(201).json({ ...newOrder, itens: createdItems });
  });

  app.post('/api/store/order-lookup', (req, res) => {
    const store = loadStore();
    const { codigo, telefoneOuEmail } = req.body;

    if (!codigo || !telefoneOuEmail) {
      return res.status(400).json({ error: 'Informe o código do pedido e o telefone ou e-mail cadastrado.' });
    }

    const cleanCode = String(codigo).trim().toUpperCase();
    const cleanLookup = String(telefoneOuEmail).trim().toLowerCase().replace(/\D/g, '');
    const rawLookup = String(telefoneOuEmail).trim().toLowerCase();

    const order = store.storeOrders.find(o => {
      const matchCode = String(o.codigo || o.id).trim().toUpperCase() === cleanCode;
      if (!matchCode) return false;

      const orderPhoneDigits = String(o.telefone || '').replace(/\D/g, '');
      const orderEmail = String(o.email || '').trim().toLowerCase();

      const phoneMatch = cleanLookup.length >= 8 && orderPhoneDigits.includes(cleanLookup);
      const emailMatch = rawLookup.includes('@') && orderEmail === rawLookup;

      return phoneMatch || emailMatch;
    });

    if (!order) {
      return res.status(404).json({ error: 'Pedido não localizado com as credenciais informadas. Verifique o código e o contato.' });
    }

    const items = store.storeOrderItems.filter(item => item.pedidoId === order.id || item.pedidoId === order.codigo);
    res.json({ ...order, itens: items });
  });

  app.patch('/api/store/orders/:id/status', (req, res) => {
    const store = loadStore();
    const id = req.params.id;
    const { statusPedido, statusPagamento, observacoes } = req.body;

    const idx = store.storeOrders.findIndex(o => o.id === id || o.codigo === id);
    if (idx < 0) {
      return res.status(404).json({ error: 'Pedido não encontrado.' });
    }

    const order = store.storeOrders[idx];
    const nowIso = new Date().toISOString();

    if (statusPedido) {
      order.statusPedido = statusPedido;
      if (statusPedido === 'ENTREGUE' && !order.dataRetirada) {
        order.dataRetirada = nowIso;
      }
    }

    if (statusPagamento) {
      order.statusPagamento = statusPagamento;
      if (statusPagamento === 'PAGAMENTO_CONFIRMADO' && !order.dataPagamento) {
        order.dataPagamento = nowIso;
      }
    }

    if (observacoes !== undefined) {
      order.observacoes = observacoes;
    }

    order.atualizadoEm = nowIso;
    store.storeOrders[idx] = order;
    saveStore(store);

    pushToGoogleSheets('UPDATE_STORE_ORDER', { order }, store.settings);

    const items = store.storeOrderItems.filter(item => item.pedidoId === order.id || item.pedidoId === order.codigo);
    res.json({ ...order, itens: items });
  });

  app.patch('/api/store/orders/:id/receipt', (req, res) => {
    const store = loadStore();
    const id = req.params.id;

    const idx = store.storeOrders.findIndex(o => o.id === id || o.codigo === id);
    if (idx < 0) {
      return res.status(404).json({ error: 'Pedido não encontrado.' });
    }

    const order = store.storeOrders[idx];
    if (order.statusPagamento === 'AGUARDANDO_PAGAMENTO') {
      order.statusPagamento = 'AGUARDANDO_CONFERENCIA';
    }
    order.atualizadoEm = new Date().toISOString();

    store.storeOrders[idx] = order;
    saveStore(store);

    pushToGoogleSheets('UPDATE_STORE_ORDER', { order }, store.settings);

    const items = store.storeOrderItems.filter(item => item.pedidoId === order.id || item.pedidoId === order.codigo);
    res.json({ ...order, itens: items });
  });

  // ----------------------------------------------------
  // API: Initialize Google Sheets Tabs via Apps Script Webhook
  // ----------------------------------------------------
  app.post('/api/championship-init', async (req, res) => {
    try {
      const store = loadStore();
      const scriptUrl = req.body.googleAppsScriptUrl || store.settings.googleAppsScriptUrl || DEFAULT_APPS_SCRIPT_URL;
      if (scriptUrl) {
        store.settings.googleAppsScriptUrl = scriptUrl;
        saveStore(store);
      }
      const response = await fetch(scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'INIT_ALL_SHEETS' }),
        redirect: 'follow'
      });
      const result = await response.json();
      await syncFromGoogleSheets(store);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Erro ao inicializar abas na planilha.' });
    }
  });

  // ----------------------------------------------------
  // API: Full Sync with Google Sheets
  // ----------------------------------------------------
  app.get('/api/sync', async (req, res) => {
    try {
      const store = loadStore();
      const results = await syncFromGoogleSheets(store);
      res.json({ success: true, results });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Erro ao sincronizar com Google Sheets.' });
    }
  });

  app.post('/api/sync', async (req, res) => {
    try {
      const store = loadStore();
      const results = await syncFromGoogleSheets(store);
      res.json({ success: true, results });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Erro ao sincronizar com Google Sheets.' });
    }
  });

  // ----------------------------------------------------
  // Vite / Frontend Server Integration
  // ----------------------------------------------------
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] Madeira Karate Backend running at http://0.0.0.0:${PORT}`);
    const store = loadStore();
    syncFromGoogleSheets(store).then(results => {
      console.log(`[Sync] Startup sync completed: ${results.championships} championships, ${results.registrations} registrations, ${results.categories} categories.`);
    }).catch(err => {
      console.warn('[Sync] Startup sync warning:', err.message);
    });
  });
}

startServer().catch(err => {
  console.error('[Server] Fatal startup error:', err);
  process.exit(1);
});
