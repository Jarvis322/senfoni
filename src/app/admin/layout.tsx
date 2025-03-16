'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  FaHome, FaBox, FaCalendarAlt, FaShoppingCart, FaUsers, 
  FaPalette, FaExchangeAlt, FaCog, FaBars, FaTimes, 
  FaSignOutAlt, FaChartLine, FaRegBell
} from 'react-icons/fa';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: <FaHome className="w-5 h-5" /> },
    { name: 'Ürünler', href: '/admin/products', icon: <FaBox className="w-5 h-5" /> },
    { name: 'Etkinlikler', href: '/admin/events', icon: <FaCalendarAlt className="w-5 h-5" /> },
    { name: 'Siparişler', href: '/admin/orders', icon: <FaShoppingCart className="w-5 h-5" /> },
    { name: 'Kullanıcılar', href: '/admin/users', icon: <FaUsers className="w-5 h-5" /> },
    { name: 'Sayfa Düzeni', href: '/admin/layout', icon: <FaPalette className="w-5 h-5" /> },
    { name: 'Döviz Kurları', href: '/admin/exchange-rates', icon: <FaExchangeAlt className="w-5 h-5" /> },
    { name: 'Ayarlar', href: '/admin/settings', icon: <FaCog className="w-5 h-5" /> },
  ];

  const isActive = (path: string) => {
    if (path === '/admin' && pathname === '/admin') {
      return true;
    }
    return pathname.startsWith(path) && path !== '/admin';
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top Navigation */}
      <header className="bg-white shadow-sm z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-500 focus:outline-none focus:text-gray-700 lg:hidden"
            >
              {sidebarOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
            </button>
            <Link href="/admin" className="flex items-center ml-4 lg:ml-0">
              <Image src="/logo.png" alt="Senfoni Müzik" width={40} height={40} className="h-8 w-auto" />
              <span className="ml-2 text-xl font-semibold text-gray-800">Admin Panel</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-1 text-gray-400 hover:text-gray-600 focus:outline-none relative">
              <FaRegBell className="w-6 h-6" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            <div className="relative">
              <div className="flex items-center space-x-3">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium text-gray-700">Admin</span>
                  <span className="text-xs text-gray-500">Yönetici</span>
                </div>
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700">
                  <FaUsers className="w-4 h-4" />
                </div>
              </div>
            </div>
            <Link href="/" className="text-gray-500 hover:text-gray-700 flex items-center">
              <span className="hidden md:inline mr-1">Siteye Dön</span>
              <FaSignOutAlt className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } fixed inset-y-0 z-10 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 pt-16 lg:pt-0`}
        >
          <nav className="mt-5 px-2 h-full overflow-y-auto">
            <div className="space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    isActive(item.href)
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-2 py-2 text-base font-medium rounded-md transition-all duration-200`}
                >
                  <div className={`${
                    isActive(item.href) ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'
                  } mr-3`}>
                    {item.icon}
                  </div>
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="mt-10 px-2">
              <div className="bg-indigo-50 p-3 rounded-lg">
                <div className="flex items-center">
                  <FaChartLine className="h-6 w-6 text-indigo-600" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-indigo-800">Günlük Ziyaretçi</p>
                    <p className="text-xl font-semibold text-indigo-600">1,248</p>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {/* Overlay for mobile when sidebar is open */}
          {sidebarOpen && isMobile && (
            <div 
              className="fixed inset-0 z-0 bg-black bg-opacity-50 lg:hidden" 
              onClick={() => setSidebarOpen(false)}
            ></div>
          )}
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 