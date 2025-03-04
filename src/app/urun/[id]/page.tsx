import { fetchProducts, getProductById } from "@/services/productService";
import { fetchLayoutSettings } from "@/services/layoutService";
import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/ProductDetailClient";
import { Product } from "@/services/productService";

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  try {
    // Next.js 15.1.7'de params nesnesini await etmemiz gerekiyor
    const resolvedParams = await params;
    const productId = resolvedParams.id;
    
    // Önce doğrudan ürünü getirmeyi deneyelim
    let product = await getProductById(productId);
    let products: Product[] = [];
    
    // Eğer ürün bulunamadıysa, tüm ürünleri çekelim
    if (!product) {
      products = await fetchProducts();
      product = products.find(p => p.id === productId) || null;
    } else {
      // Benzer ürünler için tüm ürünleri çekelim
      products = await fetchProducts();
    }
    
    // Eğer ürün hala bulunamadıysa 404 sayfasına yönlendir
    if (!product) {
      console.error(`Ürün bulunamadı: ${productId}`);
      notFound();
    }
    
    const layoutSettings = await fetchLayoutSettings();
    
    // Benzer ürünleri bul (aynı kategoriden)
    const similarProducts = product.categories && product.categories.length > 0 && products.length > 0
      ? products.filter(p => 
          p.id !== product.id && 
          p.categories.some(cat => product.categories.includes(cat))
        ).slice(0, 4)
      : [];

    return (
      <ProductDetailClient 
        product={product} 
        similarProducts={similarProducts} 
        layoutSettings={layoutSettings} 
      />
    );
  } catch (error) {
    console.error("Ürün detay sayfası yüklenirken hata oluştu:", error);
    notFound();
  }
} 