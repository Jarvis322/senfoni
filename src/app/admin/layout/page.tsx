import Link from "next/link";
import Image from "next/image";
import { fetchLayoutSettings, HeroSection, FeaturedProducts, Categories, AboutSection, ContactInfo } from "@/services/layoutService";
import { 
  FaHome, FaImage, FaBoxOpen, FaLayerGroup, 
  FaInfoCircle, FaPhoneAlt, FaEdit, FaToggleOn, 
  FaToggleOff, FaChevronRight
} from "react-icons/fa";
import ToggleButton from "@/components/admin/ToggleButton";

// Extended interfaces for the UI components
interface HeroSlide {
  title: string;
  subtitle?: string;
  image: string;
}

interface Product {
  name: string;
  price: string;
  image: string;
}

export default async function LayoutManagementPage() {
  const layoutSettings = await fetchLayoutSettings();
  const { 
    heroSection = {} as HeroSection, 
    featuredProducts = {} as FeaturedProducts, 
    categories = {} as Categories, 
    aboutSection = {} as AboutSection, 
    contactInfo = {} as ContactInfo 
  } = layoutSettings || {};

  // Mock data for UI display
  const heroSlides: HeroSlide[] = [
    { title: heroSection?.title || "Ana Başlık", subtitle: heroSection?.subtitle, image: heroSection?.backgroundImage || "/images/placeholder.jpg" }
  ];

  const featuredProductsList: Product[] = featuredProducts?.productIds?.map((id, index) => ({
    name: `Ürün ${index + 1}`,
    price: "0",
    image: "/images/placeholder.jpg"
  })) || [];

  // Sayfa bölümleri
  const sections = [
    {
      id: "hero",
      title: "Ana Görsel (Hero)",
      description: "Ana sayfanın üst kısmında görünen büyük görsel ve metin alanı",
      icon: <FaHome className="w-5 h-5 text-indigo-500" />,
      enabled: heroSection?.enabled || false,
      editUrl: "/admin/layout/edit/hero",
      preview: heroSection?.backgroundImage,
      fields: [
        { name: "Başlık", value: heroSection?.title || "" },
        { name: "Alt Başlık", value: heroSection?.subtitle || "" },
        { name: "Buton Metni", value: heroSection?.buttonText || "" }
      ]
    },
    {
      id: "featured",
      title: "Öne Çıkan Ürünler",
      description: "Ana sayfada gösterilecek öne çıkan ürünler",
      icon: <FaBoxOpen className="w-5 h-5 text-amber-500" />,
      enabled: featuredProducts?.enabled || false,
      editUrl: "/admin/layout/edit/featured",
      fields: [
        { name: "Başlık", value: featuredProducts?.title || "" },
        { name: "Alt Başlık", value: featuredProducts?.subtitle || "" },
        { name: "Ürün Sayısı", value: featuredProducts?.productIds?.length || 0 }
      ]
    },
    {
      id: "categories",
      title: "Kategoriler",
      description: "Ana sayfada gösterilecek ürün kategorileri",
      icon: <FaLayerGroup className="w-5 h-5 text-green-500" />,
      enabled: categories?.enabled || false,
      editUrl: "/admin/layout/edit/categories",
      fields: [
        { name: "Başlık", value: categories?.title || "" },
        { name: "Alt Başlık", value: categories?.subtitle || "" },
        { name: "Kategori Sayısı", value: categories?.items?.length || 0 }
      ]
    },
    {
      id: "about",
      title: "Hakkımızda",
      description: "Ana sayfada gösterilecek hakkımızda bölümü",
      icon: <FaInfoCircle className="w-5 h-5 text-blue-500" />,
      enabled: aboutSection?.enabled || false,
      editUrl: "/admin/layout/edit/about",
      preview: aboutSection?.image,
      fields: [
        { name: "Başlık", value: aboutSection?.title || "" },
        { name: "İçerik", value: aboutSection?.content ? aboutSection.content.substring(0, 50) + "..." : "" }
      ]
    },
    {
      id: "contact",
      title: "İletişim Bilgileri",
      description: "Tüm sayfalarda görünen iletişim bilgileri",
      icon: <FaPhoneAlt className="w-5 h-5 text-red-500" />,
      enabled: true,
      editUrl: "/admin/layout/edit/contact",
      fields: [
        { name: "Adres", value: contactInfo?.address || "" },
        { name: "Telefon", value: contactInfo?.phone || "" },
        { name: "E-posta", value: contactInfo?.email || "" }
      ]
    }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Sayfa Düzeni Yönetimi</h1>
      
      <div className="grid grid-cols-1 gap-6">
        {/* Hero Bölümü */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center">
              <FaHome className="w-5 h-5 text-blue-500 mr-3" />
              <div>
                <h2 className="text-lg font-medium text-gray-900">Hero Bölümü</h2>
                <p className="text-sm text-gray-500">Ana sayfa üst bölümü ve slider</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <ToggleButton section="hero" enabled={heroSection?.enabled || false} />
              <Link 
                href="/admin/layout/edit/hero" 
                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full"
                aria-label="Düzenle"
              >
                <FaEdit className="w-5 h-5" />
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {heroSlides.length > 0 ? (
                heroSlides.map((slide, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="aspect-w-16 aspect-h-9 mb-3 bg-gray-100 rounded-md overflow-hidden">
                      {slide.image && (
                        <Image 
                          src={slide.image} 
                          alt={slide.title || `Slide ${index + 1}`}
                          width={320}
                          height={180}
                          className="object-cover w-full h-full"
                        />
                      )}
                    </div>
                    <h3 className="font-medium text-gray-900">{slide.title || `Slide ${index + 1}`}</h3>
                    {slide.subtitle && <p className="text-sm text-gray-500 mt-1">{slide.subtitle}</p>}
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-8 text-gray-500">
                  Henüz slider eklenmemiş
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Öne Çıkan Ürünler */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center">
              <FaBoxOpen className="w-5 h-5 text-green-500 mr-3" />
              <div>
                <h2 className="text-lg font-medium text-gray-900">Öne Çıkan Ürünler</h2>
                <p className="text-sm text-gray-500">Ana sayfada gösterilen öne çıkan ürünler</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <ToggleButton section="featured" enabled={featuredProducts?.enabled || false} />
              <Link 
                href="/admin/layout/edit/featured" 
                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full"
                aria-label="Düzenle"
              >
                <FaEdit className="w-5 h-5" />
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900">Başlık: {featuredProducts?.title || "Öne Çıkan Ürünler"}</h3>
              <span className="text-sm text-gray-500">Gösterilen ürün sayısı: {featuredProducts?.productIds?.length || 0}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featuredProductsList.length > 0 ? (
                featuredProductsList.map((product, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3">
                    <div className="aspect-w-1 aspect-h-1 mb-2 bg-gray-100 rounded-md overflow-hidden">
                      {product.image && (
                        <Image 
                          src={product.image} 
                          alt={product.name || `Ürün ${index + 1}`}
                          width={100}
                          height={100}
                          className="object-cover w-full h-full"
                        />
                      )}
                    </div>
                    <h4 className="text-sm font-medium text-gray-900 truncate">{product.name || `Ürün ${index + 1}`}</h4>
                    <p className="text-xs text-gray-500 mt-1">{product.price || "0"} TL</p>
                  </div>
                ))
              ) : (
                <div className="col-span-4 text-center py-8 text-gray-500">
                  Henüz ürün eklenmemiş
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Kategoriler */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center">
              <FaLayerGroup className="w-5 h-5 text-purple-500 mr-3" />
              <div>
                <h2 className="text-lg font-medium text-gray-900">Kategoriler</h2>
                <p className="text-sm text-gray-500">Ana sayfada gösterilen kategori bölümü</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <ToggleButton section="categories" enabled={categories?.enabled || false} />
              <Link 
                href="/admin/layout/edit/categories" 
                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full"
                aria-label="Düzenle"
              >
                <FaEdit className="w-5 h-5" />
              </Link>
            </div>
          </div>
          <div className="p-6">
            <h3 className="font-medium text-gray-900 mb-4">Başlık: {categories?.title || "Kategoriler"}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories?.items && categories.items.length > 0 ? (
                categories.items.map((category, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3">
                    <div className="aspect-w-1 aspect-h-1 mb-2 bg-gray-100 rounded-md overflow-hidden">
                      {category?.image && (
                        <Image 
                          src={category.image} 
                          alt={category.name || `Kategori ${index + 1}`}
                          width={100}
                          height={100}
                          className="object-cover w-full h-full"
                        />
                      )}
                    </div>
                    <h4 className="text-sm font-medium text-gray-900 truncate">{category?.name || `Kategori ${index + 1}`}</h4>
                  </div>
                ))
              ) : (
                <div className="col-span-4 text-center py-8 text-gray-500">
                  Henüz kategori eklenmemiş
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Hakkımızda Bölümü */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center">
              <FaInfoCircle className="w-5 h-5 text-yellow-500 mr-3" />
              <div>
                <h2 className="text-lg font-medium text-gray-900">Hakkımızda Bölümü</h2>
                <p className="text-sm text-gray-500">Ana sayfadaki hakkımızda bölümü</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <ToggleButton section="about" enabled={aboutSection?.enabled || false} />
              <Link 
                href="/admin/layout/edit/about" 
                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full"
                aria-label="Düzenle"
              >
                <FaEdit className="w-5 h-5" />
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Başlık: {aboutSection?.title || "Hakkımızda"}</h3>
                <p className="text-sm text-gray-600">{aboutSection?.content || "İçerik eklenmemiş"}</p>
                <div className="mt-3 inline-flex items-center text-sm font-medium text-indigo-600">
                  {heroSection?.buttonText || "Daha Fazla"}
                  <FaChevronRight className="ml-1 w-4 h-4" />
                </div>
              </div>
              <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-md overflow-hidden">
                {aboutSection?.image && (
                  <Image 
                    src={aboutSection.image} 
                    alt="Hakkımızda"
                    width={400}
                    height={225}
                    className="object-cover w-full h-full"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* İletişim Bilgileri */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div className="flex items-center">
              <FaPhoneAlt className="w-5 h-5 text-red-500 mr-3" />
              <div>
                <h2 className="text-lg font-medium text-gray-900">İletişim Bilgileri</h2>
                <p className="text-sm text-gray-500">Site genelinde gösterilen iletişim bilgileri</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Link 
                href="/admin/layout/edit/contact" 
                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full"
                aria-label="Düzenle"
              >
                <FaEdit className="w-5 h-5" />
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Adres</h3>
                <p className="text-sm text-gray-600">{contactInfo?.address || "Adres eklenmemiş"}</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Telefon</h3>
                <p className="text-sm text-gray-600">{contactInfo?.phone || "Telefon eklenmemiş"}</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">E-posta</h3>
                <p className="text-sm text-gray-600">{contactInfo?.email || "E-posta eklenmemiş"}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Settings */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Sayfa Ayarları</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Site başlığı, açıklama, logo ve renkler gibi genel sayfa ayarlarını düzenleyin.
                </p>
              </div>
              <div className="flex space-x-2">
                <Link
                  href="/admin/layout/edit/settings"
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FaEdit className="mr-1.5 h-4 w-4" />
                  Düzenle
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 