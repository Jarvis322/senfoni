'use client';

import { useState, useEffect } from 'react';
import { Currency } from '@/types/currency';
import { formatCurrency } from '@/services/currencyService';

interface ProductPriceProps {
  price: number;
  discountedPrice?: number | null;
  currency?: Currency;
  showConverter?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function ProductPrice({
  price,
  discountedPrice,
  currency = 'TRY',
  showConverter = false,
  size = 'md',
  className = '',
}: ProductPriceProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currency);
  
  // Sayfa yüklendiğinde localStorage'dan tercih edilen para birimini al
  useEffect(() => {
    const savedCurrency = localStorage.getItem('preferredCurrency') as Currency | null;
    if (savedCurrency && ['TRY', 'USD', 'EUR'].includes(savedCurrency)) {
      setSelectedCurrency(savedCurrency);
    }
  }, []);
  
  // Global para birimi değişikliklerini dinle
  useEffect(() => {
    const handleCurrencyChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ currency: Currency }>;
      setSelectedCurrency(customEvent.detail.currency);
    };
    
    window.addEventListener('currencyChange', handleCurrencyChange as EventListener);
    
    return () => {
      window.removeEventListener('currencyChange', handleCurrencyChange as EventListener);
    };
  }, []);
  
  // Döviz kurları (gerçek uygulamada API'den alınacak)
  const exchangeRates: Record<Currency, number> = {
    'TRY': 1,
    'USD': 0.03,    // 1 TRY = 0.03 USD
    'EUR': 0.028,   // 1 TRY = 0.028 EUR
  };
  
  // Para birimi çevirme fonksiyonu
  const convertPrice = (amount: number, from: Currency, to: Currency): number => {
    if (from === to) return amount;
    
    if (from === 'TRY') {
      return amount * exchangeRates[to];
    } else if (to === 'TRY') {
      return amount / exchangeRates[from];
    } else {
      // Önce TRY'ye çevir, sonra hedef para birimine
      const amountInTRY = amount / exchangeRates[from];
      return amountInTRY * exchangeRates[to];
    }
  };
  
  // Fiyatı seçilen para birimine çevir
  const convertedPrice = convertPrice(price, currency, selectedCurrency);
  const convertedDiscountedPrice = discountedPrice 
    ? convertPrice(discountedPrice, currency, selectedCurrency) 
    : null;
  
  // İndirim yüzdesi hesapla
  const discountPercentage = discountedPrice && price > 0
    ? Math.round(((price - discountedPrice) / price) * 100)
    : null;
  
  // Boyut sınıflarını belirle
  const sizeClasses = {
    sm: {
      container: 'text-sm',
      price: 'text-sm',
      discounted: 'text-xs',
      discount: 'text-xs px-1',
    },
    md: {
      container: 'text-base',
      price: 'text-lg',
      discounted: 'text-sm',
      discount: 'text-xs px-1.5',
    },
    lg: {
      container: 'text-lg',
      price: 'text-2xl',
      discounted: 'text-base',
      discount: 'text-sm px-2',
    },
  };
  
  // Para birimi değiştiğinde localStorage'a kaydet
  const handleCurrencyChange = (currency: Currency) => {
    setSelectedCurrency(currency);
    localStorage.setItem('preferredCurrency', currency);
    // Diğer bileşenlere bildir
    window.dispatchEvent(new CustomEvent('currencyChange', { 
      detail: { currency } 
    }));
  };
  
  return (
    <div className={`${className} ${sizeClasses[size].container}`}>
      <div className="flex flex-wrap items-center gap-2">
        {/* İndirimli fiyat varsa */}
        {convertedDiscountedPrice ? (
          <>
            <span className={`font-bold ${sizeClasses[size].price}`}>
              {formatCurrency(convertedDiscountedPrice, selectedCurrency)}
            </span>
            <span className={`line-through text-muted-foreground ${sizeClasses[size].discounted}`}>
              {formatCurrency(convertedPrice, selectedCurrency)}
            </span>
            {discountPercentage && (
              <span className={`bg-red-100 text-red-800 rounded-full ${sizeClasses[size].discount}`}>
                %{discountPercentage}
              </span>
            )}
          </>
        ) : (
          // Normal fiyat
          <span className={`font-bold ${sizeClasses[size].price}`}>
            {formatCurrency(convertedPrice, selectedCurrency)}
          </span>
        )}
        
        {/* Para birimi dönüştürücü */}
        {showConverter && (
          <div className="ml-auto mt-2 w-full md:w-auto md:mt-0">
            <div className="flex items-center justify-between md:justify-end">
              <label htmlFor="currency-select" className="block mr-2 text-sm font-medium text-gray-700">
                Para Birimi:
              </label>
              <select
                id="currency-select"
                value={selectedCurrency}
                onChange={(e) => handleCurrencyChange(e.target.value as Currency)}
                className="block w-24 py-1 px-2 text-sm border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              >
                <option value="TRY">₺ TRY</option>
                <option value="USD">$ USD</option>
                <option value="EUR">€ EUR</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 