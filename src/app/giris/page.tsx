import { Suspense } from 'react';
import LoginClient from '@/components/LoginClient';

export const metadata = {
  title: 'Giriş Yap | Senfoni Müzik',
  description: 'Senfoni Müzik hesabınıza giriş yapın ve müzik alışverişinin keyfini çıkarın.',
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Yükleniyor...</div>}>
      <LoginClient />
    </Suspense>
  );
} 