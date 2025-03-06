import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Admin kullanıcısı oluştur
  const hashedPassword = await bcrypt.hash('Admin123!', 10);
  
  try {
    const admin = await prisma.user.upsert({
      where: { email: 'admin@senfoni.com' },
      update: {},
      create: {
        email: 'admin@senfoni.com',
        password: hashedPassword,
        name: 'Admin',
        surname: 'User',
        role: 'ADMIN',
      },
    });
    
    console.log('Admin kullanıcısı oluşturuldu:', admin.email);
  } catch (error) {
    console.error('Admin kullanıcısı oluşturulurken hata:', error);
  }

  // Varsayılan layout ayarlarını oluştur
  await prisma.layoutSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
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
        productIds: [],
        enabled: true
      },
      categories: {
        title: "Kategoriler",
        subtitle: "Ürün kategorilerimiz",
        items: [],
        enabled: true
      },
      aboutSection: {
        title: "Hakkımızda",
        content: "Senfoni Müzik olarak müzik tutkunlarına hizmet vermekteyiz...",
        image: "/images/about.jpg",
        enabled: true
      },
      contactInfo: {
        address: "Örnek Adres",
        phone: "+90 555 555 55 55",
        email: "info@senfonimusic.com",
        socialMedia: {
          facebook: "",
          instagram: "",
          twitter: ""
        }
      }
    }
  });

  console.log('Varsayılan layout ayarları oluşturuldu');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 