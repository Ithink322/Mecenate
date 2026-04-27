import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { BackHandler, Platform } from 'react-native';

import { FeedScreen } from './src/features/feed/feed-screen';
import { PostDetailScreen } from './src/features/post-detail/post-detail-screen';
import { usePostsRealtime } from './src/realtime/use-posts-realtime';
import { AppProviders } from './src/store/store-provider';

type AppRoute =
  | { name: 'Feed' }
  | { name: 'PostDetail'; postId: string };

const AppContent = () => {
  const [route, setRoute] = useState<AppRoute>({ name: 'Feed' });

  usePostsRealtime();

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (route.name === 'PostDetail') {
          setRoute({ name: 'Feed' });
          return true;
        }

        return false;
      },
    );

    return () => subscription.remove();
  }, [route]);

  return (
    <>
      <StatusBar style="dark" />
      {route.name === 'Feed' ? (
        <FeedScreen
          onOpenPost={(postId) => setRoute({ name: 'PostDetail', postId })}
        />
      ) : (
        <PostDetailScreen
          postId={route.postId}
          onBack={() => setRoute({ name: 'Feed' })}
        />
      )}
    </>
  );
};

export default function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}
