import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import {
  addCommentToCache,
  updatePostEverywhere,
} from '../api/cache-updates';
import { queryKeys } from '../api/query-keys';
import type { Comment } from '../api/types';
import { useRootStore } from '../store/store-provider';

type RealtimeEvent =
  | { type: 'ping' }
  | { type: 'like_updated'; postId: string; likesCount: number }
  | { type: 'comment_added'; postId: string; comment: Comment };

const buildWebSocketUrl = (apiBaseUrl: string, userId: string) => {
  const url = new URL(apiBaseUrl);
  url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
  url.pathname = `${url.pathname.replace(/\/+$/, '')}/ws`;
  url.search = '';
  url.searchParams.set('token', userId);

  return url.toString();
};

const parseRealtimeEvent = (payload: string): RealtimeEvent | null => {
  try {
    const event = JSON.parse(payload) as Partial<RealtimeEvent>;

    if (event.type === 'ping') {
      return { type: 'ping' };
    }

    if (
      event.type === 'like_updated' &&
      typeof event.postId === 'string' &&
      typeof event.likesCount === 'number'
    ) {
      return event as RealtimeEvent;
    }

    if (
      event.type === 'comment_added' &&
      typeof event.postId === 'string' &&
      event.comment
    ) {
      return event as RealtimeEvent;
    }
  } catch {
    return null;
  }

  return null;
};

export const usePostsRealtime = () => {
  const queryClient = useQueryClient();
  const { sessionStore } = useRootStore();

  useEffect(() => {
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
    let socket: WebSocket | undefined;
    let shouldReconnect = true;

    const connect = () => {
      socket = new WebSocket(
        buildWebSocketUrl(sessionStore.apiBaseUrl, sessionStore.userId),
      );

      socket.onmessage = (message) => {
        if (typeof message.data !== 'string') {
          return;
        }

        const event = parseRealtimeEvent(message.data);

        if (!event || event.type === 'ping') {
          return;
        }

        if (event.type === 'like_updated') {
          updatePostEverywhere(queryClient, event.postId, (post) => ({
            ...post,
            likesCount: event.likesCount,
          }));
          return;
        }

        const inserted = addCommentToCache(queryClient, event.comment);

        if (inserted) {
          updatePostEverywhere(queryClient, event.postId, (post) => ({
            ...post,
            commentsCount: post.commentsCount + 1,
          }));
        }

        void queryClient.invalidateQueries({
          queryKey: queryKeys.comments(event.postId),
          refetchType: 'inactive',
        });
      };

      socket.onclose = () => {
        if (!shouldReconnect) {
          return;
        }

        reconnectTimer = setTimeout(connect, 1500);
      };
    };

    connect();

    return () => {
      shouldReconnect = false;

      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
      }

      socket?.close();
    };
  }, [queryClient, sessionStore.apiBaseUrl, sessionStore.userId]);
};
