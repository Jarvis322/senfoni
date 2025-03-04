import { Suspense } from 'react';
import { fetchLayoutSettings } from '@/services/layoutService';
import { getCategoryById } from '@/services/categoryService';
import { fetchProducts } from '@/services/productService';
import KategoriDetayClient from '@/components/KategoriDetayClient';
import { notFound } from 'next/navigation';

interface KategoriDetayPageProps {
  params: {
    id: string;
  };
}

export default async function KategoriDetayPage({ params }: KategoriDetayPageProps) {
  // Next.js 15.1.7'de params nesnesini await etmemiz gerekiyor
  const resolvedParams = await params;
  const categoryId = resolvedParams.id;
  
  console.log(`Kategori sayfası yükleniyor: ${categoryId}`);
  
  const layoutSettings = await fetchLayoutSettings();
  const category = await getCategoryById(categoryId);
  
  if (!category) {
    console.log(`Kategori bulunamadı: ${categoryId}`);
    notFound();
  }
  
  console.log(`Kategori bulundu: ${category.name} (${category.id})`);
  
  // Bu kategoriye ait ürünleri getir
  const allProducts = await fetchProducts();
  console.log(`Toplam ürün sayısı: ${allProducts.length}`);
  
  // Kategori ID'sine göre ürünleri filtrele
  const categoryProducts = allProducts.filter(product => {
    const hasCategory = product.categories && product.categories.includes(category.id);
    if (hasCategory) {
      console.log(`Ürün kategoriye dahil: ${product.name} - Kategoriler: ${product.categories.join(', ')}`);
    }
    return hasCategory;
  });
  
  console.log(`${category.name} kategorisinde ${categoryProducts.length} ürün bulundu`);
  
  // Eğer hiç ürün bulunamadıysa, tüm ürünlerin kategorilerini kontrol et
  if (categoryProducts.length === 0) {
    console.log(`UYARI: ${category.name} kategorisinde hiç ürün bulunamadı!`);
    console.log(`Tüm ürünlerin kategorileri kontrol ediliyor...`);
    
    allProducts.forEach(product => {
      console.log(`Ürün: ${product.name} - Kategoriler: ${product.categories ? product.categories.join(', ') : 'Kategori yok'}`);
    });
    
    // Piyano kategorisi için özel kontrol
    if (category.id === 'piyano') {
      const pianoNameProducts = allProducts.filter(p => 
        p.name.toLowerCase().includes('piyano') || 
        p.name.toLowerCase().includes('piano') ||
        p.name.toLowerCase().includes('klavye') ||
        p.name.toLowerCase().includes('keyboard')
      );
      
      console.log(`Piyano içeren isme sahip ${pianoNameProducts.length} ürün var`);
      pianoNameProducts.forEach(p => {
        console.log(`Piyano isimli ürün: ${p.name} - Kategoriler: ${p.categories ? p.categories.join(', ') : 'Kategori yok'}`);
      });
    }
  }
  
  return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <KategoriDetayClient 
        layoutSettings={layoutSettings} 
        category={category}
        products={categoryProducts}
      />
    </Suspense>
  );
} 