import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { LayoutSettings } from '@/services/layoutService';

// Varsayılan layout ayarları
const defaultLayoutSettings = {
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

// GET endpoint - layout ayarlarını getir
export async function GET(request: NextRequest) {
  try {
    // Veritabanından layout ayarlarını çekmeye çalış
    const settings = await prisma.layoutSettings.findUnique({
      where: { id: 'default' }
    });

    // Eğer ayarlar varsa, JSON'dan parse et ve döndür
    if (settings) {
      const parsedSettings = {
        heroSection: settings.heroSection as unknown as LayoutSettings['heroSection'],
        featuredProducts: settings.featuredProducts as unknown as LayoutSettings['featuredProducts'],
        categories: settings.categories as unknown as LayoutSettings['categories'],
        aboutSection: settings.aboutSection as unknown as LayoutSettings['aboutSection'],
        contactInfo: settings.contactInfo as unknown as LayoutSettings['contactInfo']
      };
      
      return NextResponse.json(parsedSettings);
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
      // Veritabanına kaydetme hatası durumunda sessizce devam et
    }

    return NextResponse.json(defaultLayoutSettings);
  } catch (error) {
    console.error('Layout ayarları çekilirken hata oluştu:', error);
    return NextResponse.json(
      { error: 'Layout ayarları getirilemedi' },
      { status: 500 }
    );
  }
}

// PUT endpoint - layout ayarlarını güncelle
export async function PUT(request: NextRequest) {
  try {
    const settings = await request.json();
    
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
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Layout ayarları güncellenirken hata oluştu:', error);
    return NextResponse.json(
      { error: 'Layout ayarları güncellenemedi' },
      { status: 500 }
    );
  }
}

// PATCH endpoint - belirli bir bölümü güncelle
export async function PATCH(request: NextRequest) {
  try {
    const { sectionName, sectionData } = await request.json();
    
    const settings = await prisma.layoutSettings.findUnique({
      where: { id: 'default' }
    });

    if (!settings) {
      return NextResponse.json(
        { error: 'Layout ayarları bulunamadı' },
        { status: 404 }
      );
    }

    const updateData: any = {};
    updateData[sectionName] = sectionData;
    updateData.updatedAt = new Date();

    await prisma.layoutSettings.update({
      where: { id: 'default' },
      data: updateData
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Layout bölümü güncellenirken hata oluştu:', error);
    return NextResponse.json(
      { error: 'Layout bölümü güncellenemedi' },
      { status: 500 }
    );
  }
} 