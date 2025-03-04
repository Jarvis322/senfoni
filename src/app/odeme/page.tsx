import { Metadata } from 'next';
import PaymentForm from '@/components/PaymentForm';
import { fetchLayoutSettings } from '@/services/layoutService';
import PaymentClient from '@/components/PaymentClient';

export const metadata: Metadata = {
  title: 'Ödeme - Senfoni Müzik',
  description: 'Güvenli ödeme sayfası',
};

export default async function PaymentPage() {
  const layoutSettings = await fetchLayoutSettings();
  
  // Ensure layoutSettings has all required properties
  const completeLayoutSettings = {
    showHeader: true,
    showFooter: true,
    showSearch: true,
    showCart: true,
    ...layoutSettings
  };
  
  return <PaymentClient layoutSettings={completeLayoutSettings} />;
} 