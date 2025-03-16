import { Metadata } from 'next';
import { fetchLayoutSettings } from '@/services/layoutService';
import OrderDetailClient from '@/components/OrderDetailClient';

export const metadata: Metadata = {
  title: 'Sipariş Detayları - Senfoni Müzik',
  description: 'Sipariş detaylarınızı görüntüleyin',
};

interface OrderDetailPageProps {
  params: {
    orderId: string;
  };
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { orderId } = params;
  const layoutSettings = await fetchLayoutSettings();
  
  // Ensure layoutSettings has all required properties
  const completeLayoutSettings = {
    showHeader: true,
    showFooter: true,
    showSearch: true,
    showCart: true,
    ...layoutSettings
  };
  
  return <OrderDetailClient layoutSettings={completeLayoutSettings} orderId={orderId} />;
} 