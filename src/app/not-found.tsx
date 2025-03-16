import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
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
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Sayfa Bulunamadı</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir. Ana sayfaya dönüp tekrar deneyebilirsiniz.
        </p>
        <Link 
          href="/" 
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
} 