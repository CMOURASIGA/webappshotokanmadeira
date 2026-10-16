import React, { useState } from "react";
import { createPortal } from "react-dom";
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  CheckCircle2, 
  QrCode, 
  Copy, 
  Check, 
  MessageCircle, 
  AlertCircle,
  HelpCircle,
  User,
  Phone,
  Mail,
  Loader2
} from "lucide-react";
import { useMadeiraStoreCart } from "../../contexts/MadeiraStoreCartContext";
import { useAppData } from "../../contexts/AppDataContext";
import { madeiraStoreService } from "../../services/madeiraStoreService";
import { generatePixCopiaECola, generatePixQrCodeDataUrl } from "../../lib/pixUtils";
import { StoreOrder } from "../../types/storeOrder";
import { Link } from "react-router-dom";

export function MadeiraStoreCartDrawer() {
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    clearCart, 
    totalItems, 
    totalAmount, 
    isCartDrawerOpen, 
    setIsCartDrawerOpen 
  } = useMadeiraStoreCart();

  const { config } = useAppData();

  // Checkout flow state
  const [step, setStep] = useState<"cart" | "checkout" | "success">("cart");
  const [nomeCliente, setNomeCliente] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Success / PIX state
  const [createdOrder, setCreatedOrder] = useState<StoreOrder | null>(null);
  const [pixPayload, setPixPayload] = useState<string>("");
  const [pixQrCodeUrl, setPixQrCodeUrl] = useState<string>("");
  const [copiedPix, setCopiedPix] = useState(false);
  const [markedPaymentSent, setMarkedPaymentSent] = useState(false);

  if (!isCartDrawerOpen) return null;

  const handleStartCheckout = () => {
    if (items.length === 0) return;
    setSubmitError(null);
    setStep("checkout");
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!nomeCliente.trim()) {
      setSubmitError("Informe o seu nome completo.");
      return;
    }
    if (!telefone.trim() || telefone.replace(/\D/g, "").length < 10) {
      setSubmitError("Informe um telefone / WhatsApp válido com DDD.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setSubmitError("Informe um e-mail válido para confirmação do pedido.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Enviar criação do pedido ao backend/planilha
      const orderPayload = {
        nomeCliente: nomeCliente.trim(),
        telefone: telefone.trim(),
        email: email.trim().toLowerCase(),
        observacoes: observacoes.trim() || undefined,
        itens: items.map(item => ({
          produtoId: item.productId,
          produtoNome: item.product.name,
          categoria: item.product.category,
          quantidade: item.quantity,
          tamanho: item.selectedSize,
          cor: item.selectedColor,
          variacao: item.selectedVariation,
          personalizacao: item.customizationText,
          valorUnitario: item.unitPrice,
          subtotal: item.subtotal
        }))
      };

      const newOrder = await madeiraStoreService.createOrder(orderPayload);
      setCreatedOrder(newOrder);

      // 2. Gerar PIX com valor exato do pedido
      const pixConfig = await madeiraStoreService.getPixConfig();
      const payload = generatePixCopiaECola({
        config: pixConfig,
        amount: newOrder.valorTotal,
        txid: newOrder.codigo.replace(/[^a-zA-Z0-9]/g, "")
      });
      setPixPayload(payload);

      const qrUrl = await generatePixQrCodeDataUrl(payload);
      setPixQrCodeUrl(qrUrl);

      // 3. Limpar carrinho após confirmação do pedido
      clearCart();
      setStep("success");
    } catch (err: any) {
      console.error("[MadeiraStore] Erro ao criar pedido:", err);
      setSubmitError(err.message || "Erro ao registrar o pedido. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyPix = () => {
    if (!pixPayload) return;
    navigator.clipboard.writeText(pixPayload);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 3000);
  };

  const handleMarkPaymentDone = async () => {
    if (!createdOrder) return;
    try {
      const updated = await madeiraStoreService.markPaymentSent(createdOrder.id);
      setCreatedOrder(updated);
      setMarkedPaymentSent(true);
    } catch (e) {
      console.error("Erro ao informar pagamento:", e);
    }
  };

  const generateWhatsAppUrl = () => {
    if (!createdOrder) return "#";
    const rawNumber = config.whatsapp || "5521973681109";
    const cleanNumber = rawNumber.replace(/\D/g, "");

    const msg = `Olá! Estou enviando o comprovante do meu pedido na MadeiraStore.\n\n` +
      `Pedido: ${createdOrder.codigo}\n` +
      `Cliente: ${createdOrder.nomeCliente}\n` +
      `Valor: R$ ${createdOrder.valorTotal.toFixed(2).replace(".", ",")}\n\n` +
      `Segue em anexo o comprovante PIX para conferência.`;

    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`;
  };

  const handleClose = () => {
    setIsCartDrawerOpen(false);
    if (step === "success") {
      setStep("cart");
      setCreatedOrder(null);
      setPixPayload("");
      setPixQrCodeUrl("");
      setMarkedPaymentSent(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-[100dvh] max-h-[100dvh] min-h-0 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="shrink-0 p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-karate-red flex items-center justify-center font-bold text-white">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm sm:text-base leading-tight">
                {step === "cart" && "Carrinho MadeiraStore"}
                {step === "checkout" && "Finalizar Compra"}
                {step === "success" && "Pedido Criado!"}
              </h2>
              <span className="text-[10px] text-neutral-400 block">
                {step === "cart" && `${totalItems} ${totalItems === 1 ? "item" : "itens"} selecionados`}
                {step === "checkout" && "Informe os dados do comprador"}
                {step === "success" && `Código: ${createdOrder?.codigo}`}
              </span>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-5">
          {/* ETAPA 1: CARRINHO */}
          {step === "cart" && (
            <>
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400">
                  <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-3">
                    <ShoppingBag className="w-8 h-8 text-neutral-300" />
                  </div>
                  <h3 className="font-bold text-neutral-800 text-base mb-1">Seu carrinho está vazio</h3>
                  <p className="text-xs text-neutral-500 max-w-xs mb-6">
                    Navegue pelos produtos da MadeiraStore e selecione os itens desejados.
                  </p>
                  <button
                    onClick={() => setIsCartDrawerOpen(false)}
                    className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all"
                  >
                    Ver Produtos
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div 
                      key={item.id}
                      className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200/80 flex gap-3 items-start"
                    >
                      {item.product.images?.[0] ? (
                        <img 
                          src={item.product.images[0]} 
                          alt={item.product.name} 
                          className="w-16 h-16 rounded-xl object-cover border border-neutral-200 shrink-0 bg-white"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-neutral-200 flex items-center justify-center text-neutral-400 shrink-0">
                          <ShoppingBag className="w-6 h-6" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-bold text-xs sm:text-sm text-neutral-900 line-clamp-2 leading-tight">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-neutral-400 hover:text-red-600 p-1 transition-colors"
                            title="Remover item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Variações */}
                        <div className="mt-1 flex flex-wrap gap-1 text-[10px] text-neutral-600">
                          {item.selectedSize && (
                            <span className="bg-white px-2 py-0.5 rounded border border-neutral-200 font-medium">
                              Tam: {item.selectedSize}
                            </span>
                          )}
                          {item.selectedColor && (
                            <span className="bg-white px-2 py-0.5 rounded border border-neutral-200 font-medium">
                              Cor: {item.selectedColor}
                            </span>
                          )}
                          {item.selectedVariation && (
                            <span className="bg-white px-2 py-0.5 rounded border border-neutral-200 font-medium">
                              Opção: {item.selectedVariation}
                            </span>
                          )}
                          {item.customizationText && (
                            <span className="bg-white px-2 py-0.5 rounded border border-neutral-200 text-neutral-700 italic block w-full mt-0.5">
                              Gravação: "{item.customizationText}"
                            </span>
                          )}
                        </div>

                        {/* Preço e Quantidade */}
                        <div className="mt-2.5 flex items-center justify-between">
                          <div className="flex items-center border border-neutral-300 rounded-lg bg-white overflow-hidden shadow-xs">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-neutral-100 text-neutral-700 transition-colors"
                              aria-label="Diminuir quantidade"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-2 text-xs font-bold text-neutral-900 min-w-[24px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-neutral-100 text-neutral-700 transition-colors"
                              aria-label="Aumentar quantidade"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <span className="font-bold text-xs sm:text-sm text-neutral-900">
                            R$ {item.subtotal.toFixed(2).replace(".", ",")}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ETAPA 2: FORMULÁRIO DE CHECKOUT */}
          {step === "checkout" && (
            <form onSubmit={handleSubmitOrder} className="space-y-4">
              <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200">
                <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                  Resumo da Compra
                </span>
                <p className="text-xs font-semibold text-neutral-800">
                  {totalItems} {totalItems === 1 ? "item" : "itens"} selecionados
                </p>
                <p className="text-lg font-black text-karate-red font-mono mt-0.5">
                  Total: R$ {totalAmount.toFixed(2).replace(".", ",")}
                </p>
              </div>

              {submitError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Nome Completo *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      required
                      value={nomeCliente}
                      onChange={(e) => setNomeCliente(e.target.value)}
                      placeholder="Ex: Carlos Moura"
                      className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-karate-red bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Telefone / WhatsApp *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="tel"
                      required
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      placeholder="Ex: (21) 97368-1109"
                      className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-karate-red bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    E-mail para Confirmação *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Ex: seuemail@exemplo.com"
                      className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-karate-red bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">
                    Observações (opcional)
                  </label>
                  <textarea
                    rows={2}
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder="Instruções sobre retirada ou detalhes do pedido..."
                    className="w-full text-xs p-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:border-karate-red bg-white"
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 leading-snug">
                📍 <strong>Retirada presencial:</strong> A retirada dos produtos é feita no dojo Madeira Karate após a confirmação do pagamento.
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStep("cart")}
                  className="px-4 py-2.5 text-xs font-bold text-neutral-600 hover:text-neutral-900 bg-neutral-100 rounded-xl"
                >
                  Voltar
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 bg-karate-red hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Gerando Pedido Oficial...</span>
                    </>
                  ) : (
                    <>
                      <span>Finalizar Compra</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* ETAPA 3: TELA DE SUCESSO & PAGAMENTO PIX */}
          {step === "success" && createdOrder && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-sm text-center">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <span className="text-[11px] font-semibold text-emerald-100 uppercase tracking-wider block">
                  Pedido Criado com Sucesso!
                </span>
                <h3 className="text-xl font-black font-mono mt-0.5">
                  {createdOrder.codigo}
                </h3>
                <p className="text-sm font-bold text-white mt-1">
                  Valor Total: R$ {createdOrder.valorTotal.toFixed(2).replace(".", ",")}
                </p>
              </div>

              {/* QR Code PIX */}
              <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/80 text-center space-y-3">
                <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider block">
                  Pague com PIX
                </span>

                {pixQrCodeUrl ? (
                  <div className="bg-white p-3 rounded-xl border border-neutral-200 inline-block shadow-xs">
                    <img
                      src={pixQrCodeUrl}
                      alt="QR Code PIX para pagamento"
                      className="w-44 h-44 object-contain mx-auto"
                    />
                  </div>
                ) : (
                  <div className="w-44 h-44 bg-neutral-200 animate-pulse rounded-xl mx-auto" />
                )}

                {/* Copia e Cola */}
                <div className="space-y-1.5 text-left">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wide block">
                    PIX Copia e Cola:
                  </span>
                  <div className="p-2 bg-white rounded-lg border border-neutral-300 text-[11px] font-mono break-all text-neutral-700 max-h-16 overflow-y-auto">
                    {pixPayload}
                  </div>
                  <button
                    onClick={handleCopyPix}
                    className="w-full py-2 bg-neutral-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
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
              </div>

              {/* Botão Já Realizei o Pagamento */}
              <div className="p-3 bg-neutral-100 rounded-xl space-y-2">
                <button
                  onClick={handleMarkPaymentDone}
                  disabled={markedPaymentSent}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    markedPaymentSent
                      ? "bg-emerald-600 text-white cursor-default"
                      : "bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-300 cursor-pointer shadow-xs"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>{markedPaymentSent ? "Pagamento informado!" : "Já realizei o pagamento"}</span>
                </button>
                <p className="text-[11px] text-neutral-600 text-center">
                  O pagamento será confirmado após conferência do comprovante pela Madeira Karate.
                </p>
              </div>

              {/* Botão de Envio de Comprovante via WhatsApp */}
              <a
                href={generateWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Enviar comprovante pelo WhatsApp</span>
              </a>

              {/* Link para consulta */}
              <div className="pt-2 text-center">
                <Link
                  to={`/madeirastore/pedido`}
                  onClick={handleClose}
                  className="text-xs text-karate-red hover:underline font-bold inline-flex items-center gap-1"
                >
                  <span>Acompanhar status do pedido {createdOrder.codigo}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Footer (Apenas no passo do carrinho) */}
        {step === "cart" && items.length > 0 && (
          <div className="shrink-0 p-4 sm:p-5 border-t border-neutral-200 bg-neutral-50 space-y-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <div className="flex items-center justify-between text-xs text-neutral-600">
              <span>Subtotal dos itens:</span>
              <span className="font-bold text-neutral-900 font-mono">
                R$ {totalAmount.toFixed(2).replace(".", ",")}
              </span>
            </div>

            <div className="flex items-center justify-between text-base font-extrabold text-neutral-900 pt-1 border-t border-neutral-200">
              <span>Total Geral:</span>
              <span className="text-karate-red font-mono">
                R$ {totalAmount.toFixed(2).replace(".", ",")}
              </span>
            </div>

            <button
              onClick={handleStartCheckout}
              className="w-full py-3 px-4 rounded-xl bg-karate-red hover:bg-red-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <span>Continuar para Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
