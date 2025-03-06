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
export async function GET() {
  try {
    const layoutSettings = await prisma.layoutSettings.findUnique({
      where: { id: 'default' }
    });

    if (!layoutSettings) {
      return NextResponse.json({ error: 'Layout ayarları bulunamadı' }, { status: 404 });
    }

    return NextResponse.json(layoutSettings);
  } catch (error) {
    console.error('Layout ayarları getirme hatası:', error);
    return NextResponse.json({ error: 'Layout ayarları getirilemedi' }, { status: 500 });
  }
}

// PUT endpoint - layout ayarlarını güncelle
export async function PUT(request: Request) {
  try {
    const settings: LayoutSettings = await request.json();

    const updatedSettings = await prisma.layoutSettings.upsert({
      where: { id: 'default' },
      update: {
        heroSection: settings.heroSection as any,
        featuredProducts: settings.featuredProducts as any,
        categories: settings.categories as any,
        aboutSection: settings.aboutSection as any,
        contactInfo: settings.contactInfo as any,
        updatedAt: new Date()
      },
      create: {
        id: 'default',
        heroSection: settings.heroSection as any,
        featuredProducts: settings.featuredProducts as any,
        categories: settings.categories as any,
        aboutSection: settings.aboutSection as any,
        contactInfo: settings.contactInfo as any,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error('Layout ayarları güncelleme hatası:', error);
    return NextResponse.json({ error: 'Layout ayarları güncellenemedi' }, { status: 500 });
  }
}

// PATCH endpoint - belirli bir bölümü güncelle
export async function PATCH(request: Request) {
  try {
    const { sectionName, sectionData } = await request.json();

    const existingSettings = await prisma.layoutSettings.findUnique({
      where: { id: 'default' }
    });

    if (!existingSettings) {
      return NextResponse.json({ error: 'Layout ayarları bulunamadı' }, { status: 404 });
    }

    const updateData: any = {};
    updateData[sectionName] = sectionData;
    updateData.updatedAt = new Date();

    const updatedSettings = await prisma.layoutSettings.update({
      where: { id: 'default' },
      data: updateData
    });

    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error('Layout bölümü güncelleme hatası:', error);
    return NextResponse.json({ error: 'Layout bölümü güncellenemedi' }, { status: 500 });
  }
} 