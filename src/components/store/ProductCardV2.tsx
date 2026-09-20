import React, { useState } from "react";
import { 
  ShoppingBag, 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Info, 
  Sparkles, 
  Plus, 
  CheckCircle2,
  AlertCircle,
  ImageOff
} from "lucide-react";
import { Product } from "../../contexts/AppDataContext";
import { useCart } from "../../contexts/CartContext";

interface ProductCardV2Props {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export function ProductCardV2({ product, onQuickView }: ProductCardV2Props) {
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

  const { addItem, setIsCartOpen } = useCart();

  const handleAddToCart = (openDrawer = false) => {
    addItem(product, 1, {
      size: selectedSize,
      color: selectedColor,
      variation: selectedVariation,
      customization: customizationText.trim() || undefined
    });

    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);

    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  const images = product.images;
  const hasImages = images.length > 0;
  const currentImageHasError = !hasImages || imageError[currentImageIndex];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-200/80 overflow-hidden flex flex-col hover:border-neutral-300 hover:shadow-md transition-all">
      {/* Visual Header / Carousel */}
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
              Imagem do produto indisponível
            </span>
            <span className="text-[10px] text-neutral-400 mt-0.5">
              Consulte a secretaria para mais detalhes
            </span>
          </div>
        )}

        {/* Tags superiores */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          {product.category && (
            <span className="bg-neutral-900/85 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              {product.category}
            </span>
          )}

          {product.available === false && (
            <span className="bg-red-600/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ml-auto">
              Sob Consulta
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
              aria-label="Imagem anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-neutral-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
              aria-label="Próxima imagem"
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
                  aria-label={`Ir para foto ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Product Content & Variations */}
      <div className="p-5 flex flex-col flex-1 space-y-4">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-base sm:text-lg text-neutral-900 font-jp leading-tight">
              {product.name}
            </h3>
            <span className="font-black text-lg text-karate-red shrink-0">
              R$ {product.price.toFixed(2).replace(".", ",")}
            </span>
          </div>

          <p className="text-xs text-neutral-600 leading-relaxed line-clamp-3">
            {product.description}
          </p>
        </div>

        {/* Variantes se cadastradas */}
        <div className="space-y-3 pt-2 border-t border-neutral-100 flex-1">
          {/* Tamanhos */}
          {product.sizes && product.sizes.length > 0 && (
            <div>
              <span className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                Tamanho: <span className="text-neutral-500 font-normal">{selectedSize || "Escolha"}</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {product.sizes.map((size) => (
                  <button
                    key={size}
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

          {/* Cores */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <span className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                Cor: <span className="text-neutral-500 font-normal">{selectedColor || "Escolha"}</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {product.colors.map((color) => (
                  <button
                    key={color}
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

          {/* Outras Variações */}
          {product.variations && product.variations.length > 0 && (
            <div>
              <span className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                Opção: <span className="text-neutral-500 font-normal">{selectedVariation || "Escolha"}</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {product.variations.map((variation) => (
                  <button
                    key={variation}
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

          {/* Personalização (Bordado / Nome) */}
          {product.customizable && (
            <div className="pt-1">
              <button
                onClick={() => setShowCustomInput(!showCustomInput)}
                className="text-xs text-neutral-600 hover:text-neutral-900 font-semibold flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-karate-gold" />
                <span>Adicionar nome para bordado / personalização</span>
              </button>

              {showCustomInput && (
                <div className="mt-2 space-y-1">
                  <input
                    type="text"
                    value={customizationText}
                    onChange={(e) => setCustomizationText(e.target.value)}
                    placeholder="Ex: Nome do aluno no bordado da faixa"
                    maxLength={50}
                    className="w-full text-xs p-2 rounded-lg bg-neutral-50 border border-neutral-300 text-neutral-900 focus:outline-none focus:border-karate-red"
                  />
                  <span className="text-[10px] text-neutral-400 block">
                    Será validado com a secretaria antes da produção.
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-neutral-100 flex items-center gap-2">
          <button
            onClick={() => handleAddToCart(false)}
            disabled={product.available === false}
            className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm ${
              product.available === false
                ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                : addedAnimation
                ? "bg-emerald-600 text-white"
                : "bg-neutral-900 hover:bg-black text-white active:scale-95"
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-4 h-4" />
                <span>Adicionado!</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Adicionar ao Carrinho</span>
              </>
            )}
          </button>

          <button
            onClick={() => handleAddToCart(true)}
            disabled={product.available === false}
            className="py-2.5 px-3 rounded-xl font-bold text-xs bg-karate-red/10 hover:bg-karate-red hover:text-white text-karate-red border border-karate-red/20 transition-all active:scale-95 shrink-0"
            title="Adicionar e abrir carrinho para enviar via WhatsApp"
          >
            Pedir Agora
          </button>
        </div>
      </div>
    </div>
  );
}
