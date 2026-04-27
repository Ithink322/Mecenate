import { useMutation, useQueryClient } from '@tanstack/react-query';

import { togglePostLike } from '../../api/posts';
import { updatePostEverywhere } from '../../api/cache-updates';
import { useRootStore } from '../../store/store-provider';

export const useLikePostMutation = (postId: string) => {
  const queryClient = useQueryClient();
  const { sessionStore } = useRootStore();

  return useMutation({
    mutationFn: () =>
      togglePostLike({
        apiBaseUrl: sessionStore.apiBaseUrl,
        userId: sessionStore.userId,
        postId,
      }),
    onSuccess: ({ isLiked, likesCount }) => {
      updatePostEverywhere(queryClient, postId, (post) => ({
        ...post,
        isLiked,
        likesCount,
      }));
    },
  });
};
