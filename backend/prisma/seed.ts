import { PrismaClient, Role, TransactionType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Починаємо заповнення бази даних...');

  const passwordHash = bcrypt.hashSync('password123', 10);

  // 1. Головний Адмін
  const mainAdmin = await prisma.user.upsert({
    where: { phone: '+380500000000' },
    update: {
      passwordHash,
      email: 'admin@test.com'
    },
    create: {
      phone: '+380500000000',
      email: 'admin@test.com',
      name: 'Головний Адмін',
      passwordHash: passwordHash,
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
    { phone: '+380501110001', email: 'user1@test.com', name: 'Олексій (Тест 1)', passwordHash: passwordHash, role: Role.CUSTOMER },
    { phone: '+380501110002', email: 'user2@test.com', name: 'Марія (Тест 2)', passwordHash: passwordHash, role: Role.CUSTOMER },
    { phone: '+380501110003', email: 'user3@test.com', name: 'Іван (Тест 3)', passwordHash: passwordHash, role: Role.CUSTOMER },
  ];

  const createdUsers = [];
  for (const u of usersData) {
    const user = await prisma.user.upsert({
      where: { phone: u.phone },
      update: {
        passwordHash: u.passwordHash,
        email: u.email
      },
      create: u,
    });
    createdUsers.push(user);
    console.log(`Створено користувача: ${user.name} (Email: ${user.email}, Password: password123)`);
  }

  // 4. Транзакції різних типів (EARN, REDEEM, TRANSFER)
  console.log('Створюємо транзакції...');

  const transactions = [
    // EARN
    { amount: 15, senderId: null, receiverId: createdUsers[0].id, merchantId: merchant.id, type: TransactionType.EARN },
    { amount: 4,  senderId: null, receiverId: createdUsers[0].id, merchantId: merchant.id, type: TransactionType.EARN },
    { amount: 32, senderId: null, receiverId: createdUsers[1].id, merchantId: merchant.id, type: TransactionType.EARN },
    { amount: 10, senderId: null, receiverId: createdUsers[2].id, merchantId: merchant.id, type: TransactionType.EARN },
    { amount: 1,  senderId: null, receiverId: createdUsers[2].id, merchantId: merchant.id, type: TransactionType.EARN },
    // REDEEM
    { amount: 5,  senderId: createdUsers[0].id, receiverId: mainAdmin.id, merchantId: merchant.id, type: TransactionType.REDEEM },
    { amount: 10, senderId: createdUsers[1].id, receiverId: mainAdmin.id, merchantId: merchant.id, type: TransactionType.REDEEM },
    // TRANSFER
    { amount: 2,  senderId: createdUsers[0].id, receiverId: createdUsers[1].id, merchantId: merchant.id, type: TransactionType.TRANSFER },
    { amount: 3,  senderId: createdUsers[1].id, receiverId: createdUsers[2].id, merchantId: merchant.id, type: TransactionType.TRANSFER },
  ];

  for (const t of transactions) {
    await prisma.transaction.create({
      data: {
        amount: t.amount,
        type: t.type,
        merchantId: t.merchantId,
        senderId: t.senderId,
        receiverId: t.receiverId,
      }
    });

    // Оновлення балансу для отримувача (якщо це EARN або TRANSFER)
    if (t.type === TransactionType.EARN || t.type === TransactionType.TRANSFER) {
      await prisma.balance.upsert({
        where: {
          userId_merchantId: {
            userId: t.receiverId,
            merchantId: t.merchantId,
          }
        },
        create: {
          userId: t.receiverId,
          merchantId: t.merchantId,
          pointsAmount: t.amount,
        },
        update: {
          pointsAmount: { increment: t.amount }
        }
      });
    }

    // Оновлення балансу для відправника (якщо це REDEEM або TRANSFER)
    if (t.type === TransactionType.REDEEM || t.type === TransactionType.TRANSFER) {
      await prisma.balance.upsert({
        where: {
          userId_merchantId: {
            userId: t.senderId!,
            merchantId: t.merchantId,
          }
        },
        create: {
          userId: t.senderId!,
          merchantId: t.merchantId,
          pointsAmount: 0,
        },
        update: {
          pointsAmount: { decrement: t.amount }
        }
      });
    }
  }

  console.log('✅ Успіх: База заповнена згідно з ТЗ (юзери, баланси та транзакції різних типів)!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });