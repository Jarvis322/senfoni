'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Categories, Category } from '@/services/layoutService';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

// Client Component for the form
function CategoriesForm({ initialData }: { initialData: Categories }) {
  const router = useRouter();
  const [formData, setFormData] = useState<Categories>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [newCategory, setNewCategory] = useState<Category>({ id: '', name: '', image: '' });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

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

  const handleNewCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCategory({
      ...newCategory,
      [name]: value
    });
  };

  const handleEditCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingCategory) return;
    
    const { name, value } = e.target;
    setEditingCategory({
      ...editingCategory,
      [name]: value
    });
  };

  const handleAddCategory = () => {
    if (!newCategory.name || !newCategory.image) {
      setMessage({ type: 'error', text: 'Kategori adı ve görsel URL\'si gereklidir.' });
      return;
    }

    // Benzersiz ID oluştur
    const newId = `cat_${Date.now()}`;
    const categoryToAdd = {
      ...newCategory,
      id: newId
    };

    setFormData({
      ...formData,
      items: [...formData.items, categoryToAdd]
    });

    // Formu temizle
    setNewCategory({ id: '', name: '', image: '' });
    setMessage({ type: '', text: '' });
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
  };

  const handleSaveEdit = () => {
    if (!editingCategory) return;

    if (!editingCategory.name || !editingCategory.image) {
      setMessage({ type: 'error', text: 'Kategori adı ve görsel URL\'si gereklidir.' });
      return;
    }

    setFormData({
      ...formData,
      items: formData.items.map(item => 
        item.id === editingCategory.id ? editingCategory : item
      )
    });

    setEditingCategory(null);
    setMessage({ type: '', text: '' });
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
  };

  const handleRemoveCategory = (id: string) => {
    setFormData({
      ...formData,
      items: formData.items.filter(item => item.id !== id)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      // Import dynamically to avoid using server components in client components
      const { updateLayoutSection } = await import('@/services/layoutService');
      const success = await updateLayoutSection('categories', formData);
      
      if (success) {
        setMessage({ type: 'success', text: 'Kategoriler başarıyla güncellendi.' });
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
          <h3 className="font-medium text-gray-900">Yeni Kategori Ekle</h3>
          
          <div>
            <label htmlFor="newCategoryName" className="block text-sm font-medium text-gray-700">Kategori Adı</label>
            <input
              type="text"
              id="newCategoryName"
              name="name"
              value={newCategory.name}
              onChange={handleNewCategoryChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="newCategoryImage" className="block text-sm font-medium text-gray-700">Görsel URL</label>
            <input
              type="text"
              id="newCategoryImage"
              name="image"
              value={newCategory.image}
              onChange={handleNewCategoryChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <button
              type="button"
              onClick={handleAddCategory}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Kategori Ekle
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-medium text-gray-900 mb-3">Kategoriler ({formData.items.length})</h3>
        
        {formData.items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {formData.items.map(category => (
              <div key={category.id} className="border border-gray-200 rounded-lg p-4">
                {editingCategory && editingCategory.id === category.id ? (
                  // Düzenleme modu
                  <div className="space-y-3">
                    <div>
                      <label htmlFor={`editName-${category.id}`} className="block text-xs font-medium text-gray-700">Kategori Adı</label>
                      <input
                        type="text"
                        id={`editName-${category.id}`}
                        name="name"
                        value={editingCategory.name}
                        onChange={handleEditCategoryChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor={`editImage-${category.id}`} className="block text-xs font-medium text-gray-700">Görsel URL</label>
                      <input
                        type="text"
                        id={`editImage-${category.id}`}
                        name="image"
                        value={editingCategory.image}
                        onChange={handleEditCategoryChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="flex space-x-2 mt-2">
                      <button
                        type="button"
                        onClick={handleSaveEdit}
                        className="inline-flex items-center px-2 py-1 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Kaydet
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="inline-flex items-center px-2 py-1 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        İptal
                      </button>
                    </div>
                  </div>
                ) : (
                  // Görüntüleme modu
                  <>
                    <div className="flex items-center space-x-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                        <Image
                          src={category.image || 'https://placehold.co/100?text=Kategori'}
                          alt={category.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <h4 className="text-sm font-medium text-gray-900">{category.name}</h4>
                    <div className="flex space-x-2 mt-2">
                      <button
                        type="button"
                        onClick={() => handleEditCategory(category)}
                        className="inline-flex items-center px-2 py-1 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Düzenle
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveCategory(category.id)}
                        className="inline-flex items-center px-2 py-1 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Sil
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-gray-200 rounded-md p-4 text-center text-gray-500">
            Henüz kategori eklenmemiş
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3 mt-6">
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
export default function EditCategoriesPage() {
  const searchParams = useSearchParams();
  
  // Parse the initial data if it exists
  const initialDataParam = searchParams.get('initialData');
  const initialData: Categories = initialDataParam 
    ? JSON.parse(initialDataParam) 
    : {
        title: '',
        subtitle: '',
        items: [],
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
            <h1 className="text-2xl font-bold text-gray-900">Kategoriler Düzenleme</h1>
            <Link href="/admin/layout" className="text-blue-600 hover:text-blue-800">
              Geri Dön
            </Link>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            Ana sayfada gösterilecek kategorileri buradan düzenleyebilirsiniz.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <CategoriesForm initialData={initialData} />
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