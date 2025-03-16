import './globals.css'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Inter } from 'next/font/google'
import { Providers } from '@/app/providers'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { headers } from 'next/headers'

const inter = Inter({ subsets: ['latin'] })

// Force static rendering and caching
export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: 'Senfoni Müzik - Müzik Aletleri Mağazası',
  description: 'Senfoni Müzik - Müzik Aletleri Mağazası',
  keywords: [
    'müzik aletleri',
    'gitar',
    'piyano',
    'keman',
    'davul',
    'bateri',
    'müzik mağazası',
    'enstrüman',
    'müzik ekipmanları'
  ],
  authors: [
    {
      name: 'Senfoni Müzik',
      url: 'https://www.senfonimuzikaletleri.com'
    }
  ],
  creator: 'Senfoni Müzik',
  publisher: 'Senfoni Müzik',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.senfonimuzikaletleri.com'),
  openGraph: {
    title: 'Senfoni Müzik - Müzik Aletleri Mağazası',
    description: 'Senfoni Müzik - Müzik Aletleri Mağazası',
    url: 'https://www.senfonimuzikaletleri.com',
    siteName: 'Senfoni Müzik',
    images: [
      {
        url: 'https://www.senfonimuzikaletleri.com/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Senfoni Müzik - Müzik Aletleri Mağazası'
      }
    ],
    locale: 'tr_TR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  twitter: {
    card: 'summary_large_image',
    title: 'Senfoni Müzik - Müzik Aletleri Mağazası',
    description: 'Senfoni Müzik - Müzik Aletleri Mağazası',
    creator: '@senfonimuzik',
    images: ['https://www.senfonimuzikaletleri.com/images/og-image.jpg'],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
    yahoo: 'yahoo-site-verification-code',
  },
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
        <meta httpEquiv="Cache-Control" content="public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400" />
      </head>
      <body className={`${GeistSans.variable} ${GeistMono.variable} ${inter.className} antialiased min-h-screen flex flex-col`}>
        <Providers>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
