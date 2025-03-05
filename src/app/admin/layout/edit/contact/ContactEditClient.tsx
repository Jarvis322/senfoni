'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ContactInfo, updateLayoutSection } from '@/services/layoutService';
import { useSearchParams } from 'next/navigation';

// Client Component for the form
function ContactInfoForm({ initialData }: { initialData: ContactInfo }) {
  const router = useRouter();
  const [formData, setFormData] = useState<ContactInfo>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle nested socialMedia fields
    if (name.startsWith('socialMedia.')) {
      const socialField = name.split('.')[1];
      setFormData({
        ...formData,
        socialMedia: {
          ...formData.socialMedia,
          [socialField]: value
        }
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
      const success = await updateLayoutSection('contactInfo', formData);
      
      if (success) {
        setMessage({ 
          type: 'success', 
          text: 'İletişim bilgileri başarıyla güncellendi!' 
        });
        // Redirect after successful update
        setTimeout(() => {
          router.push('/admin/layout');
        }, 1500);
      } else {
        setMessage({ 
          type: 'error', 
          text: 'İletişim bilgileri güncellenirken bir hata oluştu.' 
        });
      }
    } catch (error) {
      console.error('Error updating contact info:', error);
      setMessage({ 
        type: 'error', 
        text: 'İletişim bilgileri güncellenirken bir hata oluştu.' 
      });
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
          <h3 className="font-medium text-gray-900">Temel İletişim Bilgileri</h3>
          
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Adres</label>
            <textarea
              id="address"
              name="address"
              rows={3}
              value={formData.address}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefon</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-posta</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-gray-900">Sosyal Medya Hesapları</h3>
          
          <div>
            <label htmlFor="socialMedia.facebook" className="block text-sm font-medium text-gray-700">Facebook</label>
            <input
              type="text"
              id="socialMedia.facebook"
              name="socialMedia.facebook"
              value={formData.socialMedia?.facebook || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="socialMedia.twitter" className="block text-sm font-medium text-gray-700">Twitter</label>
            <input
              type="text"
              id="socialMedia.twitter"
              name="socialMedia.twitter"
              value={formData.socialMedia?.twitter || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="socialMedia.instagram" className="block text-sm font-medium text-gray-700">Instagram</label>
            <input
              type="text"
              id="socialMedia.instagram"
              name="socialMedia.instagram"
              value={formData.socialMedia?.instagram || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
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
export default function ContactEditClient() {
  const searchParams = useSearchParams();
  
  // Parse the initial data if it exists
  const initialDataParam = searchParams.get('initialData');
  const initialData: ContactInfo = initialDataParam 
    ? JSON.parse(initialDataParam) 
    : {
        address: '',
        phone: '',
        email: '',
        socialMedia: {
          facebook: '',
          instagram: '',
          twitter: ''
        }
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
            <h1 className="text-2xl font-bold text-gray-900">İletişim Bilgileri Düzenleme</h1>
            <Link href="/admin/layout" className="text-blue-600 hover:text-blue-800">
              Geri Dön
            </Link>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            Site genelinde gösterilen iletişim bilgilerini buradan düzenleyebilirsiniz.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <ContactInfoForm initialData={initialData} />
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