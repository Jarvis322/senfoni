'use client';

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product, fetchProducts, deleteProduct } from "@/services/productService";
import { FaPlus, FaSearch, FaFilter, FaSort, FaEdit, FaTrash, FaChevronLeft, FaChevronRight, FaSync } from "react-icons/fa";
import { checkRefreshParam } from "./index";

export default function ProductsManagementPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  
  // Filtreleme durumları
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [sortOption, setSortOption] = useState("name-asc");
  
  // Sayfalama
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  
  // Benzersiz kategorileri saklamak için
  const [categories, setCategories] = useState<string[]>([]);

  // Yenileme durumu
  const [refreshing, setRefreshing] = useState(false);
  
  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data: Product[] = [];
      try {
        // Use SWR pattern with a cache timeout
        const cacheKey = `admin_products_${new Date().toISOString().split('T')[0]}`; // Cache key with date for daily refresh
        const cachedData = sessionStorage.getItem(cacheKey);
        
        if (cachedData) {
          data = JSON.parse(cachedData);
          console.log(`Using cached data for ${data.length} products`);
        } else {
          // API'den ürünleri çek
          const response = await fetch(`/api/admin/products`, {
            next: { revalidate: 3600 } // 1 saat cache
          });
          
          if (!response.ok) {
            throw new Error(`Ürünler getirilemedi: ${response.status} ${response.statusText}`);
          }
          
          data = await response.json();
          console.log(`Başarıyla ${data.length} ürün yüklendi`);
          
          // Cache the data
          sessionStorage.setItem(cacheKey, JSON.stringify(data));
        }
      } catch (fetchError) {
        console.error("Ürünler yüklenirken hata oluştu:", fetchError);
        setError("Ürünler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
        data = []; // Empty array as fallback
      }
      
      setProducts(data);
      setFilteredProducts(data);
      
      // Benzersiz kategorileri çıkar
      const uniqueCategories = Array.from(
        new Set(
          data.flatMap(product => 
            product.categories && product.categories.length > 0 
              ? product.categories 
              : []
          )
        )
      );
      setCategories(uniqueCategories);
      
      // Toplam sayfa sayısını hesapla
      setTotalPages(Math.ceil(data.length / itemsPerPage));
    } catch (err) {
      setError("Ürünler yüklenirken bir hata oluştu");
      console.error("Genel veri yükleme hatası:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [itemsPerPage]);

  useEffect(() => {
    loadProducts();
    
    // URL'de refresh parametresi varsa, ürünleri yeniden yükle
    const shouldRefresh = checkRefreshParam();
    if (shouldRefresh) {
      loadProducts();
    }
  }, [loadProducts]);

  // Filtreleme ve sıralama işlemleri
  useEffect(() => {
    let result = [...products];
    
    // Arama filtresi
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchLower) || 
        product.description.toLowerCase().includes(searchLower) || 
        product.id.toLowerCase().includes(searchLower)
      );
    }
    
    // Kategori filtresi
    if (categoryFilter) {
      result = result.filter(product => 
        product.categories && 
        product.categories.some(cat => cat === categoryFilter)
      );
    }
    
    // Stok filtresi
    if (stockFilter === "in-stock") {
      result = result.filter(product => product.stock > 0);
    } else if (stockFilter === "out-of-stock") {
      result = result.filter(product => product.stock <= 0);
    }
    
    // Sıralama
    switch (sortOption) {
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "stock-asc":
        result.sort((a, b) => a.stock - b.stock);
        break;
      case "stock-desc":
        result.sort((a, b) => b.stock - a.stock);
        break;
    }
    
    setFilteredProducts(result);
    setTotalPages(Math.ceil(result.length / itemsPerPage));
    setCurrentPage(1); // Filtre değiştiğinde ilk sayfaya dön
  }, [products, searchTerm, categoryFilter, stockFilter, sortOption, itemsPerPage]);

  const handleDeleteClick = (productId: string) => {
    setDeleteConfirm(productId);
  };

  const handleCancelDelete = () => {
    setDeleteConfirm(null);
  };

  const handleConfirmDelete = async (productId: string) => {
    setDeleting(true);
    try {
      await deleteProduct(productId, loadProducts);
      // Silme işlemi başarılı olduktan sonra callback ile ürünler yeniden yükleniyor
      setDeleteConfirm(null);
    } catch (err) {
      setError("Ürün silinirken bir hata oluştu");
      console.error(err);
    } finally {
      setDeleting(false);
      setDeleteConfirm(null);
    }
  };
  
  const handleClearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
    setStockFilter("");
    setSortOption("name-asc");
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
  };

  // Mevcut sayfadaki ürünleri hesapla
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const handleRefresh = () => {
    setRefreshing(true);
    loadProducts();
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

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ürün Yönetimi</h1>
          <p className="mt-1 text-sm text-gray-600">
            Toplam {products.length} ürün bulunuyor
            {filteredProducts.length !== products.length && ` (Filtrelenmiş: ${filteredProducts.length})`}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FaSync className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Yenileniyor...' : 'Yenile'}
          </button>
          <Link 
            href="/admin/products/new" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FaPlus className="mr-2 h-4 w-4" />
            Yeni Ürün Ekle
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Hata! </strong>
          <span className="block sm:inline">{error}</span>
          <button 
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setError(null)}
          >
            <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <title>Kapat</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
            </svg>
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-5 rounded-lg shadow-sm mb-6">
        <div className="flex items-center mb-4">
          <FaFilter className="mr-2 text-gray-500" />
          <h2 className="text-lg font-medium text-gray-900">Filtreler</h2>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Ürün Ara</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                id="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ürün adı, açıklama veya ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="w-40">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <select
              id="category"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">Tümü</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="w-40">
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">Stok Durumu</label>
            <select
              id="stock"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
            >
              <option value="">Tümü</option>
              <option value="in-stock">Stokta Var</option>
              <option value="out-of-stock">Stokta Yok</option>
            </select>
          </div>
          <div className="w-40">
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">Sıralama</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSort className="h-4 w-4 text-gray-400" />
              </div>
              <select
                id="sort"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="name-asc">İsim (A-Z)</option>
                <option value="name-desc">İsim (Z-A)</option>
                <option value="price-asc">Fiyat (Artan)</option>
                <option value="price-desc">Fiyat (Azalan)</option>
                <option value="stock-asc">Stok (Artan)</option>
                <option value="stock-desc">Stok (Azalan)</option>
              </select>
            </div>
          </div>
          <div className="flex items-end">
            <button 
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              onClick={handleClearFilters}
            >
              Filtreleri Temizle
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ürün
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fiyat
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stok
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 relative rounded-full overflow-hidden">
                          <Image 
                            src={product.images[0] || 'https://placehold.co/40x40'} 
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">ID: {product.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.categories && product.categories.length > 0 
                          ? product.categories[0] 
                          : 'Kategorisiz'}
                      </div>
                      {product.categories && product.categories.length > 1 && (
                        <div className="text-xs text-gray-500">
                          +{product.categories.length - 1} diğer
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Intl.NumberFormat('tr-TR', {
                          style: 'currency',
                          currency: product.currency || 'TRY',
                        }).format(product.price)}
                      </div>
                      {product.discountedPrice && (
                        <div className="text-xs text-red-600">
                          İndirimli: {new Intl.NumberFormat('tr-TR', {
                            style: 'currency',
                            currency: product.currency || 'TRY',
                          }).format(product.discountedPrice)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.stock > 0 ? `${product.stock} adet` : 'Stokta yok'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        href={`/admin/products/${product.id}`} 
                        className="text-indigo-600 hover:text-indigo-900 inline-flex items-center mr-3"
                      >
                        <FaEdit className="h-4 w-4 mr-1" />
                        Düzenle
                      </Link>
                      {deleteConfirm === product.id ? (
                        <div className="inline-flex items-center">
                          <span className="mr-2 text-gray-700">Emin misiniz?</span>
                          <button 
                            onClick={() => handleConfirmDelete(product.id)}
                            disabled={deleting}
                            className="text-red-600 hover:text-red-900 inline-flex items-center mr-2"
                          >
                            {deleting ? 'Siliniyor...' : 'Evet'}
                          </button>
                          <button 
                            onClick={handleCancelDelete}
                            className="text-gray-600 hover:text-gray-900 inline-flex items-center"
                          >
                            Hayır
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleDeleteClick(product.id)}
                          className="text-red-600 hover:text-red-900 inline-flex items-center"
                        >
                          <FaTrash className="h-4 w-4 mr-1" />
                          Sil
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    {filteredProducts.length === 0 ? (
                      <>
                        <p>Hiç ürün bulunamadı.</p>
                        <Link href="/admin/products/new" className="mt-2 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800">
                          <FaPlus className="mr-1 h-3 w-3" />
                          Yeni Ürün Ekle
                        </Link>
                      </>
                    ) : (
                      <p>Filtrelere uygun ürün bulunamadı. Lütfen filtreleri değiştirin.</p>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center mb-4 sm:mb-0">
          <span className="text-sm text-gray-700 mr-2">Sayfa başına göster:</span>
          <select 
            className="border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        
        <div className="flex items-center">
          <div className="text-sm text-gray-700 mr-4">
            <span className="font-medium">{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredProducts.length)}</span> / <span className="font-medium">{filteredProducts.length}</span> ürün gösteriliyor
          </div>
          
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button 
              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 cursor-pointer'}`}
              onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <span className="sr-only">Önceki</span>
              <FaChevronLeft className="h-4 w-4" />
            </button>
            
            {/* Sayfa numaraları */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Toplam 5 sayfa numarası göster, mevcut sayfa ortada olacak şekilde
              let pageNum;
              if (totalPages <= 5) {
                // 5 veya daha az sayfa varsa, tüm sayfaları göster
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                // Başlangıçtayız, ilk 5 sayfayı göster
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                // Sondayız, son 5 sayfayı göster
                pageNum = totalPages - 4 + i;
              } else {
                // Ortadayız, mevcut sayfayı ortada göster
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${currentPage === pageNum ? 'bg-indigo-50 text-indigo-600 z-10' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button 
              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50 cursor-pointer'}`}
              onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <span className="sr-only">Sonraki</span>
              <FaChevronRight className="h-4 w-4" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
} 