// Kategori tipi tanımı
export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  productCount?: number;
  parentId?: string;
  children?: Category[];
}

// Tüm kategorileri getir
export async function getAllCategories(): Promise<Category[]> {
  // Normalde burada bir API çağrısı veya veritabanı sorgusu olacak
  // Şimdilik örnek veri döndürüyoruz
  return [
    {
      id: "gitar",
      name: "Gitarlar",
      description: "Akustik, elektro ve klasik gitarlar",
      image: "https://images.unsplash.com/photo-1550291652-6ea9114a47b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
      productCount: 0 // Dinamik olarak güncellenecek
    },
    {
      id: "piyano",
      name: "Piyanolar",
      description: "Akustik ve dijital piyanolar",
      image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      productCount: 0 // Dinamik olarak güncellenecek
    },
    {
      id: "davul",
      name: "Davul ve Perküsyon",
      description: "Akustik ve elektronik davul setleri, perküsyon aletleri",
      image: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      productCount: 0 // Dinamik olarak güncellenecek
    },
    {
      id: "yayli",
      name: "Yaylı Çalgılar",
      description: "Keman, viyola, çello ve kontrbas",
      image: "https://images.unsplash.com/photo-1612225330812-01a9c6b355ec?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      productCount: 0 // Dinamik olarak güncellenecek
    },
    {
      id: "uflemeli",
      name: "Üflemeli Çalgılar",
      description: "Flüt, klarnet, saksafon ve diğer üflemeli çalgılar",
      image: "https://images.unsplash.com/photo-1573871669414-010dbf73ca84?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
      productCount: 0 // Dinamik olarak güncellenecek
    },
    {
      id: "elektronik",
      name: "Elektronik Müzik",
      description: "Synthesizer, MIDI controller ve diğer elektronik müzik ekipmanları",
      image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      productCount: 0 // Dinamik olarak güncellenecek
    },
    {
      id: "amfi",
      name: "Amfi ve Efekt",
      description: "Gitar ve bas amfileri, efekt pedalları",
      image: "https://images.unsplash.com/photo-1546058256-47154de4046c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
      productCount: 0 // Dinamik olarak güncellenecek
    },
    {
      id: "aksesuar",
      name: "Aksesuarlar",
      description: "Teller, mızraplar, tuner ve diğer müzik aksesuarları",
      image: "https://images.unsplash.com/photo-1588599376442-3cbf9c67449e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80",
      productCount: 0 // Dinamik olarak güncellenecek
    }
  ];
}

// Kategori ID'sine göre kategori getir
export async function getCategoryById(id: string): Promise<Category | null> {
  const categories = await getAllCategories();
  return categories.find(category => category.id === id) || null;
}

// Ana kategorileri getir (parentId olmayan kategoriler)
export async function getMainCategories(): Promise<Category[]> {
  const categories = await getAllCategories();
  return categories.filter(category => !category.parentId);
}

// Bir kategorinin alt kategorilerini getir
export async function getSubcategories(parentId: string): Promise<Category[]> {
  const categories = await getAllCategories();
  return categories.filter(category => category.parentId === parentId);
}

// Kategori ağacını oluştur (ana kategoriler ve alt kategorileri)
export async function getCategoryTree(): Promise<Category[]> {
  const allCategories = await getAllCategories();
  const mainCategories = allCategories.filter(category => !category.parentId);
  
  // Her ana kategoriye alt kategorileri ekle
  return mainCategories.map(mainCategory => {
    const children = allCategories.filter(category => category.parentId === mainCategory.id);
    return {
      ...mainCategory,
      children: children.length > 0 ? children : undefined
    };
  });
}

// Ürün sayılarını güncellenmiş kategorileri getir
import { fetchProducts } from './productService';

export async function getCategoriesWithProductCounts(): Promise<Category[]> {
  console.log("Ürün sayılarıyla kategoriler getiriliyor...");
  const categories = await getAllCategories();
  const products = await fetchProducts();
  
  console.log(`Toplam ${products.length} ürün ve ${categories.length} kategori bulundu`);
  
  // Her kategori için ürün sayısını hesapla
  return categories.map(category => {
    // Kategori ID'sini küçük harfe çevirerek karşılaştırma yapalım
    const categoryId = category.id.toLowerCase();
    
    const productsInCategory = products.filter(product => {
      // Ürünün kategorilerini kontrol et
      if (!product.categories || !Array.isArray(product.categories)) {
        return false;
      }
      
      // Kategori ID'lerini küçük harfe çevirerek karşılaştırma yapalım
      return product.categories.some(cat => 
        typeof cat === 'string' && cat.toLowerCase() === categoryId
      );
    });
    
    const productCount = productsInCategory.length;
    
    console.log(`"${category.name}" kategorisinde ${productCount} ürün bulundu`);
    
    // Kategori adlarını düzgün şekilde ayarla
    let categoryName = category.name;
    switch(category.id) {
      case 'gitar':
        categoryName = 'Gitarlar';
        break;
      case 'piyano':
        categoryName = 'Piyanolar';
        break;
      case 'davul':
        categoryName = 'Davul ve Perküsyon';
        break;
      case 'yayli':
        categoryName = 'Yaylı Çalgılar';
        break;
      case 'uflemeli':
        categoryName = 'Üflemeli Çalgılar';
        break;
      case 'elektronik':
        categoryName = 'Elektronik Müzik';
        break;
      case 'amfi':
        categoryName = 'Amfi ve Efekt';
        break;
      case 'aksesuar':
        categoryName = 'Aksesuarlar';
        break;
    }
    
    return {
      ...category,
      name: categoryName,
      productCount
    };
  });
}