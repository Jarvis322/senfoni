'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { LayoutSettings, fetchLayoutSettings, updateLayoutSettings } from '@/services/layoutService';

interface LayoutContextType {
  settings: LayoutSettings | null;
  isLoading: boolean;
  error: string | null;
  updateSettings: (newSettings: LayoutSettings) => Promise<boolean>;
  refreshSettings: () => Promise<void>;
}

const LayoutContext = createContext<LayoutContextType>({
  settings: null,
  isLoading: true,
  error: null,
  updateSettings: async () => false,
  refreshSettings: async () => {},
});

export function useLayout() {
  return useContext(LayoutContext);
}

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<LayoutSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const newSettings = await fetchLayoutSettings();
      setSettings(newSettings);
    } catch (err) {
      setError('Layout ayarları yüklenirken bir hata oluştu.');
      console.error('Layout ayarları yükleme hatası:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: LayoutSettings): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      const success = await updateLayoutSettings(newSettings);
      if (success) {
        setSettings(newSettings);
        return true;
      }
      throw new Error('Layout ayarları güncellenemedi');
    } catch (err) {
      setError('Layout ayarları güncellenirken bir hata oluştu.');
      console.error('Layout ayarları güncelleme hatası:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  return (
    <LayoutContext.Provider
      value={{
        settings,
        isLoading,
        error,
        updateSettings,
        refreshSettings,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
} 