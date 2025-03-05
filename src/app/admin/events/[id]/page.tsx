'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Event, getEventById, updateEvent } from "@/services/eventService";
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaMoneyBillWave, FaTicketAlt, FaStar } from "react-icons/fa";
import Image from "next/image";

interface EventEditPageProps {
  params: {
    id: string;
  };
}

export default function EventEditPage({ params }: EventEditPageProps) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<Partial<Event>>({});

  useEffect(() => {
    async function loadEvent() {
      try {
        setLoading(true);
        const eventData = await getEventById(params.id);
        
        if (eventData) {
          setEvent(eventData);
          setFormData(eventData);
        } else {
          setError("Etkinlik bulunamadı");
        }
      } catch (err) {
        setError("Etkinlik yüklenirken bir hata oluştu");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, [params]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: id === 'price' || id === 'ticketsAvailable' 
        ? Number(value) 
        : value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await updateEvent(params.id, formData);
      setSuccess(true);
      // Başarılı mesajını 3 saniye sonra kaldır
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Etkinlik kaydedilirken bir hata oluştu");
      console.error(err);
    } finally {
      setSaving(false);
    }
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

  if (error && !event) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="mb-4">
          <Link href="/admin/events" className="text-blue-600 hover:underline">
            ← Etkinliklere Dön
          </Link>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Hata</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="mb-4">
          <Link href="/admin/events" className="text-blue-600 hover:underline">
            ← Etkinliklere Dön
          </Link>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Etkinlik Bulunamadı</h1>
          <p className="text-gray-600">Düzenlemek istediğiniz etkinlik bulunamadı veya kaldırılmış olabilir.</p>
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
              <Link href="/admin" className="text-2xl font-bold text-gray-900">
                Senfoni Müzik - Yönetim Paneli
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                Siteye Dön
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/admin/events" className="text-blue-600 hover:underline flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Etkinliklere Dön
          </Link>
        </div>

        {success && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Başarılı! </strong>
            <span className="block sm:inline">Etkinlik başarıyla güncellendi.</span>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Hata! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Etkinlik Düzenle</h1>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  {/* Temel Bilgiler */}
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Temel Bilgiler</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-1">Etkinlik ID</label>
                        <input
                          type="text"
                          id="id"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                          value={event.id}
                          readOnly
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Etkinlik Adı</label>
                        <input
                          type="text"
                          id="title"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.title || ''}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                        <textarea
                          id="description"
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.description || ''}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                        <select
                          id="category"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.category || ''}
                          onChange={handleInputChange}
                        >
                          <option value="">Kategori Seçin</option>
                          <option value="konser">Konser</option>
                          <option value="workshop">Workshop</option>
                          <option value="festival">Festival</option>
                          <option value="resital">Resital</option>
                          <option value="seminer">Seminer</option>
                          <option value="diger">Diğer</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  {/* Tarih ve Konum */}
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Tarih ve Konum</h2>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                            <FaCalendarAlt className="inline mr-1" /> Tarih
                          </label>
                          <input
                            type="text"
                            id="date"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            value={formData.date || ''}
                            onChange={handleInputChange}
                            placeholder="15 Mart 2025"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                            <FaClock className="inline mr-1" /> Saat
                          </label>
                          <input
                            type="text"
                            id="time"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            value={formData.time || ''}
                            onChange={handleInputChange}
                            placeholder="20:00"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                          <FaMapMarkerAlt className="inline mr-1" /> Konum
                        </label>
                        <input
                          type="text"
                          id="location"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.location || ''}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Fiyat ve Bilet */}
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Fiyat ve Bilet</h2>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                            <FaMoneyBillWave className="inline mr-1" /> Fiyat
                          </label>
                          <input
                            type="number"
                            id="price"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            value={formData.price || 0}
                            onChange={handleInputChange}
                            min="0"
                            step="0.01"
                            required
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">Para Birimi</label>
                          <select
                            id="currency"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            value={formData.currency || 'TRY'}
                            onChange={handleInputChange}
                          >
                            <option value="TRY">TRY - Türk Lirası</option>
                            <option value="USD">USD - Amerikan Doları</option>
                            <option value="EUR">EUR - Euro</option>
                            <option value="GBP">GBP - İngiliz Sterlini</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="ticketsAvailable" className="block text-sm font-medium text-gray-700 mb-1">
                          <FaTicketAlt className="inline mr-1" /> Bilet Sayısı
                        </label>
                        <input
                          type="number"
                          id="ticketsAvailable"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.ticketsAvailable || 0}
                          onChange={handleInputChange}
                          min="0"
                          step="1"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {/* Görsel */}
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Etkinlik Görseli</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Görsel URL</label>
                        <input
                          type="text"
                          id="image"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.image || ''}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="border border-gray-300 rounded-md p-4">
                        <div className="aspect-w-16 aspect-h-9 mb-4 relative h-48">
                          {formData.image && (
                            <Image 
                              src={formData.image} 
                              alt="Etkinlik görseli önizleme" 
                              className="object-cover rounded-md"
                              fill
                            />
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          Görsel önizleme.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Diğer Ayarlar */}
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Diğer Ayarlar</h2>
                    
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="featured"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          checked={formData.featured || false}
                          onChange={handleCheckboxChange}
                        />
                        <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                          <FaStar className="inline mr-1 text-amber-500" /> Öne Çıkan Etkinlik
                        </label>
                      </div>
                      <p className="text-sm text-gray-500">
                        Öne çıkan etkinlikler ana sayfada ve etkinlikler sayfasında daha belirgin şekilde gösterilir.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-3">
                <Link
                  href="/admin/events"
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  İptal
                </Link>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={saving}
                >
                  {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
} 