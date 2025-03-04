import { Metadata } from 'next';
import { fetchLayoutSettings } from '@/services/layoutService';
import PaymentFailedClient from '@/components/PaymentFailedClient';

export const metadata: Metadata = {
  title: 'Ödeme Başarısız - Senfoni Müzik',
  description: 'Ödeme işlemi sırasında bir hata oluştu',
};

export default async function PaymentFailedPage() {
  const layoutSettings = await fetchLayoutSettings();
  
  // Ensure layoutSettings has all required properties
  const completeLayoutSettings = {
    showHeader: true,
    showFooter: true,
    showSearch: true,
    showCart: true,
    ...layoutSettings
  };
  
  return <PaymentFailedClient layoutSettings={completeLayoutSettings} />;
} 