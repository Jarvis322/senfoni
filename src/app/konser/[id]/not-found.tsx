import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

export default function KonserNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Etkinlik Bulunamadı</h1>
        <p className="text-gray-600 mb-8">
          Aradığınız etkinlik bulunamadı veya kaldırılmış olabilir. Lütfen tüm etkinlikler sayfasına dönün.
        </p>
        <Link 
          href="/konserler" 
          className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
        >
          <FaArrowLeft className="mr-2" />
          Tüm Etkinliklere Dön
        </Link>
      </div>
    </div>
  );
} 