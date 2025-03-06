import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Para birimini formatlar
 * @param amount Miktar
 * @param currency Para birimi kodu (varsayılan: TRY)
 * @returns Formatlanmış para birimi
 */
export function formatCurrency(amount: number, currency: string = 'TRY') {
  // TL kodunu TRY'ye çevir
  const currencyCode = currency === 'TL' ? 'TRY' : currency;
  
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}
