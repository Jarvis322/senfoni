'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Kritik hata loglaması yapılabilir
    console.error(error);
  }, [error]);

  return (
    <html lang="tr">
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Kritik Bir Hata Oluştu</h1>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Üzgünüz, uygulamada kritik bir hata oluştu. Lütfen tekrar deneyin veya daha sonra tekrar ziyaret edin.
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
      </body>
    </html>
  );
} 