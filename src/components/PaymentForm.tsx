'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

// Cart item interface
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface PaymentFormProps {
  orderId: string;
  orderNumber: string;
  totalAmount: number;
  currency: string;
}

export default function PaymentForm({ orderId, orderNumber, totalAmount, currency }: PaymentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Ödeme işlemini başlat
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Ödeme işlemi başlatılamadı');
      }
      
      // PayTR ödeme sayfasına yönlendir
      window.location.href = data.formUrl;
      
    } catch (error) {
      console.error('Ödeme hatası:', error);
      setError(error instanceof Error ? error.message : 'Ödeme işlemi sırasında bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Ödeme Bilgileri</CardTitle>
        <CardDescription>
          Siparişinizi tamamlamak için ödeme yapın
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="font-medium">Sipariş Numarası:</span>
            <span>{orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Toplam Tutar:</span>
            <span className="font-bold">
              {formatCurrency(totalAmount, currency)}
            </span>
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
        </div>
      </CardContent>
      <div className="px-6 py-4 border-t border-gray-100">
        <Button 
          onClick={handlePayment} 
          disabled={loading} 
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                İşleniyor...
            </>
            ) : (
            'Ödeme Yap'
            )}
        </Button>
      </div>
    </Card>
  );
} 