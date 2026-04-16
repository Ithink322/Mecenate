import { useInfiniteQuery } from '@tanstack/react-query';

import { fetchFeedPage } from '../../api/posts';
import { useRootStore } from '../../store/store-provider';

export const useFeedQuery = () => {
  const { sessionStore } = useRootStore();

  return useInfiniteQuery({
    queryKey: ['feed', sessionStore.apiBaseUrl, sessionStore.userId],
    initialPageParam: null as string | null,
    queryFn: ({ pageParam, signal }) =>
      fetchFeedPage({
        apiBaseUrl: sessionStore.apiBaseUrl,
        userId: sessionStore.userId,
        cursor: pageParam,
        signal,
        simulateError: sessionStore.simulateError,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor ?? undefined : undefined,
  });
};
