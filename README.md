# Mecenate Test

Лента и детальный экран публикации для тестового задания Mecenate на `React Native + Expo + TypeScript`.

## Что реализовано

- экран feed с карточками постов
- курсорная пагинация через `useInfiniteQuery`
- `pull-to-refresh`
- платные посты с заглушкой вместо текста
- таб-фильтр `Все / Бесплатные / Платные`
- переход из ленты на детальный экран поста
- детальный экран с полным текстом, обложкой, автором и счётчиками
- лайк с анимацией счётчика на `react-native-reanimated` и haptic feedback через `expo-haptics`
- комментарии с lazy load
- отправка нового комментария
- real-time обновления лайков и комментариев через WebSocket
- состояние ошибки с кнопкой повтора
- разделение на серверное состояние (`React Query`) и UI/session state (`MobX`)
- дизайн-токены для цветов, отступов, типографики и радиусов

## Стек

- Expo
- React Native
- TypeScript
- MobX
- React Query
- WebSocket
- Reanimated
- Expo Haptics

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

WebSocket URL строится автоматически из `EXPO_PUBLIC_API_BASE_URL`: `<api-base-url>/ws?token=<EXPO_PUBLIC_USER_ID>`.

## Полезные команды

```bash
npm run typecheck
```

## Примечания

- по умолчанию используется тестовый UUID из задания, чтобы приложение запускалось без дополнительной настройки
- приложение ориентировано на запуск в Expo Go
