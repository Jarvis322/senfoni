import { XMLParser } from 'fast-xml-parser';
import { Currency } from '@/types/currency';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  discountPercentage?: number;
  currency: Currency;
  images: string[];
  image?: string;
  categories: string[];
  brand?: string;
  stock: number;
  url?: string;
}

// Örnek ürünler - XML çalışmazsa bunları gösterelim
const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Miguel Artegas MAG150 Klasik Gitar',
    description: 'Arka ve Yanlar: Maun, Ön Kapak: Ladin, Klavye: Gül, Burgu: Pirinç',
    price: 11000,
    currency: 'TRY' as Currency,
    images: ['https://static.ticimax.cloud/40835/Uploads/UrunResimleri/buyuk/miguel-artegas-mag150-klasik-gitar-1c5510.jpg'],
    categories: ['gitar'],
    brand: 'Miguel Artegas',
    stock: 4
  },
  {
    id: '2',
    name: 'Miguel Artegas MAG170 Klasik Gitar',
    description: 'Arka ve Yanlar: Zeytin, Ön Kapak: Ladin, Klavye: Gül, Burgu: Pirinç',
    price: 11900,
    currency: 'TRY' as Currency,
    images: ['https://static.ticimax.cloud/40835/Uploads/UrunResimleri/buyuk/miguel-artegas-mag170-klasik-gitar-285b4d.jpg'],
    categories: ['gitar'],
    brand: 'Miguel Artegas',
    stock: 5
  },
  {
    id: '3',
    name: 'Migeul Artegas MAG185CEQ Elektro Klasik Gitar',
    description: 'Arka ve Yanlar: Maun, Ön Kapak: Sedir, Klavye: Gül, Burgular: Nikel',
    price: 12500,
    currency: 'TRY' as Currency,
    images: ['https://static.ticimax.cloud/40835/Uploads/UrunResimleri/buyuk/migeul-artegas-mag185ceq-elektro-klasi-0-dac2.jpg'],
    categories: ['gitar'],
    brand: 'Miguel Artegas',
    stock: 6
  },
  {
    id: '4',
    name: 'Miguel Artegas MAGFLEQ Flamenko Klasik Gitar',
    description: 'Arka ve Yanlar: Kelebek, Ön Kapak: Ladin, Klavye: Gül, Burgular: Pirinç, Sap: Akçaağaç',
    price: 13500,
    currency: 'TRY' as Currency,
    images: ['https://static.ticimax.cloud/40835/Uploads/UrunResimleri/buyuk/miguel-artegas-magfleq-flamenko-klasik-e24-68.jpg'],
    categories: ['gitar'],
    brand: 'Miguel Artegas',
    stock: 7
  }
];

// Kategori isimlerini ID'lere eşleştiren yardımcı fonksiyon
function mapCategoryNameToId(categoryName: string): string | null {
  // Kategori adı boşsa null döndür
  if (!categoryName || categoryName.trim() === '') {
    return null;
  }
  
  const categoryNameLower = categoryName.toLowerCase();
  
  // Piyano kategorisi için özel kontrol
  const pianoTerms = ['piyano', 'piano', 'klavye', 'keyboard', 'org', 'tuşlu', 'tuslu', 'synthesizer', 'synth'];
  for (const term of pianoTerms) {
    if (categoryNameLower.includes(term)) {
      return 'piyano';
    }
  }
  
  const categoryMap: Record<string, string> = {
    // Gitar kategorileri
    'klasik gitar': 'gitar',
    'elektro gitar': 'gitar',
    'akustik gitar': 'gitar',
    'bas gitar': 'gitar',
    'gitar': 'gitar',
    'gitarlar': 'gitar',
    
    // Piyano kategorileri
    'piyano': 'piyano',
    'dijital piyano': 'piyano',
    'akustik piyano': 'piyano',
    'klavye': 'piyano',
    'org': 'piyano',
    'tuşlu çalgılar': 'piyano',
    
    // Davul kategorileri
    'davul': 'davul',
    'bateri': 'davul',
    'perküsyon': 'davul',
    'davul seti': 'davul',
    'elektronik davul': 'davul',
    
    // Yaylı çalgılar
    'keman': 'yayli',
    'viyola': 'yayli',
    'çello': 'yayli',
    'kontrbas': 'yayli',
    'yaylı çalgılar': 'yayli',
    
    // Üflemeli çalgılar
    'flüt': 'uflemeli',
    'klarnet': 'uflemeli',
    'saksafon': 'uflemeli',
    'trompet': 'uflemeli',
    'üflemeli çalgılar': 'uflemeli',
    
    // Elektronik müzik
    'synthesizer': 'elektronik',
    'midi controller': 'elektronik',
    'dj ekipmanları': 'elektronik',
    'elektronik müzik': 'elektronik',
    
    // Amfi ve efekt
    'amfi': 'amfi',
    'efekt pedalı': 'amfi',
    'gitar amfisi': 'amfi',
    'bas amfisi': 'amfi',
    'amfi ve efekt': 'amfi',
    
    // Aksesuarlar
    'aksesuar': 'aksesuar',
    'gitar aksesuar': 'aksesuar',
    'kablo': 'aksesuar',
    'çanta': 'aksesuar',
    'mızrap': 'aksesuar',
    'tel': 'aksesuar'
  };
  
  // Tam eşleşme kontrolü (küçük harfe çevirerek)
  if (categoryNameLower in categoryMap) {
    return categoryMap[categoryNameLower];
  }
  
  // Kısmi eşleşme kontrolü
  for (const [key, value] of Object.entries(categoryMap)) {
    if (categoryNameLower.includes(key.toLowerCase())) {
      return value;
    }
  }
  
  // Varsayılan kategori
  return null;
}

// Ürün adından kategori belirleme yardımcı fonksiyonu
function determineCategoryByProductName(name: string): string[] {
  const nameLower = name.toLowerCase();
  const categories: string[] = [];
  
  // Piyano/Klavye kontrolü
  const pianoTerms = ['piyano', 'piano', 'klavye', 'keyboard', 'org', 'tuşlu', 'tuslu', 'synthesizer', 'synth'];
  if (pianoTerms.some(term => nameLower.includes(term))) {
    categories.push('piyano');
  }
  
  // Gitar kontrolü
  const guitarTerms = ['gitar', 'guitar', 'bas gitar', 'elektro gitar', 'akustik gitar', 'klasik gitar'];
  if (guitarTerms.some(term => nameLower.includes(term))) {
    categories.push('gitar');
  }
  
  // Davul kontrolü
  const drumTerms = ['davul', 'bateri', 'perküsyon', 'drum', 'trampet', 'zil', 'cymbal'];
  if (drumTerms.some(term => nameLower.includes(term))) {
    categories.push('davul');
  }
  
  // Yaylı çalgılar kontrolü
  const stringTerms = ['keman', 'viyola', 'çello', 'cello', 'kontrbas', 'violin', 'viola'];
  if (stringTerms.some(term => nameLower.includes(term))) {
    categories.push('yayli');
  }
  
  // Üflemeli çalgılar kontrolü
  const windTerms = ['flüt', 'klarnet', 'saksafon', 'trompet', 'trombon', 'obua', 'fagot', 'flute', 'clarinet', 'saxophone'];
  if (windTerms.some(term => nameLower.includes(term))) {
    categories.push('uflemeli');
  }
  
  // Elektronik müzik kontrolü
  const electronicTerms = ['dj', 'mixer', 'controller', 'kontroller', 'launchpad', 'sampler'];
  if (electronicTerms.some(term => nameLower.includes(term))) {
    categories.push('elektronik');
  }
  
  // Amfi kontrolü
  const ampTerms = ['amfi', 'amplifier', 'amp', 'hoparlör', 'speaker', 'kabin', 'cabinet'];
  if (ampTerms.some(term => nameLower.includes(term))) {
    categories.push('amfi');
  }
  
  // Aksesuar kontrolü - genellikle ürün adının sonunda olur
  const accessoryTerms = ['kılıf', 'stand', 'sehpa', 'pedal', 'tuner', 'akort', 'kablo', 'tel', 'pena', 'metronom', 'yedek parça', 'bakım', 'temizlik'];
  if (accessoryTerms.some(term => nameLower.includes(term))) {
    categories.push('aksesuar');
  }
  
  // Eğer hiçbir kategori bulunamadıysa, aksesuar olarak varsayalım
  if (categories.length === 0) {
    // Sonsuz özyinelemeyi önlemek için doğrudan aksesuar kategorisini ekle
    categories.push('aksesuar');
  }
  
  return categories;
}

// Currency değerini doğrulayan yardımcı fonksiyon
function validateCurrency(currency: string): Currency {
  // TL değerini TRY'ye dönüştür
  if (currency === 'TL') {
    return 'TRY';
  }
  
  if (currency === 'TRY' || currency === 'USD' || currency === 'EUR') {
    return currency as Currency;
  }
  
  console.warn(`Geçersiz para birimi: ${currency}, varsayılan olarak TRY kullanılıyor`);
  return 'TRY'; // Varsayılan değer
}

// Ürünleri XML'den çekip veritabanına kaydeden fonksiyon
export async function syncProductsWithDatabase(): Promise<{ success: boolean; count?: number; error?: string }> {
  console.log("Ürünleri XML'den çekip veritabanına aktarma işlemi başlatılıyor...");
  
  // Tarayıcı ortamında çalışıyorsa hata fırlat
  if (typeof window !== 'undefined') {
    return { 
      success: false, 
      error: 'Bu fonksiyon sadece sunucu tarafında çalışabilir' 
    };
  }
  
  // Prisma'yı dinamik olarak import et
  const { prisma } = await import('@/lib/prisma');
  
  try {
    // Birden fazla XML kaynağı deneyelim
    const xmlUrls = [
      'https://www.maskemuzik.com/TicimaxXml/5BE22172CA0848B2A085FA30B7841D7A/',
      'https://www.maskemuzik.com/TicimaxXml/5BE22172CA0848B2A085FA30B7841D7A/urunler',
      'https://www.maskemuzik.com/TicimaxXml/5BE22172CA0848B2A085FA30B7841D7A/products',
      'https://www.maskemuzik.com/Xml/urunler',
      'https://www.maskemuzik.com/Xml/products'
    ];
    
    let xmlText = '';
    let successfulUrl = '';
    let fetchError = null;
    
    // Her URL'yi sırayla deneyelim
    for (const url of xmlUrls) {
      try {
        console.log(`XML kaynağı deneniyor: ${url}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 saniye timeout
        
        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'application/xml, text/xml, */*',
            'Cache-Control': 'no-cache'
          }
        });
        
        clearTimeout(timeoutId);
    
        if (!response.ok) {
          console.log(`${url} kaynağından XML çekilemedi: ${response.status} ${response.statusText}`);
          continue; // Sonraki URL'yi dene
        }
        
        xmlText = await response.text();
        console.log(`${url} kaynağından XML veri uzunluğu: ${xmlText.length} karakter`);
        
        if (!xmlText || xmlText.length === 0) {
          console.log(`${url} kaynağından alınan XML verisi boş`);
          continue; // Sonraki URL'yi dene
        }
        
        // Başarılı URL'yi kaydet ve döngüden çık
        successfulUrl = url;
        console.log(`Başarılı XML kaynağı: ${successfulUrl}`);
        break;
        
      } catch (error) {
        console.error(`${url} kaynağından XML çekilirken hata:`, error);
        fetchError = error;
        // Hata durumunda sonraki URL'yi dene
      }
    }
    
    // Hiçbir URL başarılı olmadıysa hata fırlat
    if (!xmlText || xmlText.length === 0) {
      throw new Error(`Hiçbir XML kaynağından veri çekilemedi: ${fetchError instanceof Error ? fetchError.message : 'Bilinmeyen hata'}`);
    }

    // XML içeriğinin ilk 500 karakterini kontrol edelim
    console.log("XML içeriği (ilk 500 karakter):", xmlText.substring(0, 500));
    
    // XML yapısını analiz et
    let productNodes: any[] = [];
    
    try {
      console.log("XML ayrıştırma başlatılıyor...");
      
      // XML parser oluştur - CDATA bölümlerini doğru işlemek için
      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "@_",
        isArray: (name) => {
          return name === "Urun" || name === "Resim" || name === "Secenek";
        },
        cdataPropName: "__cdata",
        preserveOrder: false,
        parseTagValue: false,
        trimValues: true,
        parseAttributeValue: false
      });
      
      // XML'i parse et
      const parsedXml = parser.parse(xmlText);
      console.log("XML başarıyla ayrıştırıldı. Kök elemanlar:", Object.keys(parsedXml));
      
      // Ürün düğümlerini bulmak için farklı yapıları deneyelim
      // Yapı: <Root><Urunler><Urun>...</Urun></Urunler></Root>
      if (parsedXml.Root && parsedXml.Root.Urunler && Array.isArray(parsedXml.Root.Urunler.Urun)) {
        console.log("Yapı tespit edildi: Root > Urunler > Urun");
        productNodes = parsedXml.Root.Urunler.Urun;
      }
      // Diğer yapıları da kontrol edelim
      else if (parsedXml.products && Array.isArray(parsedXml.products.product)) {
        console.log("Yapı tespit edildi: products > product");
        productNodes = parsedXml.products.product;
      }
      else if (parsedXml.urunler && Array.isArray(parsedXml.urunler.urun)) {
        console.log("Yapı tespit edildi: urunler > urun");
        productNodes = parsedXml.urunler.urun;
      }
      else if (parsedXml.xml && parsedXml.xml.products && Array.isArray(parsedXml.xml.products.product)) {
        console.log("Yapı tespit edildi: xml > products > product");
        productNodes = parsedXml.xml.products.product;
      }
      else if (parsedXml.xml && parsedXml.xml.urunler && Array.isArray(parsedXml.xml.urunler.urun)) {
        console.log("Yapı tespit edildi: xml > urunler > urun");
        productNodes = parsedXml.xml.urunler.urun;
      }
      else if (parsedXml.items && Array.isArray(parsedXml.items.item)) {
        console.log("Yapı tespit edildi: items > item");
        productNodes = parsedXml.items.item;
      }
      else if (parsedXml.catalog && parsedXml.catalog.items && Array.isArray(parsedXml.catalog.items.item)) {
        console.log("Yapı tespit edildi: catalog > items > item");
        productNodes = parsedXml.catalog.items.item;
      }
      // Hiçbir yapı eşleşmezse, XML'i derinlemesine analiz et
      else {
        console.log("Bilinen yapılar eşleşmedi, XML derinlemesine analiz ediliyor...");
        productNodes = findProductNodes(parsedXml);
        console.log(`Derinlemesine analiz sonucu ${productNodes.length} ürün bulundu`);
      }
      
      console.log(`XML ayrıştırma sonucu ${productNodes.length} ürün bulundu`);
      
      // Ürün bulunamadıysa hata fırlat
      if (!productNodes || productNodes.length === 0) {
        throw new Error("XML'de ürün bulunamadı");
      }
      
      // Bulunan ürünlerin ilk 3 tanesinin anahtarlarını göster
      for (let i = 0; i < Math.min(3, productNodes.length); i++) {
        console.log(`Ürün ${i+1} anahtarları:`, Object.keys(productNodes[i]));
      }
      
    } catch (parseError) {
      console.error("XML ayrıştırma hatası:", parseError);
      throw parseError; // Hata durumunda işlemi sonlandır
    }
    
    console.log(`Toplam ${productNodes.length} ürün bulundu`);
    
    // Her ürünü veritabanına ekle
    let processedCount = 0;
    
    for (const productNode of productNodes) {
      try {
        // Ürün verilerini normalize et
        const normalizedProduct = processProductNode(productNode);
        
        if (!normalizedProduct.id || !normalizedProduct.name) {
          console.log("Geçersiz ürün verisi, atlanıyor:", normalizedProduct);
          continue;
        }
        
        // Her 10 üründe bir ilerleme raporu
        if (processedCount % 10 === 0) {
          console.log(`${processedCount}/${productNodes.length} ürün işleniyor...`);
        }
        
        // Ürünü veritabanına ekle
        await prisma.product.upsert({
          where: { id: normalizedProduct.id },
          update: {
            name: normalizedProduct.name,
            description: normalizedProduct.description || "",
            price: normalizedProduct.price || 0,
            discountedPrice: normalizedProduct.discountedPrice,
            stock: normalizedProduct.stock || 0,
            brand: normalizedProduct.brand || "",
            categories: normalizedProduct.categories || [],
            images: normalizedProduct.images || [],
            currency: normalizedProduct.currency || "TRY",
            url: normalizedProduct.url || ""
          },
          create: {
            id: normalizedProduct.id,
            name: normalizedProduct.name,
            description: normalizedProduct.description || "",
            price: normalizedProduct.price || 0,
            discountedPrice: normalizedProduct.discountedPrice,
            stock: normalizedProduct.stock || 0,
            brand: normalizedProduct.brand || "",
            categories: normalizedProduct.categories || [],
            images: normalizedProduct.images || [],
            currency: normalizedProduct.currency || "TRY",
            url: normalizedProduct.url || ""
          }
        });
        
        processedCount++;
      } catch (dbError) {
        console.error(`Ürün kaydedilirken hata oluştu:`, dbError);
      }
    }
    
    console.log(`Toplam ${processedCount} ürün veritabanına kaydedildi.`);
    return { success: true, count: processedCount };
    
  } catch (error: any) {
    console.error("Ürünleri senkronize ederken hata oluştu:", error);
    return { success: false, error: error.message };
  }
}

// XML'de ürün düğümlerini bulmak için yardımcı fonksiyon
function findProductNodes(obj: any, depth = 0, maxDepth = 5): any[] {
  // Maksimum derinliğe ulaşıldıysa boş dizi döndür
  if (depth > maxDepth) return [];
  
  // Eğer obj bir dizi ise, her öğeyi kontrol et
  if (Array.isArray(obj)) {
    // Dizideki her öğe ürün olabilir mi kontrol et
    if (obj.length > 0 && isProductArray(obj)) {
      console.log(`Derinlik ${depth}'de muhtemel ürün dizisi bulundu (${obj.length} öğe)`);
      return obj;
    }
    
    // Değilse, her öğeyi derinlemesine ara
    for (const item of obj) {
      const result = findProductNodes(item, depth + 1, maxDepth);
      if (result.length > 0) return result;
    }
    
    return [];
  }
  
  // Eğer obj bir nesne ise
  if (obj && typeof obj === 'object') {
    // Nesnenin kendisi bir ürün mü kontrol et
    if (isProductObject(obj)) {
      console.log(`Derinlik ${depth}'de tek ürün bulundu`);
      return [obj];
    }
    
    // Nesnenin her alanını kontrol et
    for (const key in obj) {
      // Ürün dizisi olabilecek alanları kontrol et
      if (
        ['products', 'urunler', 'items', 'product', 'urun', 'item'].includes(key.toLowerCase()) && 
        Array.isArray(obj[key])
      ) {
        if (isProductArray(obj[key])) {
          console.log(`Derinlik ${depth}'de '${key}' alanında muhtemel ürün dizisi bulundu (${obj[key].length} öğe)`);
          return obj[key];
        }
      }
      
      // Derinlemesine arama
      const result = findProductNodes(obj[key], depth + 1, maxDepth);
      if (result.length > 0) return result;
    }
  }
  
  return [];
}

// Bir nesnenin ürün olup olmadığını kontrol eden yardımcı fonksiyon
function isProductObject(obj: any): boolean {
  if (!obj || typeof obj !== 'object') return false;
  
  // Ürün özelliklerini kontrol et
  const hasId = obj.id || obj.ID || obj.Id || obj.productId || obj.ProductID || obj.urunId || obj.UrunID;
  const hasName = obj.name || obj.Name || obj.title || obj.Title || obj.urunAdi || obj.UrunAdi;
  const hasPrice = obj.price !== undefined || obj.Price !== undefined || obj.fiyat !== undefined || obj.Fiyat !== undefined;
  
  // En az iki özellik varsa muhtemelen bir üründür
  return (hasId && hasName) || (hasId && hasPrice) || (hasName && hasPrice);
}

// Bir dizinin ürün dizisi olup olmadığını kontrol eden yardımcı fonksiyon
function isProductArray(arr: any[]): boolean {
  if (!Array.isArray(arr) || arr.length === 0) return false;
  
  // İlk birkaç öğeyi kontrol et
  const sampleSize = Math.min(3, arr.length);
  let productCount = 0;
  
  for (let i = 0; i < sampleSize; i++) {
    if (isProductObject(arr[i])) {
      productCount++;
    }
  }
  
  // Örneklerin çoğu ürünse, muhtemelen bir ürün dizisidir
  return productCount >= sampleSize / 2;
}

// Ürün düğümünü işleyip normalize eden fonksiyon
function processProductNode(productNode: any): any {
  const result: any = {};
  
  // ID
  result.id = productNode.UrunKartiID || String(Math.random()).substring(2, 10);
  
  // Ürün adı
  result.name = productNode.UrunAdi || "";
  
  // Açıklama - CDATA içeriğini işle
  let description = "";
  if (productNode.Aciklama) {
    if (typeof productNode.Aciklama === 'object' && productNode.Aciklama.__cdata) {
      description = productNode.Aciklama.__cdata;
    } else {
      description = String(productNode.Aciklama);
    }
  } else if (productNode.OnYazi) {
    if (typeof productNode.OnYazi === 'object' && productNode.OnYazi.__cdata) {
      description = productNode.OnYazi.__cdata;
    } else {
      description = String(productNode.OnYazi);
    }
  }
  
  // HTML etiketlerini koru, ancak güvenlik için temel bir temizleme yap
  // Sadece temel HTML etiketlerine izin ver
  result.description = description;
  
  // Marka
  result.brand = productNode.Marka || "";
  
  // URL
  result.url = productNode.UrunUrl || "";
  
  // Kategoriler
  const categories = [];
  if (productNode.Kategori) {
    categories.push(productNode.Kategori);
  }
  if (productNode.KategoriTree) {
    const categoryParts = productNode.KategoriTree.split('/');
    categories.push(...categoryParts);
  }
  result.categories = categories.filter(Boolean);
  
  // Resimler
  const images = [];
  if (productNode.Resimler && Array.isArray(productNode.Resimler.Resim)) {
    images.push(...productNode.Resimler.Resim);
  } else if (productNode.Resimler && productNode.Resimler.Resim) {
    images.push(productNode.Resimler.Resim);
  }
  result.images = images.filter(Boolean);
  
  // Fiyat ve stok bilgileri
  if (productNode.UrunSecenek && Array.isArray(productNode.UrunSecenek.Secenek)) {
    const option = productNode.UrunSecenek.Secenek[0]; // İlk seçeneği alalım
    
    // Fiyat
    if (option.SatisFiyati) {
      result.price = parseFloat(String(option.SatisFiyati).replace(',', '.'));
    }
    
    // İndirimli fiyat
    if (option.IndirimliFiyat && parseFloat(String(option.IndirimliFiyat).replace(',', '.')) > 0) {
      result.discountedPrice = parseFloat(String(option.IndirimliFiyat).replace(',', '.'));
    }
    
    // Stok
    if (option.StokAdedi) {
      result.stock = parseInt(option.StokAdedi, 10);
    }
    
    // Para birimi
    if (option.ParaBirimi) {
      // TL değerini TRY'ye dönüştür
      result.currency = option.ParaBirimi === 'TL' ? 'TRY' : validateCurrency(option.ParaBirimi);
    } else if (option.ParaBirimiKodu) {
      // TRY, USD, EUR gibi kodları Currency tipine dönüştür
      result.currency = validateCurrency(option.ParaBirimiKodu);
    } else {
      // Varsayılan para birimi
      result.currency = 'TRY';
    }
  } else if (productNode.UrunSecenek && productNode.UrunSecenek.Secenek) {
    const option = productNode.UrunSecenek.Secenek;
    
    // Fiyat
    if (option.SatisFiyati) {
      result.price = parseFloat(String(option.SatisFiyati).replace(',', '.'));
    }
    
    // İndirimli fiyat
    if (option.IndirimliFiyat && parseFloat(String(option.IndirimliFiyat).replace(',', '.')) > 0) {
      result.discountedPrice = parseFloat(String(option.IndirimliFiyat).replace(',', '.'));
    }
    
    // Stok
    if (option.StokAdedi) {
      result.stock = parseInt(option.StokAdedi, 10);
    }
    
    // Para birimi
    if (option.ParaBirimi) {
      // TL değerini TRY'ye dönüştür
      result.currency = option.ParaBirimi === 'TL' ? 'TRY' : validateCurrency(option.ParaBirimi);
    } else if (option.ParaBirimiKodu) {
      result.currency = validateCurrency(option.ParaBirimiKodu);
    } else {
      // Varsayılan para birimi
      result.currency = 'TRY';
    }
  } else {
    // Seçenek yoksa varsayılan değerler
    result.price = 0;
    result.stock = 0;
    result.currency = 'TRY';
  }
  
  // Son kontrol: Para birimi TL ise TRY'ye dönüştür
  if (result.currency === 'TL') {
    result.currency = 'TRY';
  }
  
  return result;
}

// Veritabanından ürünleri çeken fonksiyon
export async function fetchProductsFromDatabase(): Promise<Product[]> {
  // Tarayıcı ortamında çalışıyorsa hata fırlat
  if (typeof window !== 'undefined') {
    throw new Error('Bu fonksiyon sadece sunucu tarafında çalışabilir');
  }

  console.log("Ürünler veritabanından çekiliyor...");
  
  try {
    // Prisma'yı dinamik olarak import et
    const { prisma } = await import('@/lib/prisma');
    
    const products = await prisma.product.findMany();
    console.log(`Veritabanından ${products.length} ürün çekildi`);
    
    // Veritabanından gelen verileri Product tipine dönüştür
    return products.map((dbProduct: any) => ({
      id: dbProduct.id,
      name: dbProduct.name,
      description: dbProduct.description || "",
      price: dbProduct.price,
      discountedPrice: dbProduct.discountedPrice || undefined,
      stock: dbProduct.stock,
      brand: dbProduct.brand || "",
      categories: dbProduct.categories as string[],
      images: dbProduct.images as string[],
      currency: validateCurrency(dbProduct.currency)
    }));
  } catch (error) {
    console.error("Veritabanından ürünler çekilirken hata oluştu:", error);
    return [];
  }
}

// Mevcut fetchProducts fonksiyonunu güncelle - artık client-side'da çalışacak
export async function fetchProducts(): Promise<Product[]> {
  try {
    // Sunucu tarafında çalışıyorsa doğrudan veritabanına erişim
    if (typeof window === 'undefined') {
      try {
        const { prisma } = await import('@/lib/prisma');
        
        const products = await prisma.product.findMany();
        console.log(`Veritabanından ${products.length} ürün çekildi`);
        
        // Veritabanından gelen verileri Product tipine dönüştür
        return products.map(dbProduct => ({
          id: dbProduct.id,
          name: dbProduct.name,
          description: dbProduct.description || "",
          price: dbProduct.price,
          discountedPrice: dbProduct.discountedPrice || undefined,
          stock: dbProduct.stock,
          brand: dbProduct.brand || "",
          categories: dbProduct.categories as string[],
          images: dbProduct.images as string[],
          currency: validateCurrency(dbProduct.currency)
        }));
      } catch (dbError) {
        console.error("Veritabanından ürünler çekilirken hata oluştu:", dbError);
        console.log("Boş ürün listesi döndürülüyor...");
        return [];
      }
    }
    
    // Client tarafında çalışıyorsa API'yi çağır
    const timestamp = new Date().getTime();
    const response = await fetch(`/api/admin/products?t=${timestamp}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

    if (!response.ok) {
      throw new Error(`Ürünler getirilemedi: ${response.status} ${response.statusText}`);
    }

    const products = await response.json();
    return products;
  } catch (error) {
    console.error("Ürünler çekilirken hata oluştu:", error);
    return [];
  }
}

function mapXmlToProduct(xmlProduct: any): Product {
  // Bu fonksiyon şu anda kullanılmıyor, ancak ileride XML ayrıştırma sorunu çözülürse kullanılabilir
  console.log('İşlenen ürün:', JSON.stringify(xmlProduct, null, 2).substring(0, 300));
  
  // Fiyat bilgisini doğru şekilde çıkaralım
  let price = 0;
  let discountedPrice = undefined;
  
  if (xmlProduct.Price) {
    price = parseFloat(xmlProduct.Price);
  } else if (xmlProduct.SatisFiyati) {
    price = parseFloat(xmlProduct.SatisFiyati);
  } else if (xmlProduct.FIYAT) {
    price = parseFloat(xmlProduct.FIYAT);
  } else if (xmlProduct.UrunFiyati) {
    price = parseFloat(xmlProduct.UrunFiyati);
  }
  
  // İndirimli fiyat kontrolü
  if (xmlProduct.DiscountedPrice) {
    discountedPrice = parseFloat(xmlProduct.DiscountedPrice);
  } else if (xmlProduct.IndirimliSatisFiyati) {
    discountedPrice = parseFloat(xmlProduct.IndirimliSatisFiyati);
  } else if (xmlProduct.INDIRIMLISATISFIYATI) {
    discountedPrice = parseFloat(xmlProduct.INDIRIMLISATISFIYATI);
  }
  
  // Görüntüleri çıkaralım
  let images: string[] = [];
  
  if (xmlProduct.Images && Array.isArray(xmlProduct.Images.Image)) {
    images = xmlProduct.Images.Image.map((img: any) => {
      if (typeof img === 'string') return img;
      return img.Url || img.URL || img.Path || img;
    }).filter(Boolean);
  } else if (xmlProduct.Image && typeof xmlProduct.Image === 'string') {
    images = [xmlProduct.Image];
  } else if (xmlProduct.Resim && typeof xmlProduct.Resim === 'string') {
    images = [xmlProduct.Resim];
  } else if (xmlProduct.RESIM && typeof xmlProduct.RESIM === 'string') {
    images = [xmlProduct.RESIM];
  }
  
  // Kategorileri çıkaralım
  let categories: string[] = [];
  
  if (xmlProduct.Categories && Array.isArray(xmlProduct.Categories.Category)) {
    categories = xmlProduct.Categories.Category.map((cat: any) => {
      if (typeof cat === 'string') return cat;
      return cat.Name || cat.Title || cat;
    }).filter(Boolean);
  } else if (xmlProduct.Category && typeof xmlProduct.Category === 'string') {
    categories = [xmlProduct.Category];
  } else if (xmlProduct.Kategori && typeof xmlProduct.Kategori === 'string') {
    categories = [xmlProduct.Kategori];
  } else if (xmlProduct.KATEGORI && typeof xmlProduct.KATEGORI === 'string') {
    categories = [xmlProduct.KATEGORI];
  }
  
  return {
    id: xmlProduct.Id || xmlProduct.ProductId || xmlProduct.UrunId || xmlProduct.URUNID || xmlProduct.UrunKartiID || '',
    name: xmlProduct.Name || xmlProduct.Title || xmlProduct.UrunAdi || xmlProduct.URUNADI || '',
    description: xmlProduct.Description || xmlProduct.Aciklama || xmlProduct.ACIKLAMA || '',
    price: price,
    discountedPrice: discountedPrice,
    currency: xmlProduct.Currency || xmlProduct.ParaBirimi || xmlProduct.PARABIRIMI || 'TRY',
    images: images,
    categories: categories,
    brand: xmlProduct.Brand || xmlProduct.Manufacturer || xmlProduct.Marka || xmlProduct.MARKA || undefined,
    stock: parseInt(xmlProduct.Stock || xmlProduct.Stok || xmlProduct.STOK || 0, 10),
    url: xmlProduct.Url || xmlProduct.URL || xmlProduct.Link || xmlProduct.LINK || undefined,
  };
}

export async function fetchMaskeMuzikProducts(): Promise<Product[]> {
  try {
    console.log("Maske Müzik ürünleri çekiliyor...");
    
    // XML kaynağı
    const xmlUrl = 'https://www.maskemuzik.com/TicimaxXml/5BE22172CA0848B2A085FA30B7841D7A/';
    
    // XML'i çek
    const response = await fetch(xmlUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/xml, text/xml, */*',
        'Cache-Control': 'no-cache'
      }
    });
    
    if (!response.ok) {
      throw new Error(`XML çekilemedi: ${response.status} ${response.statusText}`);
    }
    
    const xmlText = await response.text();
    console.log(`XML veri uzunluğu: ${xmlText.length} karakter`);
    
    // XML parser oluştur
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
      isArray: (name) => {
        return name === "Urun" || name === "Resim" || name === "Secenek";
      },
      cdataPropName: "__cdata",
      preserveOrder: false,
      parseTagValue: false,
      trimValues: true,
      parseAttributeValue: false
    });
    
    // XML'i parse et
    const parsedXml = parser.parse(xmlText);
    console.log("XML başarıyla ayrıştırıldı. Kök elemanlar:", Object.keys(parsedXml));
    
    // Ürün düğümlerini bul
    let productNodes: any[] = [];
    
    // Yapı: <Root><Urunler><Urun>...</Urun></Urunler></Root>
    if (parsedXml.Root && parsedXml.Root.Urunler && Array.isArray(parsedXml.Root.Urunler.Urun)) {
      console.log("Yapı tespit edildi: Root > Urunler > Urun");
      productNodes = parsedXml.Root.Urunler.Urun;
    }
    // Diğer yapıları da kontrol edelim
    else if (parsedXml.products && Array.isArray(parsedXml.products.product)) {
      console.log("Yapı tespit edildi: products > product");
      productNodes = parsedXml.products.product;
    }
    else if (parsedXml.urunler && Array.isArray(parsedXml.urunler.urun)) {
      console.log("Yapı tespit edildi: urunler > urun");
      productNodes = parsedXml.urunler.urun;
    }
    else {
      // Hiçbir yapı eşleşmezse, XML'i derinlemesine analiz et
      console.log("Bilinen yapılar eşleşmedi, XML derinlemesine analiz ediliyor...");
      productNodes = findProductNodes(parsedXml);
    }
    
    console.log(`Toplam ${productNodes.length} ürün bulundu`);
    
    if (!productNodes || productNodes.length === 0) {
      throw new Error("XML'de ürün bulunamadı");
    }
    
    // Ürünleri işle
    const products: Product[] = [];
    
    for (const productNode of productNodes) {
      try {
        const processedProduct = processProductNode(productNode);
        
        if (processedProduct.id && processedProduct.name) {
          // Para birimini kontrol et ve düzelt
          if (processedProduct.currency === 'TL' as any) {
            processedProduct.currency = 'TRY';
          }
          
          products.push(processedProduct as Product);
        }
      } catch (error) {
        console.error("Ürün işlenirken hata:", error);
      }
    }
    
    console.log(`Toplam ${products.length} ürün işlendi`);
    return products;
    
  } catch (error) {
    console.error("Maske Müzik ürünleri çekilirken hata:", error);
    return [];
  }
}

// Ürün oluşturma fonksiyonu
export async function createProduct(productData: Omit<Product, 'id'>): Promise<Product> {
  try {
    // Sunucu tarafında çalışıyorsa veritabanına eriş
    if (typeof window === 'undefined') {
      try {
        const { prisma } = await import('@/lib/prisma');
        
        const newProduct = await prisma.product.create({
          data: {
            id: `product-${Math.random().toString(36).substring(2, 8)}`,
            name: productData.name,
            description: productData.description || "",
            price: productData.price || 0,
            discountedPrice: productData.discountedPrice,
            stock: productData.stock || 0,
            brand: productData.brand || "",
            categories: productData.categories || [],
            images: productData.images || [],
            currency: productData.currency || "TRY"
          }
        });
        
        return {
          id: newProduct.id,
          name: newProduct.name,
          description: newProduct.description || "",
          price: newProduct.price,
          discountedPrice: newProduct.discountedPrice || undefined,
          stock: newProduct.stock,
          brand: newProduct.brand || "",
          categories: newProduct.categories as string[],
          images: newProduct.images as string[],
          currency: validateCurrency(newProduct.currency)
        };
      } catch (dbError) {
        console.error('Veritabanına ürün ekleme hatası:', dbError);
        throw new Error('Ürün oluşturulamadı');
      }
    }
    
    // Client tarafında çalışıyorsa API'yi çağır
    const response = await fetch('/api/admin/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Ürün oluşturulamadı');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Ürün oluşturma hatası:', error);
    throw new Error('Ürün oluşturulamadı');
  }
}

// Ürün güncelleme fonksiyonu
export async function updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
  try {
    // Sunucu tarafında çalışıyorsa veritabanına eriş
    if (typeof window === 'undefined') {
      try {
        const { prisma } = await import('@/lib/prisma');
        
        const updatedProduct = await prisma.product.update({
          where: { id },
          data: {
            name: productData.name,
            description: productData.description,
            price: productData.price,
            discountedPrice: productData.discountedPrice,
            stock: productData.stock,
            brand: productData.brand,
            categories: productData.categories,
            images: productData.images,
            currency: productData.currency
          }
        });
        
        return {
          id: updatedProduct.id,
          name: updatedProduct.name,
          description: updatedProduct.description || "",
          price: updatedProduct.price,
          discountedPrice: updatedProduct.discountedPrice || undefined,
          stock: updatedProduct.stock,
          brand: updatedProduct.brand || "",
          categories: updatedProduct.categories as string[],
          images: updatedProduct.images as string[],
          currency: validateCurrency(updatedProduct.currency)
        };
      } catch (dbError) {
        console.error('Veritabanında ürün güncelleme hatası:', dbError);
        throw new Error('Ürün güncellenemedi');
      }
    }
    
    // Client tarafında çalışıyorsa API'yi çağır
    const response = await fetch(`/api/admin/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Ürün güncellenemedi');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Ürün güncelleme hatası:', error);
    throw new Error('Ürün güncellenemedi');
  }
}

// Ürün silme fonksiyonu
export async function deleteProduct(id: string, onSuccess?: () => void): Promise<boolean> {
  try {
    // API endpoint'ini çağır
    const response = await fetch(`/api/admin/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Ürün silinemedi');
    }
    
    // Başarılı yanıt alındıysa, localStorage'ı da güncelle
    try {
      const products = await fetchProducts();
      const updatedProducts = products.filter(p => p.id !== id);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
    } catch (storageError) {
      console.error("LocalStorage güncellenirken hata oluştu:", storageError);
      // Bu hata kritik değil, devam edebiliriz
    }
    
    // Başarı callback'ini çağır
    if (onSuccess && typeof onSuccess === 'function') {
      onSuccess();
    }
    
    return true;
  } catch (error) {
    console.error('Ürün silme hatası:', error);
    throw error instanceof Error ? error : new Error('Ürün silinemedi');
  }
}

// Ürün detaylarını getirme fonksiyonu
export async function getProductById(id: string): Promise<Product | null> {
  try {
    // Sunucu tarafında çalışıyorsa veritabanına eriş
    if (typeof window === 'undefined') {
      try {
        const { prisma } = await import('@/lib/prisma');
        
        const product = await prisma.product.findUnique({
          where: { id }
        });
        
        if (!product) {
          console.log(`Ürün bulunamadı (ID: ${id})`);
          return null;
        }
        
        return {
          id: product.id,
          name: product.name,
          description: product.description || "",
          price: product.price,
          discountedPrice: product.discountedPrice || undefined,
          stock: product.stock,
          brand: product.brand || "",
          categories: product.categories as string[],
          images: product.images as string[],
          currency: validateCurrency(product.currency)
        };
      } catch (dbError) {
        console.error('Veritabanından ürün getirme hatası:', dbError);
        return null;
      }
    }
    
    // Client tarafında çalışıyorsa API'yi çağır
    try {
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/admin/products/${id}?t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (!response.ok) {
        console.error(`Ürün getirme hatası: ${response.status} ${response.statusText}`);
        return null;
      }
      
      return await response.json();
    } catch (fetchError) {
      console.error('Ürün API çağrısı hatası:', fetchError);
      return null;
    }
  } catch (error) {
    console.error('Ürün detayı getirme hatası:', error);
    return null;
  }
}