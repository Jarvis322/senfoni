'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaTimesCircle, FaSearch, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
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

interface PaymentFailedClientProps {
  layoutSettings: LayoutSettings;
}

export default function PaymentFailedClient({ layoutSettings }: PaymentFailedClientProps) {
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
      
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTimesCircle className="text-red-600 text-4xl" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Ödeme Başarısız</h1>
            <p className="text-gray-600 mb-6">
              Ödeme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyiniz veya farklı bir ödeme yöntemi kullanınız.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Olası Nedenler:</h3>
              <ul className="text-left text-gray-600 space-y-1">
                <li>• Kart bilgileriniz hatalı olabilir</li>
                <li>• Kartınızda yeterli bakiye olmayabilir</li>
                <li>• Bankanız işlemi onaylamıyor olabilir</li>
                <li>• İnternet bağlantınızda sorun olabilir</li>
              </ul>
            </div>
            
            <div className="flex flex-col space-y-3">
              <Link 
                href="/odeme" 
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
              >
                Tekrar Dene
              </Link>
              <Link 
                href="/sepet" 
                className="border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-md font-medium transition-colors"
              >
                Sepete Dön
              </Link>
              <Link 
                href="/" 
                className="text-gray-600 hover:text-red-600 py-2 transition-colors"
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