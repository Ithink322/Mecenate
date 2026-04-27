import type { InfiniteData, QueryClient } from '@tanstack/react-query';

import type { Comment, CommentsPage, Post, PostsPage } from './types';
import { queryKeys } from './query-keys';

const updatePostInFeedPages = (
  data: InfiniteData<PostsPage> | undefined,
  postId: string,
  updatePost: (post: Post) => Post,
) => {
  if (!data) {
    return data;
  }

  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      posts: page.posts.map((post) =>
        post.id === postId ? updatePost(post) : post,
      ),
    })),
  };
};

export const updatePostEverywhere = (
  queryClient: QueryClient,
  postId: string,
  updatePost: (post: Post) => Post,
) => {
  queryClient.setQueriesData<InfiniteData<PostsPage>>(
    { queryKey: queryKeys.feed },
    (data) => updatePostInFeedPages(data, postId, updatePost),
  );

  queryClient.setQueryData<Post>(queryKeys.post(postId), (post) =>
    post ? updatePost(post) : post,
  );
};

export const addCommentToCache = (
  queryClient: QueryClient,
  comment: Comment,
) => {
  let inserted = false;

  queryClient.setQueryData<InfiniteData<CommentsPage>>(
    queryKeys.comments(comment.postId),
    (data) => {
      if (!data) {
        inserted = true;

        return {
          pageParams: [null],
          pages: [
            {
              comments: [comment],
              nextCursor: null,
              hasMore: false,
            },
          ],
        };
      }

      const alreadyExists = data.pages.some((page) =>
        page.comments.some((cachedComment) => cachedComment.id === comment.id),
      );

      if (alreadyExists) {
        return data;
      }

      inserted = true;
      const [firstPage, ...restPages] = data.pages;

      if (!firstPage) {
        return data;
      }

      return {
        ...data,
        pages: [
          {
            ...firstPage,
            comments: [comment, ...firstPage.comments],
          },
          ...restPages,
        ],
      };
    },
  );

  return inserted;
};
