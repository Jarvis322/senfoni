import { NextResponse } from 'next/server';

export function GET() {
  const robotsTxt = `
User-agent: *
Allow: /

# Disallow admin and debug routes
Disallow: /admin/
Disallow: /debug/

# Sitemap
Sitemap: ${process.env.NEXTAUTH_URL || 'https://senfoni.vercel.app'}/sitemap.xml
`;

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
} 