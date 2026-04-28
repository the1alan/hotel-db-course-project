# Hotel DB Course Project

Информационная система управления гостиницей для курсового проекта по дисциплине **«Базы данных»**.

## Стек
- Node.js
- Express
- Sequelize
- PostgreSQL
- Docker / Docker Compose
- React + Vite
- Postman

## Структура проекта
- `hotel-app/` — backend API
- `client/` — frontend (React/Vite)
- `postman/` — Postman collection + environment
- `docker-compose.yml` — запуск всех сервисов

## Запуск без Docker
### Backend
```bash
cd hotel-app
npm install
npm start
```

### Frontend
```bash
cd client
npm install
npm run dev
```

## Запуск через Docker
```bash
docker compose up --build
```

- API: http://localhost:8080
- Frontend: http://localhost:5173
- PostgreSQL: localhost:5433

## Seed данных
```bash
cd hotel-app
npm run seed
```

или через Docker:
```bash
docker compose exec backend npm run seed
```

## Тестовые пользователи
- `admin@example.com / admin123`
- `manager@example.com / manager123`
- `receptionist@example.com / receptionist123`

## Основные API endpoints
- Auth: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`
- Room types: `/api/room-types`
- Rooms: `/api/rooms`, `/api/rooms/available`
- Guests: `/api/guests`
- Bookings: `/api/bookings`
- Payments: `/api/payments`
- Services: `/api/services`
- Booking services: `/api/booking-services`
- Staff: `/api/staff`
- Users: `/api/users`
- Reports: `/api/reports/occupancy`, `/api/reports/revenue`, `/api/reports/popular-room-types`, `/api/reports/debts`

## Postman
1. Импортируйте `postman/Hotel Management API.postman_collection.json`.
2. Импортируйте `postman/Hotel Local.postman_environment.json`.
3. Выберите environment **Hotel Local**.
4. Выполните `Auth -> Login`, токен автоматически сохранится в `{{token}}`.

## Что реализовано
- CRUD для ключевых сущностей гостиницы.
- Проверка доступности номера на даты бронирования.
- Платежи и услуги.
- Отчёты по загрузке, доходу, популярности и задолженностям.
- JWT авторизация и роли (`admin`, `manager`, `receptionist`).
- Seed тестовых данных.
- Docker запуск backend + frontend + PostgreSQL.
- React frontend для демонстрации преподавателю.
