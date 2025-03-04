import { fetchProducts } from '@/services/productService';
import { getAllCategories } from '@/services/categoryService';

export default async function TestPage() {
  const products = await fetchProducts();
  const categories = await getAllCategories();
  
  // Her kategori için ürün sayısını hesapla
  const categoryProductCounts = categories.map(category => {
    const categoryProducts = products.filter(product => 
      product.categories && product.categories.includes(category.id)
    );
    
    return {
      id: category.id,
      name: category.name,
      productCount: categoryProducts.length,
      products: categoryProducts.slice(0, 3).map(p => p.name) // İlk 3 ürünü göster
    };
  });
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Kategori ve Ürün Testi</h1>
      
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Toplam Ürün Sayısı: {products.length}</h2>
        <p className="text-sm text-gray-600">İlk 5 ürün kategorileri:</p>
        <ul className="list-disc pl-5">
          {products.slice(0, 5).map((product, index) => (
            <li key={index}>
              <strong>{product.name}</strong>: {product.categories?.join(', ') || 'Kategori yok'}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Kategoriler ve Ürün Sayıları:</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {categoryProductCounts.map((item) => (
            <div key={item.id} className="border p-4 rounded-lg">
              <h3 className="font-bold">{item.name} ({item.id})</h3>
              <p>Ürün Sayısı: {item.productCount}</p>
              {item.productCount > 0 ? (
                <div>
                  <p className="text-sm font-medium mt-2">Örnek Ürünler:</p>
                  <ul className="list-disc pl-5 text-sm">
                    {item.products.map((name, idx) => (
                      <li key={idx}>{name}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-red-500 mt-2">Bu kategoride ürün bulunamadı!</p>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Sorun Tespiti</h2>
        <p>
          Eğer kategorilerde ürün görünmüyorsa, muhtemel nedenler:
        </p>
        <ol className="list-decimal pl-5 mt-2">
          <li>Ürün verilerindeki kategori ID'leri ile kategori servisindeki ID'ler eşleşmiyor olabilir.</li>
          <li>Ürünlerin categories dizisi boş veya undefined olabilir.</li>
          <li>XML'den veri çekilirken kategori bilgileri doğru şekilde ayrıştırılmamış olabilir.</li>
        </ol>
      </div>
    </div>
  );
} 