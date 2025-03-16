import { Suspense } from 'react';
import { Categories } from '@/services/layoutService';

// Client component will be imported
import CategoriesEditClient from './CategoriesEditClient';

// Server component
export default function EditCategoriesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CategoriesEditClient />
    </Suspense>
  );
} 