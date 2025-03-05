'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FeaturedProducts } from '@/services/layoutService';
import { Product } from '@/services/productService';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

// Client Component for the form
function FeaturedProductsForm({ initialData, allProducts }: { initialData: FeaturedProducts, allProducts: Product[] }) {
  const router = useRouter();
  const [formData, setFormData] = useState<FeaturedProducts>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [selectedProductId, setSelectedProductId] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const handleAddProduct = () => {
    if (selectedProductId && !formData.productIds.includes(selectedProductId)) {
      setFormData({
        ...formData,
        productIds: [...formData.productIds, selectedProductId]
      });
      setSelectedProductId('');
    }
  };

  const handleRemoveProduct = (productId: string) => {
    setFormData({
      ...formData,
      productIds: formData.productIds.filter(id => id !== productId)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      // Import dynamically to avoid using server components in client components
      const { updateLayoutSection } = await import('@/services/layoutService');
      const success = await updateLayoutSection('featuredProducts', formData);
      
      if (success) {
        setMessage({ type: 'success', text: 'Öne çıkan ürünler başarıyla güncellendi.' });
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

  // Seçili ürünleri bul
  const selectedProducts = formData.productIds
    .map(id => allProducts.find(p => p.id === id))
    .filter(p => p !== undefined);

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
            <input
              type="text"
              id="subtitle"
              name="subtitle"
              value={formData.subtitle}
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

        <div className="space-y-4">
          <div>
            <label htmlFor="productSelect" className="block text-sm font-medium text-gray-700">Ürün Ekle</label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <select
                id="productSelect"
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Ürün seçin...</option>
                {allProducts.map(product => (
                  <option key={product.id} value={product.id} disabled={formData.productIds.includes(product.id)}>
                    {product.name} - {product.price} TL
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddProduct}
                disabled={!selectedProductId}
                className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 text-sm hover:bg-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              >
                Ekle
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Seçili Ürünler ({selectedProducts.length})</label>
            {selectedProducts.length > 0 ? (
              <ul className="border border-gray-200 rounded-md divide-y divide-gray-200 max-h-64 overflow-y-auto">
                {selectedProducts.map(product => (
                  <li key={product.id} className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center">
                      {product.image && (
                        <div className="relative w-10 h-10 mr-3">
                          <Image 
                            src={product.image} 
                            alt={product.name} 
                            className="object-cover rounded-md"
                            fill
                            sizes="40px"
                            onError={(e) => {
                              // @ts-expect-error Server Component
                              e.target.src = 'https://placehold.co/100?text=Ürün';
                            }}
                          />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.price} TL</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveProduct(product.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Kaldır
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="border border-gray-200 rounded-md p-4 text-center text-gray-500">
                Henüz ürün eklenmemiş
              </div>
            )}
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

// Main page component
export default function EditFeaturedProductsPage() {
  const searchParams = useSearchParams();
  
  // Parse the initial data if it exists
  const initialDataParam = searchParams.get('initialData');
  const initialData: FeaturedProducts = initialDataParam 
    ? JSON.parse(initialDataParam) 
    : {
        title: '',
        subtitle: '',
        productIds: [],
        enabled: false
      };
  
  // Parse the products if they exist
  const productsParam = searchParams.get('products');
  const allProducts: Product[] = productsParam 
    ? JSON.parse(productsParam) 
    : [];

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
            <h1 className="text-2xl font-bold text-gray-900">Öne Çıkan Ürünler Düzenleme</h1>
            <Link href="/admin/layout" className="text-blue-600 hover:text-blue-800">
              Geri Dön
            </Link>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            Ana sayfada gösterilecek öne çıkan ürünleri buradan düzenleyebilirsiniz.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <FeaturedProductsForm initialData={initialData} allProducts={allProducts} />
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