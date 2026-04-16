const fallbackApiBaseUrl = 'https://k8s.mectest.ru/test-app';
const fallbackUserId = '550e8400-e29b-41d4-a716-446655440000';

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

export const env = {
  apiBaseUrl: trimTrailingSlash(
    process.env.EXPO_PUBLIC_API_BASE_URL ?? fallbackApiBaseUrl,
  ),
  userId: process.env.EXPO_PUBLIC_USER_ID ?? fallbackUserId,
  simulateError: process.env.EXPO_PUBLIC_SIMULATE_ERROR === 'true',
};
