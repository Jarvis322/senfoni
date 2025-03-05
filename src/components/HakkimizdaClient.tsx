"use client";

import React from "react";
import { LayoutSettings } from "@/services/layoutService";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

interface HakkimizdaClientProps {
  layoutSettings: LayoutSettings;
}

const HakkimizdaClient: React.FC<HakkimizdaClientProps> = ({
  layoutSettings,
}) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[50vh] bg-gradient-to-r from-blue-900 to-indigo-800">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Hakkımızda</h1>
            <p className="text-xl text-white max-w-3xl mx-auto">
              Müzik tutkunlarına en kaliteli enstrümanları ve hizmeti sunmak için buradayız.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Hikayemiz</h2>
            <p className="text-gray-600 mb-4">
              Senfoni, 2010 yılında müzik tutkunları tarafından kurulmuş bir müzik enstrümanları ve ekipmanları mağazasıdır. Kurulduğumuz günden bu yana, müziğe olan tutkumuzu müşterilerimizle paylaşmak ve onlara en kaliteli ürünleri sunmak için çalışıyoruz.
            </p>
            <p className="text-gray-600 mb-4">
              Yıllar içinde, müzik dünyasındaki en son trendleri ve teknolojileri takip ederek, ürün yelpazemizi sürekli genişlettik ve müşterilerimize en iyi hizmeti sunmak için kendimizi geliştirdik.
            </p>
            <p className="text-gray-600">
              Bugün, Türkiye'nin önde gelen müzik enstrümanları mağazalarından biri olarak, hem profesyonel müzisyenlere hem de müziğe yeni başlayanlara hizmet veriyoruz.
            </p>
          </div>
          <div className="relative h-80 md:h-96 rounded-lg overflow-hidden shadow-xl">
            <Image 
              src={layoutSettings.aboutSection.image || "/logo.png"} 
              alt="Mağazamız" 
              fill 
              className="object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div className="order-2 md:order-1 relative h-80 md:h-96 rounded-lg overflow-hidden shadow-xl">
            <Image 
              src={layoutSettings.heroSection.backgroundImage || "/logo.png"} 
              alt="Ekibimiz" 
              fill 
              className="object-cover"
            />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Misyonumuz</h2>
            <p className="text-gray-600 mb-4">
              Misyonumuz, müziğin evrensel dilini yaygınlaştırmak ve herkesin müzik yapma fırsatına sahip olmasını sağlamaktır. Bunu, kaliteli enstrümanlar ve ekipmanlar sunarak, müzik eğitimini destekleyerek ve müzik topluluğunu güçlendirerek gerçekleştiriyoruz.
            </p>
            <p className="text-gray-600 mb-4">
              Her müşterimize, müzik yolculuğunda ihtiyaç duyduğu rehberliği ve desteği sağlamak için buradayız. Amacımız sadece ürün satmak değil, aynı zamanda müzik tutkusunu paylaşmak ve müzik kültürünü zenginleştirmektir.
            </p>
            <p className="text-gray-600">
              Müşteri memnuniyeti bizim için en önemli önceliktir ve her zaman müşterilerimizin beklentilerini aşmak için çalışıyoruz.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Değerlerimiz</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-indigo-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-3 text-gray-600">
                  <span className="font-semibold text-gray-800">Kalite:</span> Her zaman en kaliteli ürünleri sunmak için çalışıyoruz.
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-indigo-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-3 text-gray-600">
                  <span className="font-semibold text-gray-800">Tutku:</span> Müziğe olan tutkumuz, her yaptığımız işte kendini gösterir.
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-indigo-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-3 text-gray-600">
                  <span className="font-semibold text-gray-800">Dürüstlük:</span> Müşterilerimizle olan ilişkilerimizde her zaman dürüst ve şeffafız.
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-indigo-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-3 text-gray-600">
                  <span className="font-semibold text-gray-800">Yenilikçilik:</span> Müzik dünyasındaki en son yenilikleri takip eder ve müşterilerimize sunarız.
                </p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 text-indigo-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-3 text-gray-600">
                  <span className="font-semibold text-gray-800">Topluluk:</span> Müzik topluluğunu destekler ve güçlendiririz.
                </p>
              </li>
            </ul>
          </div>
          <div className="relative h-80 md:h-96 rounded-lg overflow-hidden shadow-xl">
            <Image 
              src="/logo.png" 
              alt="Değerlerimiz" 
              fill 
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Ekibimiz</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Senfoni'nin arkasındaki tutkulu ve deneyimli ekibimizle tanışın. Her biri müzik dünyasında uzman olan ekip üyelerimiz, size en iyi hizmeti sunmak için burada.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Team Member 1 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="relative h-64">
                <Image 
                  src="/logo.png" 
                  alt="Ahmet Yılmaz" 
                  fill 
                  className="object-contain p-4"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800">Ahmet Yılmaz</h3>
                <p className="text-indigo-600 mb-4">Kurucu & CEO</p>
                <p className="text-gray-600 text-sm">
                  20 yıllık müzik deneyimiyle Senfoni'yi kurdu ve büyüttü.
                </p>
              </div>
            </div>
            
            {/* Team Member 2 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="relative h-64">
                <Image 
                  src="/logo.png" 
                  alt="Ayşe Kaya" 
                  fill 
                  className="object-contain p-4"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800">Ayşe Kaya</h3>
                <p className="text-indigo-600 mb-4">Müzik Direktörü</p>
                <p className="text-gray-600 text-sm">
                  Konservatuar mezunu ve profesyonel piyanist.
                </p>
              </div>
            </div>
            
            {/* Team Member 3 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="relative h-64">
                <Image 
                  src="/logo.png" 
                  alt="Mehmet Demir" 
                  fill 
                  className="object-contain p-4"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800">Mehmet Demir</h3>
                <p className="text-indigo-600 mb-4">Satış Müdürü</p>
                <p className="text-gray-600 text-sm">
                  15 yıllık perakende deneyimiyle müşteri memnuniyeti uzmanı.
                </p>
              </div>
            </div>
            
            {/* Team Member 4 */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="relative h-64">
                <Image 
                  src="/logo.png" 
                  alt="Zeynep Yıldız" 
                  fill 
                  className="object-contain p-4"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800">Zeynep Yıldız</h3>
                <p className="text-indigo-600 mb-4">Müşteri Hizmetleri</p>
                <p className="text-gray-600 text-sm">
                  Müşteri deneyimini mükemmelleştirmek için çalışan ekip lideri.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="container mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Bize Ulaşın</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Sorularınız veya geri bildirimleriniz için bizimle iletişime geçebilirsiniz. Size yardımcı olmaktan memnuniyet duyarız.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Address */}
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-indigo-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Adres</h3>
            <p className="text-gray-600">
              {layoutSettings.contactInfo.address}
            </p>
          </div>
          
          {/* Email */}
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-indigo-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">E-posta</h3>
            <p className="text-gray-600">
              {layoutSettings.contactInfo.email}
            </p>
          </div>
          
          {/* Phone */}
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-indigo-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Telefon</h3>
            <p className="text-gray-600">
              {layoutSettings.contactInfo.phone.replace(/\+90\s\d{3}\s\d{3}\s\d{2}\s\d{2}/, '+90 554 302 80 98')}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Senfoni</h3>
              <p className="text-gray-400 mb-4">
                Müzik tutkunlarına en kaliteli enstrümanları ve hizmeti sunuyoruz.
              </p>
              <div className="flex space-x-4">
                <a href={layoutSettings.contactInfo.socialMedia.facebook} className="text-gray-400 hover:text-white transition-colors">
                  <FaFacebook size={20} />
                </a>
                <a href={layoutSettings.contactInfo.socialMedia.instagram} className="text-gray-400 hover:text-white transition-colors">
                  <FaInstagram size={20} />
                </a>
                <a href={layoutSettings.contactInfo.socialMedia.twitter} className="text-gray-400 hover:text-white transition-colors">
                  <FaTwitter size={20} />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Hızlı Linkler</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                    Ana Sayfa
                  </Link>
                </li>
                <li>
                  <Link href="/urunler" className="text-gray-400 hover:text-white transition-colors">
                    Ürünler
                  </Link>
                </li>
                <li>
                  <Link href="/konserler" className="text-gray-400 hover:text-white transition-colors">
                    Konserler
                  </Link>
                </li>
                <li>
                  <Link href="/hakkimizda" className="text-gray-400 hover:text-white transition-colors">
                    Hakkımızda
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Kategoriler</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/kategoriler/piyanolar" className="text-gray-400 hover:text-white transition-colors">
                    Piyanolar
                  </Link>
                </li>
                <li>
                  <Link href="/kategoriler/gitarlar" className="text-gray-400 hover:text-white transition-colors">
                    Gitarlar
                  </Link>
                </li>
                <li>
                  <Link href="/kategoriler/yayli-calgilar" className="text-gray-400 hover:text-white transition-colors">
                    Yaylı Çalgılar
                  </Link>
                </li>
                <li>
                  <Link href="/kategoriler/vurmali-calgilar" className="text-gray-400 hover:text-white transition-colors">
                    Vurmalı Çalgılar
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">İletişim</h3>
              <ul className="space-y-2">
                <li className="text-gray-400">
                  {layoutSettings.contactInfo.address}
                </li>
                <li className="text-gray-400">
                  {layoutSettings.contactInfo.email}
                </li>
                <li className="text-gray-400">
                  {layoutSettings.contactInfo.phone}
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Senfoni. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HakkimizdaClient; 