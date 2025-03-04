import { fetchProducts } from "@/services/productService";
import { getCategoryById } from "@/services/categoryService";

export default async function TestPiyanoPage() {
  const allProducts = await fetchProducts();
  const pianoCategory = await getCategoryById('piyano');
  
  // Piyano kategorisindeki ürünleri filtrele
  const pianoProducts = allProducts.filter(product => 
    product.categories && product.categories.includes('piyano')
  );
  
  // Piyano içeren ürün adları
  const pianoNameProducts = allProducts.filter(product => 
    product.name.toLowerCase().includes('piyano') || 
    product.name.toLowerCase().includes('piano') ||
    product.name.toLowerCase().includes('klavye') ||
    product.name.toLowerCase().includes('keyboard')
  );
  
  // Tüm ürünlerin kategorilerini kontrol et
  const productCategories = allProducts.map(product => ({
    id: product.id,
    name: product.name,
    categories: product.categories
  }));
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Piyano Kategorisi Testi</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">Kategori Bilgileri</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(pianoCategory, null, 2)}
        </pre>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">Piyano Kategorisindeki Ürünler ({pianoProducts.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pianoProducts.map(product => (
            <div key={product.id} className="border p-4 rounded">
              <h3 className="font-bold">{product.name}</h3>
              <p>ID: {product.id}</p>
              <p>Kategoriler: {product.categories.join(', ')}</p>
              <p>Marka: {product.brand || 'Belirtilmemiş'}</p>
              <p>Fiyat: {product.price} {product.currency}</p>
              <p>Stok: {product.stock}</p>
              {product.images && product.images.length > 0 && (
                <img 
                  src={product.images[0]} 
                  alt={product.name} 
                  className="mt-2 w-full h-40 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://placehold.co/300x300?text=Resim+Yok';
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">Piyano İçeren Ürün Adları ({pianoNameProducts.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pianoNameProducts.map(product => (
            <div key={product.id} className={`border p-4 rounded ${product.categories.includes('piyano') ? 'bg-green-100' : 'bg-red-100'}`}>
              <h3 className="font-bold">{product.name}</h3>
              <p>ID: {product.id}</p>
              <p>Kategoriler: {product.categories.join(', ')}</p>
              <p>Marka: {product.brand || 'Belirtilmemiş'}</p>
              <p>Fiyat: {product.price} {product.currency}</p>
              <p>Stok: {product.stock}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">Tüm Ürünlerin Kategorileri</h2>
        <div className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">ID</th>
                <th className="text-left">Ürün Adı</th>
                <th className="text-left">Kategoriler</th>
              </tr>
            </thead>
            <tbody>
              {productCategories.map(product => (
                <tr key={product.id} className={product.categories.includes('piyano') ? 'bg-green-100' : ''}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.categories.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 