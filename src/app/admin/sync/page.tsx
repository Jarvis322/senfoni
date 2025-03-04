'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FaSync, FaArrowLeft, FaCheck, FaExclamationTriangle } from 'react-icons/fa';

export default function SyncPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; count?: number; error?: string } | null>(null);

  const handleSync = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      // Call the API endpoint instead of directly using syncProductsWithDatabase
      const response = await fetch('/api/admin/sync-products');
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setResult(data);
    } catch (error: any) {
      console.error('Senkronizasyon hatası:', error);
      setResult({ success: false, error: error.message || 'Bilinmeyen bir hata oluştu' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Ürün Senkronizasyonu</h1>
        <Link href="/admin" className="flex items-center text-blue-600 hover:text-blue-800">
          <FaArrowLeft className="mr-2" />
          Admin Paneline Dön
        </Link>
      </header>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">XML'den Ürün Senkronizasyonu</h2>
        
        <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex items-start">
            <FaExclamationTriangle className="text-yellow-400 mt-1 mr-3" />
            <div>
              <p className="font-medium">Dikkat</p>
              <p className="text-sm">
                Bu işlem, XML kaynağından tüm ürünleri çekip veritabanına aktaracaktır. 
                Mevcut ürünler güncellenir, yeni ürünler eklenir. 
                Ürün sayısına bağlı olarak bu işlem biraz zaman alabilir.
              </p>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleSync}
          disabled={loading}
          className={`flex items-center justify-center px-4 py-2 rounded-md text-white ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? (
            <>
              <FaSync className="animate-spin mr-2" />
              Senkronizasyon Yapılıyor...
            </>
          ) : (
            <>
              <FaSync className="mr-2" />
              Ürünleri Senkronize Et
            </>
          )}
        </button>
        
        {result && (
          <div className={`mt-6 p-4 rounded-md ${
            result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            {result.success ? (
              <div className="flex items-center">
                <FaCheck className="text-green-500 mr-2" />
                <p>
                  Senkronizasyon başarılı! {result.count} adet ürün veritabanına aktarıldı.
                </p>
              </div>
            ) : (
              <div className="flex items-center">
                <FaExclamationTriangle className="text-red-500 mr-2" />
                <p>
                  Senkronizasyon sırasında bir hata oluştu: {result.error}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Ürün Yönetimi</h2>
        <p className="mb-4">
          Senkronizasyon tamamlandıktan sonra, ürünleri görüntülemek ve düzenlemek için ürün yönetimi sayfasına gidebilirsiniz.
        </p>
        <Link 
          href="/admin/products" 
          className="inline-flex items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
        >
          Ürün Yönetimine Git
        </Link>
      </div>
    </div>
  );
} 