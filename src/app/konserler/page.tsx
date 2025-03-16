import { Suspense } from 'react';
import { fetchLayoutSettings } from '@/services/layoutService';
import KonserlerClient from '@/components/KonserlerClient';
import { getAllEvents, getFeaturedEvents } from '@/services/eventService';

export default async function KonserlerPage() {
  const layoutSettings = await fetchLayoutSettings();
  const events = await getAllEvents();
  const featuredEvents = await getFeaturedEvents();
  const featuredEvent = featuredEvents.length > 0 ? featuredEvents[0] : null;
  
  return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <KonserlerClient 
        layoutSettings={layoutSettings} 
        events={events}
        featuredEvent={featuredEvent}
      />
    </Suspense>
  );
} 