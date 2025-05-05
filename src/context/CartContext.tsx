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
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);
  const [cartError, setCartError] = useState<string | null>(null);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (id: string, quantity: number = 1): void => {
    const item = allItems.find((i) => i.id === id);
    if (!item) return;

    setCartItems(prev => {
      const existing = prev.find(cartItem => cartItem.id === id);
      const newQuantity = (existing?.quantity || 0) + quantity;

      if (newQuantity > 20) {
        setCartError('Cannot add more than 20 of this item.');
        return prev;
      }

      if (existing) {
        return prev.map(cartItem =>
          cartItem.id === id
            ? { ...cartItem, quantity: newQuantity }
            : cartItem
        );
      } else {
        return [
          ...prev,
          {
            id: item.id,
            title: item.title,
            subtitle: item.subtitle ?? '',
            price: item.price,
            image: item.image,
            quantity,
          },
        ];
      }
    });

    setLastAddedItem({
      id: item.id,
      title: item.title,
      subtitle: item.subtitle ?? '',
      price: item.price,
      image: item.image,
      quantity,
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
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
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context)
    throw new Error('useCart must be used within a CartProvider');
  return context;
};