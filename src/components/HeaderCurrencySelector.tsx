'use client';

import { useState, useEffect, useRef } from 'react';
import { Currency } from '@/types/currency';
import { motion } from 'framer-motion';

interface HeaderCurrencySelectorProps {
  className?: string;
}

export default function HeaderCurrencySelector({ className = '' }: HeaderCurrencySelectorProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('TRY');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Para birimi değiştiğinde localStorage'a kaydet ve event yayınla
  useEffect(() => {
    try {
      localStorage.setItem('preferredCurrency', selectedCurrency);
      // Sayfayı yenileme olmadan para birimi değişikliğini uygulamak için
      // bir event yayınlayabiliriz, diğer bileşenler dinleyebilir
      window.dispatchEvent(new CustomEvent('currencyChange', { 
        detail: { currency: selectedCurrency } 
      }));
      console.log('Para birimi değiştirildi:', selectedCurrency);
    } catch (error) {
      console.error('Para birimi değiştirilirken hata oluştu:', error);
    }
  }, [selectedCurrency]);
  
  // Sayfa yüklendiğinde localStorage'dan tercih edilen para birimini al
  useEffect(() => {
    try {
      const savedCurrency = localStorage.getItem('preferredCurrency') as Currency | null;
      if (savedCurrency && ['TRY', 'USD', 'EUR'].includes(savedCurrency)) {
        setSelectedCurrency(savedCurrency);
        console.log('Kaydedilmiş para birimi yüklendi:', savedCurrency);
      }
    } catch (error) {
      console.error('Kaydedilmiş para birimi yüklenirken hata oluştu:', error);
    }
  }, []);

  // Dışarı tıklandığında dropdown'ı kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const currencies = [
    { value: 'TRY', symbol: '₺', label: 'TRY' },
    { value: 'USD', symbol: '$', label: 'USD' },
    { value: 'EUR', symbol: '€', label: 'EUR' },
  ];

  const getCurrencySymbol = (currency: Currency) => {
    const found = currencies.find(c => c.value === currency);
    return found ? found.symbol : '';
  };
  
  const handleCurrencyChange = (currency: Currency) => {
    setSelectedCurrency(currency);
    setIsOpen(false);
  };
  
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`flex items-center px-3 py-1 rounded-full transition-all duration-300 ${
          isOpen 
            ? 'bg-red-500 text-white' 
            : 'bg-white/10 backdrop-blur-sm text-gray-200 hover:bg-white/20'
        }`}
      >
        <span className="font-medium">{getCurrencySymbol(selectedCurrency)}</span>
        <span className="ml-1 text-sm">{selectedCurrency}</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`h-4 w-4 ml-1 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.button>
      
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 mt-2 w-24 bg-white rounded-lg shadow-xl z-50 overflow-hidden"
        >
          {currencies.map((currency) => (
            <motion.button
              key={currency.value}
              whileHover={{ backgroundColor: '#f3f4f6' }}
              onClick={(e) => {
                e.stopPropagation();
                handleCurrencyChange(currency.value as Currency);
              }}
              className={`w-full px-4 py-2 text-left text-sm flex items-center justify-between ${
                selectedCurrency === currency.value ? 'bg-red-50 text-red-600 font-medium' : 'text-gray-700'
              }`}
            >
              <span>{currency.symbol}</span>
              <span>{currency.label}</span>
              {selectedCurrency === currency.value && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-2 h-2 rounded-full bg-red-500"
                />
              )}
            </motion.button>
          ))}
        </motion.div>
      )}
    </div>
  );
} 