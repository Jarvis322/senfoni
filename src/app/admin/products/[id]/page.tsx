'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Product } from "@/services/productService";
import { getProductById, updateProduct, deleteProduct } from "@/services/productService";
import { useRouter } from "next/navigation";

interface ProductEditPageProps {
  params: {
    id: string;
  };
}

export default function ProductEditPage({ params }: ProductEditPageProps) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        // Next.js 15.1.7'de params nesnesini await etmemiz gerekiyor
        const resolvedParams = await params;
        const productData = await getProductById(resolvedParams.id);
        
        if (productData) {
          setProduct(productData);
          setFormData({
            name: productData.name,
            description: productData.description,
            price: productData.price,
            discountedPrice: productData.discountedPrice,
            stock: productData.stock,
            brand: productData.brand || '',
            categories: productData.categories || [],
            images: productData.images || [],
            currency: productData.currency
          });
        } else {
          setError('Ürün bulunamadı');
        }
      } catch (err) {
        setError('Ürün yüklenirken bir hata oluştu');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    loadProduct();
  }, [params]);

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
    setSuccess(false);

    try {
      // Next.js 15.1.7'de params nesnesini await etmemiz gerekiyor
      const resolvedParams = await params;
      await updateProduct(resolvedParams.id, formData);
      setSuccess(true);
      // Başarılı mesajını 3 saniye sonra kaldır
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Ürün kaydedilirken bir hata oluştu");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      // Next.js 15.1.7'de params nesnesini await etmemiz gerekiyor
      const resolvedParams = await params;
      await deleteProduct(resolvedParams.id, () => {
        // Silme işlemi başarılı olduktan sonra ürünler sayfasına yönlendir
        router.push('/admin/products?refresh=true');
      });
    } catch (error) {
      setError("Ürün silinirken bir hata oluştu");
      console.error(error);
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
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

  if (error && !product) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="mb-4">
          <Link href="/admin/products" className="text-blue-600 hover:underline">
            ← Ürünlere Dön
          </Link>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Hata</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="mb-4">
          <Link href="/admin/products" className="text-blue-600 hover:underline">
            ← Ürünlere Dön
          </Link>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Ürün Bulunamadı</h1>
          <p className="text-gray-600">Düzenlemek istediğiniz ürün bulunamadı veya kaldırılmış olabilir.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Ürün Düzenle</h1>
        <div className="flex space-x-2">
          <Link
            href="/admin/products"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Geri Dön
          </Link>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Ürünü Sil
          </button>
        </div>
      </div>

      {/* Silme onay modalı */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ürünü silmek istediğinize emin misiniz?</h3>
            <p className="text-gray-500 mb-4">Bu işlem geri alınamaz ve ürün kalıcı olarak silinecektir.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                disabled={deleting}
              >
                İptal
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                disabled={deleting}
              >
                {deleting ? 'Siliniyor...' : 'Evet, Sil'}
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Hata! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

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

          {success && (
            <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Başarılı! </strong>
              <span className="block sm:inline">Ürün başarıyla güncellendi.</span>
            </div>
          )}

          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Ürün Düzenle</h1>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    {/* Temel Bilgiler */}
                    <div>
                      <h2 className="text-lg font-medium text-gray-900 mb-4">Temel Bilgiler</h2>
                      
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-1">Ürün ID</label>
                          <input
                            type="text"
                            id="id"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
                            value={product.id}
                            readOnly
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Ürün Adı</label>
                          <input
                            type="text"
                            id="name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            value={formData.name || ''}
                            onChange={handleInputChange}
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
                        <div className="grid grid-cols-2 gap-4">
                          {formData.images && formData.images.map((image, index) => (
                            <div key={index} className="relative border border-gray-300 rounded-md overflow-hidden">
                              <img
                                src={image}
                                alt={`Ürün görseli ${index + 1}`}
                                className="w-full h-40 object-cover"
                              />
                              <div className="absolute top-2 right-2 flex space-x-2">
                                <button
                                  type="button"
                                  className="bg-white p-1 rounded-full shadow-md hover:bg-gray-100"
                                  title="Ana görsel yap"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                </button>
                                <button
                                  type="button"
                                  className="bg-white p-1 rounded-full shadow-md hover:bg-gray-100"
                                  title="Görseli sil"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                        
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
                    disabled={submitting}
                  >
                    {submitting ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
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
    </div>
  );
}