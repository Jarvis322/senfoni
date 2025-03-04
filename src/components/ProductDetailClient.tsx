'use client';

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { FaHeart, FaShoppingCart, FaTruck, FaShieldAlt, FaUndo } from "react-icons/fa";
import ProductPrice from "@/components/ProductPrice";
import AddToCartButton from '@/components/AddToCartButton';
import CartButton from '@/components/CartButton';
import HeaderCurrencySelector from '@/components/HeaderCurrencySelector';
import { Product } from "@/services/productService";
import { LayoutSettings } from "@/services/layoutService";

// CDATA içeriğini işleyen yardımcı fonksiyon
const processDescription = (desc: any): string => {
  if (!desc) return "";
  if (typeof desc === 'string') return desc;
  if (desc.__cdata) return desc.__cdata;
  if (typeof desc === 'object') return JSON.stringify(desc);
  return String(desc);
};

interface ProductDetailClientProps {
  product: Product;
  similarProducts: Product[];
  layoutSettings: LayoutSettings;
}

export default function ProductDetailClient({ product, similarProducts, layoutSettings }: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= (product.stock || 100)) {
      setQuantity(newQuantity);
    }
  };
  
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Üst Bar */}
          <div className="flex justify-between items-center py-2 text-sm border-b border-gray-100">
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 flex items-center">
                <FaShoppingCart className="mr-2" />
                {layoutSettings.contactInfo.phone}
              </span>
              <span className="text-gray-600 flex items-center">
                <FaShoppingCart className="mr-2" />
                {layoutSettings.contactInfo.email}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <HeaderCurrencySelector />
              <Link href="/hesabim" className="text-gray-600 hover:text-red-600 transition-colors">
                Hesabım
              </Link>
              <Link href="/admin" className="text-gray-600 hover:text-red-600 transition-colors">
                Yönetim
              </Link>
              <Link href="/debug" className="text-gray-600 hover:text-red-600 transition-colors">
                Debug
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
                  <FaShoppingCart />
                </button>
              </div>
            </div>
            
            {/* Sepet ve Favoriler */}
            <div className="flex items-center space-x-6">
              <Link href="/favoriler" className="text-gray-700 hover:text-red-600 relative">
                <FaHeart className="text-2xl" />
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
              </Link>
              <CartButton />
            </div>
          </div>
          
          {/* Kategoriler Menüsü */}
          <nav className="bg-gray-100 py-3 px-4 rounded-lg mb-4">
            <ul className="flex space-x-6 overflow-x-auto">
              {layoutSettings.categories.items.map((category: any) => (
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
          {product.categories && product.categories.length > 0 && (
            <>
              <Link href={`/kategori/${product.categories[0]}`} className="hover:text-red-600">
                {product.categories[0]}
              </Link>
              <span className="mx-2">/</span>
            </>
          )}
          <span className="text-gray-700 font-medium truncate">{product.name}</span>
        </nav>
        
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="lg:flex">
            {/* Ürün Görselleri */}
            <div className="lg:w-2/5">
              <div className="sticky top-6">
                <div className="relative h-96 w-full bg-gray-50 border rounded-lg overflow-hidden mb-4">
                  <Image
                    src={product.images?.[selectedImageIndex] || 'https://placehold.co/600x400'}
                    alt={product.name}
                    className="object-contain p-4"
                    fill
                  />
                  {product.discountedPrice && (
                    <div className="absolute top-4 left-4 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                      %{Math.round((1 - product.discountedPrice / product.price) * 100)} İndirim
                    </div>
                  )}
                </div>
                
                {product.images && product.images.length > 1 && (
                  <div className="grid grid-cols-5 gap-2">
                    {product.images.slice(0, 5).map((image, index) => (
                      <div 
                        key={index} 
                        className={`border rounded-lg overflow-hidden h-20 bg-gray-50 hover:border-red-500 cursor-pointer ${selectedImageIndex === index ? 'border-red-500' : ''}`}
                        onClick={() => setSelectedImageIndex(index)}
                      >
                        <Image
                          src={image}
                          alt={`${product.name} - Görsel ${index + 1}`}
                          className="object-contain p-1"
                          width={80}
                          height={80}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Ürün Bilgileri */}
            <div className="lg:w-3/5 lg:pl-10 mt-6 lg:mt-0">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
              
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {/* Star ratings */}
                </div>
                <span className="text-sm text-gray-500 ml-2">(4.5) - 12 Değerlendirme</span>
              </div>
              
              {product.brand && (
                <div className="mb-4 flex items-center">
                  <span className="text-gray-600 mr-2">Marka:</span>
                  <Link href={`/marka/${product.brand}`} className="text-red-600 hover:underline font-medium">
                    {product.brand}
                  </Link>
                </div>
              )}
              
              <div className="mb-6 pb-6 border-b border-gray-200">
                <ProductPrice 
                  price={product.price}
                  discountedPrice={product.discountedPrice}
                  currency={product.currency as any || 'TRY'}
                  showConverter={true}
                  size="lg"
                  className="mb-2"
                />
                
                <p className="text-sm text-gray-500 mt-2">
                  Farklı para birimlerinde görüntülemek için para birimi seçebilirsiniz.
                </p>
              </div>
              
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold mb-3">Ürün Açıklaması</h2>
                <div 
                  className="text-gray-700 leading-relaxed prose prose-sm max-w-none prose-headings:text-gray-900 prose-headings:font-semibold prose-a:text-red-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg" 
                  dangerouslySetInnerHTML={{ __html: processDescription(product.description) }} 
                />
              </div>
              
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-gray-700 font-medium mr-4">Adet:</span>
                    <div className="flex border border-gray-300 rounded-md">
                      <button 
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                        onClick={() => handleQuantityChange(quantity - 1)}
                      >
                        -
                      </button>
                      <input 
                        type="text" 
                        value={quantity} 
                        readOnly 
                        className="w-12 text-center border-x border-gray-300" 
                      />
                      <button 
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                        onClick={() => handleQuantityChange(quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stock > 0 ? 'Stokta' : 'Stokta Yok'}
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <AddToCartButton 
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    discountedPrice={product.discountedPrice}
                    currency={product.currency as any || 'TRY'}
                    image={product.images && product.images.length > 0 ? product.images[0] : undefined}
                    stock={product.stock}
                    quantity={quantity}
                    className="flex-1 py-3 px-4"
                    fullWidth
                  />
                  <button className="p-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                    <FaHeart />
                  </button>
                </div>
              </div>
              
              {product.categories && product.categories.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-3">Kategoriler</h2>
                  <div className="flex flex-wrap gap-2">
                    {product.categories.map((category, index) => (
                      <Link href={`/kategori/${category}`} key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors">
                        {category}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-6">
                <div className="flex items-center space-x-6 text-gray-600">
                  <div className="flex items-center">
                    <FaTruck className="text-red-600 mr-2" />
                    <span>Hızlı Teslimat</span>
                  </div>
                  <div className="flex items-center">
                    <FaShieldAlt className="text-red-600 mr-2" />
                    <span>Güvenli Ödeme</span>
                  </div>
                  <div className="flex items-center">
                    <FaUndo className="text-red-600 mr-2" />
                    <span>Kolay İade</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Benzer Ürünler */}
        {similarProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Benzer Ürünler</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {similarProducts.map(similarProduct => (
                <ProductCard key={similarProduct.id} product={similarProduct} />
              ))}
            </div>
          </div>
        )}
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
                {layoutSettings.categories.items.slice(0, 5).map((category: any) => (
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

// ProductCard component for similar products
function ProductCard({ product }: { product: Product }) {
  const discountPercentage = product.discountPercentage || 0;
  const discountedPrice = discountPercentage > 0 
    ? product.price * (1 - discountPercentage / 100) 
    : null;
  
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 group">
      <Link href={`/urun/${product.id}`}>
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          <Image
            src={product.image || (product.images && product.images.length > 0 ? product.images[0] : "https://placehold.co/300x300")}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="transform group-hover:scale-110 transition-transform duration-500 object-cover"
          />
          {discountPercentage > 0 && (
            <div className="absolute top-2 right-2 bg-red-600 text-white text-sm font-bold px-2 py-1 rounded-full">
              %{discountPercentage} İndirim
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
          <div className="mt-1 text-sm text-gray-500 line-clamp-2" dangerouslySetInnerHTML={{ __html: processDescription(product.description) }} />
          <div className="mt-2 flex items-center justify-between">
            <ProductPrice 
              price={product.price}
              discountedPrice={discountedPrice}
              currency={product.currency as any || 'TRY'}
              size="md"
            />
          </div>
        </div>
      </Link>
      <div className="px-4 pb-4">
        <AddToCartButton
          id={product.id}
          name={product.name}
          price={product.price}
          discountedPrice={discountedPrice}
          currency={product.currency as any || 'TRY'}
          image={product.image || (product.images && product.images.length > 0 ? product.images[0] : undefined)}
          className="w-full py-2"
          fullWidth
        />
      </div>
    </div>
  );
} 