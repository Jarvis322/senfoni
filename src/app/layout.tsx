import './globals.css'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from "next/font/google";
import { CartProvider } from '@/contexts/CartContext';
import { NotificationProvider } from '@/components/NotificationProvider';
import { LayoutProvider } from '@/contexts/LayoutContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Senfoni Müzik - Müzik Aletleri ve Ekipmanları',
  description: 'Senfoni Müzik - Türkiye\'nin en kaliteli müzik aletleri ve ekipmanları mağazası. Piyanolar, gitarlar, yaylı ve vurmalı çalgılar için en iyi fiyatlar.',
  keywords: 'müzik aletleri, piyano, gitar, yaylı çalgılar, vurmalı çalgılar, müzik ekipmanları, konserler, etkinlikler',
  authors: [{ name: 'Senfoni Müzik' }],
  creator: 'Senfoni Müzik',
  publisher: 'Senfoni Müzik',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'https://senfoni.vercel.app'),
  alternates: {
    canonical: '/',
    languages: {
      'tr-TR': '/',
    },
  },
  openGraph: {
    title: 'Senfoni Müzik - Müzik Aletleri ve Ekipmanları',
    description: 'Senfoni Müzik - Türkiye\'nin en kaliteli müzik aletleri ve ekipmanları mağazası.',
    url: 'https://senfoni.vercel.app',
    siteName: 'Senfoni Müzik',
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 600,
        alt: 'Senfoni Müzik Logo',
      },
    ],
    locale: 'tr_TR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/logo-ikon.png',
    shortcut: '/logo-ikon.png',
    apple: '/logo-ikon.png',
  },
  verification: {
    google: 'google-site-verification-code',
  },
  category: 'e-commerce',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NotificationProvider>
          <CartProvider>
            <LayoutProvider>
              {children}
            </LayoutProvider>
          </CartProvider>
        </NotificationProvider>
      </body>
    </html>
  )
}
