'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import PaymentSuccessClient from '@/components/PaymentSuccessClient';
import { fetchLayoutSettings } from '@/services/layoutService';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const paymentMethod = searchParams.get('method');
  const orderIdFromUrl = searchParams.get('orderId');
  const [layoutSettings, setLayoutSettings] = useState<any>({
    showHeader: true,
    showFooter: true,
    showSearch: true,
    showCart: true
  });
  
  useEffect(() => {
    // Fetch layout settings on the client side
    const getLayoutSettings = async () => {
      try {
        const settings = await fetchLayoutSettings();
        setLayoutSettings({
          ...layoutSettings,
          ...settings
        });
      } catch (error) {
        console.error('Layout settings could not be fetched:', error);
      }
    };
    
    getLayoutSettings();
  }, []);
  
  return (
    <PaymentSuccessClient 
      paymentMethod={paymentMethod} 
      orderIdFromUrl={orderIdFromUrl}
      layoutSettings={layoutSettings}
    />
  );
} 