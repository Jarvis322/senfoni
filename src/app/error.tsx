'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Hata loglaması yapılabilir
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <div className="relative w-40 h-40 mx-auto mb-6">
          <Image 
            src="/logo.png" 
            alt="Senfoni Logo" 
            fill
            className="object-contain"
          />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Bir Hata Oluştu</h1>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Üzgünüz, bir şeyler yanlış gitti. Lütfen tekrar deneyin veya ana sayfaya dönün.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => reset()}
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Tekrar Dene
          </button>
          <Link 
            href="/" 
            className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
} 