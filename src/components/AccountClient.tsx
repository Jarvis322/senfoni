'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaUser, FaShoppingBag, FaHeart, FaMapMarkerAlt, FaCog, FaSignOutAlt, FaPhone, FaEnvelope, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

type User = {
  id: string;
  email: string;
  name: string | null;
  surname: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  postalCode: string | null;
  role: string;
};

type LayoutSettings = {
  contactInfo: {
    phone: string;
    email: string;
    address: string;
    socialMedia: {
      facebook: string;
      instagram: string;
      twitter: string;
    };
  };
  categories: {
    enabled: boolean;
    title: string;
    subtitle: string;
    items: Array<{
      id: string;
      name: string;
      image: string;
    }>;
  };
  // Diğer layout ayarları da eklenebilir
};

interface AccountClientProps {
  layoutSettings: LayoutSettings;
}

export default function AccountClient({ layoutSettings }: AccountClientProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('profile');
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Kullanıcı bilgileri alınamadı');
        }
        
        setUser(data.user);
      } catch (error: any) {
        setError(error.message);
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      if (response.ok) {
        router.push('/');
      } else {
        throw new Error('Çıkış yapılamadı');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" alt="Senfoni Müzik" width={150} height={40} />
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/giris" className="text-blue-600 hover:text-blue-800">Giriş Yap</Link>
              <Link href="/kayit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">Kayıt Ol</Link>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Erişim Hatası</h1>
            <p className="text-gray-600 mb-6">{error || 'Hesap bilgilerinize erişilemedi. Lütfen giriş yapın.'}</p>
            <Link href="/giris" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Giriş Yap
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-800 text-white mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Hakkımızda</h3>
                <p className="text-gray-400">Senfoni Müzik, kaliteli müzik aletleri ve ekipmanları sunan bir online mağazadır.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Kategoriler</h3>
                <ul className="space-y-2">
                  {layoutSettings.categories.items.slice(0, 5).map((category) => (
                    <li key={category.id}>
                      <Link href={`/kategori/${category.id}`} className="text-gray-400 hover:text-white">
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">İletişim</h3>
                <p className="flex items-center text-gray-400 mb-2">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>{layoutSettings.contactInfo.address}</span>
                </p>
                <p className="flex items-center text-gray-400 mb-2">
                  <FaPhone className="mr-2" />
                  <span>{layoutSettings.contactInfo.phone.replace(/\+90\s\d{3}\s\d{3}\s\d{2}\s\d{2}/, '+90 554 302 80 98')}</span>
                </p>
                <p className="flex items-center text-gray-400">
                  <FaEnvelope className="mr-2" />
                  <span>{layoutSettings.contactInfo.email}</span>
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Takip Edin</h3>
                <div className="flex space-x-4">
                  <Link href={layoutSettings.contactInfo.socialMedia.facebook} className="text-gray-400 hover:text-white">
                    <FaFacebook size={24} />
                  </Link>
                  <Link href={layoutSettings.contactInfo.socialMedia.instagram} className="text-gray-400 hover:text-white">
                    <FaInstagram size={24} />
                  </Link>
                  <Link href={layoutSettings.contactInfo.socialMedia.twitter} className="text-gray-400 hover:text-white">
                    <FaTwitter size={24} />
                  </Link>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; {new Date().getFullYear()} Senfoni Müzik. Tüm hakları saklıdır.</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="Senfoni Müzik" width={150} height={40} />
          </Link>
          <div className="flex items-center space-x-4">
            <Link href="/sepet" className="text-gray-600 hover:text-gray-800">
              <FaShoppingBag className="text-xl" />
            </Link>
            <div className="relative">
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-800 flex items-center"
              >
                <FaSignOutAlt className="mr-1" /> Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="md:flex">
            {/* Sidebar */}
            <div className="md:w-1/4 bg-gray-50 p-6 border-r border-gray-200">
              <div className="text-center mb-6">
                <div className="inline-block bg-blue-100 rounded-full p-3 mb-2">
                  <FaUser className="text-blue-600 text-2xl" />
                </div>
                <h2 className="text-xl font-semibold">{user.name} {user.surname}</h2>
                <p className="text-gray-600 text-sm">{user.email}</p>
              </div>
              
              <nav>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                        activeTab === 'profile' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <FaUser className="mr-2" /> Profil Bilgileri
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                        activeTab === 'orders' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <FaShoppingBag className="mr-2" /> Siparişlerim
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('wishlist')}
                      className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                        activeTab === 'wishlist' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <FaHeart className="mr-2" /> Favorilerim
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('address')}
                      className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                        activeTab === 'address' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <FaMapMarkerAlt className="mr-2" /> Adres Bilgileri
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab('settings')}
                      className={`w-full text-left px-4 py-2 rounded-md flex items-center ${
                        activeTab === 'settings' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <FaCog className="mr-2" /> Hesap Ayarları
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
            
            {/* Content */}
            <div className="md:w-3/4 p-6">
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-semibold mb-6">Profil Bilgileri</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">Ad</label>
                      <p className="border rounded-md px-4 py-2 bg-gray-50">{user.name || '-'}</p>
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">Soyad</label>
                      <p className="border rounded-md px-4 py-2 bg-gray-50">{user.surname || '-'}</p>
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">E-posta</label>
                      <p className="border rounded-md px-4 py-2 bg-gray-50">{user.email}</p>
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">Telefon</label>
                      <p className="border rounded-md px-4 py-2 bg-gray-50">{user.phone || '-'}</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <button
                      onClick={() => setActiveTab('settings')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Bilgilerimi Güncelle
                    </button>
                  </div>
                </div>
              )}
              
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-semibold mb-6">Siparişlerim</h2>
                  <p className="text-gray-600">Henüz bir sipariş bulunmuyor.</p>
                </div>
              )}
              
              {activeTab === 'wishlist' && (
                <div>
                  <h2 className="text-2xl font-semibold mb-6">Favorilerim</h2>
                  <p className="text-gray-600">Favori listenizde ürün bulunmuyor.</p>
                </div>
              )}
              
              {activeTab === 'address' && (
                <div>
                  <h2 className="text-2xl font-semibold mb-6">Adres Bilgileri</h2>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2">Adres</label>
                      <p className="border rounded-md px-4 py-2 bg-gray-50">{user.address || '-'}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Şehir</label>
                        <p className="border rounded-md px-4 py-2 bg-gray-50">{user.city || '-'}</p>
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Ülke</label>
                        <p className="border rounded-md px-4 py-2 bg-gray-50">{user.country || '-'}</p>
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Posta Kodu</label>
                        <p className="border rounded-md px-4 py-2 bg-gray-50">{user.postalCode || '-'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <button
                      onClick={() => setActiveTab('settings')}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Adres Bilgilerimi Güncelle
                    </button>
                  </div>
                </div>
              )}
              
              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-2xl font-semibold mb-6">Hesap Ayarları</h2>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Ad</label>
                        <input
                          type="text"
                          className="border rounded-md px-4 py-2 w-full"
                          defaultValue={user.name || ''}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Soyad</label>
                        <input
                          type="text"
                          className="border rounded-md px-4 py-2 w-full"
                          defaultValue={user.surname || ''}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Telefon</label>
                        <input
                          type="text"
                          className="border rounded-md px-4 py-2 w-full"
                          defaultValue={user.phone || ''}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Adres</label>
                        <input
                          type="text"
                          className="border rounded-md px-4 py-2 w-full"
                          defaultValue={user.address || ''}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Şehir</label>
                        <input
                          type="text"
                          className="border rounded-md px-4 py-2 w-full"
                          defaultValue={user.city || ''}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Ülke</label>
                        <input
                          type="text"
                          className="border rounded-md px-4 py-2 w-full"
                          defaultValue={user.country || ''}
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Posta Kodu</label>
                        <input
                          type="text"
                          className="border rounded-md px-4 py-2 w-full"
                          defaultValue={user.postalCode || ''}
                        />
                      </div>
                    </div>
                    <div>
                      <button
                        type="button"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Bilgilerimi Güncelle
                      </button>
                    </div>
                  </form>
                  
                  <div className="mt-12 pt-6 border-t">
                    <h3 className="text-xl font-semibold mb-4">Şifre Değiştir</h3>
                    <form className="space-y-6">
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Mevcut Şifre</label>
                        <input
                          type="password"
                          className="border rounded-md px-4 py-2 w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Yeni Şifre</label>
                        <input
                          type="password"
                          className="border rounded-md px-4 py-2 w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Yeni Şifre (Tekrar)</label>
                        <input
                          type="password"
                          className="border rounded-md px-4 py-2 w-full"
                        />
                      </div>
                      <div>
                        <button
                          type="button"
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Şifremi Değiştir
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Hakkımızda</h3>
              <p className="text-gray-400">Senfoni Müzik, kaliteli müzik aletleri ve ekipmanları sunan bir online mağazadır.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Kategoriler</h3>
              <ul className="space-y-2">
                {layoutSettings.categories.items.slice(0, 5).map((category) => (
                  <li key={category.id}>
                    <Link href={`/kategori/${category.id}`} className="text-gray-400 hover:text-white">
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">İletişim</h3>
              <p className="flex items-center text-gray-400 mb-2">
                <FaMapMarkerAlt className="mr-2" />
                <span>{layoutSettings.contactInfo.address}</span>
              </p>
              <p className="flex items-center text-gray-400 mb-2">
                <FaPhone className="mr-2" />
                <span>{layoutSettings.contactInfo.phone.replace(/\+90\s\d{3}\s\d{3}\s\d{2}\s\d{2}/, '+90 554 302 80 98')}</span>
              </p>
              <p className="flex items-center text-gray-400">
                <FaEnvelope className="mr-2" />
                <span>{layoutSettings.contactInfo.email}</span>
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Takip Edin</h3>
              <div className="flex space-x-4">
                <Link href={layoutSettings.contactInfo.socialMedia.facebook} className="text-gray-400 hover:text-white">
                  <FaFacebook size={24} />
                </Link>
                <Link href={layoutSettings.contactInfo.socialMedia.instagram} className="text-gray-400 hover:text-white">
                  <FaInstagram size={24} />
                </Link>
                <Link href={layoutSettings.contactInfo.socialMedia.twitter} className="text-gray-400 hover:text-white">
                  <FaTwitter size={24} />
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Senfoni Müzik. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 