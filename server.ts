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

interface StoreData {
  championships: any[];
  registrations: any[];
  categories: any[];
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
        settings: {
          adminPin: parsed.settings?.adminPin || '1926',
          googleSheetId: parsed.settings?.googleSheetId || GOOGLE_SHEET_ID,
          googleAppsScriptUrl: parsed.settings?.googleAppsScriptUrl || '',
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
    settings: {
      adminPin: '1926',
      googleSheetId: GOOGLE_SHEET_ID,
      googleAppsScriptUrl: '',
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

// Push to Google Apps Script Webhook securely from server
async function pushToGoogleSheets(action: string, payload: any, settings: StoreData['settings']) {
  if (!settings.googleAppsScriptUrl || !settings.googleAppsScriptUrl.startsWith('http')) {
    return;
  }
  try {
    const body = {
      secret: settings.webhookSecret,
      action,
      ...payload
    };
    await fetch(settings.googleAppsScriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
  } catch (err) {
    console.warn('[Sheets Webhook] Error pushing to Google Apps Script:', err);
  }
}

// Pull and sync from official Google Sheets tabs
async function syncFromGoogleSheets(store: StoreData): Promise<{ championships: number; registrations: number; categories: number }> {
  const sheetId = store.settings.googleSheetId || GOOGLE_SHEET_ID;
  let addedChamps = 0;
  let addedRegs = 0;
  let addedCats = 0;

  try {
    // 1. Tab: CAMPEONATOS
    const champsUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=CAMPEONATOS`;
    const champsRes = await fetch(champsUrl);
    if (champsRes.ok) {
      const champsCsv = await champsRes.text();
      const parsed = Papa.parse(champsCsv, { header: true }).data as any[];
      // Validate that headers belong to CAMPEONATOS and not default Produtos tab
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
            valorInscricao: parseFloat(String(row.valorInscricao).replace(',', '.')) || 0,
            modalidades: row.modalidades ? String(row.modalidades).split(/[,;]/).map((s: string) => s.trim()).filter(Boolean) : ['Kata', 'Kumite', 'Kata + Kumite'],
            configuracaoPix: {
              tipoChave: row.pixTipo || 'TELEFONE',
              chave: row.pixChave || '21973681109',
              nomeRecebedor: row.pixNome || 'MADEIRA KARATE',
              cidadeRecebedor: row.pixCidade || 'RIO DE JANEIRO',
              incluirValorNoQrCode: true,
              instrucoesAdicionais: 'Pagamento referente à inscrição no torneio.'
            },
            regulamento: String(row.regulamento || '').trim(),
            permiteMenores: true,
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
    // 2. Tab: INSCRICOES_CAMPEONATO
    const regsUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=INSCRICOES_CAMPEONATO`;
    const regsRes = await fetch(regsUrl);
    if (regsRes.ok) {
      const regsCsv = await regsRes.text();
      const parsed = Papa.parse(regsCsv, { header: true }).data as any[];
      if (parsed.length > 0 && ('nomeCompleto' in parsed[0] || 'championshipId' in parsed[0] || 'paymentStatus' in parsed[0])) {
        for (const row of parsed) {
          if (!row.id || !row.nomeCompleto) continue;
          const existingIdx = store.registrations.findIndex(r => r.id === row.id);
          const regObj = {
            id: String(row.id).trim(),
            championshipId: String(row.championshipId || '').trim(),
            championshipName: String(row.championshipName || '').trim(),
            nomeCompleto: String(row.nomeCompleto).trim(),
            dataNascimento: String(row.dataNascimento || '').trim(),
            idadeNaDataCampeonato: parseInt(row.idadeNaDataCampeonato, 10) || 0,
            sexo: row.sexo || 'Masculino',
            graduacao: row.graduacao || 'Faixa Branca',
            peso: parseFloat(String(row.peso).replace(',', '.')) || 0,
            modalidade: row.modalidade || 'Kata',
            telefone: String(row.telefone || '').trim(),
            email: String(row.email || '').trim(),
            isMenor: String(row.isMenor).toLowerCase() === 'true' || String(row.isMenor).toLowerCase() === 'sim',
            nomeResponsavel: row.nomeResponsavel || '',
            telefoneResponsavel: row.telefoneResponsavel || '',
            autorizacaoResponsavel: true,
            aceiteRegulamento: true,
            categoriaId: row.categoriaId || '',
            categoriaNome: row.categoriaNome || 'Sem Categoria',
            status: row.status || 'RECEBIDA',
            paymentStatus: row.paymentStatus || 'AGUARDANDO_PAGAMENTO',
            valorInscricao: parseFloat(String(row.valorInscricao).replace(',', '.')) || 0,
            dataHoraInscricao: row.dataHoraInscricao || new Date().toISOString(),
            comprovanteRecebido: String(row.comprovanteRecebido).toLowerCase() === 'true',
            observacoes: row.observacoes || ''
          };

          if (existingIdx >= 0) {
            store.registrations[existingIdx] = { ...store.registrations[existingIdx], ...regObj };
          } else {
            store.registrations.push(regObj);
            addedRegs++;
          }
        }
      }
    }
  } catch (e) {
    console.warn('[Sync] Could not pull INSCRICOES_CAMPEONATO tab:', e);
  }

  try {
    // 3. Tab: CATEGORIAS_CAMPEONATO
    const catsUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=CATEGORIAS_CAMPEONATO`;
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
            championshipId: String(row.championshipId || '').trim(),
            nome: String(row.nome).trim(),
            modalidade: row.modalidade || 'Geral',
            idadeMinima: row.idadeMinima ? parseInt(row.idadeMinima, 10) : undefined,
            idadeMaxima: row.idadeMaxima ? parseInt(row.idadeMaxima, 10) : undefined,
            sexo: row.sexo || 'Misto',
            pesoMaximo: row.pesoMaximo ? parseFloat(String(row.pesoMaximo).replace(',', '.')) : undefined
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

  saveStore(store);
  return { championships: addedChamps, registrations: addedRegs, categories: addedCats };
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
    const champ = req.body;

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
    const data = req.body;

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
    const cat = req.body;

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
  // API: Full Sync with Google Sheets
  // ----------------------------------------------------
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
      server: { middlewareMode: true },
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
  });
}

startServer().catch(err => {
  console.error('[Server] Fatal startup error:', err);
  process.exit(1);
});
