import { randomUUID } from "crypto";
import { callAppsScript, readSheetRows } from "../_sheetConfig.js";

const ADMIN_PIN = String(process.env.MADEIRA_ADMIN_PIN || "1926").trim();

function toNumber(value: unknown): number {
  const raw = String(value ?? "0").trim();
  if (!raw) return 0;
  const normalized = raw.includes(",") ? raw.replace(/\./g, "").replace(",", ".") : raw;
  return Number(normalized) || 0;
}

function parseBool(value: unknown, defaultValue = false): boolean {
  const raw = String(value ?? "").trim().toLowerCase();
  if (!raw) return defaultValue;
  return ["1","true","sim","yes","ativo","disponivel","disponível"].includes(raw);
}

function parseList(value: unknown): string[] {
  return String(value ?? "").split(/[,;|]/).map(v => v.trim()).filter(Boolean);
}

function parseStockMap(value: unknown): Record<string, number> {
  try {
    const parsed = JSON.parse(String(value ?? "").trim() || "{}");
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return Object.fromEntries(
      Object.entries(parsed).map(([key, qty]) => [key, Math.max(0, Math.floor(Number(qty) || 0))])
    );
  } catch {
    return {};
  }
}

function stockVariantKey(size?: string, color?: string, variation?: string): string {
  return [size || "", color || "", variation || ""]
    .map(value => String(value).trim().toLowerCase())
    .join("||");
}

function cleanPhone(value: unknown): string {
  return String(value ?? "").replace(/\D/g, "");
}

function isAdmin(req: any): boolean {
  return String(req.headers?.["x-admin-pin"] || "").trim() === ADMIN_PIN;
}

function requireAdmin(req: any, res: any): boolean {
  if (!isAdmin(req)) {
    res.status(401).json({ error: "Acesso administrativo não autorizado." });
    return false;
  }
  return true;
}

function mapItemRow(i: any, code: string) {
  return {
    pedidoId: code,
    produtoId: String(i.produtoId || i["Produto ID"] || "").trim(),
    produtoNome: String(i.produtoNome || i["Produto"] || "").trim(),
    categoria: String(i.categoria || i["Categoria"] || "").trim() || undefined,
    quantidade: parseInt(String(i.quantidade || 1), 10) || 1,
    tamanho: String(i.tamanho || "").trim() || undefined,
    cor: String(i.cor || "").trim() || undefined,
    variacao: String(i.variacao || "").trim() || undefined,
    personalizacao: String(i.personalizacao || "").trim() || undefined,
    valorUnitario: toNumber(i.valorUnitario || i["Valor Unitário"]),
    subtotal: toNumber(i.subtotal || i["Subtotal"])
  };
}

function mapOrderRow(r: any, itemsRows: any[]) {
  const code = String(r.codigo || r.id || r["Código"] || "").trim();
  const items = itemsRows.filter(i => String(i.pedidoId || i["Pedido ID"] || "").trim() === code).map(i => mapItemRow(i, code));
  return {
    id: code,
    codigo: code,
    nomeCliente: String(r.nomeCliente || r["Nome Cliente"] || r.cliente || "").trim(),
    telefone: String(r.telefone || r["Telefone"] || "").trim(),
    email: String(r.email || r["E-mail"] || "").trim(),
    valorTotal: toNumber(r.valorTotal || r["Valor Total"]),
    statusPedido: String(r.statusPedido || r["Status Pedido"] || "RECEBIDO").trim(),
    statusPagamento: String(r.statusPagamento || r["Status Pagamento"] || "AGUARDANDO_PAGAMENTO").trim(),
    dataCriacao: String(r.dataCriacao || r["Data Criação"] || "").trim(),
    dataPagamento: String(r.dataPagamento || r["Data Pagamento"] || "").trim() || undefined,
    dataRetirada: String(r.dataRetirada || r["Data Retirada"] || "").trim() || undefined,
    observacoes: String(r.observacoes || r["Observações"] || "").trim(),
    atualizadoEm: String(r.atualizadoEm || r["Atualizado Em"] || "").trim(),
    tokenRetirada: String(r.tokenRetirada || "").trim() || undefined,
    dataGeracaoComprovante: String(r.dataGeracaoComprovante || "").trim() || undefined,
    entreguePor: String(r.entreguePor || "").trim() || undefined,
    itens: items
  };
}

async function loadOrders() {
  let ordersRows: any[] = [];
  let itemsRows: any[] = [];
  try { ordersRows = await readSheetRows("PEDIDOS_LOJA"); } catch {}
  try { itemsRows = await readSheetRows("ITENS_PEDIDO_LOJA"); } catch {}
  return ordersRows.filter(r => r && (r.id || r.codigo || r["Código"])).map(r => mapOrderRow(r, itemsRows));
}

function mapCategory(r: any) {
  return {
    id: String(r.id || "").trim(),
    nome: String(r.nome || "").trim(),
    descricao: String(r.descricao || "").trim(),
    ativo: parseBool(r.ativo, true),
    usaTamanho: parseBool(r.usaTamanho, false),
    usaCor: parseBool(r.usaCor, false),
    usaVariacao: parseBool(r.usaVariacao, false),
    permitePersonalizacao: parseBool(r.permitePersonalizacao, false),
    ordem: toNumber(r.ordem) || undefined
  };
}

function mapProduct(r: any) {
  return {
    id: String(r.id || "").trim(),
    nome: String(r.nome || "").trim(),
    descricao: String(r.descricao || "").trim(),
    preco: toNumber(r.preco),
    imagem1: String(r.imagem1 || "").trim(),
    imagem2: String(r.imagem2 || "").trim(),
    imagem3: String(r.imagem3 || "").trim(),
    imagem1FileId: String(r.imagem1_file_id || "").trim(),
    imagem2FileId: String(r.imagem2_file_id || "").trim(),
    imagem3FileId: String(r.imagem3_file_id || "").trim(),
    categoriaId: String(r.categoriaId || "").trim(),
    categoria: String(r.categoria || "").trim(),
    tamanhos: String(r.tamanhos || "").trim(),
    cores: String(r.cores || "").trim(),
    variacoes: String(r.variacoes || "").trim(),
    personalizavel: parseBool(r.personalizavel, false),
    disponivel: parseBool(r.disponivel, true),
    ativo: parseBool(r.ativo, true),
    estoqueControlado: parseBool(r.estoqueControlado, false),
    estoqueAtual: Math.max(0, Math.floor(toNumber(r.estoqueAtual))),
    estoqueVariacoes: parseStockMap(r.estoqueVariacoes),
    ordem: toNumber(r.ordem) || undefined
  };
}

async function normalizeOfficialItems(rawItems: any[]) {
  const productRows = await readSheetRows("Produtos_MadeiraStore");
  const products = new Map(productRows.filter(r => String(r.id || "").trim()).map(r => [String(r.id).trim(), r]));
  return rawItems.map((raw, index) => {
    const produtoId = String(raw?.produtoId || "").trim();
    const row: any = products.get(produtoId);
    if (!row) throw new Error(`Produto inválido no item ${index + 1}.`);
    if (!parseBool(row.ativo, true) || !parseBool(row.disponivel, true)) throw new Error(`Produto indisponível: ${String(row.nome || produtoId)}.`);
    const quantidade = Number(raw?.quantidade || 1);
    if (!Number.isInteger(quantidade) || quantidade < 1 || quantidade > 99) throw new Error(`Quantidade inválida para ${String(row.nome || produtoId)}.`);
    const allowedSizes = parseList(row.tamanhos);
    const allowedColors = parseList(row.cores);
    const allowedVariations = parseList(row.variacoes);
    const tamanho = String(raw?.tamanho || "").trim();
    const cor = String(raw?.cor || "").trim();
    const variacao = String(raw?.variacao || "").trim();
    if (allowedSizes.length && !allowedSizes.includes(tamanho)) throw new Error("Tamanho selecionado não é válido para o produto.");
    if (allowedColors.length && !allowedColors.includes(cor)) throw new Error("Cor selecionada não é válida para o produto.");
    if (allowedVariations.length && !allowedVariations.includes(variacao)) throw new Error("Variação selecionada não é válida para o produto.");
    const valorUnitario = toNumber(row.preco);
    if (!(valorUnitario > 0)) throw new Error(`Preço oficial inválido para ${String(row.nome || produtoId)}.`);

    if (parseBool(row.estoqueControlado, false)) {
      const hasVariants = allowedSizes.length > 0 || allowedColors.length > 0 || allowedVariations.length > 0;
      const availableStock = hasVariants
        ? (parseStockMap(row.estoqueVariacoes)[stockVariantKey(tamanho, cor, variacao)] || 0)
        : Math.max(0, Math.floor(toNumber(row.estoqueAtual)));
      if (availableStock < quantidade) {
        throw new Error(`Estoque insuficiente para ${String(row.nome || produtoId)}. Disponível: ${availableStock}.`);
      }
    }

    return {
      produtoId,
      produtoNome: String(row.nome || produtoId).trim(),
      categoria: String(row.categoria || "").trim(),
      quantidade, tamanho, cor, variacao,
      personalizacao: String(raw?.personalizacao || "").trim(),
      valorUnitario,
      subtotal: Number((valorUnitario * quantidade).toFixed(2))
    };
  });
}

export default async function handler(req: any, res: any) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  const action = String(req.query?.action || req.body?.action || "").trim().toLowerCase();
  const id = String(req.query?.id || req.body?.id || req.body?.orderId || "").trim();

  if (req.method === "GET") {
    if (!requireAdmin(req, res)) return;
    try {
      if (action === "admin-catalog") {
        const [productRows, categoryRows, configRows] = await Promise.all([
          readSheetRows("Produtos_MadeiraStore").catch(() => []),
          readSheetRows("CATEGORIAS_MADEIRASTORE").catch(() => []),
          readSheetRows("Configuracoes").catch(() => [])
        ]);
        const configMap = new Map(configRows.map((r:any) => [String(r.chave || "").trim(), String(r.valor || "").trim()]));
        return res.status(200).json({
          products: productRows.filter((r:any) => r.id).map(mapProduct),
          categories: categoryRows.filter((r:any) => r.id).map(mapCategory),
          config: {
            driveFolderUrl: configMap.get("madeirastore_drive_folder_url") || "",
            driveFolderId: configMap.get("madeirastore_drive_folder_id") || ""
          }
        });
      }
      return res.status(200).json(await loadOrders());
    } catch (err: any) {
      return res.status(500).json({ error: err.message || "Erro ao consultar dados da loja." });
    }
  }

  if (req.method === "POST" && action === "verify-admin") {
    return isAdmin(req) ? res.status(200).json({ success: true }) : res.status(401).json({ success: false, error: "PIN incorreto." });
  }

  if (req.method === "POST" && action === "lookup") {
    const { codigo, telefoneOuEmail } = req.body || {};
    if (!codigo || !telefoneOuEmail) return res.status(400).json({ error: "Informe o código do pedido e o telefone ou e-mail cadastrado." });
    const cleanCode = String(codigo).trim().toUpperCase();
    const lookupDigits = cleanPhone(telefoneOuEmail);
    const lookupLower = String(telefoneOuEmail).trim().toLowerCase();
    const orders = await loadOrders();
    const order = orders.find(o => String(o.codigo).toUpperCase() === cleanCode && ((lookupDigits.length >= 8 && cleanPhone(o.telefone) === lookupDigits) || (lookupLower.includes("@") && String(o.email).toLowerCase() === lookupLower)));
    if (!order) return res.status(404).json({ error: "Pedido não localizado com os dados informados." });
    return res.status(200).json(order);
  }

  if (req.method === "POST" && action === "pickup-lookup") {
    const token = String(req.body?.token || "").trim();
    if (!token) return res.status(400).json({ error: "Token de retirada não informado." });
    const orders = await loadOrders();
    const order = orders.find(o => o.tokenRetirada === token);
    if (!order) return res.status(404).json({ error: "Pedido não localizado." });
    return res.status(200).json(order);
  }

  if (req.method === "POST" && ["save-category","delete-category","save-product","delete-product","save-store-config","upload-product-image"].includes(action)) {
    if (!requireAdmin(req, res)) return;
    try {
      const body = req.body || {};
      const actionMap: Record<string,string> = {
        "save-category": "SAVE_STORE_CATEGORY",
        "delete-category": "DELETE_STORE_CATEGORY",
        "save-product": "SAVE_STORE_PRODUCT",
        "delete-product": "DELETE_STORE_PRODUCT",
        "save-store-config": "SAVE_STORE_CONFIG",
        "upload-product-image": "UPLOAD_STORE_PRODUCT_IMAGE"
      };
      const result = await callAppsScript(actionMap[action], body);
      if (action === "save-category") return res.status(200).json(result.category || result);
      if (action === "save-product") return res.status(200).json(result.product || result);
      if (action === "save-store-config") return res.status(200).json(result.config || result);
      if (action === "upload-product-image") return res.status(200).json({ url: result.url, fileId: result.fileId });
      return res.status(200).json({ success: true });
    } catch (err:any) {
      return res.status(400).json({ error: err.message || "Falha na operação administrativa." });
    }
  }

  if (req.method === "POST") {
    try {
      const body = req.body || {};
      const nomeCliente = String(body.nomeCliente || "").trim();
      const telefone = String(body.telefone || "").trim();
      const email = String(body.email || "").trim().toLowerCase();
      const itens = Array.isArray(body.itens) ? body.itens : [];
      if (!nomeCliente || cleanPhone(telefone).length < 10 || !email.includes("@")) return res.status(400).json({ error: "Nome completo, telefone e e-mail válidos são obrigatórios." });
      if (!itens.length) return res.status(400).json({ error: "O pedido deve conter pelo menos um item." });
      const officialItems = await normalizeOfficialItems(itens);
      const tokenRetirada = randomUUID().replace(/-/g, "");
      const now = new Date().toISOString();
      const scriptRes = await callAppsScript("CREATE_STORE_ORDER", {
        order: { nomeCliente, telefone, email, observacoes: String(body.observacoes || "").trim(), tokenRetirada, dataGeracaoComprovante: now },
        items: officialItems
      });
      return res.status(201).json(scriptRes.order || scriptRes);
    } catch (err:any) {
      return res.status(400).json({ error: err.message || "Erro ao registrar pedido na MadeiraStore." });
    }
  }

  if (req.method === "PATCH" && action === "receipt") {
    if (!id) return res.status(400).json({ error: "Pedido não informado." });
    try {
      const result = await callAppsScript("UPDATE_STORE_ORDER", { orderId: id, statusPagamento: "AGUARDANDO_CONFERENCIA" });
      return res.status(200).json(result.order || result);
    } catch (err:any) {
      return res.status(500).json({ error: err.message || "Erro ao registrar envio do comprovante." });
    }
  }

  if (req.method === "PATCH" && action === "pickup-deliver") {
    if (!requireAdmin(req, res)) return;
    try {
      const result = await callAppsScript("CONFIRM_STORE_PICKUP", {
        token: String(req.body?.token || "").trim(),
        entreguePor: String(req.body?.entreguePor || "ADMIN").trim()
      });
      return res.status(200).json(result.order || result);
    } catch (err:any) {
      return res.status(400).json({ error: err.message || "Erro ao confirmar entrega." });
    }
  }

  if (req.method === "PATCH" && action === "status") {
    if (!requireAdmin(req, res)) return;
    if (!id) return res.status(400).json({ error: "Pedido não informado." });
    try {
      const body = req.body || {};
      const allowedOrder = new Set(["RECEBIDO","EM_SEPARACAO","PRONTO_RETIRADA","ENTREGUE","CANCELADO"]);
      const allowedPayment = new Set(["AGUARDANDO_PAGAMENTO","AGUARDANDO_CONFERENCIA","PAGAMENTO_CONFIRMADO","PAGAMENTO_REJEITADO"]);
      const statusPedido = body.statusPedido ? String(body.statusPedido).trim() : undefined;
      const statusPagamento = body.statusPagamento ? String(body.statusPagamento).trim() : undefined;
      if (statusPedido && !allowedOrder.has(statusPedido)) return res.status(400).json({ error: "Status de pedido inválido." });
      if (statusPagamento && !allowedPayment.has(statusPagamento)) return res.status(400).json({ error: "Status de pagamento inválido." });
      const result = await callAppsScript("UPDATE_STORE_ORDER", { orderId: id, ...(statusPedido ? { statusPedido } : {}), ...(statusPagamento ? { statusPagamento } : {}), ...(body.observacoes !== undefined ? { observacoes: String(body.observacoes) } : {}) });
      return res.status(200).json(result.order || result);
    } catch (err:any) {
      return res.status(500).json({ error: err.message || "Erro ao atualizar pedido." });
    }
  }

  return res.status(405).json({ error: "Método não permitido." });
}
