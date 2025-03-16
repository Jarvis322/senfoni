'use client';

import { useState, useEffect } from 'react';
import { formatCurrency } from '@/services/currencyService';
import { Currency } from '@/types/currency';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface CurrencyConverterProps {
  amount: number;
  baseCurrency?: Currency;
  showSelector?: boolean;
  className?: string;
}

export default function CurrencyConverter({
  amount,
  baseCurrency = 'TRY',
  showSelector = true,
  className = '',
}: CurrencyConverterProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(baseCurrency);
  const [convertedAmount, setConvertedAmount] = useState<number>(amount);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Döviz kurları (gerçek uygulamada API'den alınacak)
  const exchangeRates: Record<Currency, number> = {
    'TRY': 1,
    'USD': 0.03,    // 1 TRY = 0.03 USD
    'EUR': 0.028,   // 1 TRY = 0.028 EUR
  };

  // Para birimi değiştiğinde çevirme işlemi yap
  useEffect(() => {
    convertAmount(selectedCurrency);
  }, [selectedCurrency, amount]);

  // Para birimi çevirme fonksiyonu
  const convertAmount = async (currency: Currency) => {
    setIsLoading(true);
    
    try {
      // Gerçek uygulamada bu kısım API çağrısı olacak
      // const response = await fetch(`/api/currency/convert?amount=${amount}&from=${baseCurrency}&to=${currency}`);
      // const data = await response.json();
      // setConvertedAmount(data.convertedAmount);
      
      // Şimdilik basit hesaplama yapıyoruz
      if (baseCurrency === currency) {
        setConvertedAmount(amount);
      } else if (baseCurrency === 'TRY') {
        setConvertedAmount(amount * exchangeRates[currency]);
      } else if (currency === 'TRY') {
        setConvertedAmount(amount / exchangeRates[baseCurrency]);
      } else {
        // Önce TRY'ye çevir, sonra hedef para birimine
        const amountInTRY = amount / exchangeRates[baseCurrency];
        setConvertedAmount(amountInTRY * exchangeRates[currency]);
      }
    } catch (error) {
      console.error('Para birimi çevirme hatası:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Basit gösterim (sadece fiyat)
  if (!showSelector) {
    return (
      <span className={className}>
        {isLoading ? 'Yükleniyor...' : formatCurrency(convertedAmount, selectedCurrency)}
      </span>
    );
  }

  // Tam gösterim (seçici ile)
  return (
    <Card className={`w-full max-w-sm ${className}`}>
      <CardHeader>
        <CardTitle>Para Birimi Çevirici</CardTitle>
        <CardDescription>Fiyatı farklı para birimlerinde görüntüleyin</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-lg font-medium">Tutar:</span>
            <span className="text-lg">{formatCurrency(amount, baseCurrency)}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Select
              value={selectedCurrency}
              onValueChange={(value: string) => setSelectedCurrency(value as Currency)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Para Birimi Seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TRY">Türk Lirası (₺)</SelectItem>
                <SelectItem value="USD">Amerikan Doları ($)</SelectItem>
                <SelectItem value="EUR">Euro (€)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-lg font-medium">Çevrilen Tutar:</span>
            <span className="text-xl font-bold">
              {isLoading ? 'Yükleniyor...' : formatCurrency(convertedAmount, selectedCurrency)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 