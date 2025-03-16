'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Currency } from '@/types/currency';

// Form şeması
const formSchema = z.object({
  baseCurrency: z.string().min(3).max(3),
  targetCurrency: z.string().min(3).max(3),
  rate: z.coerce.number().positive().min(0.000001),
});

type FormValues = z.infer<typeof formSchema>;

export default function ExchangeRateForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form durumu
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      baseCurrency: 'TRY',
      targetCurrency: 'USD',
      rate: 0.03,
    },
  });

  // Form gönderme işlemi
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/currency/rates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Döviz kuru güncellenirken bir hata oluştu');
      }

      toast({
        title: 'Başarılı',
        description: 'Döviz kuru başarıyla güncellendi',
      });

      // Sayfayı yenile
      router.refresh();
    } catch (error) {
      console.error('Döviz kuru güncelleme hatası:', error);
      toast({
        title: 'Hata',
        description: error instanceof Error ? error.message : 'Döviz kuru güncellenirken bir hata oluştu',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="baseCurrency">Ana Para Birimi</Label>
        <Select
          defaultValue={form.getValues().baseCurrency}
          onValueChange={(value: string) => form.setValue('baseCurrency', value)}
        >
          <SelectTrigger id="baseCurrency">
            <SelectValue placeholder="Ana para birimi seçin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TRY">Türk Lirası (TRY)</SelectItem>
          </SelectContent>
        </Select>
        {form.formState.errors.baseCurrency && (
          <p className="text-sm text-red-500">{form.formState.errors.baseCurrency.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="targetCurrency">Hedef Para Birimi</Label>
        <Select
          defaultValue={form.getValues().targetCurrency}
          onValueChange={(value: string) => form.setValue('targetCurrency', value)}
        >
          <SelectTrigger id="targetCurrency">
            <SelectValue placeholder="Hedef para birimi seçin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USD">Amerikan Doları (USD)</SelectItem>
            <SelectItem value="EUR">Euro (EUR)</SelectItem>
          </SelectContent>
        </Select>
        {form.formState.errors.targetCurrency && (
          <p className="text-sm text-red-500">{form.formState.errors.targetCurrency.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="rate">Döviz Kuru</Label>
        <Input
          id="rate"
          type="number"
          step="0.000001"
          min="0.000001"
          {...form.register('rate')}
        />
        {form.formState.errors.rate && (
          <p className="text-sm text-red-500">{form.formState.errors.rate.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          1 {form.watch('baseCurrency')} = X {form.watch('targetCurrency')}
        </p>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Güncelleniyor...' : 'Döviz Kurunu Güncelle'}
      </Button>
    </form>
  );
} 