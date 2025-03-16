'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Order } from '@/lib/orderStorage';

interface OrderListProps {
  userEmail: string;
}

export default function OrderList({ userEmail }: OrderListProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/orders?email=${encodeURIComponent(userEmail)}`);
        const data = await response.json();
        
        if (data.success) {
          setOrders(data.orders);
        } else {
          setError(data.error || 'Siparişler yüklenirken bir hata oluştu.');
        }
      } catch (error) {
        console.error('Siparişler yüklenirken hata:', error);
        setError('Siparişler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) {
      fetchOrders();
    }
  }, [userEmail]);

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

  if (orders.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 p-6 rounded-md text-center">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Henüz Siparişiniz Bulunmuyor</h3>
        <p className="text-gray-600 mb-4">Ürünlerimize göz atarak alışverişe başlayabilirsiniz.</p>
        <Link 
          href="/urunler" 
          className="inline-block bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
        >
          Ürünlere Göz At
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Siparişlerim</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-md">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 border-b">Sipariş No</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 border-b">Tarih</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 border-b">Tutar</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 border-b">Ödeme Yöntemi</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 border-b">Durum</th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 border-b">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 text-sm text-gray-700">{order.orderId}</td>
                <td className="py-3 px-4 text-sm text-gray-700">{formatDate(order.createdAt)}</td>
                <td className="py-3 px-4 text-sm text-gray-700">{order.totalAmount.toFixed(2)} TL</td>
                <td className="py-3 px-4 text-sm text-gray-700">{getPaymentMethodText(order.paymentMethod)}</td>
                <td className="py-3 px-4">
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColorClass(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <Link 
                    href={`/hesabim/siparislerim/${order.orderId}`}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Detaylar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 