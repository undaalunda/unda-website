//CartContext.tsx - Performance Beast Mode 🚀

'use client';

import { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { productById } from '@/components/allItems'; // 🚀 ใช้ Map lookup แทน array.find

export type CartItem = {
  id: string;
  title: string;
  subtitle: string;
  price: number | { original: number; sale: number };
  image: string;
  quantity: number;
  type: 'digital' | 'physical';
  weight: number;
  size?: string;  // ← เพิ่มบรรทัดนี้
};

export type LastActionItem = {
  item: CartItem;
  action: 'add' | 'remove';
};

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (id: string, quantity?: number, size?: string) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  lastActionItem: LastActionItem | null;
  setLastActionItem: (item: LastActionItem | null) => void;
  cartError: string | null;
  setCartError: (msg: string | null) => void;
  isCartReady: boolean;
  cartTotal: number;
  cartCount: number; // 🚀 เพิ่ม item count
  hasPhysicalItems: boolean; // 🚀 เพิ่มเช็ค shipping
  hasDigitalItems: boolean; // 🚀 เพิ่มเช็ค digital
  totalWeight: number; // 🚀 เพิ่มน้ำหนักรวม
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [lastActionItem, setLastActionItem] = useState<LastActionItem | null>(null);
  const [cartError, setCartError] = useState<string | null>(null);
  const [isCartReady, setIsCartReady] = useState(false);
  
  // 🚀 useRef to prevent unnecessary localStorage writes
  const cartItemsRef = useRef<CartItem[]>([]);

  // 🚀 Optimized computed values - calculate once, use everywhere!
  const computedCartData = useMemo(() => {
    let total = 0;
    let count = 0;
    let weight = 0;
    let hasPhysical = false;
    let hasDigital = false;

    cartItems.forEach(item => {
      const price = typeof item.price === 'object' ? item.price.sale : item.price;
      total += price * item.quantity;
      count += item.quantity;
      weight += item.weight * item.quantity;
      
      if (item.type === 'physical') hasPhysical = true;
      if (item.type === 'digital') hasDigital = true;
    });

    return {
      cartTotal: total,
      cartCount: count,
      totalWeight: weight,
      hasPhysicalItems: hasPhysical,
      hasDigitalItems: hasDigital
    };
  }, [cartItems]);

  // 🚀 Optimized localStorage loading with error boundary
  useEffect(() => {
    const loadCart = async () => {
      try {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
          const parsedCart = JSON.parse(storedCart);
          // 🔧 Validate cart data structure
          if (Array.isArray(parsedCart)) {
            setCartItems(parsedCart);
            cartItemsRef.current = parsedCart;
          }
        }
      } catch (err) {
        console.error('💥 Failed to load cart from localStorage:', err);
        // 🚨 Clear corrupted data
        localStorage.removeItem('cart');
      } finally {
        setIsCartReady(true);
      }
    };

    loadCart();
  }, []);

  // 🚀 Debounced localStorage save - ลด disk writes
  useEffect(() => {
    if (!isCartReady) return;
    
    // 🎯 Only save if cart actually changed
    if (JSON.stringify(cartItems) === JSON.stringify(cartItemsRef.current)) {
      return;
    }

    const saveTimer = setTimeout(() => {
      try {
        localStorage.setItem('cart', JSON.stringify(cartItems));
        cartItemsRef.current = cartItems;
      } catch (err) {
        console.error('💥 Failed to save cart to localStorage:', err);
        setCartError('Failed to save cart. Please try again.');
      }
    }, 300); // 🚀 300ms debounce

    return () => clearTimeout(saveTimer);
  }, [cartItems, isCartReady]);

  // 🚀 Super optimized addToCart with Map lookup
  const addToCart = useCallback((id: string, quantity: number = 1, size?: string): void => {
    // 🎯 O(1) lookup instead of O(n) find
    const item = productById.get(id);
    if (!item) {
      setCartError('Product not found.');
      return;
    }

    const itemWeight = item.weight ?? 0;

    setCartItems((prev) => {
      // 🚀 Use Map for O(1) lookup in cart too
      // ✅ ถ้ามี size ให้เช็คทั้ง id + size
const cartKey = size ? `${id}-${size}` : id;
const cartMap = new Map(prev.map(item => {
  const key = item.size ? `${item.id}-${item.size}` : item.id;
  return [key, item];
}));
const existing = cartMap.get(cartKey);
      const newQuantity = (existing?.quantity || 0) + quantity;

      // 🚨 Quantity validation
      if (newQuantity > 20) {
        setCartError('Cannot add more than 20 of this item.');
        return prev;
      }

      // 🚀 Clear previous errors
      setCartError(null);

      let updatedCart: CartItem[];

      if (existing) {
        // 🎯 Update existing item
        updatedCart = prev.map((cartItem) =>
          cartItem.id === id
            ? { ...cartItem, quantity: newQuantity }
            : cartItem
        );
      } else {
        // 🎯 Add new item
        const newItem: CartItem = {
  id: item.id,
  title: item.title,
  subtitle: size ? `${item.subtitle ?? ''} - Size ${size}` : (item.subtitle ?? ''),  // ← เพิ่ม size ใน subtitle
  price: item.price,
  image: item.image,
  quantity,
  type: item.type,
  weight: itemWeight,
  size,  // ← เพิ่ม
};
        updatedCart = [...prev, newItem];
      }

      setLastActionItem({
  item: {
    id: item.id,
    title: item.title,
    subtitle: size ? `${item.subtitle ?? ''} - Size ${size}` : (item.subtitle ?? ''),  // ← เพิ่ม size
    price: item.price,
    image: item.image,
    quantity,
    type: item.type,
    weight: itemWeight,
    size,  // ← เพิ่ม
  },
  action: 'add',
});

      return updatedCart;
    });
  }, []);

  // 🚀 Optimized removeFromCart
  const removeFromCart = useCallback((id: string) => {
    setCartItems((prev) => {
      const item = prev.find((item) => item.id === id);
      if (item) {
        setLastActionItem({ item, action: 'remove' });
      }
      return prev.filter((item) => item.id !== id);
    });
    setCartError(null);
  }, []);

  // 🚀 Optimized updateQuantity with validation
  const updateQuantity = useCallback((id: string, quantity: number) => {
    const validatedQuantity = Math.max(1, Math.min(20, quantity));
    
    if (quantity > 20) {
      setCartError('Maximum 20 items per product.');
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: validatedQuantity }
          : item
      )
    );
    setCartError(null);
  }, []);

  // 🚀 Optimized clearCart
  const clearCart = useCallback(() => {
    setCartItems([]);
    setLastActionItem(null);
    setCartError(null);
    
    // 🎯 Immediate localStorage clear
    try {
      localStorage.removeItem('cart');
      cartItemsRef.current = [];
    } catch (err) {
      console.error('💥 Failed to clear cart from localStorage:', err);
    }
  }, []);

  // 🚀 Auto-clear cart error after 5 seconds
  useEffect(() => {
    if (cartError) {
      const timer = setTimeout(() => setCartError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [cartError]);

  // 🚀 Stable context value - dependencies in exact order
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
    ...computedCartData, // 🎯 Spread all computed values
  }), [
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    lastActionItem,
    cartError,
    isCartReady,
    computedCartData,
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

// 🚀 BONUS: Custom hooks for specific cart operations
export const useCartTotal = () => {
  const { cartTotal } = useCart();
  return cartTotal;
};

export const useCartCount = () => {
  const { cartCount } = useCart();
  return cartCount;
};

export const useCartValidation = () => {
  const { hasPhysicalItems, hasDigitalItems, totalWeight } = useCart();
  return { hasPhysicalItems, hasDigitalItems, totalWeight };
};