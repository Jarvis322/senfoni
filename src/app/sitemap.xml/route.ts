import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://senfoni.vercel.app';
  
  // Statik sayfalar
  const staticPages = [
    '',
    '/urunler',
    '/konserler',
    '/hakkimizda',
    '/hesabim',
    '/sepet',
  ];

  // Ürünleri çek
  const products = await prisma.product.findMany({
    select: { id: true, updatedAt: true },
  });

  // Kategorileri çek
  const categories = await prisma.product.findMany({
    distinct: ['categories'],
    select: { categories: true },
  });
  const uniqueCategories = Array.from(
    new Set(categories.flatMap(c => c.categories))
  );

  // Etkinlikleri çek
  const events = await prisma.event.findMany({
    select: { id: true, updatedAt: true },
  });

  // XML oluştur
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Statik sayfaları ekle
  staticPages.forEach((path) => {
    xml += `
  <url>
    <loc>${baseUrl}${path}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${path === '' ? '1.0' : '0.8'}</priority>
  </url>`;
  });

  // Ürün sayfalarını ekle
  products.forEach((product) => {
    xml += `
  <url>
    <loc>${baseUrl}/urun/${product.id}</loc>
    <lastmod>${product.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  // Kategori sayfalarını ekle
  uniqueCategories.forEach((category) => {
    xml += `
  <url>
    <loc>${baseUrl}/kategori/${encodeURIComponent(category)}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
  });

  // Etkinlik sayfalarını ekle
  events.forEach((event) => {
    xml += `
  <url>
    <loc>${baseUrl}/konser/${event.id}</loc>
    <lastmod>${event.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  xml += `
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
} 