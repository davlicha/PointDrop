<div align="center">
  <img src="frontend/src/assets/PointDrop.jpg" alt="PointDrop Logo" width="150" />

  # PointDrop 🎯
  
  **PointDrop — це сучасна система лояльності з QR-кодами**

  ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
  ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
  ![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
  ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
  ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
  ![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
</div>

<br />

PointDrop — це комплексна система лояльності нового покоління, що складається з потужного бекенду на NestJS та динамічного фронтенду на React/Vite. Вона дозволяє закладам нараховувати кешбек своїм клієнтам, а користувачам — накопичувати та списувати бали, а також переказувати їх друзям.

## 📱 Screenshots

<div align="center">
  <!-- Зображення дашборду -->
  <img src="frontend/src/assets/Banner.png" alt="PointDrop Dashboard" width="800" />
  <p><em>PointDrop: Швидкі бонуси. Легкі перекази.</em></p>
</div>

## 📁 Структура проєкту

- **`backend/`**: REST API сервер, написаний на NestJS. Використовує Prisma як ORM для взаємодії з базою даних PostgreSQL. Реалізує бізнес-логіку нарахування балів, переказів, авторизації (JWT) та управління закладами.
- **`frontend/`**: Клієнтська частина, створена за допомогою React та Vite. Містить інтерфейси для клієнтів (перегляд балансу, історія транзакцій, переказ балів) та адміністраторів (управління закладом, призначення касирів).

## 🗄 База Даних (ER Diagram)

Детальну структуру бази даних можна переглянути на ER-діаграмі:  
👉 **[ER Diagram (docs/er-diagram.png)](docs/er-diagram.png)**

---

## 🚀 Quick Start (Deployment Guide)

Найшвидший спосіб запустити проєкт — використовувати Docker. 

1. **Клонуйте репозиторій та налаштуйте змінні середовища:**
   ```bash
   cp .env.example .env
   ```

2. **Запустіть контейнери:**
   ```bash
   docker-compose up --build -d
   ```
   *Ця команда підніме базу даних PostgreSQL, pgAdmin, Backend та Frontend сервери.*

3. **Застосуйте міграції та заповніть базу тестовими даними:**
   Виконайте наступну команду для застосування схеми Prisma та створення тестових користувачів:
   ```bash
   docker exec -it pointdrop_backend sh -c "npx prisma migrate deploy && npx prisma db seed"
   ```

### 📍 Точки доступу
- **Frontend App**: [https://localhost:5173](https://localhost:5173) (Використовується HTTPS proxy)
- **Backend API**: http://localhost:3000
- **Swagger Docs**: http://localhost:3000/api/docs
- **Prisma Studio**: http://localhost:5555
- **pgAdmin**: http://localhost:5050

---

## 🔑 Test Credentials

Після виконання сиду бази даних (`npx prisma db seed`), ви можете увійти в систему за допомогою наступних облікових записів.

**Спільний пароль для всіх користувачів:** `password123`

### 🛡️ Адміністратор закладу:
Використовуйте для доступу до **Merchant Dashboard** (керування ролями, нарахування балів):
- **Email:** `admin@test.com`

### 👤 Клієнти / Касири:
Використовуйте для тестування накопичення балів, P2P переказів та списання:
- **Користувач 1:** `user1@test.com` (можна призначити касиром через адмін-панель)
- **Користувач 2:** `user2@test.com`
- **Користувач 3:** `user3@test.com`

---

## 🧪 Тестування

**Для тестування фронтенду:**
```bash
docker exec -it pointdrop_frontend npm test -- --run
```

**Для тестування бекенду:**
```bash
docker exec -it pointdrop_backend npm test
```
