import { Suspense } from 'react';
import { AboutSection } from '@/services/layoutService';

// Client component will be imported
import AboutEditClient from './AboutEditClient';

// Server component
export default function EditAboutSectionPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AboutEditClient />
    </Suspense>
  );
} 