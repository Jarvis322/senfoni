import { Suspense } from 'react';
import HeroEditClient from './HeroEditClient';

// Server component
export default function EditHeroPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeroEditClient />
    </Suspense>
  );
} 