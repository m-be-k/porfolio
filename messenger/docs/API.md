# Messenger Backend API (actor/action)

Единая точка входа: `POST /api`  
Формат запроса: `{ "actor": "<string>", "action": "<string>", "payload": { ... } }`  
Формат ответа: `{ "status": "success" | "error", "payload": { ... } }`  
Аутентификация: cookie `sid` (HTTP only). Ставится при `auth/login` или `auth/register`.

## Таблица экшенов и ошибок

### auth

| action      | payload                                      | success payload | ошибки (status=error)                                              |
|-------------|----------------------------------------------|-----------------|--------------------------------------------------------------------|
| register    | `{ username, password }`                     | `{}`            | 400 `user already exists`; 400 при пустых полях                    |
| login       | `{ username, password }`                     | `{}`            | 401 `user not found`; 401 `invalid password`; 400 при пустых полях |
| logout      | `{}`                                         | `{ message }`   | нет (idempotent)                                                   |
| logoutAll   | `{}`                                         | `{ message }`   | нет (idempotent)                                                   |

### users

| action         | payload                            | success payload                                                                 | ошибки (status=error)                    |
|----------------|------------------------------------|----------------------------------------------------------------------------------|-----------------------------------------|
| me             | `{}`                               | `{ id, username, iconUrl, status, mutedUsernames }`                              | 401 `unauthorized` / `session expired`  |
| list           | `{}`                               | `{ users: [{ id, username, iconUrl, status, createdAt, updatedAt }] }`          | 401 `unauthorized` / `session expired`  |
| updateProfile  | `{ imageB64?, status? }`           | `{}`                                                                             | 401 `unauthorized` / `session expired`; 400 если status не in (online, away, offline) или некорректное изображение (base64) |
| replaceMuted   | `{ mutedUsernames: string[] }`     | `{}`                                                                             | 401 `unauthorized` / `session expired`; 400 при неверных именах/типах  |

### messages

| action   | payload                     | success payload                                                                                 | ошибки (status=error)                   |
|----------|-----------------------------|--------------------------------------------------------------------------------------------------|----------------------------------------|
| fetch    | `{ since?: ISOString }`     | `{ messages: [{ id, sender, senderIcon, content, createdAt }] }` (limit 500)  | 401 `unauthorized` / `session expired` |
| send     | `{ content }`               | `{}` (сервер шлёт WS `message:new` отдельно)                                                    | 401 `unauthorized` / `session expired`; 400 `empty content` |

## WebSocket
- Эндпоинт: `ws://<host>/ws`.
- Формат сообщений от сервера:
  - сообщения: `{ event: "message:new", payload: { id, sender, senderIcon, content, createdAt } }`
  - обновления пользователей: `{ event: "users:update", payload: { user } }` (включает id, username, iconUrl, status, createdAt, updatedAt)
- Клиент может подписаться на новые сообщения; авторизация по cookie `sid` (в том же домене).

## База данных
- Файл: `backend/messenger.db` (SQLite), схема в `backend/schema.sql`.
- Таблицы: `users`, `muted_users`, `messages`, `sessions`.

## Запуск локально
```bash
cd backend
npm install
npm run start   # сервер на http://localhost:4000
```

## Заметки для переписывания dataProvider
- Все вызовы фронта можно свести к POST `/api` с нужным actor/action.
- Авторизация/регистрация: `auth/register` или `auth/login`, cookie сохраняется браузером.
- Получение пользователя и списка: `users/me`, `users/list`.
- Мьюты: `users/replaceMuted`.
- Сообщения: `messages/fetch` (polling) и `messages/send` (создание); новые сообщения приходят через WS `message:new`.
