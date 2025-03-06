import { Currency } from '@/types/currency';
import { formatCurrency as formatCurrencyUtil } from '@/lib/utils';

// Desteklenen para birimleri
export const SUPPORTED_CURRENCIES: Currency[] = ['TRY', 'USD', 'EUR'];

// Varsayılan para birimi
export const DEFAULT_CURRENCY: Currency = 'TRY';

// Döviz kurları (gerçek uygulamada API'den alınacak)
export const EXCHANGE_RATES: Record<Currency, number> = {
  TRY: 1,
  USD: 0.031, // 1 TL = 0.031 USD
  EUR: 0.029, // 1 TL = 0.029 EUR
};

// Döviz kuru bilgisi
export type ExchangeRate = {
  id: string;
  baseCurrency: string;
  targetCurrency: string;
  rate: number;
  lastUpdated: Date;
};

// Döviz kuru güncelleme verisi
export type ExchangeRateInput = {
  baseCurrency: string;
  targetCurrency: string;
  rate: number;
};

/**
 * Para birimini formatlar
 * @param amount Miktar
 * @param currency Para birimi
 * @returns Formatlanmış para birimi
 */
export const formatCurrency = (amount: number, currency: Currency): string => {
  return formatCurrencyUtil(amount, currency);
};

/**
 * Bir para biriminden diğerine dönüştürür
 * @param amount Miktar
 * @param fromCurrency Kaynak para birimi
 * @param toCurrency Hedef para birimi
 * @returns Dönüştürülmüş miktar
 */
export const convertCurrency = (
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency
): number => {
  if (fromCurrency === toCurrency) {
    return amount;
  }
  
  // Önce TL'ye çevir, sonra hedef para birimine
  const amountInTRY = fromCurrency === 'TRY' ? amount : amount / EXCHANGE_RATES[fromCurrency];
  const convertedAmount = toCurrency === 'TRY' ? amountInTRY : amountInTRY * EXCHANGE_RATES[toCurrency];
  
  return parseFloat(convertedAmount.toFixed(2));
};

/**
 * Seçilen para birimine göre fiyatı dönüştürür ve formatlar
 * @param price Fiyat (TL cinsinden)
 * @param selectedCurrency Seçilen para birimi
 * @returns Formatlanmış fiyat
 */
export const getFormattedPrice = (price: number, selectedCurrency: Currency): string => {
  const convertedPrice = convertCurrency(price, 'TRY', selectedCurrency);
  return formatCurrency(convertedPrice, selectedCurrency);
};

/**
 * İki para birimi arasındaki döviz kurunu getirir
 * @param baseCurrency Ana para birimi (TRY)
 * @param targetCurrency Hedef para birimi
 * @returns Döviz kuru
 */
export async function getExchangeRate(
  baseCurrency: string,
  targetCurrency: string
): Promise<number> {
  try {
    // Tarayıcı ortamında çalışıyorsa varsayılan değerleri döndür
    if (typeof window !== 'undefined') {
      if (targetCurrency === 'USD') return 0.03;
      if (targetCurrency === 'EUR') return 0.028;
      return 1;
    }
    
    // Sunucu tarafında çalışıyorsa Prisma'yı dinamik olarak import et
    const { prisma } = await import('@/lib/prisma');
    
    // Doğrudan SQL sorgusu kullanarak döviz kurunu al
    const result = await prisma.$queryRaw`
      SELECT rate FROM "ExchangeRate" 
      WHERE "baseCurrency" = ${baseCurrency} AND "targetCurrency" = ${targetCurrency}
      LIMIT 1
    `;
    
    const rates = result as any[];
    
    if (!rates || rates.length === 0) {
      // Kur bulunamadıysa varsayılan değerler (gerçek uygulamada API'den alınmalı)
      if (targetCurrency === 'USD') return 0.03; // 1 TRY = 0.03 USD (örnek)
      if (targetCurrency === 'EUR') return 0.028; // 1 TRY = 0.028 EUR (örnek)
      return 1; // Varsayılan olarak 1:1 oran
    }

    return rates[0].rate;
  } catch (error) {
    console.error('Döviz kuru getirme hatası:', error);
    // Hata durumunda varsayılan değerler
    if (targetCurrency === 'USD') return 0.03;
    if (targetCurrency === 'EUR') return 0.028;
    return 1;
  }
}

/**
 * Döviz kurlarını günceller
 * @param rates Güncellenecek kurlar
 */
export async function updateExchangeRates(rates: ExchangeRateInput[]): Promise<void> {
  try {
    // Tarayıcı ortamında çalışıyorsa hata fırlat
    if (typeof window !== 'undefined') {
      throw new Error('Bu fonksiyon sadece sunucu tarafında çalışabilir');
    }
    
    // Sunucu tarafında çalışıyorsa Prisma'yı dinamik olarak import et
    const { prisma } = await import('@/lib/prisma');
    
    // Her bir kur için ayrı işlem yap
    for (const rate of rates) {
      // Önce mevcut kaydı kontrol et
      const existingRate = await prisma.$queryRaw`
        SELECT id FROM "ExchangeRate" 
        WHERE "baseCurrency" = ${rate.baseCurrency} AND "targetCurrency" = ${rate.targetCurrency}
        LIMIT 1
      `;
      
      const exists = (existingRate as any[]).length > 0;
      
      if (exists) {
        // Güncelle
        await prisma.$executeRaw`
          UPDATE "ExchangeRate" 
          SET rate = ${rate.rate}, "lastUpdated" = ${new Date()}
          WHERE "baseCurrency" = ${rate.baseCurrency} AND "targetCurrency" = ${rate.targetCurrency}
        `;
      } else {
        // Yeni kayıt ekle
        await prisma.$executeRaw`
          INSERT INTO "ExchangeRate" (id, "baseCurrency", "targetCurrency", rate, "lastUpdated")
          VALUES (${crypto.randomUUID()}, ${rate.baseCurrency}, ${rate.targetCurrency}, ${rate.rate}, ${new Date()})
        `;
      }
    }
  } catch (error) {
    console.error('Döviz kuru güncelleme hatası:', error);
    throw error;
  }
}

/**
 * Tüm döviz kurlarını getirir
 * @returns Döviz kurları listesi
 */
export async function getAllExchangeRates(): Promise<ExchangeRate[]> {
  try {
    // Tarayıcı ortamında çalışıyorsa boş dizi döndür
    if (typeof window !== 'undefined') {
      return [];
    }
    
    // Sunucu tarafında çalışıyorsa Prisma'yı dinamik olarak import et
    const { prisma } = await import('@/lib/prisma');
    
    const rates = await prisma.$queryRaw`
      SELECT * FROM "ExchangeRate"
      ORDER BY "targetCurrency" ASC
    `;
    
    return rates as ExchangeRate[];
  } catch (error) {
    console.error('Döviz kurları getirme hatası:', error);
    return [];
  }
}

/**
 * Döviz kurlarını dış API'den günceller
 * Bu fonksiyon gerçek bir API entegrasyonu için şablon olarak kullanılabilir
 */
export async function fetchAndUpdateExchangeRates(): Promise<void> {
  try {
    // Tarayıcı ortamında çalışıyorsa hata fırlat
    if (typeof window !== 'undefined') {
      throw new Error('Bu fonksiyon sadece sunucu tarafında çalışabilir');
    }
    
    // Burada gerçek bir API'ye istek yapılabilir
    // Örnek: const response = await fetch('https://api.exchangerate.host/latest?base=TRY');
    // Örnek: const data = await response.json();
    
    // Şimdilik sabit değerler kullanıyoruz
    const mockRates = [
      { baseCurrency: 'TRY', targetCurrency: 'USD', rate: 0.03 },
      { baseCurrency: 'TRY', targetCurrency: 'EUR', rate: 0.028 },
    ];
    
    await updateExchangeRates(mockRates);
  } catch (error) {
    console.error('Döviz kurları güncelleme hatası:', error);
    throw error;
  }
}

/**
 * PayTR için fiyat formatı (kuruş cinsinden tam sayı)
 * @param amount TL cinsinden miktar
 * @returns Kuruş cinsinden tam sayı
 */
export function formatPriceForPayTR(amount: number): number {
  // PayTR kuruş cinsinden tam sayı bekler (örn: 10.99 TL -> 1099)
  return Math.round(amount * 100);
}

/**
 * PayTR'den gelen fiyatı TL'ye çevirir
 * @param amount Kuruş cinsinden miktar
 * @returns TL cinsinden miktar
 */
export function convertFromPayTR(amount: number): number {
  // Kuruş cinsinden tam sayıyı TL'ye çevir (örn: 1099 -> 10.99 TL)
  return amount / 100;
} 