'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle } from 'lucide-react';
import { FaSearch, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import HeaderCurrencySelector from '@/components/HeaderCurrencySelector';
import CartButton from '@/components/CartButton';

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

interface PaymentSuccessClientProps {
  paymentMethod: string | null;
  orderIdFromUrl: string | null;
  layoutSettings: LayoutSettings;
}

export default function PaymentSuccessClient({ paymentMethod, orderIdFromUrl, layoutSettings }: PaymentSuccessClientProps) {
  const [orderNumber, setOrderNumber] = useState<string>('');

  useEffect(() => {
    // URL'den gelen sipariş numarasını kullan veya rastgele oluştur
    if (orderIdFromUrl) {
      setOrderNumber(orderIdFromUrl);
    } else {
      // Rastgele sipariş numarası oluştur
      const randomOrderNumber = Math.floor(100000 + Math.random() * 900000).toString();
      setOrderNumber(randomOrderNumber);
    }
  }, [orderIdFromUrl]);

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
        facebook: 'https://facebook.com',
        instagram: 'https://instagram.com',
        twitter: 'https://twitter.com'
      }
    }
  } = layoutSettings;

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
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              {paymentMethod === 'bankTransfer' 
                ? 'Siparişiniz Alındı!' 
                : 'Ödemeniz Başarıyla Tamamlandı!'}
            </h1>
            
            <p className="text-lg text-gray-600 mb-6">
              {paymentMethod === 'bankTransfer' 
                ? 'Banka havalesi/EFT ödemeniz onaylandıktan sonra siparişiniz işleme alınacaktır.' 
                : 'Siparişiniz başarıyla oluşturuldu ve ödemeniz alındı.'}
            </p>
            
            <div className="bg-gray-50 p-4 rounded-md mb-8">
              <p className="text-gray-700 font-medium">Sipariş Numaranız:</p>
              <p className="text-xl font-bold text-red-600 mt-1">{orderNumber}</p>
            </div>
            
            {paymentMethod === 'bankTransfer' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-8 text-left">
                <h3 className="font-medium text-yellow-800 mb-2">Ödeme Bilgileri</h3>
                <p className="text-sm text-yellow-800 mb-3">
                  Lütfen aşağıdaki banka hesaplarından birine ödeme yapın ve açıklama kısmına sipariş numaranızı yazmayı unutmayın.
                </p>
                
                <div className="space-y-3">
                  <div className="p-3 bg-white border border-yellow-100 rounded-md">
                    <h4 className="font-medium text-gray-800">VakıfBank</h4>
                    <div className="mt-1 space-y-1">
                      <p className="text-sm"><span className="font-medium">IBAN:</span> TR40 0001 5001 5800 7307 4767 62</p>
                      <p className="text-sm"><span className="font-medium">Alıcı Adı:</span> Kahraman Pehlivan</p>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-white border border-yellow-100 rounded-md">
                    <h4 className="font-medium text-gray-800">QNB Finansbank</h4>
                    <div className="mt-1 space-y-1">
                      <p className="text-sm"><span className="font-medium">IBAN:</span> TR76 0011 1000 0000 0142 2737 93</p>
                      <p className="text-sm"><span className="font-medium">Alıcı Adı:</span> Kahraman Pehlivan</p>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-yellow-800 mt-3">
                  <strong>Not:</strong> Ödemeniz onaylandıktan sonra siparişiniz işleme alınacaktır. Ödeme onayı 1-2 iş günü sürebilir.
                </p>
              </div>
            )}
            
            <div className="flex flex-col md:flex-row justify-center gap-4">
              <Link 
                href="/hesabim/siparislerim" 
                className="bg-red-600 text-white py-3 px-6 rounded-md hover:bg-red-700 transition-colors duration-300"
              >
                Siparişlerimi Görüntüle
              </Link>
              <Link 
                href="/" 
                className="bg-gray-100 text-gray-800 py-3 px-6 rounded-md hover:bg-gray-200 transition-colors duration-300"
              >
                Ana Sayfaya Dön
              </Link>
            </div>
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