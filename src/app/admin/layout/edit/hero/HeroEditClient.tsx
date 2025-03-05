'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { HeroSection } from '@/services/layoutService';
import Image from 'next/image';

// Client Component for the form
function HeroSectionForm({ initialData }: { initialData: HeroSection }) {
  const router = useRouter();
  const [formData, setFormData] = useState<HeroSection>(initialData);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a preview URL for the image
    const imageUrl = URL.createObjectURL(file);
    setFormData({
      ...formData,
      imageFile: file,
      imagePreview: imageUrl
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      // Create a FormData object to send the image file
      const formDataToSend = new FormData();
      
      // Add all the text fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('subtitle', formData.subtitle);
      formDataToSend.append('buttonText', formData.buttonText);
      formDataToSend.append('buttonLink', formData.buttonLink);
      formDataToSend.append('enabled', String(formData.enabled));
      
      // Add the image file if it exists
      if (formData.imageFile) {
        formDataToSend.append('image', formData.imageFile);
      }

      // Import dynamically to avoid using server components in client components
      const { updateHeroSection } = await import('@/services/layoutService');
      const success = await updateHeroSection(formDataToSend);
      
      if (success) {
        setMessage({ type: 'success', text: 'Hero bölümü başarıyla güncellendi!' });
        setTimeout(() => {
          router.push('/admin/layout');
          router.refresh();
        }, 1500);
      } else {
        setMessage({ type: 'error', text: 'Güncelleme sırasında bir hata oluştu.' });
      }
    } catch (error) {
      console.error('Error updating hero section:', error);
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
            <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700">Alt Başlık</label>
            <textarea
              id="subtitle"
              name="subtitle"
              rows={3}
              value={formData.subtitle}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="buttonText" className="block text-sm font-medium text-gray-700">Buton Metni</label>
            <input
              type="text"
              id="buttonText"
              name="buttonText"
              value={formData.buttonText}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="buttonLink" className="block text-sm font-medium text-gray-700">Buton Bağlantısı</label>
            <input
              type="text"
              id="buttonLink"
              name="buttonLink"
              value={formData.buttonLink}
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
              Hero Bölümünü Aktif Et
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Hero Görseli</label>
            <div className="mt-1 flex items-center">
              <div className="relative w-full h-48 overflow-hidden rounded-md border border-gray-300">
                {(formData.imagePreview || formData.image) ? (
                  <Image
                    src={formData.imagePreview || formData.image || ''}
                    alt="Hero görseli"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500">
                    Görsel seçilmedi
                  </div>
                )}
              </div>
            </div>
            <div className="mt-2">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 sr-only">
                Görsel Yükle
              </label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="mt-1 text-xs text-gray-500">
                PNG, JPG, GIF formatında, maksimum 5MB boyutunda.
              </p>
            </div>
          </div>
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
export default function HeroEditClient() {
  const searchParams = useSearchParams();

  // Parse the initial data if it exists
  const initialDataParam = searchParams.get('initialData');
  const initialData: HeroSection = initialDataParam
    ? JSON.parse(initialDataParam)
    : {
        title: '',
        subtitle: '',
        buttonText: '',
        buttonLink: '',
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
            <h1 className="text-2xl font-bold text-gray-900">Hero Bölümünü Düzenle</h1>
            <Link href="/admin/layout" className="text-blue-600 hover:text-blue-800">
              Geri Dön
            </Link>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            Ana sayfada gösterilen hero bölümünü buradan düzenleyebilirsiniz.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <HeroSectionForm initialData={initialData} />
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