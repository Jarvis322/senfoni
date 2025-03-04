'use client';

import { useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '@/contexts/CartContext';
import { useNotification } from './NotificationProvider';
import { Currency } from '@/types/currency';

interface AddToCartButtonProps {
  id: string;
  name: string;
  price: number;
  discountedPrice?: number | null;
  currency?: Currency;
  image?: string;
  quantity?: number;
  stock?: number;
  className?: string;
  showIcon?: boolean;
  fullWidth?: boolean;
  variant?: 'primary' | 'secondary';
}

export default function AddToCartButton({
  id,
  name,
  price,
  discountedPrice,
  currency = 'TRY',
  image,
  quantity = 1,
  stock = Infinity,
  className = '',
  showIcon = true,
  fullWidth = false,
  variant = 'primary',
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const { showNotification } = useNotification();
  const [isAdding, setIsAdding] = useState(false);
  const [addedQuantity, setAddedQuantity] = useState(0);
  
  // Sepete ekleme işlemi
  const handleAddToCart = () => {
    if (stock <= 0) return;
    
    setIsAdding(true);
    
    // Sepete eklenecek ürün
    const item = {
      id,
      name,
      price,
      discountedPrice,
      currency,
      quantity,
      image,
    };
    
    // Sepete ekle
    addItem(item);
    
    // Eklenen ürün sayısını güncelle
    setAddedQuantity(prev => prev + quantity);
    
    // Animasyon için kısa bir süre bekle
    setTimeout(() => {
      setIsAdding(false);
      
      // Sepete eklendi bildirimini göster
      const event = new CustomEvent('cartItemAdded', { 
        detail: { 
          item,
          message: `${name} sepete eklendi!`
        } 
      });
      window.dispatchEvent(event);
      
      // Bildirim göster
      showNotification(`${name} sepete eklendi!`, 'success');
    }, 300); // Daha hızlı bir animasyon için süreyi azalttık
  };
  
  // Buton sınıfları
  const buttonClasses = `
    ${fullWidth ? 'w-full' : ''} 
    ${variant === 'primary' 
      ? 'bg-red-600 hover:bg-red-700 text-white' 
      : 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700'
    }
    ${isAdding ? 'animate-pulse' : ''}
    transition-colors duration-300 rounded-lg flex items-center justify-center font-medium
    ${className}
  `;
  
  return (
    <button
      onClick={handleAddToCart}
      disabled={stock <= 0 || isAdding}
      className={buttonClasses}
    >
      {showIcon && <FaShoppingCart className={`${variant === 'primary' ? 'mr-2' : ''}`} />}
      {variant === 'primary' && (
        addedQuantity > 0 
          ? `Sepete Ekle (${addedQuantity} adet eklendi)`
          : 'Sepete Ekle'
      )}
    </button>
  );
} 