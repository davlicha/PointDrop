import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Починаємо заповнення бази даних...');

  const admin = await prisma.user.upsert({
    where: { phone: '+380501112233' },
    update: {},
    create: {
      phone: '+380501112233',
      name: 'Admin User',
      passwordHash: 'hashed_password_here',
      role: 'ADMIN',
    },
  });

  const merchant = await prisma.merchant.create({
    data: {
      name: 'Coffee Shop Point',
      cashbackRate: 10.0,
      adminId: admin.id,
    },
  });

  console.log(`Створено адміна: ${admin.name}`);
  console.log(`Створено заклад: ${merchant.name}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });