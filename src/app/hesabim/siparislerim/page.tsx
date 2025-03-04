import { Metadata } from 'next';
import { fetchLayoutSettings } from '@/services/layoutService';
import OrdersClient from '@/components/OrdersClient';

export const metadata: Metadata = {
  title: 'Siparişlerim - Senfoni Müzik',
  description: 'Siparişlerinizi görüntüleyin ve takip edin',
};

export default async function OrdersPage() {
  const layoutSettings = await fetchLayoutSettings();
  
  // Ensure layoutSettings has all required properties
  const completeLayoutSettings = {
    showHeader: true,
    showFooter: true,
    showSearch: true,
    showCart: true,
    ...layoutSettings
  };
  
  return <OrdersClient layoutSettings={completeLayoutSettings} />;
} 