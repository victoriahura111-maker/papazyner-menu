// ============================================
// PAPAZYNER'S - CART HOOK (useCart)
// ============================================

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { CartItem, CartState } from '@/utils/types';

const STORAGE_KEY = 'papazyner_cart';

function loadCartFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item: CartItem) =>
        item &&
        item.id &&
        item.name &&
        typeof item.price === 'number' &&
        typeof item.quantity === 'number' &&
        item.quantity > 0
    );
  } catch {
    console.warn('Failed to load cart from localStorage. Starting fresh.');
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

function saveCartToStorage(items: CartItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    if (items.length === 0) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  } catch {
    console.warn('Failed to save cart to localStorage.');
  }
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const stored = loadCartFromStorage();
    setItems(stored);
    setIsLoaded(true);
  }, []);

  // Persist cart to localStorage whenever it changes (after initial load)
  useEffect(() => {
    if (isLoaded) {
      saveCartToStorage(items);
    }
  }, [items, isLoaded]);

  // Generate a unique key for cart items that may have variations
  const itemKey = useCallback((id: string, variationLabel?: string) => {
    return variationLabel ? `${id}__${variationLabel}` : id;
  }, []);

  const addItem = useCallback(
    (newItem: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
      setItems((prev) => {
        const key = itemKey(newItem.id, newItem.variationLabel);
        const existingIndex = prev.findIndex(
          (item) => itemKey(item.id, item.variationLabel) === key
        );

        if (existingIndex >= 0) {
          // Item exists, increment quantity
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + (newItem.quantity || 1),
          };
          return updated;
        }

        // New item
        return [...prev, { ...newItem, quantity: newItem.quantity || 1 }];
      });
    },
    [itemKey]
  );

  const removeItem = useCallback(
    (id: string, variationLabel?: string) => {
      setItems((prev) => {
        const key = itemKey(id, variationLabel);
        return prev.filter(
          (item) => itemKey(item.id, item.variationLabel) !== key
        );
      });
    },
    [itemKey]
  );

  const updateQuantity = useCallback(
    (id: string, variationLabel: string | undefined, quantity: number) => {
      if (quantity < 1) {
        removeItem(id, variationLabel);
        return;
      }
      setItems((prev) => {
        const key = itemKey(id, variationLabel);
        return prev.map((item) =>
          itemKey(item.id, item.variationLabel) === key
            ? { ...item, quantity }
            : item
        );
      });
    },
    [itemKey, removeItem]
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const cartState: CartState = useMemo(() => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return { items, totalItems, subtotal };
  }, [items]);

  return {
    ...cartState,
    isLoaded,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };
}
