import { readSheetRows } from "../_sheetConfig.js";

function toNumber(value: unknown): number {
  const raw = String(value ?? "0").trim();
  if (!raw) return 0;
  const normalized = raw.includes(",") ? raw.replace(/\./g, "").replace(",", ".") : raw;
  return Number(normalized) || 0;
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido." });
  }

  try {
    const { codigo, telefoneOuEmail } = req.body || {};
    if (!codigo || !telefoneOuEmail) {
      return res.status(400).json({ error: "Informe o código do pedido e o telefone ou e-mail cadastrado." });
    }

    const cleanCode = String(codigo).trim().toUpperCase();
    const cleanLookupDigits = String(telefoneOuEmail).trim().replace(/\D/g, "");
    const cleanLookupLower = String(telefoneOuEmail).trim().toLowerCase();

    const ordersRows = await readSheetRows("PEDIDOS_LOJA");
    const orderRow = ordersRows.find(r => {
      const rowCode = String(r.codigo || r.id || r["Código"] || "").trim().toUpperCase();
      if (rowCode !== cleanCode) return false;

      const orderPhoneDigits = String(r.telefone || r["Telefone"] || "").replace(/\D/g, "");
      const orderEmail = String(r.email || r["E-mail"] || "").trim().toLowerCase();

      const phoneMatch = cleanLookupDigits.length >= 8 && orderPhoneDigits.includes(cleanLookupDigits);
      const emailMatch = cleanLookupLower.includes("@") && orderEmail === cleanLookupLower;

      return phoneMatch || emailMatch;
    });

    if (!orderRow) {
      return res.status(404).json({ error: "Pedido não localizado com os dados informados. Verifique o código e o contato." });
    }

    const orderCode = String(orderRow.codigo || orderRow.id || orderRow["Código"]).trim();
    let items: any[] = [];
    try {
      const itemsRows = await readSheetRows("ITENS_PEDIDO_LOJA");
      items = itemsRows
        .filter(i => String(i.pedidoId || i["Pedido ID"] || "").trim().toUpperCase() === orderCode.toUpperCase())
        .map(i => ({
          id: String(i.id || ""),
          pedidoId: orderCode,
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
        }));
    } catch (e) {}

    return res.status(200).json({
      id: orderCode,
      codigo: orderCode,
      nomeCliente: String(orderRow.nomeCliente || orderRow["Nome Cliente"] || orderRow.cliente || "").trim(),
      telefone: String(orderRow.telefone || orderRow["Telefone"] || "").trim(),
      email: String(orderRow.email || orderRow["E-mail"] || "").trim(),
      valorTotal: toNumber(orderRow.valorTotal || orderRow["Valor Total"]),
      statusPedido: String(orderRow.statusPedido || orderRow["Status Pedido"] || "RECEBIDO").trim(),
      statusPagamento: String(orderRow.statusPagamento || orderRow["Status Pagamento"] || "AGUARDANDO_PAGAMENTO").trim(),
      dataCriacao: String(orderRow.dataCriacao || orderRow["Data Criação"] || "").trim(),
      dataPagamento: orderRow.dataPagamento ? String(orderRow.dataPagamento).trim() : undefined,
      dataRetirada: orderRow.dataRetirada ? String(orderRow.dataRetirada).trim() : undefined,
      observacoes: String(orderRow.observacoes || orderRow["Observações"] || "").trim(),
      atualizadoEm: String(orderRow.atualizadoEm || orderRow["Atualizado Em"] || "").trim(),
      itens: items
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Erro ao consultar pedido." });
  }
}
