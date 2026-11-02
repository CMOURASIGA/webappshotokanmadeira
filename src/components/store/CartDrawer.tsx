import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Smartphone, 
  AlertCircle, 
  CheckCircle2,
  ExternalLink,
  ImageOff
} from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import { useAppData } from "../../contexts/AppDataContext";
import { useLanguage } from "../../i18n/LanguageContext";

export function CartDrawer() {
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    clearCart, 
    subtotal, 
    totalItems, 
    isCartOpen, 
    setIsCartOpen,
    generateWhatsAppCheckoutUrl
  } = useCart();
  
  const { config } = useAppData();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const copy = language === "en"
    ? { cartAria: "Student shopping cart", cartTitle: "Student Cart", item: "item", items: "items", subtitle: "Official dojo merchandise request", close: "Close cart", preparation: "Order preparation", preparationText: "This cart is saved on this device. It does not represent a stock reservation or a completed purchase.", empty: "Your cart is empty", emptyText: "Browse the Madeira Karate official catalog and add dogi, belts or shirts to prepare your request.", backStore: "Back to Store", selectedItems: "Selected Items", clearAll: "Clear everything?", yes: "Yes", no: "No", clearCart: "Clear cart", noPhoto: "No photo", removeItem: "Remove item", size: "Size", color: "Color", embroidery: "Embroidery", decrease: "Decrease quantity", increase: "Increase quantity", unit: "ea.", subtotal: "Estimated subtotal", pickup: "Pickup", atDojo: "At the dojo office", total: "Estimated Total", noImmediateCharge: "No immediate charge on the website", howFinish: "How is the order completed?", howFinishText: "You will send these items to the dojo office via WhatsApp. The team will confirm available sizes, timing and PIX payment details.", sendWhatsApp: "Send Order via Official WhatsApp" }
    : language === "ja"
    ? { cartAria: "会員用ショッピングカート", cartTitle: "会員カート", item: "点", items: "点", subtitle: "道場公式商品の注文準備", close: "カートを閉じる", preparation: "注文準備", preparationText: "このカートはこの端末に保存されます。在庫確保や注文確定を意味するものではありません。", empty: "カートは空です", emptyText: "Madeira Karate の公式商品から道着、帯、シャツなどを選んで注文内容を準備してください。", backStore: "ストアに戻る", selectedItems: "選択商品", clearAll: "すべて削除しますか？", yes: "はい", no: "いいえ", clearCart: "カートを空にする", noPhoto: "画像なし", removeItem: "商品を削除", size: "サイズ", color: "色", embroidery: "刺繍", decrease: "数量を減らす", increase: "数量を増やす", unit: "点", subtotal: "小計（概算）", pickup: "受取", atDojo: "道場受付", total: "合計（概算）", noImmediateCharge: "サイト上で即時決済は行いません", howFinish: "注文確定までの流れ", howFinishText: "商品一覧を WhatsApp で道場受付へ送信します。スタッフが在庫サイズ、受取時期、PIX 支払情報を確認します。", sendWhatsApp: "公式 WhatsApp で注文を送る" }
    : { cartAria: "Carrinho de Compras do Aluno", cartTitle: "Carrinho do Aluno", item: "item", items: "itens", subtitle: "Pedido oficial de artigos do Dojo", close: "Fechar carrinho", preparation: "Preparação de Pedido", preparationText: "O carrinho é salvo na memória deste aparelho. Não representa reserva de estoque ou compra finalizada.", empty: "Seu carrinho está vazio", emptyText: "Explore o catálogo oficial da Madeira Karate e adicione dogis, faixas ou camisas para preparar sua solicitação.", backStore: "Voltar à Loja", selectedItems: "Itens Selecionados", clearAll: "Limpar tudo?", yes: "Sim", no: "Não", clearCart: "Limpar carrinho", noPhoto: "Sem foto", removeItem: "Remover item", size: "Tam", color: "Cor", embroidery: "Bordado", decrease: "Diminuir quantidade", increase: "Aumentar quantidade", unit: "un", subtotal: "Subtotal estimado", pickup: "Retirada", atDojo: "Na secretaria do Dojo", total: "Total Estimado", noImmediateCharge: "Sem cobrança imediata no site", howFinish: "Como funciona a finalização?", howFinishText: "Você enviará estes itens para o WhatsApp da secretaria. A equipe confirmará tamanhos em estoque, prazo e dados para pagamento via PIX.", sendWhatsApp: "Enviar Pedido via WhatsApp Oficial" };
  const [confirmClear, setConfirmClear] = useState(false);
  const [thumbnailErrors, setThumbnailErrors] = useState<Record<string, boolean>>({});

  // Bloqueio de rolagem do body quando o carrinho estiver aberto em qualquer gadget
  useEffect(() => {
    if (isCartOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isCartOpen]);

  // Tecla Escape para fechar
  useEffect(() => {
    if (!isCartOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsCartOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  const checkoutUrl = generateWhatsAppCheckoutUrl(config.whatsapp);

  return createPortal(
    <div className="fixed inset-0 z-[150] flex flex-col sm:flex-row justify-start sm:justify-end items-stretch p-0 sm:p-4 md:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      {/* Responsive Modal/Drawer Panel - Posicionado no TOPO em qualquer gadget */}
      <div 
        className="relative w-full sm:max-w-md bg-white shadow-2xl flex flex-col z-10 h-full sm:h-auto sm:max-h-[90vh] sm:rounded-2xl overflow-hidden animate-in slide-in-from-top-4 sm:slide-in-from-right-6 duration-300 border-b sm:border border-neutral-200/50"
        role="dialog"
        aria-modal="true"
        aria-label={copy.cartAria}
      >
        {/* Header / Label do Carrinho - Fixado no topo absoluto do gadget */}
        <div className="p-3.5 sm:p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900 text-white shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-karate-red flex items-center justify-center text-white shrink-0">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold font-jp">{copy.cartTitle}</h2>
                <span className="bg-karate-red text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {totalItems} {totalItems === 1 ? copy.item : copy.items}
                </span>
              </div>
              <span className="text-[11px] text-neutral-400 block">
                {copy.subtitle}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label={copy.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informative Guidance Banner */}
        <div className="bg-amber-50 border-b border-amber-200/80 px-3.5 sm:px-4 py-2 text-[11px] text-amber-900 flex items-start gap-2 shrink-0">
          <Smartphone className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
          <span>
            <strong>{copy.preparation}:</strong> {copy.preparationText}
          </span>
        </div>

        {/* Items List - Altura responsiva e flexível com scroll interno suave */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-3 min-h-0">
          {items.length === 0 ? (
            <div className="py-8 px-4 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400">
                <ShoppingBag className="w-7 h-7 stroke-[1.5]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-neutral-800">{copy.empty}</h3>
                <p className="text-xs text-neutral-500 max-w-xs leading-relaxed">
                  {copy.emptyText}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate("/store");
                }}
                className="mt-2 text-xs font-bold text-karate-red hover:underline cursor-pointer"
              >
                {copy.backStore}
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100 text-xs text-neutral-500">
                <span>{copy.selectedItems}</span>
                {confirmClear ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-red-600 font-bold">{copy.clearAll}</span>
                    <button
                      onClick={() => {
                        clearCart();
                        setConfirmClear(false);
                      }}
                      className="text-[11px] font-bold text-red-600 underline"
                    >
                      {copy.yes}
                    </button>
                    <button
                      onClick={() => setConfirmClear(false)}
                      className="text-[11px] text-neutral-500"
                    >
                      {copy.no}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmClear(true)}
                    className="text-neutral-400 hover:text-neutral-700 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>{copy.clearCart}</span>
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {items.map((item) => {
                  const itemSubtotal = item.unitPrice * item.quantity;
                  const firstImage = item.product.images[0];
                  const hasThumbnailError = thumbnailErrors[item.id] || !firstImage;

                  return (
                    <div 
                      key={item.id}
                      className="bg-neutral-50 rounded-xl p-3.5 border border-neutral-200/80 flex gap-3 relative group"
                    >
                      {/* Thumbnail */}
                      <div className="w-16 h-20 rounded-lg bg-neutral-200 overflow-hidden shrink-0 border border-neutral-200">
                        {!hasThumbnailError ? (
                          <img 
                            src={firstImage} 
                            alt={item.product.name} 
                            className="w-full h-full object-cover"
                            onError={() => {
                              setThumbnailErrors((prev) => ({ ...prev, [item.id]: true }));
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 text-[10px] p-1 text-center bg-neutral-100">
                            <ImageOff className="w-4 h-4 text-neutral-400 mb-0.5" />
                            <span>{copy.noPhoto}</span>
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs sm:text-sm font-bold text-neutral-900 truncate">
                              {item.product.name}
                            </h4>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-neutral-400 hover:text-karate-red transition-colors p-1"
                              title={copy.removeItem}
                              aria-label={`Remover ${item.product.name}`}
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Variantes selecionadas */}
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {item.selectedSize && (
                              <span className="text-[10px] bg-white border border-neutral-200 px-1.5 py-0.5 rounded font-medium text-neutral-700">
                                {copy.size}: {item.selectedSize}
                              </span>
                            )}
                            {item.selectedColor && (
                              <span className="text-[10px] bg-white border border-neutral-200 px-1.5 py-0.5 rounded font-medium text-neutral-700">
                                {copy.color}: {item.selectedColor}
                              </span>
                            )}
                            {item.selectedVariation && (
                              <span className="text-[10px] bg-white border border-neutral-200 px-1.5 py-0.5 rounded font-medium text-neutral-700">
                                {item.selectedVariation}
                              </span>
                            )}
                          </div>

                          {item.customizationText && (
                            <p className="text-[11px] text-neutral-600 mt-1 italic line-clamp-1">
                              {copy.embroidery}: &ldquo;{item.customizationText}&rdquo;
                            </p>
                          )}
                        </div>

                        {/* Quantity and Price */}
                        <div className="flex items-center justify-between pt-2 mt-1 border-t border-neutral-200/60">
                          <div className="flex items-center border border-neutral-300 bg-white rounded-lg overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 text-neutral-500 hover:bg-neutral-100 transition-colors"
                              aria-label={copy.decrease}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2.5 text-xs font-bold text-neutral-800 min-w-[24px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 text-neutral-500 hover:bg-neutral-100 transition-colors"
                              aria-label={copy.increase}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="text-right">
                            <span className="text-xs font-bold text-neutral-900">
                              R$ {itemSubtotal.toFixed(2).replace(".", ",")}
                            </span>
                            {item.quantity > 1 && (
                              <span className="block text-[10px] text-neutral-400">
                                R$ {item.unitPrice.toFixed(2).replace(".", ",")} {copy.unit}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer with Checkout - Diretamente acoplado abaixo dos itens selecionados */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-neutral-200 bg-neutral-50 space-y-3 shrink-0">
            {/* Summary */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-neutral-600">
                <span>{copy.subtotal}</span>
                <span className="font-semibold text-neutral-900">
                  R$ {subtotal.toFixed(2).replace(".", ",")}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>{copy.pickup}</span>
                <span className="text-neutral-700 font-medium">{copy.atDojo}</span>
              </div>
              <div className="pt-2 border-t border-neutral-200 flex items-baseline justify-between">
                <div>
                  <span className="text-sm font-bold text-neutral-900">{copy.total}</span>
                  <span className="block text-[10px] text-neutral-500">{copy.noImmediateCharge}</span>
                </div>
                <span className="text-lg font-black text-karate-red font-jp">
                  R$ {subtotal.toFixed(2).replace(".", ",")}
                </span>
              </div>
            </div>

            {/* Aviso do Fluxo Oficial */}
            <div className="bg-white rounded-lg p-2.5 border border-neutral-200 text-[11px] text-neutral-600 leading-snug">
              <span className="font-bold text-neutral-800 block mb-0.5">{copy.howFinish}</span>
              {copy.howFinishText}
            </div>

            {/* CTA WhatsApp */}
            <a
              href={checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <span>{copy.sendWhatsApp}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
