import type { ApiErrorResponse } from './types';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
    public readonly details?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface RequestOptions {
  apiBaseUrl: string;
  userId: string;
  query?: Record<string, string | number | boolean | null | undefined>;
  signal?: AbortSignal;
}

const buildUrl = (
  apiBaseUrl: string,
  path: string,
  query?: RequestOptions['query'],
) => {
  const normalizedBaseUrl = apiBaseUrl.replace(/\/+$/, '');
  const normalizedPath = path.replace(/^\/+/, '');
  const url = new URL(`${normalizedBaseUrl}/${normalizedPath}`);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null || value === '') {
        continue;
      }

      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
};

const parseJsonSafely = (payload: string) => {
  if (!payload) {
    return null;
  }

  try {
    return JSON.parse(payload) as unknown;
  } catch {
    return null;
  }
};

const apiRequest = async <T>(
  path: string,
  options: RequestOptions & {
    method?: 'GET' | 'POST';
    body?: unknown;
  },
): Promise<T> => {
  const requestUrl = buildUrl(options.apiBaseUrl, path, options.query);
  let response: Response;

  try {
    response = await fetch(requestUrl, {
      method: options.method ?? 'GET',
      headers: {
        Accept: 'application/json',
        ...(options.body ? { 'Content-Type': 'application/json' } : null),
        Authorization: `Bearer ${options.userId}`,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: options.signal,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Network request failed';

    console.error('[apiRequest] request failed', {
      url: requestUrl,
      message,
    });

    throw new ApiError(
      'Не удалось загрузить публикации',
      0,
      'NETWORK_ERROR',
      message,
    );
  }

  const rawPayload = await response.text();
  const payload = parseJsonSafely(rawPayload);

  if (!response.ok) {
    const errorPayload = payload as ApiErrorResponse | null;
    const message = errorPayload?.error?.message ?? 'Не удалось загрузить публикации';

    console.error('[apiRequest] bad response', {
      url: requestUrl,
      status: response.status,
      message,
    });

    throw new ApiError(
      message,
      response.status,
      errorPayload?.error?.code,
      `HTTP ${response.status}`,
    );
  }

  return payload as T;
};

export const apiGet = async <T>(
  path: string,
  options: RequestOptions,
): Promise<T> => apiRequest<T>(path, options);

export const apiPost = async <T>(
  path: string,
  options: RequestOptions & { body?: unknown },
): Promise<T> => apiRequest<T>(path, { ...options, method: 'POST' });
