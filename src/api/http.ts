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

export const apiGet = async <T>(
  path: string,
  options: RequestOptions,
): Promise<T> => {
  const requestUrl = buildUrl(options.apiBaseUrl, path, options.query);
  let response: Response;

  try {
    response = await fetch(requestUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${options.userId}`,
      },
      signal: options.signal,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Network request failed';

    console.error('[apiGet] request failed', {
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

    console.error('[apiGet] bad response', {
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
