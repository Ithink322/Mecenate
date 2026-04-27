import { apiGet, apiPost } from './http';
import type {
  CommentCreatedResponse,
  CommentsPage,
  CommentsResponse,
  LikeResponse,
  Post,
  PostDetailResponse,
  PostTier,
  PostsPage,
  PostsResponse,
} from './types';

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

export const fetchPostById = async ({
  apiBaseUrl,
  userId,
  postId,
  signal,
}: {
  apiBaseUrl: string;
  userId: string;
  postId: string;
  signal?: AbortSignal;
}): Promise<Post> => {
  const response = await apiGet<PostDetailResponse>(`/posts/${postId}`, {
    apiBaseUrl,
    userId,
    signal,
  });

  return response.data.post;
};

export const togglePostLike = async ({
  apiBaseUrl,
  userId,
  postId,
  signal,
}: {
  apiBaseUrl: string;
  userId: string;
  postId: string;
  signal?: AbortSignal;
}): Promise<LikeResponse['data']> => {
  const response = await apiPost<LikeResponse>(`/posts/${postId}/like`, {
    apiBaseUrl,
    userId,
    signal,
  });

  return response.data;
};

export const fetchPostComments = async ({
  apiBaseUrl,
  userId,
  postId,
  cursor,
  limit = 20,
  signal,
}: {
  apiBaseUrl: string;
  userId: string;
  postId: string;
  cursor?: string | null;
  limit?: number;
  signal?: AbortSignal;
}): Promise<CommentsPage> => {
  const response = await apiGet<CommentsResponse>(`/posts/${postId}/comments`, {
    apiBaseUrl,
    userId,
    signal,
    query: {
      cursor,
      limit,
    },
  });

  return response.data;
};

export const createPostComment = async ({
  apiBaseUrl,
  userId,
  postId,
  text,
  signal,
}: {
  apiBaseUrl: string;
  userId: string;
  postId: string;
  text: string;
  signal?: AbortSignal;
}): Promise<CommentCreatedResponse['data']> => {
  const response = await apiPost<CommentCreatedResponse>(
    `/posts/${postId}/comments`,
    {
      apiBaseUrl,
      userId,
      signal,
      body: { text },
    },
  );

  return response.data;
};
