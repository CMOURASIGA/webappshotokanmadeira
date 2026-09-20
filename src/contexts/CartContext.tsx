import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "./AppDataContext";

export interface CartItemVariation {
  size?: string;
  color?: string;
  variation?: string;
  customization?: string;
}

export interface CartItem {
  id: string; // Unique key for cart: e.g. `${product.id}_${size}_${color}_${customization}`
  productId: string;
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  selectedVariation?: string;
  customizationText?: string;
  unitPrice: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity: number, variations?: CartItemVariation) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  generateWhatsAppCheckoutUrl: (whatsappNumber: string) => string;
}

const CART_STORAGE_KEY = "madeira_karate_cart_v2";

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Failed to load cart from localStorage", e);
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Failed to save cart to localStorage", e);
    }
  }, [items]);

  const generateCartItemId = (productId: string, variations?: CartItemVariation): string => {
    const s = (variations?.size || "").trim().toLowerCase();
    const c = (variations?.color || "").trim().toLowerCase();
    const v = (variations?.variation || "").trim().toLowerCase();
    const cust = (variations?.customization || "").trim().toLowerCase();
    return `${productId}::${s}::${c}::${v}::${cust}`;
  };

  const addItem = (product: Product, quantity: number = 1, variations?: CartItemVariation) => {
    if (quantity <= 0) return;
    const cartItemId = generateCartItemId(product.id, variations);

    setItems(prevItems => {
      const existingIndex = prevItems.findIndex(item => item.id === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      } else {
        const newItem: CartItem = {
          id: cartItemId,
          productId: product.id,
          product,
          quantity,
          selectedSize: variations?.size,
          selectedColor: variations?.color,
          selectedVariation: variations?.variation,
          customizationText: variations?.customization,
          unitPrice: product.price
        };
        return [...prevItems, newItem];
      }
    });
  };

  const updateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(cartItemId);
      return;
    }
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (cartItemId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== cartItemId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  const generateWhatsAppCheckoutUrl = (whatsappNumber: string): string => {
    const cleanNumber = whatsappNumber.replace(/\D/g, "");
    
    if (items.length === 0) {
      return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
        "Olá! Gostaria de tirar uma dúvida sobre os produtos da loja oficial Madeira Karate."
      )}`;
    }

    let message = `🥋 *SOLICITAÇÃO DE PEDIDO — LOJA MADEIRA KARATE*\n\n`;
    message += `Olá, equipe Madeira Karate! Gostaria de verificar a disponibilidade dos seguintes itens:\n\n`;

    items.forEach((item, index) => {
      message += `*${index + 1}. ${item.product.name}*\n`;
      message += `   • Quantidade: ${item.quantity}x\n`;
      message += `   • Preço unitário: R$ ${item.unitPrice.toFixed(2).replace(".", ",")}\n`;
      
      const details: string[] = [];
      if (item.selectedSize) details.push(`Tamanho: ${item.selectedSize}`);
      if (item.selectedColor) details.push(`Cor: ${item.selectedColor}`);
      if (item.selectedVariation) details.push(`Variação: ${item.selectedVariation}`);
      if (item.customizationText) details.push(`Personalização (Nome/Bordado): "${item.customizationText}"`);

      if (details.length > 0) {
        message += `   • Detalhes: ${details.join(" | ")}\n`;
      }
      
      const itemSubtotal = item.unitPrice * item.quantity;
      message += `   • Subtotal do item: R$ ${itemSubtotal.toFixed(2).replace(".", ",")}\n\n`;
    });

    message += `━━━━━━━━━━━━━━━━━━━━━\n`;
    message += `💰 *Valor Total Estimado: R$ ${subtotal.toFixed(2).replace(".", ",")}*\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
    message += `📍 *Observação:* Entendo que este é um pedido de verificação e a compra não está concluída.\n`;
    message += `Gostaria de confirmar disponibilidade, pagamento e retirada com a secretaria.`;

    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        totalItems,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        generateWhatsAppCheckoutUrl
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
