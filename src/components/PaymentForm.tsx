'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';

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

interface CustomerInfo {
  email: string;
  name: string;
  phone: string;
  address: string;
}

export default function PaymentForm({ orderId, orderNumber, totalAmount, currency }: PaymentFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [retryCount, setRetryCount] = useState(0);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    email: '',
    name: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    const loadCartItems = () => {
      const cartData = localStorage.getItem('cart');
      if (cartData) {
        try {
          const items = JSON.parse(cartData);
          if (JSON.stringify(items) !== JSON.stringify(cartItems)) {
            setCartItems(items);
          }
        } catch (error) {
          console.error('Cart data parsing error:', error);
          if (!error) {
            setError('Sepet verileri yüklenirken bir hata oluştu');
            toast({
              title: 'Hata',
              description: 'Sepet verileri yüklenirken bir hata oluştu',
              variant: 'destructive'
            });
          }
        }
      }
    };

    // Eğer kullanıcı giriş yapmışsa, bilgilerini form alanlarına doldur
    if (session?.user) {
      setCustomerInfo({
        email: session.user.email || '',
        name: session.user.name || '',
        phone: session.user.phone || '',
        address: session.user.address || ''
      });
    }

    loadCartItems();
  }, [toast, cartItems, session]);
  
  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (!cartItems.length) {
        throw new Error('Sepetinizde ürün bulunmamaktadır');
      }

      // Form validasyonu
      if (!session?.user) {
        if (!customerInfo.email || !customerInfo.name || !customerInfo.phone || !customerInfo.address) {
          throw new Error('Lütfen tüm bilgileri doldurun');
        }

        // Email validasyonu
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(customerInfo.email)) {
          throw new Error('Geçerli bir email adresi girin');
        }

        // Telefon validasyonu
        const phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(customerInfo.phone.replace(/[^0-9]/g, ''))) {
          throw new Error('Geçerli bir telefon numarası girin');
        }
      }

      // Sepet tutarını doğrula
      const calculatedTotal = cartItems.reduce((sum, item) => 
        sum + (item.price * item.quantity), 0
      );
      
      if (Math.abs(calculatedTotal - totalAmount) > 0.01) {
        throw new Error('Sepet tutarı ile ödeme tutarı uyuşmuyor');
      }

      console.log('Sending payment request with:', {
        orderId,
        cartItems,
        totalAmount,
        currency,
        customerInfo: session?.user ? undefined : customerInfo
      });

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.senfonimuzikaletleri.com';
      // Ödeme işlemini başlat
      const response = await fetch(`${baseUrl}/api/payment/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          cartItems,
          totalAmount,
          currency: currency === 'TL' ? 'TRY' : currency,
          customerInfo: session?.user ? undefined : customerInfo
        }),
      });
      
      const data = await response.json();
      console.log('Payment API response:', data);
      
      if (!response.ok) {
        throw new Error(data.error || 'Ödeme işlemi başlatılamadı');
      }
      
      // PayTR ödeme sayfasına yönlendir
      if (data.formUrl) {
        window.location.href = data.formUrl;
      } else {
        throw new Error('Ödeme formu oluşturulamadı');
      }
      
    } catch (error) {
      console.error('Ödeme hatası:', error);
      
      let errorMessage = 'Ödeme işlemi sırasında bir hata oluştu';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      toast({
        title: 'Ödeme Hatası',
        description: errorMessage,
        variant: 'destructive'
      });

      // 3 deneme sonrası kullanıcıyı sepete yönlendir
      if (retryCount >= 2) {
        toast({
          title: 'Ödeme Başarısız',
          description: 'Lütfen daha sonra tekrar deneyiniz',
          variant: 'destructive'
        });
        router.push('/sepet');
        return;
      }
      
      setRetryCount(prev => prev + 1);
      
    } finally {
      setLoading(false);
    }
  };

  if (!cartItems.length) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-red-600">Sepetinizde ürün bulunmamaktadır</p>
            <Button
              onClick={() => router.push('/')}
              className="mt-4"
            >
              Alışverişe Devam Et
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

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
          {!session?.user && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-posta Adresi</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ornek@email.com"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Ad Soyad</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Ad Soyad"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefon</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="05XX XXX XX XX"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Adres</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="Teslimat adresi"
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                  required
                />
              </div>
            </div>
          )}

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

          <div className="text-sm text-gray-500">
            <p>Sipariş Detayları:</p>
            <ul className="mt-2 space-y-1">
              {cartItems.map((item) => (
                <li key={item.id} className="flex justify-between">
                  <span>{item.name} x {item.quantity}</span>
                  <span>{formatCurrency(item.price * item.quantity, currency)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
      <div className="px-6 py-4 border-t border-gray-100">
        <Button 
          onClick={handlePayment} 
          disabled={loading || !cartItems.length} 
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
        {retryCount > 0 && (
          <p className="text-sm text-gray-500 mt-2 text-center">
            Kalan deneme hakkı: {3 - retryCount}
          </p>
        )}
      </div>
    </Card>
  );
} 