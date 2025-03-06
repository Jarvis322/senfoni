'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import { useNotification } from '@/components/NotificationProvider';
import { useLayout } from '@/contexts/LayoutContext';

export default function EditLayoutSettingsPage() {
  const router = useRouter();
  const { showNotification } = useNotification();
  const { settings, updateSettings, isLoading: isContextLoading } = useLayout();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    siteTitle: '',
    siteDescription: '',
    siteLogo: '',
    siteFavicon: '',
    primaryColor: '',
    secondaryColor: '',
    footerText: ''
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        siteTitle: settings.heroSection.title,
        siteDescription: settings.heroSection.subtitle,
        siteLogo: '/logo.png',
        siteFavicon: '/favicon.ico',
        primaryColor: '#4f46e5',
        secondaryColor: '#f59e0b',
        footerText: '© 2025 Senfoni Müzik. Tüm hakları saklıdır.'
      });
    }
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!settings) {
        throw new Error('Mevcut ayarlar yüklenemedi');
      }

      const success = await updateSettings({
        ...settings,
        heroSection: {
          ...settings.heroSection,
          title: formData.siteTitle,
          subtitle: formData.siteDescription
        },
        aboutSection: {
          ...settings.aboutSection,
          title: formData.siteTitle,
          content: formData.siteDescription
        }
      });

      if (success) {
        showNotification("Sayfa ayarları başarıyla kaydedildi!", "success");
        
        // Yönlendirme
        setTimeout(() => {
          router.push('/admin/layout');
          router.refresh();
        }, 1000);
      } else {
        throw new Error("Ayarlar kaydedilemedi");
      }
    } catch (error) {
      showNotification("Ayarlar kaydedilirken bir hata oluştu.", "error");
      console.error("Ayarlar kaydedilirken hata:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isContextLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Ayarlar yükleniyor...</p>
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
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Sayfa Ayarları</h1>
            <Link href="/admin/layout" className="inline-flex items-center text-blue-600 hover:text-blue-800">
              <FaArrowLeft className="mr-2" /> Geri Dön
            </Link>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            Genel sayfa ayarlarını buradan düzenleyebilirsiniz.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="siteTitle" className="block text-sm font-medium text-gray-700">Site Başlığı</label>
                    <input
                      type="text"
                      id="siteTitle"
                      name="siteTitle"
                      value={formData.siteTitle}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700">Site Açıklaması</label>
                    <textarea
                      id="siteDescription"
                      name="siteDescription"
                      value={formData.siteDescription}
                      onChange={handleChange}
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="siteLogo" className="block text-sm font-medium text-gray-700">Logo URL</label>
                    <input
                      type="text"
                      id="siteLogo"
                      name="siteLogo"
                      value={formData.siteLogo}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="siteFavicon" className="block text-sm font-medium text-gray-700">Favicon URL</label>
                    <input
                      type="text"
                      id="siteFavicon"
                      name="siteFavicon"
                      value={formData.siteFavicon}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700">Ana Renk</label>
                    <div className="mt-1 flex items-center">
                      <input
                        type="color"
                        id="primaryColor"
                        name="primaryColor"
                        value={formData.primaryColor}
                        onChange={handleChange}
                        className="h-8 w-8 border border-gray-300 rounded-md shadow-sm"
                      />
                      <input
                        type="text"
                        value={formData.primaryColor}
                        onChange={handleChange}
                        name="primaryColor"
                        className="ml-2 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="secondaryColor" className="block text-sm font-medium text-gray-700">İkincil Renk</label>
                    <div className="mt-1 flex items-center">
                      <input
                        type="color"
                        id="secondaryColor"
                        name="secondaryColor"
                        value={formData.secondaryColor}
                        onChange={handleChange}
                        className="h-8 w-8 border border-gray-300 rounded-md shadow-sm"
                      />
                      <input
                        type="text"
                        value={formData.secondaryColor}
                        onChange={handleChange}
                        name="secondaryColor"
                        className="ml-2 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="footerText" className="block text-sm font-medium text-gray-700">Alt Bilgi Metni</label>
                    <input
                      type="text"
                      id="footerText"
                      name="footerText"
                      value={formData.footerText}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div className="pt-4">
                    <p className="text-sm text-gray-500 mb-2">Önizleme:</p>
                    <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-bold" style={{ color: formData.primaryColor }}>
                          {formData.siteTitle}
                        </div>
                        <div className="text-sm" style={{ color: formData.secondaryColor }}>
                          Menü
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 mb-4">
                        {formData.siteDescription}
                      </div>
                      <div className="text-xs text-center mt-4 text-gray-500">
                        {formData.footerText}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Link 
                  href="/admin/layout" 
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  İptal
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  <FaSave className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                </button>
              </div>
            </form>
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