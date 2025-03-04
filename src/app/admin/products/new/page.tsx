'use client';

import { useState } from "react";
import Link from "next/link";
import { Product, createProduct } from "@/services/productService";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState("");
  const [formData, setFormData] = useState<Omit<Product, "id">>({
    name: "",
    description: "",
    brand: "",
    price: 0,
    stock: 0,
    currency: "TRY",
    categories: [],
    images: [],
    url: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: id === 'price' || id === 'discountedPrice' || id === 'stock' 
        ? Number(value) 
        : value
    }));
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    
    const updatedCategories = [...(formData.categories || []), newCategory.trim()];
    setFormData(prev => ({
      ...prev,
      categories: updatedCategories
    }));
    setNewCategory("");
  };

  const handleRemoveCategory = (categoryToRemove: string) => {
    const updatedCategories = (formData.categories || []).filter(
      category => category !== categoryToRemove
    );
    setFormData(prev => ({
      ...prev,
      categories: updatedCategories
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const newProduct = await createProduct(formData);
      router.push(`/admin/products/${newProduct.id}`);
    } catch (err) {
      setError("Ürün oluşturulurken bir hata oluştu");
      console.error(err);
      setSaving(false);
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
          <Link href="/admin/products" className="text-blue-600 hover:underline flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Ürünlere Dön
          </Link>
        </div>

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Hata! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Yeni Ürün Ekle</h1>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  {/* Temel Bilgiler */}
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Temel Bilgiler</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Ürün Adı</label>
                        <input
                          type="text"
                          id="name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.name || ''}
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
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">Marka</label>
                        <input
                          type="text"
                          id="brand"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.brand || ''}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Fiyat ve Stok */}
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Fiyat ve Stok</h2>
                    
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Fiyat</label>
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
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="discountedPrice" className="block text-sm font-medium text-gray-700 mb-1">İndirimli Fiyat (Opsiyonel)</label>
                          <input
                            type="number"
                            id="discountedPrice"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            value={formData.discountedPrice || ''}
                            onChange={handleInputChange}
                            min="0"
                            step="0.01"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">Stok Adedi</label>
                          <input
                            type="number"
                            id="stock"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            value={formData.stock || 0}
                            onChange={handleInputChange}
                            min="0"
                            step="1"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Kategoriler */}
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Kategoriler</h2>
                    
                    <div className="space-y-4">
                      <div className="border border-gray-300 rounded-md p-4">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {formData.categories && formData.categories.map((category, index) => (
                            <div key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                              {category}
                              <button 
                                type="button" 
                                className="ml-2 text-blue-600 hover:text-blue-800"
                                onClick={() => handleRemoveCategory(category)}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex">
                          <input
                            type="text"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Yeni kategori ekle..."
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
                          />
                          <button
                            type="button"
                            className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition-colors"
                            onClick={handleAddCategory}
                          >
                            Ekle
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {/* Ürün Görselleri */}
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Ürün Görselleri</h2>
                    
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <div className="mt-4 flex text-sm text-gray-600 justify-center">
                          <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                            <span>Görsel Yükle</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                          </label>
                          <p className="pl-1">veya sürükleyip bırakın</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG, GIF, WEBP (max. 5MB)
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* SEO Bilgileri */}
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 mb-4">SEO Bilgileri</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">URL (Opsiyonel)</label>
                        <input
                          type="text"
                          id="url"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={formData.url || ''}
                          onChange={handleInputChange}
                          placeholder="ornek-urun-url"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-3">
                <Link
                  href="/admin/products"
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  İptal
                </Link>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={saving}
                >
                  {saving ? 'Oluşturuluyor...' : 'Ürün Oluştur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
} 