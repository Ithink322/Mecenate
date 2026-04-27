import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  addCommentToCache,
  updatePostEverywhere,
} from '../../api/cache-updates';
import { createPostComment } from '../../api/posts';
import { queryKeys } from '../../api/query-keys';
import { useRootStore } from '../../store/store-provider';

export const useCreateCommentMutation = (postId: string) => {
  const queryClient = useQueryClient();
  const { sessionStore } = useRootStore();

  return useMutation({
    mutationFn: (text: string) =>
      createPostComment({
        apiBaseUrl: sessionStore.apiBaseUrl,
        userId: sessionStore.userId,
        postId,
        text,
      }),
    onSuccess: ({ comment }) => {
      const inserted = addCommentToCache(queryClient, comment);

      if (inserted) {
        updatePostEverywhere(queryClient, postId, (post) => ({
          ...post,
          commentsCount: post.commentsCount + 1,
        }));
      }

      void queryClient.invalidateQueries({
        queryKey: queryKeys.comments(postId),
        refetchType: 'inactive',
      });
    },
  });
};
