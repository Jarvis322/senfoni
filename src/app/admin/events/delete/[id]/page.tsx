'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getEventById, deleteEvent } from '@/services/eventService';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

export default function DeleteEventPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [event, setEvent] = useState<any>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventData = await getEventById(id);
        if (eventData) {
          setEvent(eventData);
        } else {
          setError('Etkinlik bulunamadı.');
        }
      } catch (err) {
        setError('Etkinlik yüklenirken bir hata oluştu.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError('');

    try {
      await deleteEvent(id);
      setSuccess('Etkinlik başarıyla silindi!');
      
      // Redirect after success
      setTimeout(() => {
        router.push('/admin/events');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Etkinlik silinirken bir hata oluştu.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Etkinlik yükleniyor...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Etkinliği Sil</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/admin/events" className="text-blue-600 hover:text-blue-800">
                Etkinliklere Dön
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              <p>{error}</p>
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
              <p>{success}</p>
            </div>
          )}
          
          {event && !success && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Etkinliği Silmek İstediğinize Emin Misiniz?</h2>
                <p className="text-gray-600">
                  Bu işlem geri alınamaz. Etkinlik kalıcı olarak silinecektir.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{event.title}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Tarih</p>
                    <p className="text-gray-900">{format(new Date(event.date), "d MMMM yyyy", { locale: tr })}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Saat</p>
                    <p className="text-gray-900">{event.time}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Konum</p>
                    <p className="text-gray-900">{event.location}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Kategori</p>
                    <p className="text-gray-900">{event.category}</p>
                  </div>
                </div>
                
                {event.description && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Açıklama</p>
                    <p className="text-gray-900">{event.description}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm text-gray-500">Öne Çıkan</p>
                  <p className="text-gray-900">{event.featured ? 'Evet' : 'Hayır'}</p>
                </div>
              </div>
              
              <div className="flex justify-center space-x-4 mt-8">
                <Link
                  href="/admin/events"
                  className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  İptal
                </Link>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className={`px-6 py-3 rounded-md text-white bg-red-600 hover:bg-red-700 ${
                    isDeleting ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                >
                  {isDeleting ? 'Siliniyor...' : 'Evet, Etkinliği Sil'}
                </button>
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