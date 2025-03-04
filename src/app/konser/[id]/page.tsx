import { getEventById } from '@/services/eventService';
import { fetchLayoutSettings } from '@/services/layoutService';
import KonserDetayClient from '@/components/KonserDetayClient';
import { notFound } from 'next/navigation';

interface KonserDetayPageProps {
  params: {
    id: string;
  };
}

export default async function KonserDetayPage({ params }: KonserDetayPageProps) {
  try {
    // Next.js 15.1.7'de params nesnesini await etmemiz gerekiyor
    const resolvedParams = await params;
    const eventId = resolvedParams.id;
    
    const event = await getEventById(eventId);
    const layoutSettings = await fetchLayoutSettings();
    
    if (!event) {
      console.error(`Konser bulunamadı: ${eventId}`);
      notFound();
    }
    
    return (
      <KonserDetayClient 
        event={event} 
        layoutSettings={layoutSettings} 
      />
    );
  } catch (error) {
    console.error("Konser detay sayfası yüklenirken hata oluştu:", error);
    notFound();
  }
} 