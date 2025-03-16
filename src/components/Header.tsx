'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import HeaderCurrencySelector from './HeaderCurrencySelector';
import CartButton from './CartButton';
import { usePathname } from 'next/navigation';

interface HeaderProps {
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

export default function Header({ contactInfo }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  // Default contact info
  const defaultContactInfo = {
    phone: '+90 554 302 80 98',
    email: 'info@senfonimuzikaletleri.com',
    address: '19 Mayıs mh, Kemal Atatürk Cd. 26/B, 34500 Büyükçekmece/İstanbul',
    socialMedia: {
      facebook: 'https://facebook.com/senfonimuzikaletleri',
      instagram: 'https://instagram.com/senfonimuzikaletleri',
      twitter: 'https://twitter.com/senfonimuzik'
    }
  };

  const info = contactInfo || defaultContactInfo;

  // Scroll olayını dinle
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Text color class based on page and scroll state
  const getTextColorClass = () => {
    if (isHomePage) {
      return scrolled ? 'text-gray-600' : 'text-gray-200';
    }
    return 'text-gray-600';
  };

  const getHoverColorClass = () => {
    if (isHomePage) {
      return scrolled ? 'hover:text-gray-900' : 'hover:text-white';
    }
    return 'hover:text-gray-900';
  };

  return (
    <header className={`w-full fixed top-0 z-50 transition-all duration-300 ${scrolled || !isHomePage ? 'bg-white shadow-lg py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Üst Bar - Sadece büyük ekranlarda ve scroll edilmediğinde görünür */}
        {!scrolled && (
          <div className="hidden lg:flex justify-between items-center py-2 text-sm border-b border-white/20 mb-4">
            <div className="flex items-center space-x-6">
              <span className={`${getTextColorClass()} ${getHoverColorClass()} transition-colors flex items-center`}>
                <FaPhone className="mr-2 text-red-500" />
                {info.phone}
              </span>
              <span className={`${getTextColorClass()} ${getHoverColorClass()} transition-colors flex items-center`}>
                <FaEnvelope className="mr-2 text-red-500" />
                {info.email}
              </span>
              <span className={`${getTextColorClass()} ${getHoverColorClass()} transition-colors flex items-center`}>
                <FaMapMarkerAlt className="mr-2 text-red-500" />
                {info.address}
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                <Link href={info.socialMedia.facebook} className={`${getTextColorClass()} ${getHoverColorClass()} transition-colors`}>
                  <FaFacebook />
                </Link>
                <Link href={info.socialMedia.instagram} className={`${getTextColorClass()} ${getHoverColorClass()} transition-colors`}>
                  <FaInstagram />
                </Link>
                <Link href={info.socialMedia.twitter} className={`${getTextColorClass()} ${getHoverColorClass()} transition-colors`}>
                  <FaTwitter />
                </Link>
              </div>
              <HeaderCurrencySelector />
              <Link href="/hesabim" className={`${getTextColorClass()} ${getHoverColorClass()} transition-colors flex items-center`}>
                <FaUser className="mr-1" /> Hesabım
              </Link>
            </div>
          </div>
        )}
        
        {/* Ana Menü */}
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-shrink-0"
          >
            <Link href="/" className="flex items-center">
              <div className={`relative p-2 rounded-lg ${scrolled || !isHomePage ? 'bg-transparent' : 'bg-white/20 backdrop-blur-sm'} transition-all duration-300`}>
                <Image 
                  src="/logo.png" 
                  alt="Senfoni Müzik" 
                  width={150} 
                  height={50} 
                  className="h-10 w-auto transition-all"
                />
              </div>
            </Link>
          </motion.div>

          {/* Ana Navigasyon */}
          <nav className="hidden md:flex items-center justify-center flex-grow">
            <div className="flex items-center space-x-8">
              <Link href="/" className={`${getTextColorClass()} ${getHoverColorClass()} transition-colors font-medium`}>
                Ana Sayfa
              </Link>
              <Link href="/urunler" className={`${getTextColorClass()} ${getHoverColorClass()} transition-colors font-medium`}>
                Ürünler
              </Link>
              <Link href="/etkinlikler" className={`${getTextColorClass()} ${getHoverColorClass()} transition-colors font-medium`}>
                Etkinlikler
              </Link>
            </div>
          </nav>
          
          {/* Sağ Menü */}
          <div className="flex items-center space-x-4">
            <CartButton />
          </div>
        </div>
      </div>
    </header>
  );
} 