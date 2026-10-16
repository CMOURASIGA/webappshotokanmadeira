import React, { useState, useEffect } from "react";
import { 
  Search, 
  ArrowLeft, 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  QrCode, 
  Copy, 
  Check, 
  MessageCircle, 
  Package, 
  Calendar, 
  Phone, 
  Mail, 
  Loader2,
  ChevronRight
} from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { madeiraStoreService } from "../services/madeiraStoreService";
import { StoreOrder, StoreOrderStatus, StorePaymentStatus } from "../types/storeOrder";
import { generatePixCopiaECola, generatePixQrCodeDataUrl } from "../lib/pixUtils";
import { useAppData } from "../contexts/AppDataContext";

export function StoreOrderLookup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { config } = useAppData();

  const [codigo, setCodigo] = useState(searchParams.get("codigo") || "");
  const [telefoneOuEmail, setTelefoneOuEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [order, setOrder] = useState<StoreOrder | null>(null);

  // PIX re-display if awaiting payment
  const [pixPayload, setPixPayload] = useState<string>("");
  const [pixQrCodeUrl, setPixQrCodeUrl] = useState<string>("");
  const [copiedPix, setCopiedPix] = useState(false);
  const [markedPaymentSent, setMarkedPaymentSent] = useState(false);

  const handleLookup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!codigo.trim() || !telefoneOuEmail.trim()) {
      setErrorMsg("Informe o código do pedido e o telefone ou e-mail cadastrado.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setOrder(null);
    setPixQrCodeUrl("");
    setPixPayload("");

    try {
      const found = await madeiraStoreService.lookupOrder(codigo.trim(), telefoneOuEmail.trim());
      setOrder(found);

      // Se o pedido ainda estiver aguardando pagamento, gera o PIX dinamicamente para facilidade do cliente
      if (found.statusPagamento === "AGUARDANDO_PAGAMENTO") {
        const pixConfig = await madeiraStoreService.getPixConfig();
        const payload = generatePixCopiaECola({
          config: pixConfig,
          amount: found.valorTotal,
          txid: found.codigo.replace(/[^a-zA-Z0-9]/g, "")
        });
        setPixPayload(payload);
        const qrUrl = await generatePixQrCodeDataUrl(payload);
        setPixQrCodeUrl(qrUrl);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Pedido não localizado. Verifique os dados informados.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyPix = () => {
    if (!pixPayload) return;
    navigator.clipboard.writeText(pixPayload);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 3000);
  };

  const handleMarkPaymentDone = async () => {
    if (!order) return;
    try {
      const updated = await madeiraStoreService.markPaymentSent(order.id);
      setOrder(updated);
      setMarkedPaymentSent(true);
    } catch (e) {
      console.error("Erro ao informar pagamento:", e);
    }
  };

  const generateWhatsAppUrl = () => {
    if (!order) return "#";
    const rawNumber = config.whatsapp || "5521973681109";
    const cleanNumber = rawNumber.replace(/\D/g, "");

    const msg = `Olá! Gostaria de falar sobre meu pedido na MadeiraStore.\n\n` +
      `Pedido: ${order.codigo}\n` +
      `Cliente: ${order.nomeCliente}\n` +
      `Valor: R$ ${order.valorTotal.toFixed(2).replace(".", ",")}\n\n` +
      `Segue meu comprovante para conferência.`;

    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`;
  };

  // Helper formatters
  const getPaymentStatusBadge = (status: StorePaymentStatus) => {
    switch (status) {
      case "PAGAMENTO_CONFIRMADO":
        return { label: "Pagamento Confirmado", bg: "bg-emerald-50 text-emerald-700 border-emerald-200" };
      case "AGUARDANDO_CONFERENCIA":
        return { label: "Aguardando Conferência", bg: "bg-purple-50 text-purple-700 border-purple-200" };
      case "AGUARDANDO_PAGAMENTO":
        return { label: "Aguardando Pagamento", bg: "bg-amber-50 text-amber-700 border-amber-200" };
      case "PAGAMENTO_REJEITADO":
        return { label: "Pagamento Rejeitado", bg: "bg-red-50 text-red-700 border-red-200" };
      default:
        return { label: status, bg: "bg-neutral-50 text-neutral-700 border-neutral-200" };
    }
  };

  const getOrderStatusBadge = (status: StoreOrderStatus) => {
    switch (status) {
      case "RECEBIDO":
        return { label: "Pedido Recebido", bg: "bg-blue-50 text-blue-700 border-blue-200" };
      case "EM_SEPARACAO":
        return { label: "Em Separação", bg: "bg-indigo-50 text-indigo-700 border-indigo-200" };
      case "PRONTO_RETIRADA":
        return { label: "Pronto para Retirada", bg: "bg-emerald-50 text-emerald-700 border-emerald-200" };
      case "ENTREGUE":
        return { label: "Entregue / Retirado", bg: "bg-neutral-100 text-neutral-800 border-neutral-300" };
      case "CANCELADO":
        return { label: "Cancelado", bg: "bg-red-50 text-red-700 border-red-200" };
      default:
        return { label: status, bg: "bg-neutral-50 text-neutral-700 border-neutral-200" };
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto w-full px-2 sm:px-4 animate-in fade-in duration-300">
      {/* Voltar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/madeirastore")}
          className="flex items-center gap-1.5 text-xs sm:text-sm text-neutral-500 hover:text-karate-red font-medium transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para MadeiraStore</span>
        </button>

        <span className="text-xs text-neutral-400 font-mono">Consulta Segura</span>
      </div>

      {/* Formulário de Busca */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-sm space-y-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-jp text-neutral-900 leading-tight">
            Consultar Pedido MadeiraStore
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Informe o código do seu pedido e o telefone ou e-mail cadastrado na compra.
          </p>
        </div>

        <form onSubmit={handleLookup} className="space-y-3 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Código do Pedido
              </label>
              <input
                type="text"
                required
                placeholder="Ex: MS2026-0001"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                className="w-full text-xs font-mono font-bold uppercase p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-karate-red bg-neutral-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                Telefone ou E-mail
              </label>
              <input
                type="text"
                required
                placeholder="Ex: 21973681109 ou email@exemplo.com"
                value={telefoneOuEmail}
                onChange={(e) => setTelefoneOuEmail(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-karate-red bg-neutral-50"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Localizando pedido...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Consultar Status</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Resultado da Consulta */}
      {order && (
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Cartão de Resumo do Pedido */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block font-mono">
                  Identificador do Pedido
                </span>
                <h2 className="text-2xl font-black font-mono text-neutral-900 mt-0.5">
                  {order.codigo}
                </h2>
                <span className="text-xs text-neutral-500">
                  Realizado em {order.dataCriacao ? new Date(order.dataCriacao).toLocaleDateString("pt-BR") : "Data indisponível"}
                </span>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block font-mono">
                  Valor Total
                </span>
                <span className="text-2xl font-black font-mono text-karate-red">
                  R$ {order.valorTotal.toFixed(2).replace(".", ",")}
                </span>
              </div>
            </div>

            {/* Badges de Status Duplo (SPEC 09 item 7) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Status do Pagamento */}
              <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block font-mono">
                    Status do Pagamento
                  </span>
                  <span className="text-xs font-bold text-neutral-800">
                    {getPaymentStatusBadge(order.statusPagamento).label}
                  </span>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getPaymentStatusBadge(order.statusPagamento).bg}`}>
                  {order.statusPagamento}
                </span>
              </div>

              {/* Status do Pedido */}
              <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block font-mono">
                    Status do Pedido
                  </span>
                  <span className="text-xs font-bold text-neutral-800">
                    {getOrderStatusBadge(order.statusPedido).label}
                  </span>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getOrderStatusBadge(order.statusPedido).bg}`}>
                  {order.statusPedido}
                </span>
              </div>
            </div>

            {/* Itens do Pedido */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2">
                Itens Adquiridos
              </h3>

              <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-2xl overflow-hidden bg-white">
                {order.itens && order.itens.length > 0 ? (
                  order.itens.map((item, idx) => (
                    <div key={idx} className="p-3 sm:p-4 flex items-center justify-between gap-3 text-xs">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-neutral-900 leading-snug truncate">
                          {item.produtoNome}
                        </h4>
                        <div className="flex flex-wrap gap-1.5 mt-1 text-[11px] text-neutral-500">
                          {item.quantidade}x R$ {item.valorUnitario.toFixed(2).replace(".", ",")}
                          {item.tamanho && <span className="bg-neutral-100 px-1.5 py-0.2 rounded font-mono">Tam: {item.tamanho}</span>}
                          {item.cor && <span className="bg-neutral-100 px-1.5 py-0.2 rounded font-mono">Cor: {item.cor}</span>}
                          {item.variacao && <span className="bg-neutral-100 px-1.5 py-0.2 rounded font-mono">Opção: {item.variacao}</span>}
                          {item.personalizacao && <span className="bg-neutral-100 px-1.5 py-0.2 rounded font-mono">"{item.personalizacao}"</span>}
                        </div>
                      </div>

                      <span className="font-bold text-neutral-900 font-mono shrink-0">
                        R$ {item.subtotal.toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-xs text-neutral-400">
                    Itens registrados na confirmação oficial.
                  </div>
                )}
              </div>
            </div>

            {/* Se estiver aguardando pagamento, exibe QR Code PIX */}
            {order.statusPagamento === "AGUARDANDO_PAGAMENTO" && (
              <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-karate-red text-white flex items-center justify-center">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-neutral-900">Efetuar Pagamento PIX</h4>
                    <p className="text-[11px] text-neutral-500">Pague o valor exato para liberação da separação do pedido.</p>
                  </div>
                </div>

                {pixQrCodeUrl && (
                  <div className="text-center">
                    <div className="bg-white p-3 rounded-xl border border-neutral-200 inline-block shadow-xs">
                      <img src={pixQrCodeUrl} alt="QR Code PIX" className="w-40 h-40 object-contain mx-auto" />
                    </div>
                  </div>
                )}

                {pixPayload && (
                  <div className="space-y-1.5">
                    <div className="p-2 bg-white rounded-lg border border-neutral-300 text-[11px] font-mono break-all text-neutral-700 max-h-16 overflow-y-auto">
                      {pixPayload}
                    </div>
                    <button
                      onClick={handleCopyPix}
                      className="w-full py-2 bg-neutral-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      {copiedPix ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span>Código PIX Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copiar Código PIX</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                <div className="p-3 bg-neutral-100 rounded-xl space-y-1.5 text-center">
                  <button
                    onClick={handleMarkPaymentDone}
                    disabled={markedPaymentSent}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      markedPaymentSent
                        ? "bg-emerald-600 text-white cursor-default"
                        : "bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-300 cursor-pointer shadow-xs"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>{markedPaymentSent ? "Pagamento informado!" : "Já realizei o pagamento"}</span>
                  </button>
                  <p className="text-[10px] text-neutral-600">
                    O pagamento será confirmado após conferência do comprovante pela Madeira Karate.
                  </p>
                </div>
              </div>
            )}

            {/* Enviar comprovante pelo WhatsApp */}
            <a
              href={generateWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Enviar comprovante pelo WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
