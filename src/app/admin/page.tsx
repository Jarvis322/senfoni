'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchProducts, Product } from "@/services/productService";
import { getAllEvents, Event } from "@/services/eventService";
import { 
  FaBox, FaCalendarAlt, FaShoppingCart, FaUsers, 
  FaArrowUp, FaArrowDown, FaEye, FaEdit, FaChartLine, FaPlus,
  FaTicketAlt, FaGuitar, FaMusic, FaMoneyBillWave, FaStar, FaDatabase, FaSync
} from "react-icons/fa";

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Gerçek verilerle istatistikler
  const [stats, setStats] = useState([
    { 
      title: "Toplam Ürün", 
      value: 0, 
      icon: <FaBox className="w-6 h-6 text-blue-500" />,
      change: 5,
      changeType: "increase" 
    },
    { 
      title: "Toplam Etkinlik", 
      value: 0, 
      icon: <FaCalendarAlt className="w-6 h-6 text-purple-500" />,
      change: 2,
      changeType: "increase" 
    },
    { 
      title: "Bekleyen Siparişler", 
      value: 0, 
      icon: <FaShoppingCart className="w-6 h-6 text-amber-500" />,
      change: null,
      changeType: null 
    },
    { 
      title: "Toplam Kullanıcı", 
      value: 0, 
      icon: <FaUsers className="w-6 h-6 text-green-500" />,
      change: null,
      changeType: null 
    }
  ]);

  // Ürün kategorileri istatistikleri
  const [productCategories, setProductCategories] = useState<{category: string, count: number}[]>([]);
  
  // Etkinlik bilet durumu
  const [ticketStats, setTicketStats] = useState({
    totalTickets: 0,
    availableTickets: 0,
    soldTickets: 0,
    percentageSold: 0
  });

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // Separate try-catch blocks for each data fetch to handle errors independently
        let productsData: Product[] = [];
        let eventsData: Event[] = [];
        
        try {
          // Ürünleri API'den çek - önbelleği devre dışı bırak
          const timestamp = new Date().getTime();
          const response = await fetch(`/api/admin/products?t=${timestamp}`, {
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            }
          });
          if (!response.ok) {
            throw new Error('Ürünler getirilemedi');
          }
          productsData = await response.json();
        } catch (productError) {
          console.error("Ürünler yüklenirken hata oluştu:", productError);
          setError("Ürünler yüklenirken bir hata oluştu, ancak diğer veriler gösteriliyor.");
          productsData = []; // Empty array as fallback
        }
        
        try {
          eventsData = await getAllEvents();
        } catch (eventError) {
          console.error("Etkinlikler yüklenirken hata oluştu:", eventError);
          if (!error) { // Only set if not already set by products error
            setError("Etkinlikler yüklenirken bir hata oluştu, ancak diğer veriler gösteriliyor.");
          }
          eventsData = []; // Empty array as fallback
        }
        
        setProducts(productsData);
        setEvents(eventsData);
        
        // İstatistikleri güncelle
        setStats(prevStats => [
          { 
            ...prevStats[0], 
            value: productsData.length,
          },
          { 
            ...prevStats[1], 
            value: eventsData.length,
          },
          ...prevStats.slice(2)
        ]);
        
        // Ürün kategorileri istatistiklerini hesapla
        const categories: Record<string, number> = {};
        productsData.forEach(product => {
          if (product.categories && product.categories.length > 0) {
            product.categories.forEach(category => {
              categories[category] = (categories[category] || 0) + 1;
            });
          }
        });
        
        const categoryStats = Object.entries(categories)
          .map(([category, count]) => ({ category, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
        
        setProductCategories(categoryStats);
        
        // Etkinlik bilet istatistiklerini hesapla
        const totalTickets = eventsData.reduce((sum, event) => sum + event.ticketsAvailable, 0);
        const soldTickets = 0; // Gerçek uygulamada satılan bilet sayısı hesaplanabilir
        
        setTicketStats({
          totalTickets: totalTickets + soldTickets,
          availableTickets: totalTickets,
          soldTickets: soldTickets,
          percentageSold: soldTickets > 0 ? Math.round((soldTickets / (totalTickets + soldTickets)) * 100) : 0
        });
        
      } catch (err) {
        setError("Veriler yüklenirken bir hata oluştu");
        console.error("Genel veri yükleme hatası:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [refreshKey]);

  // Verileri yenileme fonksiyonu
  const refreshData = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h1 className="text-xl font-medium text-gray-900 mb-4">Yükleniyor...</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Senfoni Müzik - Yönetim Paneli</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={refreshData}
                className="text-indigo-600 hover:text-indigo-800 flex items-center mr-4"
              >
                <FaSync className="mr-2" />
                Verileri Yenile
              </button>
              <Link href="/admin/sync" className="text-indigo-600 hover:text-indigo-800 flex items-center mr-4">
                <FaSync className="mr-2" />
                Veri Senkronizasyonu
              </Link>
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                Siteye Dön
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">{new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Hata! </strong>
            <span className="block sm:inline">{error}</span>
            <button 
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setError(null)}
            >
              <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <title>Kapat</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
              </svg>
            </button>
          </div>
        )}

        {/* İstatistik Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 transition-all duration-200 hover:shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className="p-3 rounded-full bg-gray-50">{stat.icon}</div>
              </div>
              {stat.change !== null && (
                <div className="mt-4 flex items-center">
                  {stat.changeType === "increase" ? (
                    <FaArrowUp className="w-3 h-3 text-green-500 mr-1" />
                  ) : (
                    <FaArrowDown className="w-3 h-3 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${stat.changeType === "increase" ? "text-green-500" : "text-red-500"}`}>
                    {stat.change}% 
                  </span>
                  <span className="text-sm text-gray-500 ml-1">son 30 günde</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Ürün Kategorileri */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Ürün Kategorileri</h2>
              <Link href="/admin/products" className="text-sm text-indigo-600 hover:text-indigo-800">
                Tümünü Görüntüle
              </Link>
            </div>
            {productCategories.length > 0 ? (
              <div className="space-y-4">
                {productCategories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FaGuitar className="w-4 h-4 text-indigo-500 mr-2" />
                      <span className="text-sm font-medium text-gray-700">{category.category}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900">{category.count}</span>
                      <span className="text-xs text-gray-500 ml-1">ürün</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40">
                <div className="text-center">
                  <p className="text-gray-500">Henüz kategori verisi bulunmuyor</p>
                </div>
              </div>
            )}
          </div>

          {/* Etkinlik Bilet Durumu */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Etkinlik Bilet Durumu</h2>
              <Link href="/admin/events" className="text-sm text-indigo-600 hover:text-indigo-800">
                Tümünü Görüntüle
              </Link>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FaTicketAlt className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Toplam Bilet</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{ticketStats.totalTickets}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FaTicketAlt className="w-4 h-4 text-blue-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Mevcut Bilet</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{ticketStats.availableTickets}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FaTicketAlt className="w-4 h-4 text-amber-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Satılan Bilet</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{ticketStats.soldTickets}</span>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Satış Oranı</span>
                  <span className="text-sm font-medium text-gray-900">{ticketStats.percentageSold}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-indigo-600 h-2.5 rounded-full" 
                    style={{ width: `${ticketStats.percentageSold}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Öne Çıkan Etkinlikler */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Öne Çıkan Etkinlikler</h2>
              <Link href="/admin/events" className="text-sm text-indigo-600 hover:text-indigo-800">
                Tümünü Görüntüle
              </Link>
            </div>
            {events.filter(event => event.featured).length > 0 ? (
              <div className="space-y-4">
                {events
                  .filter(event => event.featured)
                  .slice(0, 3)
                  .map((event, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 h-10 w-10 relative rounded-md overflow-hidden mr-3">
                        <Image 
                          src={event.image || 'https://placehold.co/40x40?text=Etkinlik'} 
                          alt={event.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{event.title}</p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                          <FaCalendarAlt className="mr-1 h-3 w-3" />
                          {event.date} • {event.time}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                          {new Intl.NumberFormat('tr-TR', {
                            style: 'currency',
                            currency: event.currency || 'TRY',
                          }).format(event.price)}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-40">
                <div className="text-center">
                  <p className="text-gray-500">Henüz öne çıkan etkinlik bulunmuyor</p>
                  <Link href="/admin/events/new" className="mt-2 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800">
                    <FaPlus className="mr-1 h-3 w-3" />
                    Yeni Etkinlik Ekle
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Son Eklenen Ürünler */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Son Eklenen Ürünler</h2>
            <div className="flex items-center space-x-4">
              <button 
                onClick={refreshData}
                className="text-sm text-gray-600 hover:text-indigo-600 flex items-center"
              >
                <FaSync className="mr-1 h-3 w-3" />
                Yenile
              </button>
              <Link href="/admin/products" className="text-sm text-indigo-600 hover:text-indigo-800">
                Tümünü Görüntüle
              </Link>
            </div>
          </div>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 4).map((product) => (
                <div key={product.id} className="bg-gray-50 rounded-lg p-4 transition-all duration-200 hover:shadow-md">
                  <div className="relative h-40 mb-4 rounded-md overflow-hidden">
                    <Image 
                      src={product.images[0] || 'https://placehold.co/400x300'} 
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 truncate">{product.name}</h3>
                  <p className="text-sm text-gray-500 truncate">{product.brand}</p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-900">
                      {new Intl.NumberFormat('tr-TR', {
                        style: 'currency',
                        currency: product.currency || 'TRY',
                      }).format(product.price)}
                    </span>
                    <Link href={`/admin/products/${product.id}`} className="text-xs text-indigo-600 hover:text-indigo-800">
                      Düzenle
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-40">
              <div className="text-center">
                <p className="text-gray-500">Henüz ürün bulunmuyor</p>
                <Link href="/admin/products/new" className="mt-2 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800">
                  <FaPlus className="mr-1 h-3 w-3" />
                  Yeni Ürün Ekle
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="mt-8 md:mt-0">
              <p className="text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} Senfoni Müzik Yönetim Paneli. Tüm hakları saklıdır.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 