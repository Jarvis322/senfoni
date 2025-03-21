'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AboutSection } from '@/services/layoutService';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

// Client Component for the form
function AboutSectionForm({ initialData }: { initialData: AboutSection }) {
  const router = useRouter();
  const [formData, setFormData] = useState<AboutSection>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      // Import dynamically to avoid using server components in client components
      const { updateLayoutSection } = await import('@/services/layoutService');
      const success = await updateLayoutSection('aboutSection', formData);
      
      if (success) {
        setMessage({ type: 'success', text: 'Hakkımızda bölümü başarıyla güncellendi.' });
        setTimeout(() => {
          router.push('/admin/layout');
          router.refresh();
        }, 1500);
      } else {
        setMessage({ type: 'error', text: 'Güncelleme sırasında bir hata oluştu.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Bir hata oluştu: ' + (error as Error).message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message.text && (
        <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Başlık</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">İçerik</label>
            <textarea
              id="content"
              name="content"
              rows={6}
              value={formData.content}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">Görsel URL</label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="enabled"
              name="enabled"
              checked={formData.enabled}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="enabled" className="ml-2 block text-sm text-gray-900">
              Bölümü Aktif Et
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Görsel Önizleme</label>
          {formData.image ? (
            <div className="border border-gray-300 rounded-md p-4">
              <div className="aspect-w-16 aspect-h-9 mb-4">
                <Image 
                  src={formData.image} 
                  alt="About section image preview" 
                  width={800}
                  height={400}
                  className="object-cover rounded-md"
                />
              </div>
              <p className="text-sm text-gray-500">
                Image preview. You can change it later if you don&apos;t like it.
              </p>
            </div>
          ) : (
            <div className="border border-gray-300 rounded-md h-64 bg-gray-100 flex items-center justify-center">
              <span className="text-gray-500">Görsel URL'si girilmedi</span>
            </div>
          )}
          <p className="mt-2 text-sm text-gray-500">
            Önerilen boyut: 800x600 piksel
          </p>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Link 
          href="/admin/layout" 
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          İptal
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </div>
    </form>
  );
}

// Main client component
export default function AboutEditClient() {
  const searchParams = useSearchParams();
  
  // Parse the initial data if it exists
  const initialDataParam = searchParams.get('initialData');
  const initialData: AboutSection = initialDataParam 
    ? JSON.parse(initialDataParam) 
    : {
        title: '',
        content: '',
        image: '',
        enabled: false
      };

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
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Hakkımızda Bölümü Düzenleme</h1>
            <Link href="/admin/layout" className="text-blue-600 hover:text-blue-800">
              Geri Dön
            </Link>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            Ana sayfa hakkımızda bölümünü buradan düzenleyebilirsiniz.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <AboutSectionForm initialData={initialData} />
          </div>
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