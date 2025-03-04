# Senfoni Müzik E-Ticaret Sitesi

Bu proje, Senfoni Müzik için bir e-ticaret web sitesidir. XML veri kaynağından ürünleri çekerek kullanıcılara sunar.

## Özellikler

- XML veri kaynağından ürün bilgilerini çekme
- Ürünleri listeleme ve filtreleme
- Sepet işlemleri
- Responsive tasarım
- Konser ve etkinlik yönetimi
- Kullanıcı hesap yönetimi

## Teknolojiler

- Next.js 15
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- Fast XML Parser

## Kurulum

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyin:

```bash
# Depoyu klonlayın
git clone https://github.com/kullanici/senfoni-muzik.git
cd senfoni-muzik

# .env dosyasını oluşturun
cp .env.example .env
# .env dosyasını düzenleyin ve gerekli değişkenleri ayarlayın

# Bağımlılıkları yükleyin
npm install

# Veritabanı şemasını oluşturun
npx prisma migrate dev

# Geliştirme sunucusunu başlatın
npm run dev
```

Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresine giderek uygulamayı görüntüleyebilirsiniz.

## Vercel Deployment

Bu proje Vercel'e kolayca deploy edilebilir:

1. [Vercel](https://vercel.com) hesabınıza giriş yapın
2. "New Project" butonuna tıklayın
3. GitHub reponuzu import edin
4. Environment Variables bölümünde `.env.example` dosyasındaki değişkenleri ayarlayın:
   - `DATABASE_URL`: PostgreSQL veritabanı bağlantı URL'i
   - `NEXTAUTH_SECRET`: Güvenli bir rastgele string
   - `NEXTAUTH_URL`: Deployment URL'iniz (örn. https://senfoni.vercel.app)
   - Diğer gerekli API anahtarları
5. "Deploy" butonuna tıklayın

## Yapı

- `src/app`: Next.js uygulama yönlendiricisi ve sayfalar
- `src/services`: Veri işleme servisleri (XML çekme, ürün işlemleri)
- `src/components`: Yeniden kullanılabilir UI bileşenleri
- `prisma`: Veritabanı şeması ve migration dosyaları

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır.
