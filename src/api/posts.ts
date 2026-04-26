import { apiGet } from './http';
import type { PostTier, PostsPage, PostsResponse } from './types';

interface FetchFeedPageParams {
  apiBaseUrl: string;
  userId: string;
  cursor?: string | null;
  limit?: number;
  tier?: PostTier;
  signal?: AbortSignal;
  simulateError?: boolean;
}

export const fetchFeedPage = async ({
  apiBaseUrl,
  userId,
  cursor,
  limit = 10,
  tier,
  signal,
  simulateError,
}: FetchFeedPageParams): Promise<PostsPage> => {
  const response = await apiGet<PostsResponse>('/posts', {
    apiBaseUrl,
    userId,
    signal,
    query: {
      limit,
      cursor,
      tier,
      simulate_error: simulateError || undefined,
    },
  });

  return response.data;
};
