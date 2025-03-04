import { Metadata } from 'next';
import { getAllExchangeRates } from '@/services/currencyService';
import ExchangeRateForm from '@/components/admin/ExchangeRateForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Döviz Kurları Yönetimi | Admin Panel',
  description: 'Döviz kurlarını yönetin ve güncelleyin',
};

export default async function ExchangeRatesPage() {
  const exchangeRates = await getAllExchangeRates();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Döviz Kurları Yönetimi</h1>
        <form action="/api/currency/refresh" method="POST">
          <Button type="submit" variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Kurları Güncelle
          </Button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Mevcut Döviz Kurları</CardTitle>
            <CardDescription>
              Sistemde kayıtlı döviz kurları ve son güncelleme tarihleri
            </CardDescription>
          </CardHeader>
          <CardContent>
            {exchangeRates.length === 0 ? (
              <p className="text-muted-foreground">Henüz kayıtlı döviz kuru bulunmuyor.</p>
            ) : (
              <div className="space-y-4">
                {exchangeRates.map((rate) => (
                  <div key={rate.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">
                        {rate.baseCurrency} → {rate.targetCurrency}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Son güncelleme: {new Date(rate.lastUpdated).toLocaleString('tr-TR')}
                      </p>
                    </div>
                    <div className="text-xl font-bold">{rate.rate.toFixed(6)}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Döviz Kuru Ekle/Güncelle</CardTitle>
            <CardDescription>
              Yeni bir döviz kuru ekleyin veya mevcut bir kuru güncelleyin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ExchangeRateForm />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>PayTR Entegrasyonu</CardTitle>
          <CardDescription>
            PayTR sanal pos entegrasyonu için döviz kuru ayarları
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>
              PayTR entegrasyonu için döviz kurları otomatik olarak kullanılacaktır. PayTR, ödeme işlemlerinde
              TL para birimini kullanır ve tutarları kuruş cinsinden (1 TL = 100 kuruş) bekler.
            </p>
            <p>
              Sistem, ürün fiyatlarını otomatik olarak TL'ye çevirecek ve PayTR için uygun formata
              dönüştürecektir. Farklı para birimlerinde gösterilen ürünler için ödeme anında güncel kurlar
              kullanılacaktır.
            </p>
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mt-4">
              <h3 className="font-medium text-amber-800">Önemli Bilgi</h3>
              <p className="text-amber-700 text-sm mt-1">
                PayTR entegrasyonu için API anahtarlarınızı ve diğer ayarlarınızı çevre değişkenlerinde
                (environment variables) tanımlamanız gerekmektedir.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 