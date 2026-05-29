#!/bin/bash

# Скрипт для легкого запуску тестів у PointDrop

echo "=== Запуск тестів Фронтенду ==="
# Фронтенд-контейнер вже має змонтовані файли (volumes: ./frontend:/app), тому можемо використати exec
docker-compose exec frontend npm run test -- --run

echo ""
echo "=== Запуск тестів Бекенду ==="
# Використовуємо чистий Node.js контейнер, щоб підключити всю локальну папку backend, 
# встановити всі залежності та запустити свіжі тести без використання кешу старого образу
docker run --rm -v $(pwd)/backend:/app -w /app node:20-alpine sh -c "npm install && DATABASE_URL=\"postgresql://placeholder:5432/placeholder\" npx prisma generate && npm run test"

echo ""
echo "Тестування завершено!"
