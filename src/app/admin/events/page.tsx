'use client';

import { useState, useEffect } from "react";
import { getAllEvents, deleteEvent, Event } from "@/services/eventService";
import Link from "next/link";
import Image from "next/image";
import { FaPlus, FaEdit, FaTrash, FaStar, FaRegStar, FaCalendarAlt, FaMapMarkerAlt, FaFilter, FaSearch, FaSort, FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  
  // Filtreleme durumları
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [featuredFilter, setFeaturedFilter] = useState("");
  const [sortOption, setSortOption] = useState("date-asc");
  
  // Sayfalama
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  
  // Benzersiz lokasyonları saklamak için
  const [locations, setLocations] = useState<string[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        // Separate try-catch blocks for each data fetch to handle errors independently
        let eventsData: Event[] = [];
        
        try {
          eventsData = await getAllEvents();
          console.log(`Başarıyla ${eventsData.length} etkinlik yüklendi`);
        } catch (eventsError) {
          console.error("Etkinlikler yüklenirken hata oluştu:", eventsError);
          setError("Etkinlikler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
          eventsData = []; // Empty array as fallback
        }
        
        setEvents(eventsData);
        setFilteredEvents(eventsData);
        
        // Benzersiz lokasyonları çıkar
        const uniqueLocations = Array.from(
          new Set(
            eventsData.map(event => event.location)
          )
        );
        setLocations(uniqueLocations);
        
        // Toplam sayfa sayısını hesapla
        setTotalPages(Math.ceil(eventsData.length / itemsPerPage));
      } catch (err) {
        setError("Veriler yüklenirken bir hata oluştu");
        console.error("Genel veri yükleme hatası:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [itemsPerPage]);
  
  // Filtreleme ve sıralama işlemleri
  useEffect(() => {
    let result = [...events];
    
    // Arama filtresi
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(event => 
        event.title.toLowerCase().includes(searchLower) || 
        event.description.toLowerCase().includes(searchLower) || 
        event.location.toLowerCase().includes(searchLower) ||
        event.id.toLowerCase().includes(searchLower)
      );
    }
    
    // Lokasyon filtresi
    if (locationFilter) {
      result = result.filter(event => event.location === locationFilter);
    }
    
    // Öne çıkan filtresi
    if (featuredFilter === "featured") {
      result = result.filter(event => event.featured);
    } else if (featuredFilter === "not-featured") {
      result = result.filter(event => !event.featured);
    }
    
    // Sıralama
    switch (sortOption) {
      case "title-asc":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title-desc":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "date-asc":
        result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case "date-desc":
        result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
    }
    
    setFilteredEvents(result);
    setTotalPages(Math.ceil(result.length / itemsPerPage));
    setCurrentPage(1); // Filtre değiştiğinde ilk sayfaya dön
  }, [events, searchTerm, locationFilter, featuredFilter, sortOption, itemsPerPage]);

  const handleDeleteClick = (eventId: string) => {
    setDeleteConfirm(eventId);
  };

  const handleCancelDelete = () => {
    setDeleteConfirm(null);
  };

  const handleConfirmDelete = async (eventId: string) => {
    setDeleting(true);
    try {
      await deleteEvent(eventId);
      setEvents(events.filter(event => event.id !== eventId));
      setFilteredEvents(filteredEvents.filter(event => event.id !== eventId));
    } catch (err) {
      setError("Etkinlik silinirken bir hata oluştu");
      console.error(err);
    } finally {
      setDeleting(false);
      setDeleteConfirm(null);
    }
  };
  
  const handleClearFilters = () => {
    setSearchTerm("");
    setLocationFilter("");
    setFeaturedFilter("");
    setSortOption("date-asc");
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
  };
  
  // Mevcut sayfadaki etkinlikleri hesapla
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEvents.slice(indexOfFirstItem, indexOfLastItem);

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
    <div>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Etkinlik Yönetimi</h1>
          <p className="mt-1 text-sm text-gray-600">
            Toplam {events.length} etkinlik bulunuyor
            {filteredEvents.length !== events.length && ` (Filtrelenmiş: ${filteredEvents.length})`}
          </p>
        </div>
        <Link 
          href="/admin/events/new" 
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <FaPlus className="mr-2 h-4 w-4" />
          Yeni Etkinlik Ekle
        </Link>
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
      
      {/* Filters */}
      <div className="bg-white p-5 rounded-lg shadow-sm mb-6">
        <div className="flex items-center mb-4">
          <FaFilter className="mr-2 text-gray-500" />
          <h2 className="text-lg font-medium text-gray-900">Filtreler</h2>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Etkinlik Ara</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                id="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Etkinlik adı, açıklama veya ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="w-40">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Konum</label>
            <select
              id="location"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              <option value="">Tümü</option>
              {locations.map((location, index) => (
                <option key={index} value={location}>{location}</option>
              ))}
            </select>
          </div>
          <div className="w-40">
            <label htmlFor="featured" className="block text-sm font-medium text-gray-700 mb-1">Öne Çıkan</label>
            <select
              id="featured"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={featuredFilter}
              onChange={(e) => setFeaturedFilter(e.target.value)}
            >
              <option value="">Tümü</option>
              <option value="featured">Öne Çıkanlar</option>
              <option value="not-featured">Normal</option>
            </select>
          </div>
          <div className="w-40">
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">Sıralama</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSort className="h-4 w-4 text-gray-400" />
              </div>
              <select
                id="sort"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="title-asc">İsim (A-Z)</option>
                <option value="title-desc">İsim (Z-A)</option>
                <option value="date-asc">Tarih (Yakın-Uzak)</option>
                <option value="date-desc">Tarih (Uzak-Yakın)</option>
                <option value="price-asc">Fiyat (Artan)</option>
                <option value="price-desc">Fiyat (Azalan)</option>
              </select>
            </div>
          </div>
          <div className="flex items-end">
            <button 
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              onClick={handleClearFilters}
            >
              Filtreleri Temizle
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Etkinlik Listesi
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Tüm etkinlikleri görüntüleyin, düzenleyin veya silin
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Etkinlik
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih & Saat
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Konum
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fiyat
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Öne Çıkan
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 relative rounded-full overflow-hidden">
                          <Image 
                            src={event.image || 'https://placehold.co/40x40?text=Etkinlik'} 
                            alt={event.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{event.title}</div>
                          <div className="text-xs text-gray-500">ID: {event.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <FaCalendarAlt className="mr-2 text-gray-400" />
                        {event.date}
                      </div>
                      <div className="text-sm text-gray-500 ml-5">{event.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <FaMapMarkerAlt className="mr-2 text-gray-400" />
                        {event.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                        {new Intl.NumberFormat('tr-TR', {
                          style: 'currency',
                          currency: event.currency || 'TRY',
                        }).format(event.price)}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        {event.ticketsAvailable} bilet mevcut
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {event.featured ? (
                        <div className="flex items-center text-amber-500">
                          <FaStar className="mr-1" />
                          <span>Öne Çıkan</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-gray-400">
                          <FaRegStar className="mr-1" />
                          <span>Normal</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        href={`/admin/events/${event.id}`} 
                        className="text-indigo-600 hover:text-indigo-900 inline-flex items-center mr-3"
                      >
                        <FaEdit className="h-4 w-4 mr-1" />
                        Düzenle
                      </Link>
                      {deleteConfirm === event.id ? (
                        <div className="inline-flex items-center">
                          <span className="mr-2 text-gray-700">Emin misiniz?</span>
                          <button 
                            onClick={() => handleConfirmDelete(event.id)}
                            disabled={deleting}
                            className="text-red-600 hover:text-red-900 inline-flex items-center mr-2"
                          >
                            {deleting ? 'Siliniyor...' : 'Evet'}
                          </button>
                          <button 
                            onClick={handleCancelDelete}
                            className="text-gray-600 hover:text-gray-900 inline-flex items-center"
                          >
                            Hayır
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleDeleteClick(event.id)}
                          className="text-red-600 hover:text-red-900 inline-flex items-center"
                        >
                          <FaTrash className="h-4 w-4 mr-1" />
                          Sil
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    {filteredEvents.length === 0 ? (
                      <>
                        <p>Henüz etkinlik bulunmuyor. Yeni bir etkinlik ekleyin.</p>
                        <Link href="/admin/events/new" className="mt-2 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800">
                          <FaPlus className="mr-1 h-3 w-3" />
                          Yeni Etkinlik Ekle
                        </Link>
                      </>
                    ) : (
                      <p>Filtrelere uygun etkinlik bulunamadı. Lütfen filtreleri değiştirin.</p>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center mb-4 sm:mb-0">
              <span className="text-sm text-gray-700 mr-2">Sayfa başına göster:</span>
              <select 
                className="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <div className="text-sm text-gray-700 mr-4">
                <span className="font-medium">{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredEvents.length)}</span> / <span className="font-medium">{filteredEvents.length}</span> etkinlik
              </div>
              
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button 
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 cursor-pointer'}`}
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <span className="sr-only">Önceki</span>
                  <FaChevronLeft className="h-4 w-4" />
                </button>
                
                {/* Sayfa numaraları */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Toplam 5 sayfa numarası göster, mevcut sayfa ortada olacak şekilde
                  let pageNum;
                  if (totalPages <= 5) {
                    // 5 veya daha az sayfa varsa, tüm sayfaları göster
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    // Başlangıçtayız, ilk 5 sayfayı göster
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    // Sondayız, son 5 sayfayı göster
                    pageNum = totalPages - 4 + i;
                  } else {
                    // Ortadayız, mevcut sayfayı ortada göster
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${currentPage === pageNum ? 'bg-indigo-50 text-indigo-600 z-10' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button 
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 cursor-pointer'}`}
                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <span className="sr-only">Sonraki</span>
                  <FaChevronRight className="h-4 w-4" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 