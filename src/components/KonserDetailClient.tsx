'use client';

import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaArrowLeft, FaShare, FaFacebookF, FaTwitter, FaInstagram, FaArrowRight } from 'react-icons/fa';

// Define Event type
type Event = {
  id: string;
  title: string;
  description: string | null;
  date: Date;
  time: string;
  location: string;
  image: string | null;
  category: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
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
  // Diğer layout ayarları...
};

type KonserDetailClientProps = {
  event: Event;
  layoutSettings: LayoutSettings;
  relatedEvents?: Event[];
};

export default function KonserDetailClient({ event, layoutSettings, relatedEvents = [] }: KonserDetailClientProps) {
  // Tarihi formatla
  const formatDate = (date: Date) => {
    return format(new Date(date), "d MMMM yyyy", { locale: tr });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative">
        <div className="h-[500px] relative overflow-hidden">
          <Image 
            src={event.image || "https://placehold.co/1920x500?text=Etkinlik"}
            alt={event.title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-16">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="max-w-3xl text-white"
              >
                <div className="flex items-center space-x-2 mb-4">
                  <Link href="/konserler" className="text-white/80 hover:text-white flex items-center">
                    <FaArrowLeft className="mr-2" /> Tüm Etkinlikler
                  </Link>
                  <span className="text-white/50">|</span>
                  <span className="bg-red-600 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">{event.category}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{event.title}</h1>
                <div className="flex flex-wrap gap-6 mt-6">
                  <div className="flex items-center text-white/90">
                    <FaCalendarAlt className="mr-2 text-red-500" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center text-white/90">
                    <FaClock className="mr-2 text-red-500" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center text-white/90">
                    <FaMapMarkerAlt className="mr-2 text-red-500" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Details */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-md p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Etkinlik Hakkında</h2>
                <div className="prose max-w-none text-gray-700">
                  <p className="whitespace-pre-line">{event.description || "Bu etkinlik için henüz detaylı açıklama bulunmamaktadır."}</p>
                </div>

                <div className="mt-12">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Etkinlik Bilgileri</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="font-medium text-gray-500 mb-1">Tarih</div>
                      <div className="text-gray-900 flex items-center">
                        <FaCalendarAlt className="mr-2 text-red-600" />
                        {formatDate(event.date)}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="font-medium text-gray-500 mb-1">Saat</div>
                      <div className="text-gray-900 flex items-center">
                        <FaClock className="mr-2 text-red-600" />
                        {event.time}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                      <div className="font-medium text-gray-500 mb-1">Konum</div>
                      <div className="text-gray-900 flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-red-600" />
                        {event.location}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-12">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Paylaş</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors">
                      <FaFacebookF />
                    </a>
                    <a href="#" className="bg-sky-500 text-white p-3 rounded-full hover:bg-sky-600 transition-colors">
                      <FaTwitter />
                    </a>
                    <a href="#" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-full hover:from-purple-600 hover:to-pink-600 transition-colors">
                      <FaInstagram />
                    </a>
                    <button className="bg-gray-200 text-gray-700 p-3 rounded-full hover:bg-gray-300 transition-colors flex items-center">
                      <FaShare className="mr-2" /> Paylaş
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>

            <div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-md p-8 sticky top-8"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6">Bilet Al</h3>
                <p className="text-gray-600 mb-6">Bu etkinlik için bilet satışları henüz başlamamıştır. Bilet satışları başladığında buradan bilet alabilirsiniz.</p>
                <button className="w-full bg-red-600 text-white font-medium py-3 px-4 rounded-md hover:bg-red-700 transition-colors mb-4 opacity-50 cursor-not-allowed">
                  Bilet Satışı Yakında
                </button>
                <p className="text-sm text-gray-500 text-center">Bilet satışları hakkında bilgi almak için bizi takip edin.</p>

                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-4">İletişim</h4>
                  <p className="text-gray-600 mb-2">Etkinlik hakkında daha fazla bilgi için:</p>
                  <p className="text-gray-900 mb-1">{layoutSettings.contactInfo.phone}</p>
                  <p className="text-gray-900">{layoutSettings.contactInfo.email}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Events */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900">Benzer Etkinlikler</h2>
            <p className="mt-4 text-xl text-gray-600">İlginizi çekebilecek diğer etkinlikler</p>
          </motion.div>

          {relatedEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedEvents.map((relatedEvent, index) => (
                <motion.div
                  key={relatedEvent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={relatedEvent.image || "https://placehold.co/800x500?text=Etkinlik"}
                      alt={relatedEvent.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-900">{relatedEvent.title}</h3>
                      <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{relatedEvent.category}</span>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-700">
                        <FaCalendarAlt className="mr-2 text-red-600" />
                        <span>{formatDate(relatedEvent.date)}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <FaMapMarkerAlt className="mr-2 text-red-600" />
                        <span>{relatedEvent.location}</span>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Link 
                        href={`/konser/${relatedEvent.id}`}
                        className="text-red-600 hover:text-red-800 font-medium flex items-center"
                      >
                        Detaylar <FaArrowRight className="ml-1" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-6">Şu anda benzer etkinlik bulunmuyor.</p>
              <Link 
                href="/konserler"
                className="inline-block bg-white border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-medium px-6 py-3 rounded-md transition-colors"
              >
                Tüm Etkinlikleri Gör
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
} 