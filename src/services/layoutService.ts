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

// Layout ayarlarını API'den çekme
export async function fetchLayoutSettings(): Promise<LayoutSettings> {
  try {
    // Sunucu tarafında çalışıyorsa API'yi doğrudan çağırmak yerine veritabanını kullan
    if (typeof window === 'undefined') {
      try {
        // Sunucu tarafında doğrudan veritabanına erişim
        const { prisma } = await import('@/lib/prisma');
        
        // Veritabanından layout ayarlarını çekmeye çalış
        const settings = await prisma.layoutSettings.findUnique({
          where: { id: 'default' }
        });

        // Eğer ayarlar varsa, JSON'dan parse et ve döndür
        if (settings) {
          return {
            heroSection: settings.heroSection as unknown as HeroSection,
            featuredProducts: settings.featuredProducts as unknown as FeaturedProducts,
            categories: settings.categories as unknown as Categories,
            aboutSection: settings.aboutSection as unknown as AboutSection,
            contactInfo: settings.contactInfo as unknown as ContactInfo
          };
        }

        // Eğer ayarlar yoksa, varsayılan ayarları veritabanına kaydet ve döndür
        try {
          await prisma.layoutSettings.create({
            data: {
              id: 'default',
              heroSection: defaultLayoutSettings.heroSection as any,
              featuredProducts: defaultLayoutSettings.featuredProducts as any,
              categories: defaultLayoutSettings.categories as any,
              aboutSection: defaultLayoutSettings.aboutSection as any,
              contactInfo: defaultLayoutSettings.contactInfo as any
            }
          });
          
          console.log('Varsayılan layout ayarları veritabanına kaydedildi');
        } catch (createError) {
          console.error('Varsayılan ayarlar veritabanına kaydedilemedi:', createError);
        }

        return defaultLayoutSettings;
      } catch (dbError) {
        console.error('Veritabanı erişim hatası:', dbError);
        return defaultLayoutSettings;
      }
    }
    
    // Client tarafında çalışıyorsa API'yi çağır
    // Önce localStorage'dan kontrol et
    if (typeof window !== 'undefined') {
      try {
        const cachedSettings = localStorage.getItem('layoutSettings');
        if (cachedSettings) {
          return JSON.parse(cachedSettings);
        }
      } catch (storageError) {
        console.error('localStorage erişim hatası:', storageError);
      }
      
      // API'den çek
      try {
        const timestamp = new Date().getTime();
        const response = await fetch(`/api/layout?t=${timestamp}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        if (!response.ok) {
          throw new Error('Layout ayarları getirilemedi');
        }
        
        const settings = await response.json();
        
        // localStorage'a kaydet
        try {
          localStorage.setItem('layoutSettings', JSON.stringify(settings));
        } catch (storageError) {
          console.error('localStorage yazma hatası:', storageError);
        }
        
        return settings;
      } catch (apiError) {
        console.error('API erişim hatası:', apiError);
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