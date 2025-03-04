'use client';

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaShoppingCart, FaPhone, FaEnvelope, FaUser, FaCog, FaBug, FaCalendarAlt, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import HeaderCurrencySelector from "./HeaderCurrencySelector";
import CartButton from "./CartButton";

type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
  price: number;
  currency: string;
  ticketsAvailable: number;
};

type LayoutSettings = {
  contactInfo: {
    phone: string;
    email: string;
    address: string;
    socialMedia: {
      facebook: string;
      instagram: string;
      twitter: string;
    };
  };
};

export default function KonserlerClient({ 
  events, 
  featuredEvent, 
  layoutSettings 
}: { 
  events: Event[], 
  featuredEvent: Event | null,
  layoutSettings: LayoutSettings 
}) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Üst Bar */}
          <div className="flex justify-between items-center py-2 text-sm border-b border-gray-100">
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 hover:text-red-600 transition-colors flex items-center">
                <FaPhone className="mr-2" />
                {layoutSettings.contactInfo.phone}
              </span>
              <span className="text-gray-600 hover:text-red-600 transition-colors flex items-center">
                <FaEnvelope className="mr-2" />
                {layoutSettings.contactInfo.email}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <HeaderCurrencySelector />
              <Link href="/hesabim" className="text-gray-600 hover:text-red-600 transition-colors flex items-center">
                <FaUser className="mr-1" /> Hesabım
              </Link>
              <Link href="/admin" className="text-gray-600 hover:text-red-600 transition-colors flex items-center">
                <FaCog className="mr-1" /> Yönetim
              </Link>
              <Link href="/debug" className="text-gray-600 hover:text-red-600 transition-colors flex items-center">
                <FaBug className="mr-1" /> Debug
              </Link>
            </div>
          </div>
          
          {/* Ana Menü */}
          <div className="flex justify-between items-center py-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center"
            >
              <Link href="/" className="flex items-center">
                <Image 
                  src="/logo.png" 
                  alt="Senfoni Müzik" 
                  width={150} 
                  height={50} 
                  className="h-10 w-auto"
                />
              </Link>
            </motion.div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-red-600 transition-colors font-medium">
                Ana Sayfa
              </Link>
              <Link href="/kategoriler" className="text-gray-700 hover:text-red-600 transition-colors font-medium">
                Kategoriler
              </Link>
              <Link href="/yeni-urunler" className="text-gray-700 hover:text-red-600 transition-colors font-medium">
                Yeni Ürünler
              </Link>
              <Link href="/konserler" className="text-red-600 font-medium">
                Konserler & Etkinlikler
              </Link>
              <CartButton />
            </div>
            
            <div className="md:hidden flex items-center">
              <button className="text-gray-700 hover:text-red-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Öne Çıkan Etkinlik */}
        {featuredEvent && (
          <div className="relative bg-gray-900 text-white">
            <div className="absolute inset-0 opacity-50">
              <Image 
                src={featuredEvent.image} 
                alt={featuredEvent.title} 
                fill
                className="object-cover"
              />
            </div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
              <div className="md:w-2/3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="inline-block bg-red-600 text-white px-3 py-1 text-sm font-semibold rounded-full mb-4">
                    Öne Çıkan Etkinlik
                  </span>
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">{featuredEvent.title}</h1>
                  <p className="text-lg text-gray-300 mb-6">{featuredEvent.description}</p>
                  
                  <div className="flex flex-wrap gap-4 mb-8">
                    <div className="flex items-center text-gray-300">
                      <FaCalendarAlt className="mr-2" />
                      <span>{featuredEvent.date}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <FaClock className="mr-2" />
                      <span>{featuredEvent.time}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <FaMapMarkerAlt className="mr-2" />
                      <span>{featuredEvent.location}</span>
                    </div>
                  </div>
                  
                  <Link 
                    href={`/konser/${featuredEvent.id}`}
                    className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                  >
                    Detayları Görüntüle
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        )}

        {/* Etkinlikler Başlık */}
        <div className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">Konserler & Etkinlikler</h2>
              <p className="mt-4 text-lg text-gray-600">
                Senfoni Müzik'in düzenlediği konser ve etkinlikleri keşfedin
              </p>
            </div>
          </div>
        </div>

        {/* Etkinlik Listesi */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </div>
          
          {events.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Şu anda planlanmış etkinlik bulunmuyor.</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:order-2">
              <Link href={layoutSettings.contactInfo.socialMedia.facebook} className="text-gray-400 hover:text-white mx-2">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link href={layoutSettings.contactInfo.socialMedia.instagram} className="text-gray-400 hover:text-white mx-2">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link href={layoutSettings.contactInfo.socialMedia.twitter} className="text-gray-400 hover:text-white mx-2">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
            </div>
            <div className="mt-8 md:mt-0 md:order-1">
              <p className="text-center text-base text-gray-400">
                &copy; {new Date().getFullYear()} Senfoni Müzik. Tüm hakları saklıdır.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// EventCard bileşeni
function EventCard({ event }: { event: Event }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={event.image}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
        
        <div className="flex flex-wrap gap-3 mb-3 text-sm text-gray-600">
          <div className="flex items-center">
            <FaCalendarAlt className="mr-1 text-red-600" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center">
            <FaClock className="mr-1 text-red-600" />
            <span>{event.time}</span>
          </div>
        </div>
        
        <div className="flex items-center mb-4 text-sm text-gray-600">
          <FaMapMarkerAlt className="mr-1 text-red-600" />
          <span>{event.location}</span>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-red-600">
            {event.price.toFixed(2)} {event.currency}
          </div>
          <Link 
            href={`/konser/${event.id}`}
            className="inline-block bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Detaylar
          </Link>
        </div>
      </div>
    </motion.div>
  );
} 