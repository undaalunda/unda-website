//CartContext.tsx

'use client';

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { allItems } from '@/components/allItems';

export type CartItem = {
  id: string;
  title: string;
  subtitle: string;
  price: number | { original: number; sale: number };
  image: string;
  quantity: number;
  type: 'digital' | 'physical';
  weight: number;
};

export type LastActionItem = {
  item: CartItem;
  action: 'add' | 'remove';
};

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (id: string, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  lastActionItem: LastActionItem | null;
  setLastActionItem: (item: LastActionItem | null) => void;
  cartError: string | null;
  setCartError: (msg: string | null) => void;
  isCartReady: boolean;
  cartTotal: number; // 🚀 Pre-computed total
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [lastActionItem, setLastActionItem] = useState<LastActionItem | null>(null);
  const [cartError, setCartError] = useState<string | null>(null);
  const [isCartReady, setIsCartReady] = useState(false);

  // 🚀 Memoize cart total เพื่อลด re-computation
  const cartTotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const price = typeof item.price === 'object' ? item.price.sale : item.price;
      return acc + price * item.quantity;
    }, 0);
  }, [cartItems]);

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (err) {
      console.error('💥 Failed to load cart from localStorage:', err);
    } finally {
      setIsCartReady(true);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (err) {
      console.error('💥 Failed to save cart to localStorage:', err);
    }
  }, [cartItems]);

  // 🚀 Memoize functions เพื่อลด re-renders
  const addToCart = useCallback((id: string, quantity: number = 1): void => {
    const item = allItems.find((i) => i.id === id);
    if (!item) return;

    const itemWeight = item.weight ?? 0;

    setCartItems((prev) => {
      const existing = prev.find((cartItem) => cartItem.id === id);
      const newQuantity = (existing?.quantity || 0) + quantity;

      if (newQuantity > 20) {
        setCartError('Cannot add more than 20 of this item.');
        return prev;
      }

      let updatedCart: CartItem[];

      if (existing) {
        updatedCart = prev.map((cartItem) =>
          cartItem.id === id
            ? { ...cartItem, quantity: newQuantity }
            : cartItem
        );
      } else {
        const newItem: CartItem = {
          id: item.id,
          title: item.title,
          subtitle: item.subtitle ?? '',
          price: item.price,
          image: item.image,
          quantity,
          type: item.type,
          weight: itemWeight,
        };
        updatedCart = [...prev, newItem];
      }

      setLastActionItem({
        item: {
          id: item.id,
          title: item.title,
          subtitle: item.subtitle ?? '',
          price: item.price,
          image: item.image,
          quantity,
          type: item.type,
          weight: itemWeight,
        },
        action: 'add',
      });

      return updatedCart;
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    const item = cartItems.find((item) => item.id === id);
    if (item) {
      setLastActionItem({ item, action: 'remove' });
    }
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }, [cartItems]);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem('cart');
  }, []);

  // 🚀 Memoize context value เพื่อลด re-renders
  const contextValue = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    lastActionItem,
    setLastActionItem,
    cartError,
    setCartError,
    isCartReady,
    cartTotal,
  }), [
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    lastActionItem,
    cartError,
    isCartReady,
    cartTotal,
  ]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};