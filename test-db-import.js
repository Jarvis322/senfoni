const { XMLParser } = require('fast-xml-parser');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

// XML örneği
const xmlExample = `
<Root>
<Urunler>
<Urun>
<UrunKartiID>4</UrunKartiID>
<UrunAdi>Miguel Artegas MAG150 Klasik Gitar</UrunAdi>
<OnYazi>
<![CDATA[ ]]>
</OnYazi>
<Aciklama>
<![CDATA[ <STYLE> table { font-family: arial, sans-serif; border-collapse: collapse; width: 100%; max-width: 400px; } td, th { border: 1px solid #dddddd; text-align: left; padding: 8px; } tr:nth-child(even) { background-color: #dddddd; } </STYLE> <TABLE> <TBODY> <TR> <TD>Arka ve Yanlar</TD> <TD>Maun</TD></TR> <TR> <TD>Ön Kapak</TD> <TD>Ladin</TD></TR> <TR> <TD>Klavye </TD> <TD>Gül</TD></TR> <TR> <TD>Burgu</TD> <TD>Pirinç</TD></TR></TBODY></TABLE> ]]>
</Aciklama>
<Marka>Miguel Artegas</Marka>
<SatisBirimi/>
<KategoriID>19</KategoriID>
<Kategori>Klasik Gitar</Kategori>
<KategoriTree>Telli Enstrumanlar/Gitar/Klasik Gitar</KategoriTree>
<UrunUrl>https://www.maskemuzik.com/miguel-artegas-klasik-gitar-masif-agac-gul-klavye-4</UrunUrl>
<Resimler>
<Resim>https://static.ticimax.cloud/40835/Uploads/UrunResimleri/buyuk/miguel-artegas-mag150-klasik-gitar-1c5510.jpg</Resim>
<Resim>https://static.ticimax.cloud/40835/Uploads/UrunResimleri/buyuk/miguel-artegas-mag150-klasik-gitar-eeaa14.jpg</Resim>
<Resim>https://static.ticimax.cloud/40835/Uploads/UrunResimleri/buyuk/miguel-artegas-mag150-klasik-gitar-989-a9.jpg</Resim>
<Resim>https://static.ticimax.cloud/40835/Uploads/UrunResimleri/buyuk/miguel-artegas-mag150-klasik-gitar-a323b4.jpg</Resim>
<Resim>https://static.ticimax.cloud/40835/Uploads/UrunResimleri/buyuk/miguel-artegas-mag150-klasik-gitar-4a-896.jpg</Resim>
<Resim>https://static.ticimax.cloud/40835/Uploads/UrunResimleri/buyuk/miguel-artegas-mag150-klasik-gitar--5464-.jpg</Resim>
<Resim>https://static.ticimax.cloud/40835/Uploads/UrunResimleri/buyuk/miguel-artegas-mag150-klasik-gitar-b4-398.jpg</Resim>
</Resimler>
<UrunSecenek>
<Secenek>
<VaryasyonID>4</VaryasyonID>
<StokKodu>MAG150</StokKodu>
<Barkod>8682983104849</Barkod>
<StokAdedi>3</StokAdedi>
<AlisFiyati>11000,00</AlisFiyati>
<SatisFiyati>11000,00</SatisFiyati>
<IndirimliFiyat>0,00</IndirimliFiyat>
<KDVDahil>true</KDVDahil>
<KdvOrani>20</KdvOrani>
<ParaBirimi>TL</ParaBirimi>
<ParaBirimiKodu>TRY</ParaBirimiKodu>
<Desi>0</Desi>
<EkSecenekOzellik/>
</Secenek>
</UrunSecenek>
<TeknikDetaylar/>
</Urun>
</Urunler>
</Root>
`;

// Veritabanına ürün ekleme işlemi
async function importProductToDatabase() {
  console.log("Veritabanına ürün ekleme işlemi başlatılıyor...");
  const prisma = new PrismaClient();
  
  try {
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
    const parsedXml = parser.parse(xmlExample);
    console.log("XML başarıyla ayrıştırıldı. Kök elemanlar:", Object.keys(parsedXml));
    
    // Ürün düğümlerini bul
    let productNodes = [];
    
    // Yapı: <Root><Urunler><Urun>...</Urun></Urunler></Root>
    if (parsedXml.Root && parsedXml.Root.Urunler && Array.isArray(parsedXml.Root.Urunler.Urun)) {
      console.log("Yapı tespit edildi: Root > Urunler > Urun");
      productNodes = parsedXml.Root.Urunler.Urun;
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
        
        console.log("Veritabanına eklenecek ürün:", normalizedProduct);
        
        // Ürünü veritabanına ekle
        const result = await prisma.product.upsert({
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
        
        console.log("Ürün veritabanına eklendi:", result);
        processedCount++;
      } catch (dbError) {
        console.error(`Ürün kaydedilirken hata oluştu:`, dbError);
      }
    }
    
    console.log(`Toplam ${processedCount} ürün veritabanına kaydedildi.`);
    
    // Veritabanındaki ürünleri kontrol et
    const products = await prisma.product.findMany();
    console.log(`Veritabanında toplam ${products.length} ürün bulunuyor.`);
    
    return { success: true, count: processedCount };
    
  } catch (error) {
    console.error("Ürünleri veritabanına eklerken hata oluştu:", error);
    return { success: false, error: error.message };
  } finally {
    await prisma.$disconnect();
  }
}

// Ürün düğümünü işleyip normalize eden fonksiyon
function processProductNode(productNode) {
  const result = {};
  
  // ID
  result.id = productNode.UrunKartiID || String(Math.random()).substring(2, 10);
  
  // Ürün adı
  result.name = productNode.UrunAdi || "";
  
  // Açıklama - CDATA içeriğini işle
  let description = "";
  if (productNode.Aciklama) {
    if (productNode.Aciklama.__cdata) {
      description = productNode.Aciklama.__cdata;
    } else {
      description = productNode.Aciklama;
    }
  } else if (productNode.OnYazi) {
    if (productNode.OnYazi.__cdata) {
      description = productNode.OnYazi.__cdata;
    } else {
      description = productNode.OnYazi;
    }
  }
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
      result.currency = option.ParaBirimi;
    } else if (option.ParaBirimiKodu) {
      result.currency = option.ParaBirimiKodu;
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
      result.currency = option.ParaBirimi;
    } else if (option.ParaBirimiKodu) {
      result.currency = option.ParaBirimiKodu;
    }
  }
  
  return result;
}

// Fonksiyonu çalıştır
importProductToDatabase()
  .then(result => console.log("İşlem sonucu:", result))
  .catch(error => console.error("Hata:", error)); 