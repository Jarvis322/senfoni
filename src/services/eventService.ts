// import { prisma } from '@/lib/prisma';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// Learn more: https://pris.ly/d/help/next-js-best-practices

export type EventInput = {
  title: string;
  description?: string;
  date: Date;
  time: string;
  location: string;
  image?: string;
  category?: string;
  featured?: boolean;
  price: number;
  currency: string;
  ticketsAvailable: number;
};

export type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
  price: number;
  currency: string;
  ticketsAvailable: number;
  featured?: boolean;
  category?: string;
};

// Örnek etkinlik verileri
const dummyEvents: Event[] = [
  {
    id: "1",
    title: "Piyano Resitali - Fazıl Say",
    description: "Dünyaca ünlü piyanist Fazıl Say'ın muhteşem piyano resitali.",
    date: "15 Mart 2025",
    time: "20:00",
    location: "İstanbul Kültür Merkezi",
    image: "https://placehold.co/800x500?text=Fazıl+Say",
    price: 350,
    currency: "TRY",
    ticketsAvailable: 120,
    featured: true
  },
  {
    id: "2",
    title: "Klasik Müzik Gecesi",
    description: "Beethoven, Mozart ve Bach'ın en sevilen eserlerinden oluşan klasik müzik gecesi.",
    date: "22 Mart 2025",
    time: "19:30",
    location: "Ankara Opera Binası",
    image: "https://placehold.co/800x500?text=Klasik+Müzik",
    price: 250,
    currency: "TRY",
    ticketsAvailable: 200
  },
  {
    id: "3",
    title: "Caz Festivali",
    description: "Yerli ve yabancı caz sanatçılarının katılımıyla gerçekleşecek festival.",
    date: "5 Nisan 2025",
    time: "18:00",
    location: "İzmir Kültür Parkı",
    image: "https://placehold.co/800x500?text=Caz+Festivali",
    price: 180,
    currency: "TRY",
    ticketsAvailable: 500
  },
  {
    id: "4",
    title: "Rock Konseri - Duman",
    description: "Duman grubunun en sevilen şarkılarını seslendireceği unutulmaz konser.",
    date: "12 Nisan 2025",
    time: "21:00",
    location: "Küçükçiftlik Park, İstanbul",
    image: "https://placehold.co/800x500?text=Duman+Konseri",
    price: 300,
    currency: "TRY",
    ticketsAvailable: 1000
  },
  {
    id: "5",
    title: "Gitar Workshop",
    description: "Profesyonel gitaristler eşliğinde gitar teknikleri ve müzik teorisi workshop'u.",
    date: "18 Nisan 2025",
    time: "14:00",
    location: "Senfoni Müzik Akademi",
    image: "https://placehold.co/800x500?text=Gitar+Workshop",
    price: 120,
    currency: "TRY",
    ticketsAvailable: 30
  },
  {
    id: "6",
    title: "Çocuklar için Müzik Atölyesi",
    description: "5-12 yaş arası çocuklar için eğlenceli müzik atölyesi ve enstrüman tanıtımı.",
    date: "25 Nisan 2025",
    time: "11:00",
    location: "Senfoni Müzik Akademi",
    image: "https://placehold.co/800x500?text=Çocuk+Atölyesi",
    price: 80,
    currency: "TRY",
    ticketsAvailable: 25
  }
];

// Helper function to initialize events in localStorage
const initializeEvents = () => {
  try {
    if (typeof window !== 'undefined') {
      const storedEvents = localStorage.getItem('events');
      if (!storedEvents) {
        localStorage.setItem('events', JSON.stringify(dummyEvents));
      }
    }
  } catch (error) {
    console.error('localStorage erişim hatası:', error);
    // localStorage erişilemiyorsa sessizce devam et
  }
};

// Helper function to get events from localStorage
const getEventsFromStorage = (): Event[] => {
  try {
    if (typeof window !== 'undefined') {
      initializeEvents();
      const storedEvents = localStorage.getItem('events');
      return storedEvents ? JSON.parse(storedEvents) : dummyEvents;
    }
  } catch (error) {
    console.error('localStorage okuma hatası:', error);
  }
  return dummyEvents; // Hata durumunda veya SSR sırasında örnek etkinlikleri döndür
};

// Helper function to save events to localStorage
const saveEventsToStorage = (events: Event[]) => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem('events', JSON.stringify(events));
    }
  } catch (error) {
    console.error('localStorage yazma hatası:', error);
    // localStorage erişilemiyorsa sessizce devam et
  }
};

/**
 * Tüm etkinlikleri getir
 */
export async function getAllEvents(): Promise<Event[]> {
  return getEventsFromStorage();
}

/**
 * Öne çıkan etkinlikleri getir
 */
export async function getFeaturedEvents(): Promise<Event[]> {
  const events = getEventsFromStorage();
  return events.filter(event => event.featured);
}

/**
 * ID'ye göre etkinlik getir
 */
export async function getEventById(id: string): Promise<Event | null> {
  const events = getEventsFromStorage();
  const event = events.find(event => event.id === id);
  return event || null;
}

/**
 * Etkinlik biletini satın al
 */
export async function purchaseTicket(eventId: string, quantity: number): Promise<{ success: boolean; message: string }> {
  const events = getEventsFromStorage();
  const eventIndex = events.findIndex(event => event.id === eventId);
  
  if (eventIndex === -1) {
    return { success: false, message: "Etkinlik bulunamadı." };
  }
  
  const event = events[eventIndex];
  
  if (event.ticketsAvailable < quantity) {
    return { success: false, message: "Yeterli bilet bulunmamaktadır." };
  }
  
  // Bilet satın alma işlemi
  events[eventIndex] = {
    ...event,
    ticketsAvailable: event.ticketsAvailable - quantity
  };
  
  saveEventsToStorage(events);
  
  return { 
    success: true, 
    message: `${event.title} etkinliği için ${quantity} adet bilet başarıyla satın alındı.` 
  };
}

/**
 * Yeni etkinlik oluştur
 */
export async function createEvent(data: Omit<Event, "id">): Promise<Event> {
  const events = getEventsFromStorage();
  
  // Generate a unique ID
  const newId = Date.now().toString();
  
  const newEvent: Event = {
    id: newId,
    ...data
  };
  
  events.push(newEvent);
  saveEventsToStorage(events);
  
  return newEvent;
}

/**
 * Etkinlik güncelle
 */
export async function updateEvent(id: string, data: Partial<Event>): Promise<Event> {
  const events = getEventsFromStorage();
  const eventIndex = events.findIndex(event => event.id === id);
  
  if (eventIndex === -1) {
    throw new Error(`Event with ID ${id} not found`);
  }
  
  const updatedEvent = {
    ...events[eventIndex],
    ...data
  };
  
  events[eventIndex] = updatedEvent;
  saveEventsToStorage(events);
  
  return updatedEvent;
}

/**
 * Etkinlik sil
 */
export async function deleteEvent(id: string): Promise<void> {
  const events = getEventsFromStorage();
  const eventIndex = events.findIndex(event => event.id === id);
  
  if (eventIndex === -1) {
    throw new Error(`Event with ID ${id} not found`);
  }
  
  events.splice(eventIndex, 1);
  saveEventsToStorage(events);
}

/**
 * Yaklaşan etkinlikleri getir
 */
export async function getUpcomingEvents(limit: number = 6): Promise<Event[]> {
  const events = getEventsFromStorage();
  
  // Sort by date (assuming date is in a format that can be compared)
  const sortedEvents = [...events].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
  
  return sortedEvents.slice(0, limit);
}

/**
 * Belirli bir ay ve yıldaki etkinlikleri getir
 */
export async function getEventsByMonth(year: number, month: number): Promise<Event[]> {
  const events = getEventsFromStorage();
  
  return events.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate.getFullYear() === year && eventDate.getMonth() === month - 1;
  });
}

/**
 * Kategoriye göre etkinlikleri getir
 */
export async function getEventsByCategory(category: string): Promise<Event[]> {
  const events = getEventsFromStorage();
  
  return events.filter(event => event.category === category);
}

/**
 * İlgili etkinlikleri getir
 */
export async function getRelatedEvents(eventId: string, limit: number = 3): Promise<Event[]> {
  const events = getEventsFromStorage();
  const event = events.find(e => e.id === eventId);
  
  if (!event) {
    return [];
  }
  
  // Find events with the same category, excluding the current event
  const relatedEvents = events
    .filter(e => e.id !== eventId && e.category === event.category)
    .slice(0, limit);
  
  // If we don't have enough related events, add some random events
  if (relatedEvents.length < limit) {
    const randomEvents = events
      .filter(e => e.id !== eventId && !relatedEvents.some(re => re.id === e.id))
      .slice(0, limit - relatedEvents.length);
    
    return [...relatedEvents, ...randomEvents];
  }
  
  return relatedEvents;
} 