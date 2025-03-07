'use client';

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaShoppingCart, FaPhone, FaEnvelope, FaUser, FaCog, FaBug, FaFilter, FaSearch, FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";
import { Product } from "@/services/productService";
import ProductPrice from "./ProductPrice";
import HeaderCurrencySelector from "./HeaderCurrencySelector";
import CartButton from "./CartButton";
import AddToCartButton from './AddToCartButton';

// Product tipini genişlet
interface ExtendedProduct extends Product {
  category?: string;
}

type LayoutSettings = {
  contactInfo: {
    phone: string;
    email: string;
    address: string;
    socialMedia: {
      facebook: string;
      instagram: string;
      twitter: string;
    };
  };
};

export default function UrunlerClient({ products, layoutSettings }: { products: ExtendedProduct[], layoutSettings: LayoutSettings }) {
  const [filteredProducts, setFilteredProducts] = useState<ExtendedProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Ürün kategorileri
  const categories = useMemo(() => {
    return [...new Set(products.map(product => 
      product.categories && product.categories.length > 0 ? product.categories[0] : null
    ))].filter(Boolean) as string[];
  }, [products]);
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Fiyat aralığını belirle
  useEffect(() => {
    if (products.length > 0) {
      const prices = products.map(p => p.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      setPriceRange([minPrice, maxPrice]);
    }
  }, [products]);
  
  // Filtreleme işlemi
  useEffect(() => {
    setIsLoading(true);
    
    // Performans için debounce kullanarak filtreleme işlemini optimize ediyoruz
    const filterTimer = setTimeout(() => {
      // Memoize filtreleme işlemi için useMemo kullanımı
      const getFilteredProducts = () => {
        let result = [...products];
        
        // Arama terimine göre filtrele
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          result = result.filter(product => 
            product.name.toLowerCase().includes(searchLower) ||
            (product.description && typeof product.description === 'string' && 
             product.description.toLowerCase().includes(searchLower))
          );
        }
        
        // Kategoriye göre filtrele
        if (selectedCategory) {
          result = result.filter(product => 
            product.categories && product.categories.includes(selectedCategory)
          );
        }
        
        // Sıralama
        result.sort((a, b) => {
          if (sortOrder === "asc") {
            return a.price - b.price;
          } else {
            return b.price - a.price;
          }
        });
        
        return result;
      };
      
      // Filtreleme işlemini çalıştır
      setFilteredProducts(getFilteredProducts());
      setIsLoading(false);
    }, 300); // 300ms gecikme
    
    return () => clearTimeout(filterTimer);
  }, [products, searchTerm, selectedCategory, sortOrder]);
  
  // Sıralama değiştirme
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // Sayfa ilk yüklendiğinde
  useEffect(() => {
    // Sayfa yüklendiğinde tüm ürünleri göster
    setFilteredProducts(products);
    
    // Sayfa yüklendikten sonra loading durumunu kaldır
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [products]);
  
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Üst Bar */}
          <div className="flex justify-between items-center py-2 text-sm border-b border-gray-100">
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 hover:text-red-600 transition-colors flex items-center">
                <FaPhone className="mr-2" />
                {layoutSettings.contactInfo.phone.replace(/\+90\s\d{3}\s\d{3}\s\d{2}\s\d{2}/, '+90 554 302 80 98')}
              </span>
              <span className="text-gray-600 hover:text-red-600 transition-colors flex items-center">
                <FaEnvelope className="mr-2" />
                {layoutSettings.contactInfo.email}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <HeaderCurrencySelector />
              <Link href="/hesabim" className="text-gray-600 hover:text-red-600 transition-colors flex items-center">
                <FaUser className="mr-1" /> Hesabım
              </Link>
            </div>
          </div>
          
          {/* Ana Menü */}
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center">
              <Image 
                src="/logo.png" 
                alt="Senfoni Müzik" 
                width={150} 
                height={50} 
                className="h-10 w-auto"
              />
            </Link>
            
            {/* Arama Kutusu */}
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ürün, kategori veya marka ara..."
                  className="w-full py-2 px-4 pr-10 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 transition-all bg-gray-100 border border-gray-200 text-gray-800"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="absolute right-0 top-0 h-full px-4 text-gray-500 hover:text-red-500">
                  <FaSearch />
                </button>
              </div>
            </div>
            
            {/* Masaüstü Menü */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-red-500 transition-colors font-medium">
                Ana Sayfa
              </Link>
              <Link href="/urunler" className="text-red-500 transition-colors font-medium">
                Ürünler
              </Link>
              <Link href="/konserler" className="text-gray-700 hover:text-red-500 transition-colors font-medium">
                Etkinlikler
              </Link>
              <CartButton />
            </div>
            
            {/* Mobil Menü Butonu */}
            <div className="md:hidden flex items-center">
              <button 
                className="text-gray-700 hover:text-red-500 transition-colors p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          {/* Mobil Menü */}
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white mt-4 rounded-lg shadow-lg overflow-hidden"
            >
              <div className="py-2 px-4">
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Ürün, kategori veya marka ara..."
                    className="w-full py-2 px-4 pr-10 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button className="absolute right-0 top-0 h-full px-4 text-gray-500 hover:text-red-500">
                    <FaSearch />
                  </button>
                </div>
                
                <nav className="space-y-3">
                  <Link href="/" className="block py-2 px-4 text-gray-700 hover:bg-red-50 hover:text-red-500 rounded-lg">
                    Ana Sayfa
                  </Link>
                  <Link href="/urunler" className="block py-2 px-4 text-red-500 bg-red-50 rounded-lg">
                    Ürünler
                  </Link>
                  <Link href="/konserler" className="block py-2 px-4 text-gray-700 hover:bg-red-50 hover:text-red-500 rounded-lg">
                    Etkinlikler
                  </Link>
                  <Link href="/hesabim" className="block py-2 px-4 text-gray-700 hover:bg-red-50 hover:text-red-500 rounded-lg">
                    Hesabım
                  </Link>
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex items-center justify-between py-2 px-4 text-gray-500">
                      <span>İletişim</span>
                    </div>
                    <div className="space-y-2 px-4 pb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <FaPhone className="mr-3 text-red-500" />
                        {layoutSettings.contactInfo.phone.replace(/\+90\s\d{3}\s\d{3}\s\d{2}\s\d{2}/, '+90 554 302 80 98')}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <FaEnvelope className="mr-3 text-red-500" />
                        {layoutSettings.contactInfo.email}
                      </div>
                    </div>
                  </div>
                </nav>
              </div>
            </motion.div>
          )}
        </div>
      </header>

      <main>
        {/* Ürünler Başlık */}
        <div className="bg-gradient-to-r from-gray-900 to-red-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold">Ürünler</h1>
              <p className="mt-4 text-lg text-gray-200 max-w-2xl mx-auto">
                Müzik aletleri ve ekipmanlarını keşfedin. Kaliteli ve profesyonel ürünlerle müziğinizi bir üst seviyeye taşıyın.
              </p>
            </div>
          </div>
        </div>

        {/* Filtreleme ve Arama */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            {/* Arama */}
            <div className="relative w-full md:w-1/3">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Ürün ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
              />
            </div>
            
            {/* Filtre Butonları */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
              >
                <FaFilter className={showFilters ? "text-red-500" : "text-gray-500"} />
                <span>{showFilters ? "Filtreleri Gizle" : "Filtrele"}</span>
              </button>
              
              <button 
                onClick={toggleSortOrder}
                className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
              >
                {sortOrder === "asc" ? (
                  <>
                    <FaSortAmountUp className="text-gray-500" />
                    <span>Artan Fiyat</span>
                  </>
                ) : (
                  <>
                    <FaSortAmountDown className="text-gray-500" />
                    <span>Azalan Fiyat</span>
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Filtre Paneli */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm"
            >
              <h3 className="text-lg font-medium mb-4">Filtreler</h3>
              
              {/* Kategori Filtreleri */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Kategoriler</h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                      selectedCategory === null
                        ? "bg-red-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Tümü
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1.5 text-sm rounded-md transition-all ${
                        selectedCategory === category
                          ? "bg-red-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Ürün Listesi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {isLoading ? (
              // Loading durumunda skeleton göster
              Array.from({ length: 8 }).map((_, index) => (
                <div key={`skeleton-${index}`} className="bg-white rounded-xl overflow-hidden shadow-sm h-[400px]">
                  <div className="aspect-square bg-gray-200 animate-pulse"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    <div className="mt-4 h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                  </div>
                </div>
              ))
            ) : (
              filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.05, 0.3) }} // Maksimum 300ms gecikme
                >
                  <ProductCard product={product} />
                </motion.div>
              ))
            )}
          </div>
          
          {!isLoading && filteredProducts.length === 0 && (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <FaSearch className="mx-auto text-gray-300 text-5xl mb-4" />
              <p className="text-gray-500 text-lg font-medium">Aradığınız kriterlere uygun ürün bulunamadı.</p>
              <p className="text-gray-400 mt-2">Lütfen farklı arama kriterleri deneyin veya filtreleri temizleyin.</p>
              <button 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory(null);
                }}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Filtreleri Temizle
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:order-2">
              <Link href={layoutSettings.contactInfo.socialMedia.facebook} className="text-gray-400 hover:text-white mx-2">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link href={layoutSettings.contactInfo.socialMedia.instagram} className="text-gray-400 hover:text-white mx-2">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link href={layoutSettings.contactInfo.socialMedia.twitter} className="text-gray-400 hover:text-white mx-2">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
            </div>
            <div className="mt-8 md:mt-0 md:order-1">
              <p className="text-center text-base text-gray-400">
                &copy; {new Date().getFullYear()} Senfoni Müzik. Tüm hakları saklıdır.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ProductCard bileşeni
function ProductCard({ product }: { product: ExtendedProduct }) {
  const discountPercentage = product.discountPercentage || 0;
  const discountedPrice = discountPercentage > 0 
    ? product.price * (1 - discountPercentage / 100) 
    : null;
  
  // Kategori bilgisini al
  const category = product.categories && product.categories.length > 0 
    ? product.categories[0] 
    : null;
  
  // CDATA içeriğini ve HTML içeriğini işle
  const processDescription = (desc: any): string => {
    if (!desc) return "";
    if (typeof desc === 'string') {
      // Normalize style tags to lowercase
      return desc.replace(/<STYLE>/g, '<style>').replace(/<\/STYLE>/g, '</style>');
    }
    if (desc.__cdata) {
      // Normalize style tags to lowercase in CDATA
      return desc.__cdata.replace(/<STYLE>/g, '<style>').replace(/<\/STYLE>/g, '</style>');
    }
    if (typeof desc === 'object') return JSON.stringify(desc);
    return String(desc);
  };
  
  // HTML içeriğini güvenli bir şekilde render et
  const createMarkup = (htmlContent: string) => {
    return { __html: htmlContent };
  };
  
  // Ürün resmi için fallback mekanizması
  const productImage = product.image || 
    (product.images && product.images.length > 0 ? 
      product.images[0] : 
      "https://placehold.co/300x300");
  
  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/urun/${product.id}`} className="block h-full">
          <div className="absolute inset-0 bg-gray-100 animate-pulse"></div>
          <Image
            src={productImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover z-10 group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onLoadingComplete={(img) => {
              // Remove loading animation when image loads
              img.parentElement?.querySelector('.animate-pulse')?.classList.add('hidden');
            }}
          />
          {discountPercentage > 0 && (
            <span className="absolute top-2 left-2 z-20 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md">
              %{discountPercentage} İndirim
            </span>
          )}
          {product.stock && product.stock <= 5 && (
            <span className="absolute top-2 right-2 z-20 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-md">
              Sınırlı Stok
            </span>
          )}
        </Link>
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        {category && (
          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md mb-2">
            {category}
          </span>
        )}
        
        <Link href={`/urun/${product.id}`} className="block flex-grow">
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
            {product.name}
          </h3>
          {product.description && (
            <div className="text-gray-500 text-sm line-clamp-2 mb-3 product-description">
              <div 
                dangerouslySetInnerHTML={createMarkup(processDescription(product.description))} 
                className="prose prose-sm max-w-none"
              />
            </div>
          )}
        </Link>
        
        <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center">
          <div>
            {discountedPrice ? (
              <div className="flex flex-col">
                <span className="text-gray-400 line-through text-xs">
                  <ProductPrice price={product.price} />
                </span>
                <span className="text-red-600 font-bold">
                  <ProductPrice price={discountedPrice} />
                </span>
              </div>
            ) : (
              <span className="text-gray-900 font-bold">
                <ProductPrice price={product.price} />
              </span>
            )}
          </div>
          
          <AddToCartButton
            id={product.id}
            name={product.name}
            price={product.price}
            discountedPrice={discountedPrice}
            currency={product.currency}
            image={productImage}
          />
        </div>
      </div>
    </div>
  );
} 