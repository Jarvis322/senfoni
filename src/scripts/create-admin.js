// Admin kullanıcısı oluşturmak için script
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // Admin bilgileri
    const adminData = {
      email: 'admin@senfoni.com',
      password: 'Admin123!',
      name: 'Admin',
      surname: 'Kullanıcı',
      role: 'ADMIN'
    };

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    // Kullanıcı var mı kontrol et
    const existingUser = await prisma.user.findUnique({
      where: { email: adminData.email }
    });

    if (existingUser) {
      console.log('Bu e-posta adresine sahip bir kullanıcı zaten var.');
      
      // Kullanıcı var ama admin değilse, admin yap
      if (existingUser.role !== 'ADMIN') {
        await prisma.user.update({
          where: { email: adminData.email },
          data: { role: 'ADMIN' }
        });
        console.log('Kullanıcı admin rolüne yükseltildi.');
      }
    } else {
      // Yeni admin kullanıcısı oluştur
      const newAdmin = await prisma.user.create({
        data: {
          email: adminData.email,
          password: hashedPassword,
          name: adminData.name,
          surname: adminData.surname,
          role: 'ADMIN'
        }
      });

      console.log('Admin kullanıcısı başarıyla oluşturuldu:');
      console.log(`E-posta: ${adminData.email}`);
      console.log(`Şifre: ${adminData.password}`);
    }
  } catch (error) {
    console.error('Admin kullanıcısı oluşturulurken hata oluştu:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser(); 