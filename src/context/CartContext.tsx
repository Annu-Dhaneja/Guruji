import React, { createContext, useContext, useEffect, useState } from 'react';
import { OrderItem } from '../types';

export interface CartContextType {
  items: OrderItem[];
  addItem: (item: OrderItem | any) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalAmount: number;
  itemsCount: number;
  hasPhysicalItems: boolean;
  hasDigitalItems: boolean;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalAmount: 0,
  itemsCount: 0,
  hasPhysicalItems: false,
  hasDigitalItems: false,
  isCartOpen: false,
  setIsCartOpen: () => {},
  openCart: () => {},
  closeCart: () => {},
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const [items, setItems] = useState<OrderItem[]>(() => {
    try {
      const saved = localStorage.getItem('gurucraft_cart');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      return parsed.map((item: any, idx: number) => ({
        itemId: String(item.itemId || item.id || `cart_item_${idx}`),
        itemType: item.itemType || 'product',
        name: item.name || 'Sacred Item',
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) > 0 ? Number(item.quantity) : 1,
        imageUrl: item.imageUrl || item.image || '',
        category: item.category || '',
        customizationData: item.customizationData,
        variantName: item.variantName,
        format: item.format,
        isDigital: item.isDigital !== undefined ? Boolean(item.isDigital) : false,
        isPhysical: item.isPhysical !== undefined ? Boolean(item.isPhysical) : true,
        sku: item.sku || '',
        downloadUrl: item.downloadUrl,
      }));
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('gurucraft_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (newItem: OrderItem | any) => {
    const rawId = newItem.itemId || newItem.id || `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const hasCustomization = newItem.customizationData && Object.keys(newItem.customizationData).length > 0;
    const uniqueCartKey = hasCustomization
      ? `${rawId}_custom_${Date.now()}`
      : (newItem.variantName ? `${rawId}_${newItem.variantName}` : String(rawId));

    const isPhysical = newItem.isPhysical !== undefined
      ? Boolean(newItem.isPhysical)
      : !newItem.isDigital;

    const normalizedItem: OrderItem = {
      itemId: uniqueCartKey,
      itemType: newItem.itemType || 'product',
      name: newItem.name || 'Sacred Product',
      price: Number(newItem.price) || 0,
      quantity: Number(newItem.quantity) > 0 ? Number(newItem.quantity) : 1,
      imageUrl: newItem.imageUrl || newItem.image || '',
      category: newItem.category || '',
      customizationData: newItem.customizationData,
      variantName: newItem.variantName,
      format: newItem.format,
      isDigital: newItem.isDigital !== undefined ? Boolean(newItem.isDigital) : !isPhysical,
      isPhysical: isPhysical,
      sku: newItem.sku || '',
      downloadUrl: newItem.downloadUrl,
    };

    setItems((prev) => {
      const existing = prev.find(
        (i) => i.itemId === normalizedItem.itemId
      );
      if (existing && !hasCustomization) {
        return prev.map((i) =>
          i.itemId === normalizedItem.itemId
            ? { ...i, quantity: (i.quantity || 1) + normalizedItem.quantity }
            : i
        );
      }
      return [...prev, normalizedItem];
    });
  };

  const removeItem = (targetId: string) => {
    setItems((prev) =>
      prev.filter((i) => i.itemId !== targetId && (i as any).id !== targetId)
    );
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.itemId === itemId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalAmount = items.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );

  const itemsCount = items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 1),
    0
  );

  const hasPhysicalItems = items.some((i) => i.isPhysical || (!i.isDigital && i.itemType === 'product'));
  const hasDigitalItems = items.some((i) => i.isDigital);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalAmount,
        itemsCount,
        hasPhysicalItems,
        hasDigitalItems,
        isCartOpen,
        setIsCartOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
