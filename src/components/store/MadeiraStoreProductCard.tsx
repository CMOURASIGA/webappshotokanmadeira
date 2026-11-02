import React, { useState } from "react";
import { 
  ShoppingBag, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Plus, 
  ImageOff
} from "lucide-react";
import { Product } from "../../contexts/AppDataContext";
import { useMadeiraStoreCart } from "../../contexts/MadeiraStoreCartContext";
import { useLanguage } from "../../i18n/LanguageContext";

interface MadeiraStoreProductCardProps {
  product: Product;
}

export function MadeiraStoreProductCard({ product }: MadeiraStoreProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState<Record<number, boolean>>({});
  
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    product.colors && product.colors.length > 0 ? product.colors[0] : undefined
  );
  const [selectedVariation, setSelectedVariation] = useState<string | undefined>(
    product.variations && product.variations.length > 0 ? product.variations[0] : undefined
  );
  const [customizationText, setCustomizationText] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const { addItem, setIsCartDrawerOpen } = useMadeiraStoreCart();
  const { language } = useLanguage();
  const copy = language === "en"
    ? { noPhoto: "Product photo unavailable", ask: "Contact the staff for details", unavailable: "Unavailable", previous: "Previous image", next: "Next image", go: "Go to image", noStock: "Out of stock for this option", unit: "unit available", units: "units available", size: "Size", color: "Color", option: "Option / Flavor", select: "Select", customize: "Add a name for engraving / customization", example: "Example: name for identification", asEntered: "It will be produced exactly as entered.", added: "Added!", add: "Add to Cart", out: "Out of stock", buy: "Buy Now", checkout: "Buy and proceed to checkout" }
    : language === "ja"
    ? { noPhoto: "商品画像はありません", ask: "詳しくはスタッフにお問い合わせください", unavailable: "在庫なし", previous: "前の画像", next: "次の画像", go: "画像へ", noStock: "この選択肢は在庫切れです", unit: "点在庫あり", units: "点在庫あり", size: "サイズ", color: "色", option: "種類 / フレーバー", select: "選択", customize: "名入れ・カスタマイズを追加", example: "例: 識別用の名前", asEntered: "入力内容のとおりに作成されます。", added: "追加しました", add: "カートに追加", out: "在庫なし", buy: "今すぐ購入", checkout: "購入して決済へ進む" }
    : { noPhoto: "{copy.noPhoto}", ask: "{copy.ask}", unavailable: "{copy.unavailable}", previous: "Imagem anterior", next: "Próxima imagem", go: "Ir para foto", noStock: "Sem estoque para esta opção", unit: "unidade disponível", units: "unidades disponíveis", size: "Tamanho", color: "Cor", option: "Opção / Sabor", select: "Selecione", customize: "Adicionar nome para gravação / personalização", example: "Ex: Nome para identificação", asEntered: "{copy.asEntered}", added: "Adicionado!", add: "Adicionar ao Carrinho", out: "Sem estoque", buy: "{copy.buy}", checkout: "Comprar e ir para o checkout" };

  const selectedStock = (() => {
    if (!product.stockControlled) return null;
    const hasVariants = !!(product.sizes?.length || product.colors?.length || product.variations?.length);
    if (!hasVariants) return Math.max(0, Math.floor(Number(product.stockQuantity) || 0));
    const key = [selectedSize || "", selectedColor || "", selectedVariation || ""]
      .map(value => value.trim().toLowerCase())
      .join("||");
    return Math.max(0, Math.floor(Number(product.stockByVariant?.[key]) || 0));
  })();

  const canBuy = product.available !== false && (selectedStock === null || selectedStock > 0);

  const handleAddToCart = (openCart = false) => {
    if (!canBuy) return;

    addItem(product, 1, {
      size: selectedSize,
      color: selectedColor,
      variation: selectedVariation,
      customization: customizationText.trim() || undefined
    });

    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);

    if (openCart) {
      setIsCartDrawerOpen(true);
    }
  };

  const images = product.images || [];
  const hasImages = images.length > 0;
  const currentImageHasError = !hasImages || imageError[currentImageIndex];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/80 overflow-hidden flex flex-col hover:border-neutral-300 hover:shadow-md transition-all">
      {/* Imagem do Produto */}
      <div className="aspect-[4/5] bg-neutral-100 relative overflow-hidden group">
        {!currentImageHasError ? (
          <img
            src={images[currentImageIndex]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => {
              setImageError((prev) => ({ ...prev, [currentImageIndex]: true }));
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-neutral-100 text-neutral-400 select-none">
            <div className="w-12 h-12 rounded-xl bg-neutral-200/70 flex items-center justify-center mb-2">
              <ImageOff className="w-6 h-6 text-neutral-400 stroke-[1.5]" />
            </div>
            <span className="text-xs font-medium text-neutral-500">
              Foto do item indisponível
            </span>
            <span className="text-[10px] text-neutral-400 mt-0.5">
              Consulte a recepção para mais detalhes
            </span>
          </div>
        )}

        {/* Categoria & Disponibilidade */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          {product.category && (
            <span className="bg-neutral-900/85 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              {product.category}
            </span>
          )}

          {!canBuy && (
            <span className="bg-red-600/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ml-auto">
              Indisponível
            </span>
          )}
        </div>

        {/* Carousel controls */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-neutral-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
              aria-label={copy.previous}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-neutral-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
              aria-label={copy.next}
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    currentImageIndex === idx ? "bg-karate-red w-5" : "bg-white/70 w-1.5 hover:bg-white"
                  }`}
                  aria-label={`${copy.go} ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Detalhes do Produto */}
      <div className="p-5 flex flex-col flex-1 space-y-4">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-base sm:text-lg text-neutral-900 leading-tight">
              {product.name}
            </h3>
            <span className="font-black text-lg text-karate-red shrink-0">
              R$ {product.price.toFixed(2).replace(".", ",")}
            </span>
          </div>

          {product.description && (
            <p className="text-xs text-neutral-600 leading-relaxed line-clamp-3">
              {product.description}
            </p>
          )}
          {product.stockControlled && (
            <p className={`text-[11px] mt-2 font-semibold ${selectedStock === 0 ? "text-red-600" : selectedStock !== null && selectedStock <= 3 ? "text-amber-700" : "text-neutral-500"}`}>
              {selectedStock === 0
                ? copy.noStock
                : selectedStock !== null
                ? `${selectedStock} ${selectedStock === 1 ? copy.unit : copy.units}`
                : ""}
            </p>
          )}
        </div>

        {/* Variantes Opcionais (apenas renderiza o que existe de fato) */}
        <div className="space-y-3 pt-2 border-t border-neutral-100 flex-1">
          {/* Tamanhos (ex: Luvas, Vestuário, Faixas) */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <span className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                {copy.size}: <span className="text-neutral-500 font-normal">{selectedSize || copy.select}</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`px-2.5 py-1 text-xs rounded-lg font-bold border transition-all ${
                      selectedSize === size
                        ? "bg-neutral-900 text-white border-neutral-900 shadow-sm"
                        : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-neutral-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cores (ex: Garrafas, Acessórios, Camisas) */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <span className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                {copy.color}: <span className="text-neutral-500 font-normal">{selectedColor || copy.select}</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`px-2.5 py-1 text-xs rounded-lg font-bold border transition-all ${
                      selectedColor === color
                        ? "bg-neutral-900 text-white border-neutral-900 shadow-sm"
                        : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-neutral-400"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Variações Genéricas (ex: Sabores de barra de proteína, Volumes de bebida, Modelos) */}
          {product.variations && product.variations.length > 0 && (
            <div>
              <span className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                {copy.option}: <span className="text-neutral-500 font-normal">{selectedVariation || copy.select}</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {product.variations.map((variation) => (
                  <button
                    key={variation}
                    type="button"
                    onClick={() => setSelectedVariation(variation)}
                    className={`px-2.5 py-1 text-xs rounded-lg font-bold border transition-all ${
                      selectedVariation === variation
                        ? "bg-neutral-900 text-white border-neutral-900 shadow-sm"
                        : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-neutral-400"
                    }`}
                  >
                    {variation}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Personalização opcional */}
          {product.customizable && (
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowCustomInput(!showCustomInput)}
                className="text-xs text-neutral-600 hover:text-neutral-900 font-semibold flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-karate-gold" />
                <span>{copy.customize}</span>
              </button>

              {showCustomInput && (
                <div className="mt-2 space-y-1">
                  <input
                    type="text"
                    value={customizationText}
                    onChange={(e) => setCustomizationText(e.target.value)}
                    placeholder={copy.example}
                    maxLength={50}
                    className="w-full text-xs p-2 rounded-lg bg-neutral-50 border border-neutral-300 text-neutral-900 focus:outline-none focus:border-karate-red"
                  />
                  <span className="text-[10px] text-neutral-400 block">
                    Será gravado conforme informado.
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Botões de Ação */}
        <div className="pt-3 border-t border-neutral-100 flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleAddToCart(false)}
            disabled={!canBuy}
            className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm ${
              !canBuy
                ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                : addedAnimation
                ? "bg-emerald-600 text-white"
                : "bg-neutral-900 hover:bg-black text-white active:scale-95 cursor-pointer"
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4" />
                <span>{copy.added}</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>{canBuy ? copy.add : copy.out}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleAddToCart(true)}
            disabled={!canBuy}
            className={`py-2.5 px-3 rounded-xl font-bold text-xs border transition-all active:scale-95 shrink-0 ${
              !canBuy
                ? "bg-neutral-100 text-neutral-300 border-neutral-200 cursor-not-allowed"
                : "bg-karate-red/10 hover:bg-karate-red hover:text-white text-karate-red border-karate-red/20 cursor-pointer"
            }`}
            title={copy.checkout}
          >
            Comprar Agora
          </button>
        </div>
      </div>
    </div>
  );
}
