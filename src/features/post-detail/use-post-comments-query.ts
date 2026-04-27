import { useInfiniteQuery } from '@tanstack/react-query';

import { fetchPostComments } from '../../api/posts';
import { queryKeys } from '../../api/query-keys';
import { useRootStore } from '../../store/store-provider';

export const usePostCommentsQuery = (postId: string) => {
  const { sessionStore } = useRootStore();

  return useInfiniteQuery({
    queryKey: queryKeys.comments(postId),
    initialPageParam: null as string | null,
    queryFn: ({ pageParam, signal }) =>
      fetchPostComments({
        apiBaseUrl: sessionStore.apiBaseUrl,
        userId: sessionStore.userId,
        postId,
        cursor: pageParam,
        signal,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextCursor ?? undefined : undefined,
  });
};
