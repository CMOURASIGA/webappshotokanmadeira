import React, { useState } from "react";
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
  const [confirmClear, setConfirmClear] = useState(false);
  const [thumbnailErrors, setThumbnailErrors] = useState<Record<string, boolean>>({});

  if (!isCartOpen) return null;

  const checkoutUrl = generateWhatsAppCheckoutUrl(config.whatsapp);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end p-0 sm:p-4 md:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      {/* Responsive Modal/Drawer Panel */}
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col z-10 max-h-[92vh] sm:max-h-[88vh] h-auto overflow-hidden animate-in slide-in-from-bottom-6 sm:slide-in-from-right-6 duration-300 border border-neutral-200/50">
        {/* Mobile Drag Indicator */}
        <div className="sm:hidden pt-2 pb-1 flex justify-center bg-neutral-900 shrink-0">
          <div className="w-10 h-1 bg-neutral-600 rounded-full" />
        </div>

        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-900 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-karate-red flex items-center justify-center text-white">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold font-jp">Carrinho do Aluno</h2>
              <span className="text-[11px] text-neutral-400">
                {totalItems} {totalItems === 1 ? "item selecionado" : "itens selecionados"}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            aria-label="Fechar carrinho"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informative Guidance Banner */}
        <div className="bg-amber-50 border-b border-amber-200/80 px-4 py-2.5 text-[11px] text-amber-900 flex items-start gap-2 shrink-0">
          <Smartphone className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
          <span>
            <strong>Preparação de Pedido:</strong> O carrinho é salvo na memória deste aparelho. Não representa reserva de estoque ou compra finalizada.
          </span>
        </div>

        {/* Items List - Altura responsiva e proporcional à quantidade de produtos */}
        <div className="overflow-y-auto p-4 sm:p-5 space-y-3 max-h-[46vh] sm:max-h-[48vh] min-h-0 flex-initial">
          {items.length === 0 ? (
            <div className="py-8 px-4 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400">
                <ShoppingBag className="w-7 h-7 stroke-[1.5]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-neutral-800">Seu carrinho está vazio</h3>
                <p className="text-xs text-neutral-500 max-w-xs leading-relaxed">
                  Explore o catálogo oficial da Madeira Karate e adicione dogis, faixas ou camisas para preparar sua solicitação.
                </p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-2 text-xs font-bold text-karate-red hover:underline"
              >
                Voltar à Loja
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100 text-xs text-neutral-500">
                <span>Itens Selecionados</span>
                {confirmClear ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-red-600 font-bold">Limpar tudo?</span>
                    <button
                      onClick={() => {
                        clearCart();
                        setConfirmClear(false);
                      }}
                      className="text-[11px] font-bold text-red-600 underline"
                    >
                      Sim
                    </button>
                    <button
                      onClick={() => setConfirmClear(false)}
                      className="text-[11px] text-neutral-500"
                    >
                      Não
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmClear(true)}
                    className="text-neutral-400 hover:text-neutral-700 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Limpar carrinho</span>
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
                            <span>Sem foto</span>
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
                              title="Remover item"
                              aria-label={`Remover ${item.product.name}`}
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Variantes selecionadas */}
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {item.selectedSize && (
                              <span className="text-[10px] bg-white border border-neutral-200 px-1.5 py-0.5 rounded font-medium text-neutral-700">
                                Tam: {item.selectedSize}
                              </span>
                            )}
                            {item.selectedColor && (
                              <span className="text-[10px] bg-white border border-neutral-200 px-1.5 py-0.5 rounded font-medium text-neutral-700">
                                Cor: {item.selectedColor}
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
                              Bordado: &ldquo;{item.customizationText}&rdquo;
                            </p>
                          )}
                        </div>

                        {/* Quantity and Price */}
                        <div className="flex items-center justify-between pt-2 mt-1 border-t border-neutral-200/60">
                          <div className="flex items-center border border-neutral-300 bg-white rounded-lg overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 text-neutral-500 hover:bg-neutral-100 transition-colors"
                              aria-label="Diminuir quantidade"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2.5 text-xs font-bold text-neutral-800 min-w-[24px] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 text-neutral-500 hover:bg-neutral-100 transition-colors"
                              aria-label="Aumentar quantidade"
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
                                R$ {item.unitPrice.toFixed(2).replace(".", ",")} un
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
                <span>Subtotal estimado</span>
                <span className="font-semibold text-neutral-900">
                  R$ {subtotal.toFixed(2).replace(".", ",")}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>Retirada</span>
                <span className="text-neutral-700 font-medium">Na secretaria do Dojo</span>
              </div>
              <div className="pt-2 border-t border-neutral-200 flex items-baseline justify-between">
                <div>
                  <span className="text-sm font-bold text-neutral-900">Total Estimado</span>
                  <span className="block text-[10px] text-neutral-500">Sem cobrança imediata no site</span>
                </div>
                <span className="text-lg font-black text-karate-red font-jp">
                  R$ {subtotal.toFixed(2).replace(".", ",")}
                </span>
              </div>
            </div>

            {/* Aviso do Fluxo Oficial */}
            <div className="bg-white rounded-lg p-2.5 border border-neutral-200 text-[11px] text-neutral-600 leading-snug">
              <span className="font-bold text-neutral-800 block mb-0.5">Como funciona a finalização?</span>
              Você enviará estes itens para o WhatsApp da secretaria. A equipe confirmará tamanhos em estoque, prazo e dados para pagamento via PIX.
            </div>

            {/* CTA WhatsApp */}
            <a
              href={checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <span>Enviar Pedido via WhatsApp Oficial</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
