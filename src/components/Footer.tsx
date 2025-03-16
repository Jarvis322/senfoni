'use client';

import Link from 'next/link';
import { FaFacebook, FaInstagram, FaTwitter, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

interface FooterProps {
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

export default function Footer({ contactInfo }: FooterProps) {
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

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Hakkımızda */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hakkımızda</h3>
            <p className="text-gray-600 text-sm">
              Senfoni Müzik, 20 yılı aşkın tecrübesiyle müzik tutkunlarına en kaliteli müzik aletlerini ve ekipmanlarını sunmaktadır.
            </p>
          </div>

          {/* İletişim Bilgileri */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">İletişim</h3>
            <div className="space-y-2">
              <p className="text-gray-600 text-sm flex items-center">
                <FaPhone className="mr-2 text-red-500" />
                {info.phone}
              </p>
              <p className="text-gray-600 text-sm flex items-center">
                <FaEnvelope className="mr-2 text-red-500" />
                {info.email}
              </p>
              <p className="text-gray-600 text-sm flex items-center">
                <FaMapMarkerAlt className="mr-2 text-red-500" />
                {info.address}
              </p>
            </div>
          </div>

          {/* Hızlı Linkler */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hızlı Linkler</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/hakkimizda" className="text-gray-600 hover:text-red-500 text-sm transition-colors">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="text-gray-600 hover:text-red-500 text-sm transition-colors">
                  İletişim
                </Link>
              </li>
              <li>
                <Link href="/gizlilik-politikasi" className="text-gray-600 hover:text-red-500 text-sm transition-colors">
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link href="/kullanim-kosullari" className="text-gray-600 hover:text-red-500 text-sm transition-colors">
                  Kullanım Koşulları
                </Link>
              </li>
            </ul>
          </div>

          {/* Sosyal Medya */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bizi Takip Edin</h3>
            <div className="flex space-x-4">
              <Link href={info.socialMedia.facebook} className="text-gray-600 hover:text-red-500 transition-colors">
                <FaFacebook size={24} />
              </Link>
              <Link href={info.socialMedia.instagram} className="text-gray-600 hover:text-red-500 transition-colors">
                <FaInstagram size={24} />
              </Link>
              <Link href={info.socialMedia.twitter} className="text-gray-600 hover:text-red-500 transition-colors">
                <FaTwitter size={24} />
              </Link>
            </div>
          </div>
        </div>

        {/* Alt Footer */}
        <div className="border-t border-gray-200 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} Senfoni Müzik. Tüm hakları saklıdır.
            </p>
            <div className="mt-4 md:mt-0">
              <img 
                src="/images/odeme-yontemleri.png" 
                alt="Ödeme Yöntemleri" 
                className="h-8 w-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 