import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Admin kullanıcısı oluştur
  const hashedPassword = await bcrypt.hash('Admin123!', 10);
  
  try {
    const admin = await prisma.user.upsert({
      where: { email: 'admin@senfoni.com' },
      update: {},
      create: {
        email: 'admin@senfoni.com',
        password: hashedPassword,
        name: 'Admin',
        surname: 'User',
        role: 'ADMIN',
      },
    });
    
    console.log('Admin kullanıcısı oluşturuldu:', admin.email);
  } catch (error) {
    console.error('Admin kullanıcısı oluşturulurken hata:', error);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 