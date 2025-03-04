import { fetchLayoutSettings } from "@/services/layoutService";
import { fetchProducts } from "@/services/productService";
import { HomeClient } from "@/components/HomeClient";

export default async function Home() {
  try {
    // Sunucu tarafında layout ayarlarını ve ürünleri çek
    const layoutSettings = await fetchLayoutSettings();
    const products = await fetchProducts();
    
    // Öne çıkan ürünleri filtrele
    const featuredProductIds = layoutSettings.featuredProducts.productIds || [];
    const featuredProducts = products.filter(product => 
      featuredProductIds.includes(product.id)
    );
    
    // Eğer öne çıkan ürün yoksa, ilk 4 ürünü göster
    const displayProducts = featuredProducts.length > 0 
      ? featuredProducts 
      : products.slice(0, 4);

    return (
      <HomeClient 
        products={products} 
        layoutSettings={layoutSettings}
      />
    );
  } catch (error) {
    console.error("Ana sayfa yüklenirken hata oluştu:", error);
    
    // Hata durumunda basit bir hata sayfası göster
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Bir hata oluştu</h1>
          <p className="text-gray-700 mb-4">
            Sayfa yüklenirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Sayfayı Yenile
          </button>
        </div>
      </div>
    );
  }
}
