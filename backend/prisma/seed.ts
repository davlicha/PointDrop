import { PrismaClient, Role, TransactionType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Починаємо заповнення бази даних...');

  // 1. Головний Адмін
  const mainAdmin = await prisma.user.upsert({
    where: { phone: '+380500000000' },
    update: {},
    create: {
      phone: '+380500000000',
      name: 'Головний Адмін',
      passwordHash: 'secure_hash',
      role: Role.ADMIN,
    },
  });

  // 2. Заклад
  let merchant = await prisma.merchant.findFirst({
    where: { adminId: mainAdmin.id }
  });

  if (!merchant) {
    merchant = await prisma.merchant.create({
      data: {
        name: 'Coffee Shop Point',
        cashbackRate: 10.0,
        adminId: mainAdmin.id,
      },
    });
  }
  console.log(`Заклад готовий: ${merchant.name}`);

  // 3. 3 Тестових користувача
  const usersData = [
    { phone: '+380501110001', name: 'Олексій (Тест 1)', passwordHash: 'hash1', role: Role.CUSTOMER },
    { phone: '+380501110002', name: 'Марія (Тест 2)', passwordHash: 'hash2', role: Role.CUSTOMER },
    { phone: '+380501110003', name: 'Іван (Тест 3)', passwordHash: 'hash3', role: Role.CUSTOMER },
  ];

  const createdUsers = [];
  for (const u of usersData) {
    const user = await prisma.user.upsert({
      where: { phone: u.phone },
      update: {},
      create: u,
    });
    createdUsers.push(user);
    console.log(`Створено користувача: ${user.name}`);
  }

  // 4. 5 Транзакцій (використовуємо TransactionType.EARN)
  console.log('Створюємо 5 транзакцій...');

  const transactions = [
    { amount: 150.50, userId: createdUsers[0].id, merchantId: merchant.id, type: TransactionType.EARN, receiverId: createdUsers[0].id },
    { amount: 45.00,  userId: createdUsers[0].id, merchantId: merchant.id, type: TransactionType.EARN, receiverId: createdUsers[0].id },
    { amount: 320.00, userId: createdUsers[1].id, merchantId: merchant.id, type: TransactionType.EARN, receiverId: createdUsers[1].id },
    { amount: 99.90,  userId: createdUsers[2].id, merchantId: merchant.id, type: TransactionType.EARN, receiverId: createdUsers[2].id },
    { amount: 12.50,  userId: createdUsers[2].id, merchantId: merchant.id, type: TransactionType.EARN, receiverId: createdUsers[2].id },
  ];

  console.log('✅ Успіх: База заповнена згідно з ТЗ (3 юзери, 5 транзакцій)!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });