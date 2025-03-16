import { Suspense } from 'react';
import { ContactInfo } from '@/services/layoutService';

// Client component will be imported
import ContactEditClient from './ContactEditClient';

// Server component
export default function EditContactInfoPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ContactEditClient />
    </Suspense>
  );
} 