'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '@/contexts/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

interface CartButtonProps {
  className?: string;
}

export default function CartButton({ className = '' }: CartButtonProps) {
  const { totalItems } = useCart();
  const [isAnimating, setIsAnimating] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [prevTotalItems, setPrevTotalItems] = useState(totalItems);
  
  // Sepete ürün eklendiğinde animasyon göster
  useEffect(() => {
    const handleCartItemAdded = (event: CustomEvent) => {
      setIsAnimating(true);
      setNotification(event.detail.message);
      
      // Animasyonu kapat
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
      
      // Bildirimi kapat
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    };
    
    // Sepet güncellendiğinde
    const handleCartUpdated = (event: CustomEvent) => {
      const newTotalItems = event.detail.totalItems;
      if (newTotalItems > prevTotalItems) {
        setIsAnimating(true);
        
        // Animasyonu kapat
        setTimeout(() => {
          setIsAnimating(false);
        }, 300);
      }
      
      setPrevTotalItems(newTotalItems);
    };
    
    window.addEventListener('cartItemAdded', handleCartItemAdded as EventListener);
    window.addEventListener('cartUpdated', handleCartUpdated as EventListener);
    
    return () => {
      window.removeEventListener('cartItemAdded', handleCartItemAdded as EventListener);
      window.removeEventListener('cartUpdated', handleCartUpdated as EventListener);
    };
  }, [prevTotalItems]);
  
  // totalItems değiştiğinde animasyon göster
  useEffect(() => {
    if (totalItems > prevTotalItems) {
      setIsAnimating(true);
      
      // Animasyonu kapat
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }
    
    setPrevTotalItems(totalItems);
  }, [totalItems, prevTotalItems]);
  
  return (
    <div className="relative">
      <Link 
        href="/sepet" 
        className={`relative flex items-center text-gray-700 hover:text-red-600 transition-colors ${className}`}
      >
        <motion.div
          animate={isAnimating ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <FaShoppingCart className="text-xl" />
          <AnimatePresence>
            {totalItems > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
              >
                {totalItems > 99 ? '99+' : totalItems}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </Link>
      
      {/* Bildirim */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 10, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -10, x: '-50%' }}
            className="absolute left-1/2 top-full mt-2 bg-green-100 text-green-800 text-sm py-1 px-3 rounded-full whitespace-nowrap z-50"
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 