import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "./AppDataContext";

export interface MadeiraStoreCartItem {
  id: string; // Composite unique key: e.g. `${productId}::${size}::${color}::${variation}::${customization}`
  productId: string;
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
  selectedVariation?: string;
  customizationText?: string;
  unitPrice: number;
  subtotal: number;
}

export interface MadeiraStoreItemVariation {
  size?: string;
  color?: string;
  variation?: string;
  customization?: string;
}

interface MadeiraStoreCartContextType {
  items: MadeiraStoreCartItem[];
  addItem: (product: Product, quantity?: number, variations?: MadeiraStoreItemVariation) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  removeItem: (cartItemId: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
}

const STORAGE_KEY = "madeira_store_mvp_cart_v1";

const MadeiraStoreCartContext = createContext<MadeiraStoreCartContextType | undefined>(undefined);

export function MadeiraStoreCartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<MadeiraStoreCartItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("[MadeiraStoreCart] Erro ao carregar carrinho local:", e);
    }
    return [];
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Persistir no LocalStorage apenas durante a composição do pedido
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("[MadeiraStoreCart] Erro ao salvar carrinho local:", e);
    }
  }, [items]);

  const generateCartItemId = (productId: string, variations?: MadeiraStoreItemVariation): string => {
    const s = (variations?.size || "").trim().toLowerCase();
    const c = (variations?.color || "").trim().toLowerCase();
    const v = (variations?.variation || "").trim().toLowerCase();
    const cust = (variations?.customization || "").trim().toLowerCase();
    return `${productId}::${s}::${c}::${v}::${cust}`;
  };

  const getAvailableStock = (product: Product, variations?: MadeiraStoreItemVariation): number | null => {
    if (!product.stockControlled) return null;
    const hasVariants = !!(product.sizes?.length || product.colors?.length || product.variations?.length);
    if (!hasVariants) return Math.max(0, Math.floor(Number(product.stockQuantity) || 0));
    const key = [
      variations?.size || "",
      variations?.color || "",
      variations?.variation || ""
    ].map(value => String(value).trim().toLowerCase()).join("||");
    return Math.max(0, Math.floor(Number(product.stockByVariant?.[key]) || 0));
  };

  const addItem = (product: Product, quantity: number = 1, variations?: MadeiraStoreItemVariation) => {
    if (quantity <= 0 || product.available === false) return;
    const cartItemId = generateCartItemId(product.id, variations);
    const availableStock = getAvailableStock(product, variations);
    if (availableStock !== null && availableStock < 1) return;

    setItems((prevItems) => {
      const existingIdx = prevItems.findIndex((item) => item.id === cartItemId);
      if (existingIdx > -1) {
        const updated = [...prevItems];
        const newQty = updated[existingIdx].quantity + quantity;
        if (availableStock !== null && newQty > availableStock) return prevItems;
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: newQty,
          subtotal: newQty * updated[existingIdx].unitPrice
        };
        return updated;
      }

      const newItem: MadeiraStoreCartItem = {
        id: cartItemId,
        productId: product.id,
        product,
        quantity,
        selectedSize: variations?.size,
        selectedColor: variations?.color,
        selectedVariation: variations?.variation,
        customizationText: variations?.customization,
        unitPrice: product.price,
        subtotal: quantity * product.price
      };
      return [...prevItems, newItem];
    });
  };

  const updateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(cartItemId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === cartItemId) {
          const availableStock = getAvailableStock(item.product, {
            size: item.selectedSize,
            color: item.selectedColor,
            variation: item.selectedVariation,
            customization: item.customizationText
          });
          const quantity = availableStock === null ? newQuantity : Math.min(newQuantity, availableStock);
          if (quantity <= 0) return item;
          return {
            ...item,
            quantity,
            subtotal: quantity * item.unitPrice
          };
        }
        return item;
      })
    );
  };

  const removeItem = (cartItemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== cartItemId));
  };

  const clearCart = () => {
    setItems([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = items.reduce((acc, item) => acc + item.subtotal, 0);

  return (
    <MadeiraStoreCartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        totalItems,
        totalAmount,
        isCartDrawerOpen,
        setIsCartDrawerOpen
      }}
    >
      {children}
    </MadeiraStoreCartContext.Provider>
  );
}

export function useMadeiraStoreCart() {
  const context = useContext(MadeiraStoreCartContext);
  if (!context) {
    throw new Error("useMadeiraStoreCart deve ser utilizado dentro de MadeiraStoreCartProvider");
  }
  return context;
}
