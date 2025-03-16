import { Suspense } from 'react';
import { FeaturedProducts } from '@/services/layoutService';
import { Product } from '@/services/productService';
import FeaturedEditClient from './FeaturedEditClient';

// Server Component
export default async function EditFeaturedProductsPage() {
  // Create default initial data
  const initialData: FeaturedProducts = {
    title: '',
    subtitle: '',
    productIds: [],
    enabled: false
  };

  // Get all products for selection
  const { fetchProductsFromDatabase } = await import('@/services/productService');
  const allProducts: Product[] = await fetchProductsFromDatabase();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FeaturedEditClient 
        initialData={initialData} 
        allProducts={allProducts} 
      />
    </Suspense>
  );
} 