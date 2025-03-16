'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNotification } from '@/components/NotificationProvider';
import { FaToggleOn, FaToggleOff } from 'react-icons/fa';

interface ToggleButtonProps {
  section: string;
  enabled: boolean;
}

export default function ToggleButton({ section, enabled }: ToggleButtonProps) {
  const [isEnabled, setIsEnabled] = useState(enabled);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { showNotification } = useNotification();

  const toggleSection = async () => {
    setIsLoading(true);
    
    try {
      // Bölüm adına göre API endpoint belirle
      let sectionName = '';
      let sectionDisplayName = '';
      switch (section) {
        case 'hero':
          sectionName = 'heroSection';
          sectionDisplayName = 'Hero Bölümü';
          break;
        case 'featured':
          sectionName = 'featuredProducts';
          sectionDisplayName = 'Öne Çıkan Ürünler';
          break;
        case 'categories':
          sectionName = 'categories';
          sectionDisplayName = 'Kategoriler';
          break;
        case 'about':
          sectionName = 'aboutSection';
          sectionDisplayName = 'Hakkımızda Bölümü';
          break;
        default:
          sectionName = '';
          sectionDisplayName = 'Bölüm';
      }
      
      if (sectionName) {
        // Mevcut ayarları getir
        const response = await fetch('/api/layout');
        const layoutSettings = await response.json();
        
        // Bölüm ayarlarını güncelle
        const sectionData = layoutSettings[sectionName];
        sectionData.enabled = !isEnabled;
        
        // Güncellemeyi API'ye gönder
        const updateResponse = await fetch(`/api/layout/section`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sectionName,
            sectionData
          }),
        });
        
        if (updateResponse.ok) {
          setIsEnabled(!isEnabled);
          // Bildirim göster
          showNotification(
            `${sectionDisplayName} ${!isEnabled ? 'etkinleştirildi' : 'devre dışı bırakıldı'}.`,
            'success'
          );
          // Sayfayı yenile
          router.refresh();
        } else {
          showNotification(`${sectionDisplayName} güncellenirken bir hata oluştu.`, 'error');
          console.error('Bölüm güncellenirken hata oluştu');
        }
      }
    } catch (error) {
      showNotification('Bölüm güncellenirken bir hata oluştu.', 'error');
      console.error('Bölüm güncellenirken hata oluştu:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      className={`p-2 rounded-full ${isEnabled ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'}`}
      aria-label={isEnabled ? "Devre dışı bırak" : "Etkinleştir"}
      onClick={toggleSection}
      disabled={isLoading}
    >
      {isEnabled ? <FaToggleOn className="w-6 h-6" /> : <FaToggleOff className="w-6 h-6" />}
    </button>
  );
} 