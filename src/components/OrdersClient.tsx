'use client';

import { useState, useEffect } from 'react';
import OrderList from '@/components/OrderList';

interface LayoutSettings {
  showHeader: boolean;
  showFooter: boolean;
  showSearch: boolean;
  showCart: boolean;
  logoUrl?: string;
  companyName?: string;
  contactEmail?: string;
  contactPhone?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
}

interface OrdersClientProps {
  layoutSettings: LayoutSettings;
}

export default function OrdersClient({ layoutSettings }: OrdersClientProps) {
  const [userEmail, setUserEmail] = useState<string>('');
  
  useEffect(() => {
    // Try to get user email from localStorage
    try {
      // First check if there's a user session
      const userSession = localStorage.getItem('userSession');
      if (userSession) {
        const userData = JSON.parse(userSession);
        if (userData.email) {
          setUserEmail(userData.email);
          return;
        }
      }
      
      // If no session, check if there's a checkout email
      const checkoutData = localStorage.getItem('checkoutInfo');
      if (checkoutData) {
        const checkoutInfo = JSON.parse(checkoutData);
        if (checkoutInfo.email) {
          setUserEmail(checkoutInfo.email);
          return;
        }
      }
      
      // If still no email, prompt the user
      const email = prompt('Siparişlerinizi görmek için e-posta adresinizi girin:');
      if (email) {
        setUserEmail(email);
        // Save for future use
        localStorage.setItem('checkoutInfo', JSON.stringify({ email }));
      }
    } catch (error) {
      console.error('Kullanıcı bilgileri alınamadı:', error);
      // Fallback to prompt
      const email = prompt('Siparişlerinizi görmek için e-posta adresinizi girin:');
      if (email) {
        setUserEmail(email);
      }
    }
  }, []);

  if (!userEmail) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Siparişlerim</h1>
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
          <p className="text-yellow-800">Siparişlerinizi görmek için lütfen e-posta adresinizi girin.</p>
          <button 
            onClick={() => {
              const email = prompt('Siparişlerinizi görmek için e-posta adresinizi girin:');
              if (email) {
                setUserEmail(email);
                localStorage.setItem('checkoutInfo', JSON.stringify({ email }));
              }
            }}
            className="mt-2 bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700"
          >
            E-posta Gir
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Siparişlerim</h1>
        <div className="text-sm text-gray-600">
          {userEmail}{' '}
          <button 
            onClick={() => {
              const email = prompt('E-posta adresinizi değiştirin:', userEmail);
              if (email) {
                setUserEmail(email);
                localStorage.setItem('checkoutInfo', JSON.stringify({ email }));
              }
            }}
            className="text-red-600 hover:text-red-800 underline"
          >
            Değiştir
          </button>
        </div>
      </div>
      <OrderList userEmail={userEmail} />
    </div>
  );
} 