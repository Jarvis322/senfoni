import { Metadata } from 'next';
import CartClient from '@/components/CartClient';
import { fetchLayoutSettings } from '@/services/layoutService';

export const metadata: Metadata = {
  title: 'Sepetim - Senfoni Müzik',
  description: 'Alışveriş sepetiniz',
};

export default async function CartPage() {
  const layoutSettings = await fetchLayoutSettings();
  
  return <CartClient layoutSettings={layoutSettings} />;
} 