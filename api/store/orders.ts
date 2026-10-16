import Papa from "papaparse";
import { callAppsScript, readSheetRows } from "../_sheetConfig.js";

function toNumber(value: unknown): number {
  const raw = String(value ?? "0").trim();
  if (!raw) return 0;
  const normalized = raw.includes(",") ? raw.replace(/\./g, "").replace(",", ".") : raw;
  return Number(normalized) || 0;
}

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    try {
      let ordersRows: any[] = [];
      let itemsRows: any[] = [];
      try {
        ordersRows = await readSheetRows("PEDIDOS_LOJA");
      } catch (e) {
        ordersRows = [];
      }
      try {
        itemsRows = await readSheetRows("ITENS_PEDIDO_LOJA");
      } catch (e) {
        itemsRows = [];
      }

      const orders = ordersRows
        .filter(r => r && (r.id || r.codigo || r["Código"]))
        .map(r => {
          const code = String(r.codigo || r.id || r["Código"] || "").trim();
          const items = itemsRows
            .filter(i => String(i.pedidoId || i["Pedido ID"] || "").trim() === code)
            .map(i => ({
              id: String(i.id || ""),
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
            }));

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
            dataPagamento: r.dataPagamento || r["Data Pagamento"] ? String(r.dataPagamento || r["Data Pagamento"]).trim() : undefined,
            dataRetirada: r.dataRetirada || r["Data Retirada"] ? String(r.dataRetirada || r["Data Retirada"]).trim() : undefined,
            observacoes: String(r.observacoes || r["Observações"] || "").trim(),
            atualizadoEm: String(r.atualizadoEm || r["Atualizado Em"] || "").trim(),
            itens: items
          };
        });

      return res.status(200).json(orders);
    } catch (err: any) {
      return res.status(500).json({ error: err.message || "Erro ao consultar pedidos da loja." });
    }
  }

  if (req.method === "POST") {
    try {
      const body = req.body || {};
      const { nomeCliente, telefone, email, observacoes, itens } = body;

      if (!nomeCliente || !telefone || !email) {
        return res.status(400).json({ error: "Nome completo, telefone e e-mail são obrigatórios." });
      }

      if (!Array.isArray(itens) || itens.length === 0) {
        return res.status(400).json({ error: "O pedido deve conter pelo menos um item." });
      }

      // Chama a ação CREATE_STORE_ORDER no Google Apps Script (que possui LockService e geração oficial sequencial)
      const scriptRes = await callAppsScript("CREATE_STORE_ORDER", {
        order: {
          nomeCliente,
          telefone,
          email,
          observacoes: observacoes || ""
        },
        items: itens
      });

      return res.status(201).json(scriptRes.order || scriptRes);
    } catch (err: any) {
      return res.status(500).json({ error: err.message || "Erro ao registrar pedido na MadeiraStore." });
    }
  }

  return res.status(405).json({ error: "Método não permitido." });
}
