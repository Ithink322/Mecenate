export type PostTier = 'free' | 'paid';

export interface Author {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  subscribersCount: number;
  isVerified: boolean;
}

export interface Post {
  id: string;
  author: Author;
  title: string;
  body: string;
  preview: string;
  coverUrl: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  tier: PostTier;
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  author: Author;
  text: string;
  createdAt: string;
}

export interface PostsPage {
  posts: Post[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface CommentsPage {
  comments: Comment[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface PostsResponse {
  ok: boolean;
  data: PostsPage;
}

export interface PostDetailResponse {
  ok: boolean;
  data: {
    post: Post;
  };
}

export interface LikeResponse {
  ok: boolean;
  data: {
    isLiked: boolean;
    likesCount: number;
  };
}

export interface CommentsResponse {
  ok: boolean;
  data: CommentsPage;
}

export interface CommentCreatedResponse {
  ok: boolean;
  data: {
    comment: Comment;
  };
}

export interface ApiErrorResponse {
  ok: false;
  error?: {
    code?: string;
    message?: string;
  };
}
