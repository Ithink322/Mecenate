export const queryKeys = {
  feed: ['feed'] as const,
  post: (postId: string) => ['post', postId] as const,
  comments: (postId: string) => ['post-comments', postId] as const,
};
