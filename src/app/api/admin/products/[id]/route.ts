import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// GET endpoint - tek bir ürünü getirme
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const prisma = new PrismaClient();
  
  try {
    // Next.js 15.1.7'de params nesnesini await etmemiz gerekiyor
    const resolvedParams = await params;
    const productId = resolvedParams.id;
    
    // Ürünü bul
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });
    
    if (!product) {
      console.log(`API: Ürün bulunamadı (ID: ${productId})`);
      return NextResponse.json(
        { error: 'Ürün bulunamadı' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product);
  } catch (error: any) {
    console.error('Ürün getirilirken hata oluştu:', error);
    return NextResponse.json(
      { error: error.message || 'Ürün getirilemedi' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE endpoint - ürün silme
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const prisma = new PrismaClient();
  
  try {
    // Next.js 15.1.7'de params nesnesini await etmemiz gerekiyor
    const resolvedParams = await params;
    const productId = resolvedParams.id;
    
    // Ürünün var olup olmadığını kontrol et
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });
    
    if (!product) {
      return NextResponse.json(
        { error: 'Ürün bulunamadı' },
        { status: 404 }
      );
    }
    
    // Ürünü sil
    await prisma.product.delete({
      where: { id: productId }
    });
    
    console.log(`Ürün başarıyla silindi: ${productId}`);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Ürün silinirken hata oluştu:', error);
    return NextResponse.json(
      { error: error.message || 'Ürün silinemedi' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 