'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaTrash, FaArrowLeft, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '@/contexts/CartContext';
import ProductPrice from './ProductPrice';
import { formatCurrency } from '@/services/currencyService';

interface CartClientProps {
  layoutSettings: any;
}

export default function CartClient({ layoutSettings }: CartClientProps) {
  const { items, removeItem, updateQuantity, totalItems, totalPrice } = useCart();
  const [couponCode, setCouponCode] = useState('');
  
  // Kupon kodu uygulandı mı?
  const [couponApplied, setCouponApplied] = useState(false);
  
  // İndirim miktarı (gerçek uygulamada API'den alınacak)
  const discountAmount = couponApplied ? totalPrice * 0.1 : 0; // %10 indirim
  
  // Toplam ödenecek tutar
  const finalTotal = totalPrice - discountAmount;
  
  // Kupon kodu uygulama
  const handleApplyCoupon = () => {
    if (couponCode.trim() === 'SENFONI10') {
      setCouponApplied(true);
    } else {
      alert('Geçersiz kupon kodu!');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Image 
                  src="/logo.png" 
                  alt="Senfoni Müzik" 
                  width={150} 
                  height={50} 
                  className="h-10 w-auto"
                />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Alışveriş Sepeti</h1>
          <Link 
            href="/" 
            className="text-red-600 hover:text-red-700 flex items-center text-sm font-medium"
          >
            <FaArrowLeft className="mr-2" />
            Alışverişe Devam Et
          </Link>
        </div>
        
        {items.length === 0 ? (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-6 text-gray-300">
                <FaShoppingCart className="w-full h-full" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Sepetiniz Boş</h2>
              <p className="text-gray-500 mb-6">Sepetinizde henüz ürün bulunmamaktadır.</p>
              <Link 
                href="/" 
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Alışverişe Başla
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sepet Ürünleri */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="border-b border-gray-200 pb-4 mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Sepet Ürünleri ({totalItems})</h2>
                  </div>
                  
                  <div className="space-y-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex flex-col sm:flex-row border-b border-gray-200 pb-6">
                        <div className="sm:w-24 sm:h-24 h-40 w-full mb-4 sm:mb-0 relative bg-gray-100 rounded-md overflow-hidden">
                          {item.image ? (
                            <Image 
                              src={item.image} 
                              alt={item.name} 
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <FaShoppingCart className="w-8 h-8" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 sm:ml-6 flex flex-col">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="text-base font-medium text-gray-900">
                                <Link href={`/urun/${item.id}`} className="hover:text-red-600">
                                  {item.name}
                                </Link>
                              </h3>
                              <div className="mt-1">
                                <ProductPrice 
                                  price={item.price}
                                  discountedPrice={item.discountedPrice}
                                  currency={item.currency as any}
                                  size="sm"
                                />
                              </div>
                            </div>
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="text-gray-400 hover:text-red-600"
                            >
                              <FaTrash />
                            </button>
                          </div>
                          
                          <div className="mt-auto pt-4 flex items-center justify-between">
                            <div className="flex items-center border border-gray-300 rounded-md">
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                              >
                                -
                              </button>
                              <input 
                                type="text" 
                                value={item.quantity} 
                                readOnly 
                                className="w-12 text-center border-x border-gray-300" 
                              />
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                              >
                                +
                              </button>
                            </div>
                            
                            <div className="text-right">
                              <span className="text-gray-700 font-medium">
                                {formatCurrency((item.discountedPrice || item.price) * item.quantity, item.currency as any)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sipariş Özeti */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Sipariş Özeti</h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ara Toplam</span>
                      <span className="text-gray-900 font-medium">{formatCurrency(totalPrice, 'TRY')}</span>
                    </div>
                    
                    {couponApplied && (
                      <div className="flex justify-between text-green-600">
                        <span>İndirim (SENFONI10)</span>
                        <span>-{formatCurrency(discountAmount, 'TRY')}</span>
                      </div>
                    )}
                    
                    <div className="pt-4 border-t border-gray-200 flex justify-between font-semibold">
                      <span className="text-gray-900">Toplam</span>
                      <span className="text-red-600 text-xl">{formatCurrency(finalTotal, 'TRY')}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <div className="mb-4">
                      <label htmlFor="coupon" className="block text-sm font-medium text-gray-700 mb-1">
                        İndirim Kuponu
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          id="coupon"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Kupon kodunuzu girin"
                          className="flex-1 min-w-0 block w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                          disabled={couponApplied}
                        />
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          disabled={couponApplied || !couponCode.trim()}
                        >
                          Uygula
                        </button>
                      </div>
                      {couponApplied && (
                        <p className="mt-1 text-sm text-green-600">
                          %10 indirim uygulandı!
                        </p>
                      )}
                    </div>
                    
                    <Link
                      href="/odeme"
                      className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Ödemeye Geç
                    </Link>
                    
                    <div className="mt-4 text-center">
                      <p className="text-xs text-gray-500">
                        Ödemeye geçerek <Link href="/kullanim-kosullari" className="text-red-600 hover:underline">Kullanım Koşullarını</Link> kabul etmiş olursunuz.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-white shadow-md rounded-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-sm font-semibold text-gray-900 mb-4">Ödeme Yöntemleri</h2>
                  <div className="flex flex-wrap gap-2">
                    <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-800 font-medium">VISA</span>
                    </div>
                    <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-800 font-medium">MC</span>
                    </div>
                    <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-800 font-medium">AMEX</span>
                    </div>
                    <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-xs text-gray-800 font-medium">PayTR</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="mt-8 md:mt-0">
              <p className="text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Senfoni Müzik. Tüm hakları saklıdır.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 