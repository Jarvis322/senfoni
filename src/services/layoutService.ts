// Layout ayarları için tip tanımlamaları
import { prisma } from '@/lib/prisma';

export interface HeroSection {
  title: string;
  subtitle: string;
  buttonText: string;
  backgroundImage: string;
  enabled: boolean;
}

export interface FeaturedProducts {
  title: string;
  subtitle: string;
  productIds: string[];
  enabled: boolean;
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface Categories {
  title: string;
  subtitle: string;
  items: Category[];
  enabled: boolean;
}

export interface AboutSection {
  title: string;
  content: string;
  image: string;
  enabled: boolean;
}

export interface SocialMedia {
  facebook: string;
  instagram: string;
  twitter: string;
}

export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  socialMedia: SocialMedia;
}

export interface LayoutSettings {
  heroSection: HeroSection;
  featuredProducts: FeaturedProducts;
  categories: Categories;
  aboutSection: AboutSection;
  contactInfo: ContactInfo;
}

// Varsayılan layout ayarları
const defaultLayoutSettings: LayoutSettings = {
  heroSection: {
    title: "Senfoni Müzik",
    subtitle: "Kaliteli müzik aletleri ve ekipmanları",
    buttonText: "Ürünleri Keşfet",
    backgroundImage: "/images/hero-bg.jpg",
    enabled: true
  },
  featuredProducts: {
    title: "Öne Çıkan Ürünler",
    subtitle: "En çok tercih edilen ürünlerimiz",
    productIds: ["1", "2", "3"],
    enabled: true
  },
  categories: {
    title: "Kategoriler",
    subtitle: "Ürün kategorilerimiz",
    items: [
      { id: "1", name: "Klasik Gitar", image: "/images/category1.jpg" },
      { id: "2", name: "Elektro Gitar", image: "/images/category2.jpg" },
      { id: "3", name: "Akustik Gitar", image: "/images/category3.jpg" }
    ],
    enabled: true
  },
  aboutSection: {
    title: "Hakkımızda",
    content: "Senfoni Müzik olarak 20 yılı aşkın süredir müzik tutkunlarına hizmet vermekteyiz...",
    image: "/images/about.jpg",
    enabled: true
  },
  contactInfo: {
    address: "Bağdat Caddesi No:123, Kadıköy, İstanbul",
    phone: "+90 212 345 67 89",
    email: "info@senfonimusic.com",
    socialMedia: {
      facebook: "https://facebook.com/senfonimusic",
      instagram: "https://instagram.com/senfonimusic",
      twitter: "https://twitter.com/senfonimusic"
    }
  }
};

// Helper function to process settings from database
function processSettings(settings: any[]): LayoutSettings {
  const result = {...defaultLayoutSettings};
  
  // Process each setting and organize by category and key
  settings.forEach(setting => {
    const category = setting.category;
    const key = setting.key;
    const value = setting.value;
    
    if (category === 'layout') {
      if (key.startsWith('heroSection.')) {
        const heroKey = key.replace('heroSection.', '');
        result.heroSection = {
          ...result.heroSection,
          [heroKey]: value
        };
      } else if (key.startsWith('aboutSection.')) {
        const aboutKey = key.replace('aboutSection.', '');
        result.aboutSection = {
          ...result.aboutSection,
          [aboutKey]: value
        };
      } else if (key.startsWith('featuredProducts.')) {
        const featuredKey = key.replace('featuredProducts.', '');
        result.featuredProducts = {
          ...result.featuredProducts,
          [featuredKey]: value
        };
      } else if (key.startsWith('categories.')) {
        const categoriesKey = key.replace('categories.', '');
        result.categories = {
          ...result.categories,
          [categoriesKey]: value
        };
      } else if (key.startsWith('contactInfo.')) {
        const contactKey = key.replace('contactInfo.', '');
        result.contactInfo = {
          ...result.contactInfo,
          [contactKey]: value
        };
      }
    }
  });
  
  return result;
}

// Layout ayarlarını API'den çekme
export async function fetchLayoutSettings(): Promise<LayoutSettings> {
  try {
    // Server tarafında çalışıyorsa doğrudan veritabanından çek
    if (typeof window === 'undefined') {
      try {
        const { prisma } = await import('@/lib/prisma');
        
        // Layout ayarlarını çek
        const layoutSettings = await prisma.layoutSettings.findUnique({
          where: { id: 'default' }
        });
        
        if (layoutSettings) {
          return {
            heroSection: layoutSettings.heroSection as unknown as HeroSection,
            featuredProducts: layoutSettings.featuredProducts as unknown as FeaturedProducts,
            categories: layoutSettings.categories as unknown as Categories,
            aboutSection: layoutSettings.aboutSection as unknown as AboutSection,
            contactInfo: layoutSettings.contactInfo as unknown as ContactInfo
          };
        }
        
        return defaultLayoutSettings;
      } catch (dbError) {
        console.error('Veritabanı erişim hatası:', dbError);
        return defaultLayoutSettings;
      }
    }
    
    // Client tarafında çalışıyorsa API'yi çağır
    // Önce localStorage'dan kontrol et ve cache süresini kontrol et
    if (typeof window !== 'undefined') {
      try {
        const cachedData = localStorage.getItem('layoutSettings');
        const cacheTimestamp = localStorage.getItem('layoutSettingsTimestamp');
        
        if (cachedData && cacheTimestamp) {
          const now = new Date().getTime();
          const cacheTime = parseInt(cacheTimestamp, 10);
          const cacheAge = now - cacheTime;
          
          // Cache 5 dakikadan yeni ise kullan (300000 ms = 5 dakika)
          if (cacheAge < 300000) {
            return JSON.parse(cachedData);
          }
        }
      } catch (storageError) {
        console.error('localStorage erişim hatası:', storageError);
      }
      
      // API'den çek
      try {
        const response = await fetch(`/api/layout`, {
          next: { revalidate: 300 } // 5 dakikada bir yeniden doğrula
        });
        
        if (!response.ok) {
          throw new Error('Layout ayarları getirilemedi');
        }
        
        const settings = await response.json();
        
        // localStorage'a kaydet
        try {
          localStorage.setItem('layoutSettings', JSON.stringify(settings));
          localStorage.setItem('layoutSettingsTimestamp', String(new Date().getTime()));
        } catch (storageError) {
          console.error('localStorage yazma hatası:', storageError);
        }
        
        return settings;
      } catch (apiError) {
        console.error('API erişim hatası:', apiError);
        
        // Eğer cache varsa, süresi geçmiş olsa bile kullan
        try {
          const cachedData = localStorage.getItem('layoutSettings');
          if (cachedData) {
            console.log('API hatası nedeniyle süresi geçmiş cache kullanılıyor');
            return JSON.parse(cachedData);
          }
        } catch (e) {}
        
        return defaultLayoutSettings;
      }
    }
    
    // Hiçbir durumda çalışmazsa varsayılan ayarları döndür
    return defaultLayoutSettings;
  } catch (error) {
    console.error('Layout ayarları çekilirken hata oluştu:', error);
    return defaultLayoutSettings;
  }
}

// Layout ayarlarını güncelleme fonksiyonu
export async function updateLayoutSettings(settings: LayoutSettings): Promise<boolean> {
  try {
    // Sunucu tarafında çalışıyorsa doğrudan veritabanını kullan
    if (typeof window === 'undefined') {
      try {
        const { prisma } = await import('@/lib/prisma');
        
        await prisma.layoutSettings.update({
          where: { id: 'default' },
          data: {
            heroSection: settings.heroSection as any,
            featuredProducts: settings.featuredProducts as any,
            categories: settings.categories as any,
            aboutSection: settings.aboutSection as any,
            contactInfo: settings.contactInfo as any,
            updatedAt: new Date()
          }
        });
        
        return true;
      } catch (dbError) {
        console.error('Veritabanı erişim hatası:', dbError);
        return false;
      }
    }
    
    // Client tarafında çalışıyorsa API'yi çağır
    try {
      const response = await fetch('/api/layout', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });
      
      if (!response.ok) {
        throw new Error('Layout ayarları güncellenemedi');
      }
      
      // localStorage'ı güncelle
      try {
        localStorage.setItem('layoutSettings', JSON.stringify(settings));
      } catch (storageError) {
        console.error('localStorage yazma hatası:', storageError);
      }
      
      return true;
    } catch (apiError) {
      console.error('API erişim hatası:', apiError);
      return false;
    }
  } catch (error) {
    console.error('Layout ayarları güncellenirken hata oluştu:', error);
    return false;
  }
}

// Belirli bir bölümü güncelleme fonksiyonu
export async function updateLayoutSection<K extends keyof LayoutSettings>(
  sectionName: K, 
  sectionData: LayoutSettings[K]
): Promise<boolean> {
  try {
    // Sunucu tarafında çalışıyorsa doğrudan veritabanını kullan
    if (typeof window === 'undefined') {
      try {
        const { prisma } = await import('@/lib/prisma');
        
        const settings = await prisma.layoutSettings.findUnique({
          where: { id: 'default' }
        });

        if (!settings) {
          return false;
        }

        const updateData: any = {};
        updateData[sectionName] = sectionData;
        updateData.updatedAt = new Date();

        await prisma.layoutSettings.update({
          where: { id: 'default' },
          data: updateData
        });
        
        return true;
      } catch (dbError) {
        console.error('Veritabanı erişim hatası:', dbError);
        return false;
      }
    }
    
    // Client tarafında çalışıyorsa API'yi çağır
    try {
      const response = await fetch('/api/layout', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sectionName,
          sectionData
        })
      });
      
      if (!response.ok) {
        throw new Error('Layout bölümü güncellenemedi');
      }
      
      // localStorage'ı güncelle
      try {
        const cachedSettings = localStorage.getItem('layoutSettings');
        if (cachedSettings) {
          const settings = JSON.parse(cachedSettings);
          settings[sectionName] = sectionData;
          localStorage.setItem('layoutSettings', JSON.stringify(settings));
        }
      } catch (storageError) {
        console.error('localStorage yazma hatası:', storageError);
      }
      
      return true;
    } catch (apiError) {
      console.error('API erişim hatası:', apiError);
      return false;
    }
  } catch (error) {
    console.error(`${sectionName} bölümü güncellenirken hata oluştu:`, error);
    return false;
  }
} 