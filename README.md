# Event Platform App

Кроссплатформенное приложение для управления событиями с опросами, оценками сессий, чатом, push-уведомлениями и mock backend для разработки.

## Backend и PostgreSQL

В проекте есть Node.js backend в `mock-server.mjs`. Он обслуживает существующие endpoints из ТЗ и добавляет регистрацию:

- `POST /auth/register`
- `POST /auth/login`
- `GET /health`

Перед запуском создайте `.env` по примеру `.env.example`, установите зависимости и выполните миграцию:

```bash
npm install
npm run db:migrate
npm run mock
```

Если установлен Docker, PostgreSQL можно поднять так:

```bash
docker compose up -d postgres
npm run mock
```

Схема из `db/schema.sql` применится при первом создании контейнера. Для уже существующей БД используйте `npm run db:migrate`.

Пример регистрации:

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"secret123\",\"name\":\"Test User\",\"phone\":\"+79990000000\"}"
```

Пустой телефон сохраняется как `null`, чтобы пустые значения не попадали в форматтеры.

## Frontend

```bash
npm run dev
npm run build
npm run build:pwa
```

Переменные:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
VITE_BUILD_ENV=dev
VITE_APP_VERSION=0.1.0
DATABASE_URL=postgres://event_app:event_app_password@localhost:5432/event_app
AUTH_TOKEN_SECRET=change-me
```
