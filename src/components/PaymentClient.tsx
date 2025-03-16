'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import PaymentForm from '@/components/PaymentForm';
import HeaderCurrencySelector from '@/components/HeaderCurrencySelector';
import CartButton from '@/components/CartButton';
import { FaSearch, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

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
  contactInfo?: {
    phone: string;
    email: string;
    address: string;
    socialMedia: {
      facebook: string;
      instagram: string;
      twitter: string;
    };
  };
}

interface PaymentClientProps {
  layoutSettings: LayoutSettings;
}

export default function PaymentClient({ layoutSettings }: PaymentClientProps) {
  const router = useRouter();
  const [orderData, setOrderData] = useState<{
    orderId: string;
    orderNumber: string;
    totalAmount: number;
    currency: string;
  } | null>(null);

  useEffect(() => {
    let isSubscribed = true;

    const loadOrderData = () => {
      const cartData = localStorage.getItem('cart');
      const orderNumber = localStorage.getItem('lastOrderNumber');
      const orderId = localStorage.getItem('lastOrderId');
      const currency = localStorage.getItem('selectedCurrency') || 'TRY';

      if (!cartData || !orderNumber || !orderId) {
        router.push('/sepet');
        return;
      }

      try {
        const cart = JSON.parse(cartData);
        const totalAmount = cart.reduce((total: number, item: any) => total + (item.price * item.quantity), 0);

        if (isSubscribed) {
          setOrderData({
            orderId,
            orderNumber,
            totalAmount,
            currency
          });
        }
      } catch (error) {
        console.error('Cart data parsing error:', error);
        if (isSubscribed) {
          router.push('/sepet');
        }
      }
    };

    loadOrderData();

    return () => {
      isSubscribed = false;
    };
  }, [router]);

  const {
    showHeader,
    showFooter,
    showSearch,
    showCart,
    contactInfo = {
      phone: '+90 212 123 45 67',
      email: 'info@senfonimusic.com',
      address: 'İstanbul, Türkiye',
      socialMedia: {
        facebook: 'https://facebook.com/senfonimuzikaletleri',
        instagram: 'https://instagram.com/senfonimuzikaletleri',
        twitter: 'https://twitter.com/senfonimuzik'
      }
    }
  } = layoutSettings;

  if (!orderData) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-red-500"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {showHeader && (
        <header className="bg-white border-b border-gray-200 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="hidden lg:flex justify-between items-center py-2 text-sm border-b border-gray-200 mb-4">
              <div className="flex items-center space-x-6">
                <span className="text-gray-600 hover:text-gray-800 transition-colors flex items-center">
                  <FaPhone className="mr-2 text-red-500" />
                  {contactInfo.phone}
                </span>
                <span className="text-gray-600 hover:text-gray-800 transition-colors flex items-center">
                  <FaEnvelope className="mr-2 text-red-500" />
                  {contactInfo.email}
                </span>
                <span className="text-gray-600 hover:text-gray-800 transition-colors flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-red-500" />
                  {contactInfo.address}
                </span>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-4">
                  <Link href={contactInfo.socialMedia.facebook} className="text-gray-600 hover:text-gray-800 transition-colors">
                    <FaFacebook />
                  </Link>
                  <Link href={contactInfo.socialMedia.instagram} className="text-gray-600 hover:text-gray-800 transition-colors">
                    <FaInstagram />
                  </Link>
                  <Link href={contactInfo.socialMedia.twitter} className="text-gray-600 hover:text-gray-800 transition-colors">
                    <FaTwitter />
                  </Link>
                </div>
                <HeaderCurrencySelector />
                <Link href="/hesabim" className="text-gray-600 hover:text-gray-800 transition-colors flex items-center">
                  <FaUser className="mr-1" /> Hesabım
                </Link>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <Link href="/" className="flex items-center">
                <Image 
                  src="/logo.png" 
                  alt="Senfoni Müzik" 
                  width={150} 
                  height={40} 
                  className="h-10 w-auto" 
                />
              </Link>
              
              <div className="flex items-center space-x-4">
                {showSearch && (
                  <Link href="/arama" className="text-gray-600 hover:text-red-600 transition-colors">
                    <FaSearch className="text-xl" />
                  </Link>
                )}
                
                {showCart && (
                  <CartButton />
                )}
              </div>
            </div>
          </div>
        </header>
      )}
      
      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Ödeme Bilgileri</h1>
            <p className="mt-2 text-gray-600">Lütfen aşağıdaki formu doldurun ve ödemeyi tamamlayın.</p>
          </div>
          
          <PaymentForm
            orderId={orderData.orderId}
            orderNumber={orderData.orderNumber}
            totalAmount={orderData.totalAmount}
            currency={orderData.currency}
          />
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Ödemeleriniz güvenle gerçekleştirilmektedir.</p>
          <div className="mt-4 flex justify-center">
            <Image 
              src="/images/odeme-yontemleri.png" 
              alt="Ödeme Yöntemleri" 
              width={200}
              height={32}
              className="h-8 w-auto"
            />
          </div>
        </div>
      </main>
      
      {showFooter && (
        <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-600">
                &copy; {new Date().getFullYear()} Senfoni Müzik. Tüm hakları saklıdır.
              </p>
              <div className="mt-4 md:mt-0 text-sm text-gray-600">
                <Link href="/gizlilik-politikasi" className="hover:text-red-600 mr-4">Gizlilik Politikası</Link>
                <Link href="/kullanim-kosullari" className="hover:text-red-600">Kullanım Koşulları</Link>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
} 