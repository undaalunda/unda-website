//CartContext.tsx

'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { allItems } from '@/components/allItems';

type CartItem = {
  id: string;
  title: string;
  subtitle: string;
  price: number | { original: number; sale: number };
  image: string;
  quantity: number;
  type: 'digital' | 'physical';
  weight: number; // ✅ เพิ่มน้ำหนักเข้ามา
};

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (id: string, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  lastAddedItem: CartItem | null;
  setLastAddedItem: (item: CartItem | null) => void;
  cartError: string | null;
  setCartError: (msg: string | null) => void;
  isCartReady: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);
  const [cartError, setCartError] = useState<string | null>(null);
  const [isCartReady, setIsCartReady] = useState(false);

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

  const addToCart = (id: string, quantity: number = 1): void => {
    const item = allItems.find((i) => i.id === id);
    if (!item) return;

    const itemWeight = item.weight ?? 0; // ✅ กำหนดน้ำหนักไว้ด้วย

    setCartItems((prev) => {
      const existing = prev.find((cartItem) => cartItem.id === id);
      const newQuantity = (existing?.quantity || 0) + quantity;

      if (newQuantity > 20) {
        setCartError('Cannot add more than 20 of this item.');
        return prev;
      }

      if (existing) {
        return prev.map((cartItem) =>
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
          weight: itemWeight, // ✅ เพิ่มน้ำหนัก
        };

        return [...prev, newItem];
      }
    });

    setLastAddedItem({
      id: item.id,
      title: item.title,
      subtitle: item.subtitle ?? '',
      price: item.price,
      image: item.image,
      quantity,
      type: item.type,
      weight: itemWeight, // ✅ เพิ่มน้ำหนัก
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        lastAddedItem,
        setLastAddedItem,
        cartError,
        setCartError,
        isCartReady,
      }}
    >
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
