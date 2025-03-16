'use client';

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaSearch, FaHeart, FaShoppingCart, FaPhone, FaEnvelope, FaUser, FaCog, FaBug, FaChevronRight, FaFacebook, FaInstagram, FaTwitter, FaMapMarkerAlt, FaHeadphones, FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { Product } from "@/services/productService";
import ProductPrice from "./ProductPrice";
import HeaderCurrencySelector from "./HeaderCurrencySelector";
import CartButton from "./CartButton";
import AddToCartButton from './AddToCartButton';
import { useState, useEffect } from "react";

// Helper function to normalize HTML content
const normalizeHtmlContent = (content: string): string => {
  if (!content) return "";
  return content.replace(/<STYLE>/g, '<style>').replace(/<\/STYLE>/g, '</style>');
};

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
  categories: {
    enabled: boolean;
    title: string;
    subtitle: string;
    items: Array<{
      id: string;
      name: string;
      image: string;
    }>;
  };
  heroSection: {
    enabled: boolean;
    title: string;
    subtitle: string;
    buttonText: string;
    backgroundImage: string;
  };
  featuredProducts: {
    enabled: boolean;
    title: string;
    subtitle: string;
    productIds: string[];
  };
  aboutSection: {
    enabled: boolean;
    title: string;
    content: string;
    image: string;
  };
};

export function HomeClient({ products, layoutSettings }: { products: Product[], layoutSettings: LayoutSettings }) {
  // Ürünleri kategorilere göre grupla
  const productsByCategory: Record<string, Product[]> = {};
  products.forEach(product => {
    if (product.categories && product.categories.length > 0) {
      const category = product.categories[0];
      if (!productsByCategory[category]) {
        productsByCategory[category] = [];
      }
      productsByCategory[category].push(product);
    }
  });

  // Seçili kategori için state
  const [selectedCategory, setSelectedCategory] = useState<string>(
    Object.keys(productsByCategory).length > 0 ? Object.keys(productsByCategory)[0] : ''
  );

  // Yeni Ürünler için pagination state'leri
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [sortedProducts, setSortedProducts] = useState<Product[]>([]);

  // Ürünleri ID'lerine göre sırala ve state'e kaydet
  useEffect(() => {
    // Ürünleri ID'lerine göre sırala (en yüksekten en düşüğe - varsayılan olarak en yeni ürünlerin ID'si daha yüksek olur)
    const sorted = [...products].sort((a, b) => {
      // Sayısal ID'ler için
      const idA = parseInt(a.id) || 0;
      const idB = parseInt(b.id) || 0;
      return idB - idA;
    });
    setSortedProducts(sorted);
  }, [products]);

  // Pagination hesaplamaları
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  // Sayfa değiştirme fonksiyonu
  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // İlk harfi büyük yapma fonksiyonu
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // İletişim bilgilerini güncelle
  const contactInfo = {
    phone: "+90 554 302 80 98",
    email: "info@senfonimuzikaletleri.com",
    address: "19 Mayıs mh, Kemal Atatürk Cd. 26/B, 34500 Büyükçekmece/İstanbul",
    socialMedia: layoutSettings.contactInfo.socialMedia
  };

  // Scroll durumunu takip etmek için state
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hero slider için state
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroSlides = [
    {
      image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070",
      title: "Müziğin Büyülü Dünyasına Hoş Geldiniz",
      subtitle: "En kaliteli müzik aletleri ve ekipmanları ile tutkularınızı keşfedin"
    },
    {
      image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070",
      title: "Yeni Sezon Ürünleri",
      subtitle: "En yeni ve en popüler müzik aletleri şimdi mağazamızda"
    },
    {
      image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=2070",
      title: "Profesyonel Ekipmanlar",
      subtitle: "Stüdyo kalitesinde ses için ihtiyacınız olan her şey"
    },
    {
      image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=2070",
      title: "Müzik Eğitimi",
      subtitle: "Profesyonel eğitmenlerle müzik yolculuğunuza başlayın"
    },
    {
      image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=80&w=2070",
      title: "Konser ve Etkinlikler",
      subtitle: "Yaklaşan konser ve etkinliklerimizi kaçırmayın"
    }
  ];

  // Slider için otomatik geçiş
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  // Bir sonraki slide'a geçiş
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  // Bir önceki slide'a geçiş
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  // Scroll olayını dinle
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <main>
        {/* Hero Section */}
        {layoutSettings.heroSection.enabled && (
          <section className="relative">
            <div className="h-screen min-h-[700px] relative overflow-hidden">
              {heroSlides.map((slide, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: currentSlide === index ? 1 : 0,
                    zIndex: currentSlide === index ? 10 : 0
                  }}
                  transition={{ duration: 1 }}
                  className="absolute inset-0"
                >
                  <Image 
                    src={slide.image}
                    alt={`Hero Banner ${index + 1}`}
                    fill
                    priority
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
                </motion.div>
              ))}
              
              {/* Hero Content */}
              <div className="absolute inset-0 z-20 flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-24">
                  <motion.div 
                    key={currentSlide}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-2xl text-white"
                  >
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                      {heroSlides[currentSlide].title}
                    </h1>
                    <p className="text-xl md:text-2xl mb-10 text-gray-200 leading-relaxed">
                      {heroSlides[currentSlide].subtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link 
                        href="/urunler" 
                        className="inline-flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        {layoutSettings.heroSection.buttonText}
                        <FaChevronRight className="ml-2" />
                      </Link>
                      <Link 
                        href="/konserler" 
                        className="inline-flex items-center justify-center bg-transparent border-2 border-white hover:bg-white/10 text-white font-medium py-3 px-8 rounded-full transition-all duration-300"
                      >
                        <FaHeadphones className="mr-2" />
                        Etkinlikleri Keşfet
                      </Link>
                    </div>
                    
                    {/* Slider Indicators */}
                    <div className="mt-16 flex space-x-3">
                      {heroSlides.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentSlide(index)}
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            currentSlide === index ? 'bg-red-600 w-10' : 'bg-white/50'
                          }`}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
              
              {/* Slider Navigation Buttons */}
              <div className="absolute inset-y-0 left-0 z-30 flex items-center">
                <button 
                  onClick={prevSlide}
                  className="bg-black/30 hover:bg-black/50 text-white p-3 ml-4 rounded-full transition-all duration-300 backdrop-blur-sm"
                  aria-label="Previous slide"
                >
                  <FaArrowLeft />
                </button>
              </div>
              <div className="absolute inset-y-0 right-0 z-30 flex items-center">
                <button 
                  onClick={nextSlide}
                  className="bg-black/30 hover:bg-black/50 text-white p-3 mr-4 rounded-full transition-all duration-300 backdrop-blur-sm"
                  aria-label="Next slide"
                >
                  <FaArrowRight />
                </button>
              </div>
              
              {/* Scroll İndikatörü */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 1 }}
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center z-20"
              >
                <span className="text-white text-sm mb-2">Keşfetmeye Başla</span>
                <motion.div 
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-6 h-10 border-2 border-white rounded-full flex justify-center pt-1"
                >
                  <motion.div 
                    animate={{ height: [5, 15, 5] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-1 bg-white rounded-full"
                  />
                </motion.div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Yeni Ürünler */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Yeni Ürünler</h2>
                <Link 
                  href="/urunler" 
                  className="text-red-600 hover:text-red-700 font-medium flex items-center"
                >
                  Tümünü Gör
                  <FaChevronRight className="ml-1" />
                </Link>
              </div>
            </motion.div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {currentProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(index * 0.05, 0.3) }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-10">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-md ${
                      currentPage === 1 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    aria-label="Previous page"
                  >
                    <FaArrowLeft className="w-5 h-5" />
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                    // Sayfa numaralarını hesapla
                    let pageNum;
                    if (totalPages <= 5) {
                      // 5 veya daha az sayfa varsa, tüm sayfaları göster
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      // Başlangıçtaysa, ilk 5 sayfayı göster
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      // Sondaysa, son 5 sayfayı göster
                      pageNum = totalPages - 4 + i;
                    } else {
                      // Ortadaysa, mevcut sayfanın etrafındaki sayfaları göster
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={i}
                        onClick={() => paginate(pageNum)}
                        className={`w-10 h-10 rounded-md ${
                          currentPage === pageNum
                            ? 'bg-red-600 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-md ${
                      currentPage === totalPages
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    aria-label="Next page"
                  >
                    <FaArrowRight className="w-5 h-5" />
                  </button>
                </nav>
              </div>
            )}
          </div>
        </section>

        {/* Popüler Kategoriler */}
        <div className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <h2 className="text-3xl font-bold text-gray-900">Popüler Kategoriler</h2>
              <div className="mt-4 border-b border-gray-200">
                <div className="flex space-x-8 overflow-x-auto pb-2 scrollbar-hide">
                  {Object.keys(productsByCategory).slice(0, 6).map((category, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setSelectedCategory(category)}
                      className={`py-2 px-1 font-medium border-b-2 ${
                        category === selectedCategory ? 'border-red-600 text-red-600' : 'border-transparent text-gray-600 hover:text-red-600'
                      } transition-all duration-300`}
                    >
                      {capitalizeFirstLetter(category)}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {Object.keys(productsByCategory).length > 0 && 
                productsByCategory[selectedCategory]
                  .slice(0, 10)
                  .map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
            </div>
          </div>
        </div>

        {/* Hakkımızda Bölümü */}
        {layoutSettings.aboutSection.enabled && (
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="relative rounded-xl overflow-hidden shadow-xl bg-gradient-to-tr from-red-600 to-red-400 p-8 text-white"
                >
                  <div className="text-8xl mb-4">🎵</div>
                  <h3 className="text-2xl font-bold mb-4">Müzik Tutkusu</h3>
                  <p className="text-white/80">
                    Senfoni olarak, müziğin hayatımızdaki önemini biliyor ve bu tutkuyu sizlerle paylaşıyoruz. 
                    En kaliteli müzik aletleri ve ekipmanlarıyla müzik yolculuğunuzda yanınızdayız.
                  </p>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-col justify-center"
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">{layoutSettings.aboutSection.title}</h2>
                  <div 
                    className="prose prose-lg text-gray-600 max-w-none"
                    dangerouslySetInnerHTML={{ __html: normalizeHtmlContent(layoutSettings.aboutSection.content) }}
                  />
                  <div className="mt-8">
                    <Link href="/hakkimizda" className="inline-flex items-center text-red-600 font-medium hover:text-red-700 transition-colors">
                      Daha Fazla Bilgi
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        )}
      </main>

      <div className="fixed bottom-4 left-4 z-50">
        <a href="http://wa.me/+905543028098" target="_blank" rel="noopener noreferrer">
          <div className="bg-green-500 text-white p-3 rounded-full shadow-lg flex items-center space-x-2">
            <FaPhone className="text-white" />
            <span>WhatsApp</span>
          </div>
        </a>
      </div>
    </div>
  );
}

// ProductCard bileşeni
function ProductCard({ product }: { product: Product }) {
  const discountPercentage = product.discountPercentage || 0;
  const discountedPrice = discountPercentage > 0 
    ? product.price * (1 - discountPercentage / 100) 
    : null;
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 group"
    >
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
          {/* Stok durumu için sadece sınırlı stok bilgisi gösterelim */}
          {product.stock && product.stock <= 5 && product.stock > 0 && (
            <div className="absolute top-2 left-2 bg-amber-500 text-white text-sm font-bold px-2 py-1 rounded-full">
              Sınırlı Stok
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">
            {product.description ? product.description.replace(/<[^>]*>/g, '') : ''}
          </p>
          <div className="mt-2 flex items-center justify-between">
            <ProductPrice 
              price={product.price}
              discountedPrice={discountedPrice}
              currency={product.currency as any || 'TRY'}
              size="md"
            />
            <AddToCartButton
              id={product.id}
              name={product.name}
              price={product.price}
              discountedPrice={discountedPrice}
              currency={product.currency as any || 'TRY'}
              image={product.image || (product.images && product.images.length > 0 ? product.images[0] : undefined)}
              className="p-2 rounded-full"
              variant="secondary"
              showIcon={true}
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
} 