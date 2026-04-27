import { useQuery } from '@tanstack/react-query';

import { fetchPostById } from '../../api/posts';
import { queryKeys } from '../../api/query-keys';
import { useRootStore } from '../../store/store-provider';

export const usePostDetailQuery = (postId: string) => {
  const { sessionStore } = useRootStore();

  return useQuery({
    queryKey: queryKeys.post(postId),
    queryFn: ({ signal }) =>
      fetchPostById({
        apiBaseUrl: sessionStore.apiBaseUrl,
        userId: sessionStore.userId,
        postId,
        signal,
      }),
  });
};
