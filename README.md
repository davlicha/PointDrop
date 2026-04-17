# PointDrop — Система лояльності нового покоління

[![Tech Stack](https://img.shields.io/badge/Stack-NestJS%20%7C%20React%20%7C%20PostgreSQL-blue)](#-технологічний-стек)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**PointDrop** — це прогресивна система лояльності, реалізована за архітектурою модульного моноліту. Проєкт дозволяє бізнесу автоматизувати нарахування бонусів через QR-коди, а клієнтам — здійснювати швидкі P2P-перекази балів друзям (Killer Feature).

---

## Основний функціонал (MVP Scope)

### Для Клієнтів (Customers):
* **Smart QR:** Генерація динамічного зашифрованого коду для безпечної ідентифікації.
* **PointDrop (P2P):** Переказ балів іншим користувачам за номером телефону.
* **Баланс та Історія:** Відстеження накопичень та детальний лог усіх операцій у реальному часі.

### Для Адміністрації (Merchants/Admins):
* **Scanner:** Веб-сканер для зчитування QR-кодів клієнтів камерою смартфона.
* **Operations:** Швидке нарахування кешбеку та списання балів як знижки за чеком.
* **Dashboard:** Аналітика закладу (кількість клієнтів, обіг балів, активність).

---

## Технологічний стек

| Шар | Технологія |
| :--- | :--- |
| **Backend** | NestJS (Node.js LTS), TypeScript |
| **Frontend** | React (Vite), JavaScript, Tailwind CSS, Framer Motion |
| **Database** | PostgreSQL 16 + Prisma ORM |
| **Auth** | JWT (JSON Web Tokens), bcrypt |
| **UI/Icons** | Lucide React, CSS Modules |

---

## Структура репозиторію

Проєкт організований як монорепозиторій із чітким розділенням відповідальності:

```text
point-drop/
├── backend/                # Серверна частина (NestJS)
│   ├── prisma/             # Схема бази даних (schema.prisma) та міграції
│   └── src/                # Модулі бекенду (Auth, Transactions, Users)
├── frontend/               # Клієнтська частина (React + Vite)
│   ├── public/             # Статичні активи (SVG іконки, favicon)
│   ├── src/                # Вихідний код (App.jsx, main.jsx, стилі)
│   └── eslint.config.js    # Налаштування якості коду фронтенду
├── docs/                   # Технічна документація
│   └── er-diagram.png      # Візуалізація схеми бази даних
├── .github/                # GitHub-специфічні налаштування
│   └── pull_request_template.md # Шаблон для перевірки коду (Code Review)
├── DATA_DICTIONARY.md      # Словник даних (детальний опис таблиць БД)
├── CONTRIBUTORS.md         # Список учасників команди та їх ролей
└── README.md               # Головний файл (цей документ)
```

---

## Інструкція із запуску

### 1. Клонування та підготовка
```bash
git clone https://github.com/davlicha/pointdrop.git
cd pointdrop
```

### 2. Налаштування Backend
```bash
cd backend
npm install
cp .env.example .env # Налаштуйте DATABASE_URL у файлі .env
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

### 3. Налаштування Frontend
```bash
cd ../frontend
npm install
npm run dev
```

---

## Стандарти кодування та Workflow

Ми підтримуємо високу якість коду за допомогою наступних правил:

* **Naming Conventions:**
    * Компоненти та Класи: `PascalCase` (напр. `TransactionCard`).
    * Функції та Змінні: `camelCase` (напр. `getUserBalance`).
    * Файли стилів та конфігів: `kebab-case`.
* **Linting & Formatting:** Обов'язкове використання ESLint та Prettier перед кожним комітом.
* **Git Flow:** Розробка ведеться у окремих гілках (`feature/`, `fix/`). Злиття в `main` відбувається лише через Pull Request після проходження Self-review за шаблоном.
* **Database:** Будь-які зміни в структурі БД повинні супроводжуватись оновленням `DATA_DICTIONARY.md`.

---

## Команда проєкту

* **Project Manager:** [Davyd Lichynskyi](https://github.com/davlicha)
* **Backend Engineer:** [Ivan Zaharchuk](https://github.com/Horizon-55)
* **DB Engineer:** [Bohdan Buriak](https://github.com/BuryakBohdan)
* **Frontend Developer:** [Evelina Kardash](https://github.com/KardashEvelina)
* **QA Engineer:** [Anton Syrbu](https://github.com/fnayed)

Детальніше про внесок кожного учасника читайте у файлі [CONTRIBUTORS.md](./CONTRIBUTORS.md).

---
© 2026 PointDrop Project. Навчальний проєкт за стандартами розробки ПЗ.