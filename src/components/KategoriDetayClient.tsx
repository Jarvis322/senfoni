'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { FaShoppingCart, FaPhone, FaEnvelope, FaUser, FaCog, FaBug, FaSearch, FaFilter, FaSortAmountDown } from "react-icons/fa";
import HeaderCurrencySelector from "./HeaderCurrencySelector";
import CartButton from "./CartButton";
import { LayoutSettings } from "@/services/layoutService";
import { Category } from "@/services/categoryService";
import { Product } from "@/services/productService";
import ProductPrice from "@/components/ProductPrice";
import AddToCartButton from '@/components/AddToCartButton';
import { Currency } from '@/types/currency';

interface KategoriDetayClientProps {
  layoutSettings: LayoutSettings;
  category: Category;
  products: Product[];
}

export default function KategoriDetayClient({ layoutSettings, category, products }: KategoriDetayClientProps) {
  const [sortBy, setSortBy] = useState<string>('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Ürünlerin fiyat aralığını belirle
  useEffect(() => {
    if (products.length > 0) {
      const prices = products.map(p => p.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      setPriceRange([0, Math.ceil(maxPrice * 1.1)]); // Maksimum fiyatı biraz daha yüksek tutuyoruz
      console.log(`Fiyat aralığı otomatik ayarlandı: ${minPrice} - ${maxPrice}`);
    }
  }, [products]);
  
  // Benzersiz markaları çıkar
  const brands = useMemo(() => {
    const brandSet = new Set<string>();
    products.forEach(product => {
      if (product.brand) {
        brandSet.add(product.brand);
      }
    });
    return Array.from(brandSet);
  }, [products]);
  
  // Ürünleri sırala
  const sortedProducts = useMemo(() => {
    console.log(`Sıralanacak ürün sayısı: ${products.length}`);
    
    return [...products].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
  }, [products, sortBy]);
  
  // Ürünleri filtrele
  const filteredProducts = useMemo(() => {
    console.log(`Filtrelenecek ürün sayısı: ${sortedProducts.length}`);
    console.log(`Seçili markalar: ${selectedBrands.join(', ') || 'Yok'}`);
    console.log(`Fiyat aralığı: ${priceRange[0]} - ${priceRange[1]}`);
    
    // Filtreleme işlemi öncesi ürünleri kontrol et
    sortedProducts.forEach((product, index) => {
      if (index < 5) { // İlk 5 ürünü logla
        console.log(`Ürün ${index + 1}: ${product.name}, Fiyat: ${product.price}, Marka: ${product.brand || 'Belirtilmemiş'}`);
      }
    });
    
    const filtered = sortedProducts.filter(product => {
      // Fiyat aralığı kontrolü
      const priceCheck = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      // Marka kontrolü
      const brandCheck = selectedBrands.length === 0 || 
        (product.brand && selectedBrands.includes(product.brand));
      
      // Filtreleme sonucunu logla
      if (!priceCheck) {
        console.log(`Ürün fiyat filtresine takıldı: ${product.name}, Fiyat: ${product.price}`);
      }
      
      if (!brandCheck) {
        console.log(`Ürün marka filtresine takıldı: ${product.name}, Marka: ${product.brand || 'Belirtilmemiş'}`);
      }
      
      return priceCheck && brandCheck;
    });
    
    console.log(`Filtreleme sonrası ürün sayısı: ${filtered.length}`);
    return filtered;
  }, [sortedProducts, priceRange, selectedBrands]);
  
  console.log(`Kategori: ${category.name}, Toplam ürün: ${products.length}, Filtrelenmiş ürün: ${filteredProducts.length}`);
  
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Üst Bar */}
          <div className="flex justify-between items-center py-2 text-sm border-b border-gray-100">
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 flex items-center">
                <FaPhone className="mr-2" />
                {layoutSettings.contactInfo.phone}
              </span>
              <span className="text-gray-600 flex items-center">
                <FaEnvelope className="mr-2" />
                {layoutSettings.contactInfo.email}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <HeaderCurrencySelector />
              <Link href="/hesabim" className="text-gray-600 hover:text-red-600 transition-colors">
                <FaUser className="inline mr-1" /> Hesabım
              </Link>
              <Link href="/admin" className="text-gray-600 hover:text-red-600 transition-colors">
                <FaCog className="inline mr-1" /> Yönetim
              </Link>
              <Link href="/debug" className="text-gray-600 hover:text-red-600 transition-colors">
                <FaBug className="inline mr-1" /> Debug
              </Link>
            </div>
          </div>
          
          {/* Ana Menü */}
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Image 
                  src="/logo.png" 
                  alt="Senfoni Müzik" 
                  width={150} 
                  height={50} 
                  className="h-10 w-auto"
                />
              </Link>
            </div>
            
            {/* Arama Kutusu */}
            <div className="flex-1 max-w-xl mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ürün, kategori veya marka ara..."
                  className="w-full py-2 px-4 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <button className="absolute right-0 top-0 h-full px-4 text-gray-500 hover:text-red-600">
                  <FaSearch />
                </button>
              </div>
            </div>
            
            {/* Sepet ve Favoriler */}
            <div className="flex items-center space-x-6">
              <Link href="/favoriler" className="text-gray-700 hover:text-red-600 relative">
                <FaShoppingCart className="text-2xl" />
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
              </Link>
              <CartButton />
            </div>
          </div>
          
          {/* Kategoriler Menüsü */}
          <nav className="bg-gray-100 py-3 px-4 rounded-lg mb-4">
            <ul className="flex space-x-6 overflow-x-auto">
              {layoutSettings.categories.items.map((category) => (
                <li key={category.id}>
                  <Link href={`/kategori/${category.id}`} className="text-gray-700 hover:text-red-600 whitespace-nowrap font-medium">
                    {category.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/kategoriler" className="text-gray-700 hover:text-red-600 whitespace-nowrap font-medium">
                  Tüm Kategoriler
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-6 text-sm text-gray-500">
          <Link href="/" className="hover:text-red-600">Ana Sayfa</Link>
          <span className="mx-2">/</span>
          <Link href="/kategoriler" className="hover:text-red-600">Kategoriler</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-700 font-medium">{category.name}</span>
        </nav>
        
        {/* Kategori Banner */}
        <div className="relative w-full h-64 rounded-lg overflow-hidden mb-8">
          <Image
            src={category.image || "https://placehold.co/1200x400?text=Kategori"}
            alt={category.name}
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
            <div className="p-8">
              <h1 className="text-4xl font-bold text-white mb-2">{category.name}</h1>
              <p className="text-white/80 max-w-xl">{category.description}</p>
            </div>
          </div>
        </div>
        
        <div className="lg:flex gap-8">
          {/* Filtreler - Mobil */}
          <div className="lg:hidden mb-4">
            <button 
              onClick={() => setFilterOpen(!filterOpen)}
              className="w-full flex items-center justify-center gap-2 bg-gray-100 py-3 px-4 rounded-lg text-gray-700 font-medium"
            >
              <FaFilter /> Filtreler
            </button>
            
            {filterOpen && (
              <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4">
                <FilterSidebar 
                  brands={brands}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  selectedBrands={selectedBrands}
                  setSelectedBrands={setSelectedBrands}
                />
              </div>
            )}
          </div>
          
          {/* Filtreler - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-lg p-4 sticky top-4">
              <FilterSidebar 
                brands={brands}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                selectedBrands={selectedBrands}
                setSelectedBrands={setSelectedBrands}
              />
            </div>
          </div>
          
          {/* Ürün Listesi */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="text-gray-600">{filteredProducts.length} ürün bulundu</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600 text-sm">Sırala:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="featured">Öne Çıkanlar</option>
                  <option value="price-asc">Fiyat (Artan)</option>
                  <option value="price-desc">Fiyat (Azalan)</option>
                  <option value="name-asc">İsim (A-Z)</option>
                  <option value="name-desc">İsim (Z-A)</option>
                </select>
              </div>
            </div>
            
            {products.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Bu kategoride ürün bulunamadı</h2>
                <p className="text-gray-600 mb-4">Bu kategoride henüz ürün bulunmamaktadır.</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Filtrelere uygun ürün bulunamadı</h2>
                <p className="text-gray-600 mb-4">Seçtiğiniz filtrelere uygun ürün bulunamadı. Lütfen filtrelerinizi değiştirin.</p>
                <button 
                  onClick={() => {
                    setPriceRange([0, 50000]);
                    setSelectedBrands([]);
                  }}
                  className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Filtreleri Temizle
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white pt-12 pb-6 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Senfoni Müzik</h3>
              <p className="text-gray-400 mb-4">
                {layoutSettings.aboutSection.content.substring(0, 120)}...
              </p>
              <div className="flex space-x-4">
                {/* Social media links */}
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Hızlı Erişim</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-400 hover:text-white">Ana Sayfa</Link></li>
                <li><Link href="/urunler" className="text-gray-400 hover:text-white">Ürünler</Link></li>
                <li><Link href="/kategoriler" className="text-gray-400 hover:text-white">Kategoriler</Link></li>
                <li><Link href="/hakkimizda" className="text-gray-400 hover:text-white">Hakkımızda</Link></li>
                <li><Link href="/iletisim" className="text-gray-400 hover:text-white">İletişim</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Kategoriler</h3>
              <ul className="space-y-2">
                {layoutSettings.categories.items.slice(0, 5).map((category) => (
                  <li key={category.id}>
                    <Link href={`/kategori/${category.id}`} className="text-gray-400 hover:text-white">
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">İletişim</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span className="text-gray-400">{layoutSettings.contactInfo.address}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span className="text-gray-400">{layoutSettings.contactInfo.phone}</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span className="text-gray-400">{layoutSettings.contactInfo.email}</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} Senfoni Müzik. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Filtre Sidebar Bileşeni
interface FilterSidebarProps {
  brands: string[];
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  selectedBrands: string[];
  setSelectedBrands: (brands: string[]) => void;
}

function FilterSidebar({ brands, priceRange, setPriceRange, selectedBrands, setSelectedBrands }: FilterSidebarProps) {
  const handleBrandChange = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };
  
  const handlePriceChange = (min: number, max: number) => {
    setPriceRange([min, max]);
  };
  
  return (
    <div>
      <h3 className="text-lg font-bold text-gray-900 mb-4">Filtreler</h3>
      
      {/* Fiyat Aralığı */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Fiyat Aralığı</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Min: {priceRange[0]} TL</span>
            <span className="text-sm text-gray-600">Max: {priceRange[1]} TL</span>
          </div>
          <div className="flex gap-2">
            <input 
              type="number" 
              value={priceRange[0]}
              onChange={(e) => handlePriceChange(Number(e.target.value), priceRange[1])}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm"
              min="0"
              max={priceRange[1]}
            />
            <input 
              type="number" 
              value={priceRange[1]}
              onChange={(e) => handlePriceChange(priceRange[0], Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg p-2 text-sm"
              min={priceRange[0]}
            />
          </div>
        </div>
      </div>
      
      {/* Markalar */}
      {brands.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Markalar</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {brands.map(brand => (
              <div key={brand} className="flex items-center">
                <input
                  type="checkbox"
                  id={`brand-${brand}`}
                  checked={selectedBrands.includes(brand)}
                  onChange={() => handleBrandChange(brand)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label htmlFor={`brand-${brand}`} className="ml-2 text-sm text-gray-700">
                  {brand}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Filtre Temizleme */}
      <button
        onClick={() => {
          setPriceRange([0, 50000]);
          setSelectedBrands([]);
        }}
        className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm"
      >
        Filtreleri Temizle
      </button>
    </div>
  );
}

// Ürün Kartı Bileşeni
function ProductCard({ product }: { product: Product }) {
  const imageUrl = product.images && product.images.length > 0 
    ? product.images[0] 
    : 'https://placehold.co/300x300';
  
  return (
    <div className="group bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
      <Link href={`/urun/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
          {product.discountedPrice && (
            <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
              {Math.round((1 - product.discountedPrice / product.price) * 100)}% İndirim
            </div>
          )}
          <button className="absolute top-2 right-2 text-gray-400 hover:text-red-600 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
            <i className="far fa-heart"></i>
          </button>
        </div>
        
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 h-10 mb-1">{product.name}</h3>
          
          <div className="flex items-center mb-1">
            <div className="flex text-yellow-400">
              <i className="fas fa-star text-xs"></i>
              <i className="fas fa-star text-xs"></i>
              <i className="fas fa-star text-xs"></i>
              <i className="fas fa-star text-xs"></i>
              <i className="fas fa-star-half-alt text-xs"></i>
            </div>
            <span className="text-xs text-gray-500 ml-1">(4.5)</span>
          </div>
          
          <div className="mt-1">
            <ProductPrice 
              price={product.price}
              discountedPrice={product.discountedPrice}
              currency={product.currency as Currency}
              size="sm"
            />
          </div>
        </div>
      </Link>
      
      <div className="px-4 pb-4">
        <AddToCartButton 
          id={product.id}
          name={product.name}
          price={product.price}
          discountedPrice={product.discountedPrice}
          currency={product.currency as Currency}
          image={product.images && product.images.length > 0 ? product.images[0] : undefined}
          stock={product.stock || 0}
          className="w-full py-2 text-sm"
          fullWidth
        />
      </div>
    </div>
  );
} 