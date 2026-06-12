# PointDrop 🎯

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)

PointDrop — це комплексна система лояльності, що складається з потужного бекенду на NestJS та динамічного фронтенду на React/Vite. Вона дозволяє закладам нараховувати кешбек своїм клієнтам, а користувачам — накопичувати та списувати бали, а також переказувати їх друзям.

## 📁 Структура проєкту

Проєкт розділений на дві основні частини:

- **`backend/`**: REST API сервер, написаний на NestJS. Використовує Prisma як ORM для взаємодії з базою даних PostgreSQL. Реалізує бізнес-логіку нарахування балів, переказів, авторизації (JWT) та управління закладами.
- **`frontend/`**: Клієнтська частина, створена за допомогою React та Vite. Містить інтерфейси для клієнтів (перегляд балансу, історія транзакцій, переказ балів) та адміністраторів (управління закладом).

## 🚀 Розгортання (Docker)

Найшвидший спосіб запустити проєкт — використовувати Docker. 

1. Створіть файл `.env` у корені проєкту на основі `.env.example`:
   ```bash
   cp .env.example .env
   ```
   *(За потреби, оновіть значення змінних у `.env`)*

2. Запустіть контейнери у фоновому режимі:
   ```bash
   docker-compose up --build -d
   ```
   *Ця команда підніме базу даних PostgreSQL, pgAdmin, Backend та Frontend сервери.*

3. Виконайте міграції бази даних та заповніть її тестовими даними. Для цього виконайте команди в контейнері бекенду або локально (якщо Node.js встановлено):
   ```bash
   # Якщо локально в папці backend/
   cd backend
   npx prisma migrate deploy
   npx prisma db seed
   ```

   *Або через Docker (переконайтеся, що контейнер backend працює):*
   ```bash
   docker exec -it pointdrop_backend sh -c "npx prisma migrate deploy && npx prisma db seed"
   ```

Після успішного запуску:
- **Frontend** доступний за адресою: http://localhost:5173
- **Backend API** доступний за адресою: http://localhost:3000
- **Swagger Документація API**: http://localhost:3000/api/docs
- **pgAdmin** доступний за адресою: http://localhost:5050

## 🔑 Тестові користувачі (Credentials)

Після виконання скрипта сідів (`npx prisma db seed`), у базі даних будуть створені наступні користувачі для тестування. 

**Спільний пароль для всіх користувачів:** `password123`

### 🛡️ Адміністратор закладу:
- **Email:** `admin@test.com`
- **Телефон:** `+380500000000`

### 👤 Клієнти (Покупці):
- **User 1:** `user1@test.com` / `+380501110001`
- **User 2:** `user2@test.com` / `+380501110002`
- **User 3:** `user3@test.com` / `+380501110003`
- **User 4:** `user4@test.com` / `+380501110004`
- **User 5:** `user5@test.com` / `+380501110005`

Ви можете використовувати ці дані для авторизації на клієнті (Frontend) та доступу до захищених ендпоінтів.