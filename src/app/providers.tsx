'use client';

import { ThemeProvider } from 'next-themes'
import { SessionProvider } from 'next-auth/react'
import { CartProvider } from '@/contexts/CartContext';
import { NotificationProvider } from '@/components/NotificationProvider';
import { LayoutProvider } from '@/contexts/LayoutContext';
import { Toaster } from 'sonner';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <LayoutProvider>
          <NotificationProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </NotificationProvider>
        </LayoutProvider>
        <Toaster />
      </ThemeProvider>
    </SessionProvider>
  );
} 