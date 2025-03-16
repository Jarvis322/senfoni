'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Order } from '@/lib/orderStorage';

interface LayoutSettings {
  showHeader: boolean;
  showFooter: boolean;
  showSearch: boolean;
  showCart: boolean;
  logoUrl?: string;
  companyName?: string;
  contactEmail?: string;
  contactPhone?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
}

interface OrderDetailClientProps {
  layoutSettings: LayoutSettings;
  orderId: string;
}

export default function OrderDetailClient({ layoutSettings, orderId }: OrderDetailClientProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/orders/${orderId}`);
        const data = await response.json();
        
        if (data.success) {
          setOrder(data.order);
        } else {
          setError(data.error || 'Sipariş detayları yüklenirken bir hata oluştu.');
        }
      } catch (error) {
        console.error('Sipariş detayları yüklenirken hata:', error);
        setError('Sipariş detayları yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetail();
    }
  }, [orderId]);

  // Sipariş durumunu Türkçe'ye çevir
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending_payment':
        return 'Ödeme Bekleniyor';
      case 'processing':
        return 'İşleniyor';
      case 'shipped':
        return 'Kargoya Verildi';
      case 'delivered':
        return 'Teslim Edildi';
      case 'cancelled':
        return 'İptal Edildi';
      default:
        return status;
    }
  };

  // Sipariş durumuna göre renk sınıfı
  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'pending_payment':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Ödeme yöntemini Türkçe'ye çevir
  const getPaymentMethodText = (method: string) => {
    switch (method) {
      case 'creditCard':
        return 'Kredi Kartı';
      case 'bankTransfer':
        return 'Banka Havalesi/EFT';
      default:
        return method;
    }
  };

  // Tarihi formatla
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
        <p>{error}</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-md">
        <p>Sipariş bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Sipariş Detayları</h1>
        <Link 
          href="/hesabim/siparislerim" 
          className="text-red-600 hover:text-red-800 font-medium"
        >
          &larr; Siparişlerime Dön
        </Link>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-md overflow-hidden mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Sipariş #{order.orderId}</h2>
              <p className="text-gray-600 mt-1">Tarih: {formatDate(order.createdAt)}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${getStatusColorClass(order.status)}`}>
                {getStatusText(order.status)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-md font-semibold text-gray-800 mb-4">Müşteri Bilgileri</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Ad Soyad</p>
              <p className="text-gray-800">{order.customerName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">E-posta</p>
              <p className="text-gray-800">{order.customerEmail}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Telefon</p>
              <p className="text-gray-800">{order.customerPhone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Adres</p>
              <p className="text-gray-800">{order.shippingAddress}, {order.city} {order.zipCode}</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-md font-semibold text-gray-800 mb-4">Ödeme Bilgileri</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Ödeme Yöntemi</p>
              <p className="text-gray-800">{getPaymentMethodText(order.paymentMethod)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Ödeme Durumu</p>
              <p className="text-gray-800">
                {order.paymentStatus === 'pending' ? 'Bekliyor' : 
                 order.paymentStatus === 'completed' ? 'Tamamlandı' : 
                 order.paymentStatus === 'failed' ? 'Başarısız' : order.paymentStatus}
              </p>
            </div>
          </div>
          
          {order.paymentMethod === 'bankTransfer' && order.paymentStatus === 'pending' && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <h4 className="font-medium text-yellow-800 mb-2">Banka Havalesi / EFT Bilgileri</h4>
              <p className="text-sm text-yellow-800 mb-3">
                Lütfen aşağıdaki banka hesaplarından birine ödeme yapın ve açıklama kısmına sipariş numaranızı yazmayı unutmayın.
              </p>
              
              <div className="space-y-3">
                <div className="p-3 bg-white border border-yellow-100 rounded-md">
                  <h5 className="font-medium text-gray-800">VakıfBank</h5>
                  <div className="mt-1 space-y-1">
                    <p className="text-sm"><span className="font-medium">IBAN:</span> TR40 0001 5001 5800 7307 4767 62</p>
                    <p className="text-sm"><span className="font-medium">Alıcı Adı:</span> Kahraman Pehlivan</p>
                  </div>
                </div>
                
                <div className="p-3 bg-white border border-yellow-100 rounded-md">
                  <h5 className="font-medium text-gray-800">QNB Finansbank</h5>
                  <div className="mt-1 space-y-1">
                    <p className="text-sm"><span className="font-medium">IBAN:</span> TR76 0011 1000 0000 0142 2737 93</p>
                    <p className="text-sm"><span className="font-medium">Alıcı Adı:</span> Kahraman Pehlivan</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-6">
          <h3 className="text-md font-semibold text-gray-800 mb-4">Sipariş Ürünleri</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-2 px-4 text-left text-sm font-medium text-gray-700 border-b">Ürün</th>
                  <th className="py-2 px-4 text-right text-sm font-medium text-gray-700 border-b">Fiyat</th>
                  <th className="py-2 px-4 text-right text-sm font-medium text-gray-700 border-b">Adet</th>
                  <th className="py-2 px-4 text-right text-sm font-medium text-gray-700 border-b">Toplam</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-3 px-4 text-sm text-gray-700">{item.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-700 text-right">{item.price.toFixed(2)} TL</td>
                    <td className="py-3 px-4 text-sm text-gray-700 text-right">{item.quantity}</td>
                    <td className="py-3 px-4 text-sm text-gray-700 text-right">{(item.price * item.quantity).toFixed(2)} TL</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50">
                  <td colSpan={3} className="py-3 px-4 text-sm font-medium text-gray-700 text-right">Toplam</td>
                  <td className="py-3 px-4 text-sm font-bold text-gray-800 text-right">{order.totalAmount.toFixed(2)} TL</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 