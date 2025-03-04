'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Sepet öğesi tipi
export interface CartItem {
  id: string;
  name: string;
  price: number;
  discountedPrice?: number | null;
  currency: string;
  quantity: number;
  image?: string;
}

// Sepet context tipi
interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

// Context oluşturma
const CartContext = createContext<CartContextType | undefined>(undefined);

// Context provider bileşeni
export function CartProvider({ children }: { children: ReactNode }) {
  // Sepet öğelerini tutan state
  const [items, setItems] = useState<CartItem[]>([]);
  
  // Sayfa yüklendiğinde localStorage'dan sepeti yükle
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Sepet yüklenirken hata oluştu:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);
  
  // Sepet değiştiğinde localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
    
    // Sepet değiştiğinde özel bir olay tetikle
    const event = new CustomEvent('cartUpdated', { 
      detail: { 
        items,
        totalItems: items.reduce((total, item) => total + item.quantity, 0),
        totalPrice: items.reduce((total, item) => {
          const itemPrice = item.discountedPrice || item.price;
          return total + (itemPrice * item.quantity);
        }, 0)
      } 
    });
    window.dispatchEvent(event);
  }, [items]);
  
  // Sepete ürün ekleme
  const addItem = (item: CartItem) => {
    setItems(prevItems => {
      // Ürün zaten sepette var mı kontrol et
      const existingItemIndex = prevItems.findIndex(i => i.id === item.id);
      
      if (existingItemIndex !== -1) {
        // Ürün zaten sepette, miktarını artır
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + item.quantity
        };
        return updatedItems;
      } else {
        // Yeni ürün ekle
        return [...prevItems, item];
      }
    });
  };
  
  // Sepetten ürün çıkarma
  const removeItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };
  
  // Ürün miktarını güncelleme
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };
  
  // Sepeti temizleme
  const clearCart = () => {
    setItems([]);
  };
  
  // Toplam ürün sayısı
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  
  // Toplam fiyat
  const totalPrice = items.reduce((total, item) => {
    const itemPrice = item.discountedPrice || item.price;
    return total + (itemPrice * item.quantity);
  }, 0);
  
  // Context değerlerini sağla
  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice
  };
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 