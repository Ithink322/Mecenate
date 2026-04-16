# Mecenate Feed Test

Экран ленты публикаций для тестового задания Mecenate на `React Native + Expo + TypeScript`.

## Что реализовано

- экран feed с карточками постов
- курсорная пагинация через `useInfiniteQuery`
- `pull-to-refresh`
- платные посты с заглушкой вместо текста
- состояние ошибки с кнопкой повтора
- разделение на серверное состояние (`React Query`) и UI/session state (`MobX`)
- дизайн-токены для цветов, отступов, типографики и радиусов

## Стек

- Expo
- React Native
- TypeScript
- MobX
- React Query

## Запуск

1. Установить зависимости:

```bash
npm install
```

2. Создать `.env` на основе `.env.example`.

3. Запустить проект:

```bash
npm run start
```

Для Android:

```bash
npm run android
```

Для iOS:

```bash
npm run ios
```

## Переменные окружения

- `EXPO_PUBLIC_API_BASE_URL` — базовый URL API
- `EXPO_PUBLIC_USER_ID` — UUID, который уходит в `Authorization: Bearer <uuid>`
- `EXPO_PUBLIC_SIMULATE_ERROR` — если `true`, приложение добавляет `simulate_error=true` к запросу `/posts` для проверки error state

## Полезные команды

```bash
npm run typecheck
```

## Примечания

- по умолчанию используется тестовый UUID из задания, чтобы приложение запускалось без дополнительной настройки
- приложение ориентировано на запуск в Expo Go
