import Link from "next/link";
import { fetchProducts } from "@/services/productService";

export default async function DebugPage() {
  const products = await fetchProducts();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-4">
        <Link href="/" className="text-blue-600 hover:underline">
          Ana Sayfaya Dön
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-4">XML Veri Debugger</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Bulunan Ürün Sayısı: {products.length}</h2>
        
        {products.length === 0 ? (
          <div className="bg-red-100 text-red-700 p-4 rounded">
            Hiç ürün bulunamadı. XML yapısı ile ilgili bir sorun olabilir.
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-medium mt-4 mb-2">İlk 3 Ürün:</h3>
            <div className="space-y-4">
              {products.slice(0, 3).map((product, index) => (
                <div key={product.id || index} className="border p-4 rounded">
                  <h4 className="font-bold">{product.name || 'İsimsiz Ürün'}</h4>
                  <p><strong>ID:</strong> {product.id || 'Yok'}</p>
                  <p><strong>Fiyat:</strong> {product.price} {product.currency}</p>
                  <p><strong>Açıklama:</strong> {product.description || 'Yok'}</p>
                  <p><strong>Stok:</strong> {product.stock}</p>
                  <p><strong>Marka:</strong> {product.brand || 'Yok'}</p>
                  <p><strong>Kategoriler:</strong> {product.categories.join(', ') || 'Yok'}</p>
                  <p><strong>Görüntüler:</strong></p>
                  <ul className="list-disc pl-5">
                    {product.images.length > 0 ? (
                      product.images.map((img, imgIndex) => (
                        <li key={imgIndex}>
                          <a href={img} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                            {img}
                          </a>
                        </li>
                      ))
                    ) : (
                      <li>Görüntü yok</li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}