import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { ApiError } from '../../api/http';
import type { Post } from '../../api/types';
import { ErrorState } from '../../components/error-state';
import { LoadingFeed } from '../../components/loading-feed';
import { PostCard } from '../../components/post-card';
import { ScreenShell } from '../../components/screen-shell';
import { useRootStore } from '../../store/store-provider';
import { tokens } from '../../theme/tokens';
import { useFeedQuery } from './use-feed-query';

const topInset = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0;

const ListTopSpacer = () => <View style={styles.topSpacer} />;

const Footer = ({
  isLoadingMore,
  hasNextPage,
}: {
  isLoadingMore: boolean;
  hasNextPage: boolean;
}) => {
  if (isLoadingMore) {
    return (
      <View style={styles.footerState}>
        <ActivityIndicator color={tokens.colors.accent} />
      </View>
    );
  }

  if (!hasNextPage) {
    return <View style={styles.bottomSpacer} />;
  }

  return <View style={styles.bottomSpacer} />;
};

const EmptyState = () => (
  <View style={styles.emptyState}>
    <View style={styles.emptyArtwork}>
      <View style={styles.emptyArtworkCore} />
    </View>
    <Text style={styles.emptyTitle}>По вашему запросу ничего не найдено</Text>
    <View style={styles.emptyButton}>
      <Text style={styles.emptyButtonLabel}>На главную</Text>
    </View>
  </View>
);

export const FeedScreen = observer(() => {
  const { feedUiStore } = useRootStore();
  const feedQuery = useFeedQuery();

  const posts = feedQuery.data?.pages.flatMap((page) => page.posts) ?? [];
  const queryError = feedQuery.error;
  const errorDetails =
    queryError instanceof ApiError
      ? queryError.details ?? queryError.message
      : queryError instanceof Error
        ? queryError.message
        : undefined;

  useEffect(() => {
    if (feedQuery.isSuccess && feedQuery.dataUpdatedAt) {
      feedUiStore.markSuccessfulSync(feedQuery.dataUpdatedAt);
    }
  }, [feedQuery.dataUpdatedAt, feedQuery.isSuccess, feedUiStore]);

  const refreshFeed = async () => {
    feedUiStore.beginPullRefresh();

    try {
      await feedQuery.refetch();
    } finally {
      feedUiStore.endPullRefresh();
    }
  };

  const handleEndReached = () => {
    if (!feedQuery.hasNextPage || feedQuery.isFetchingNextPage) {
      return;
    }

    void feedQuery.fetchNextPage();
  };

  if (feedQuery.isPending) {
    return (
      <ScreenShell>
        <View style={styles.page}>
          <View style={styles.listContent}>
            <ListTopSpacer />
            <LoadingFeed />
          </View>
        </View>
      </ScreenShell>
    );
  }

  if (feedQuery.isError && posts.length === 0) {
    return (
      <ScreenShell>
        <View style={styles.page}>
          <View style={styles.listContent}>
            <ListTopSpacer />
            <ErrorState
              onRetry={() => void feedQuery.refetch()}
              details={errorDetails}
            />
          </View>
        </View>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell>
      <FlatList<Post>
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <PostCard post={item} />}
        ListHeaderComponent={<ListTopSpacer />}
        ListEmptyComponent={<EmptyState />}
        ListFooterComponent={
          <Footer
            hasNextPage={Boolean(feedQuery.hasNextPage)}
            isLoadingMore={feedQuery.isFetchingNextPage}
          />
        }
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
        refreshing={feedUiStore.isPullRefreshing}
        onRefresh={() => void refreshFeed()}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.45}
      />
    </ScreenShell>
  );
});

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  listContent: {
    paddingTop: topInset,
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  topSpacer: {
    height: 12,
  },
  separator: {
    height: 12,
  },
  footerState: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSpacer: {
    height: 12,
  },
  emptyState: {
    marginTop: 48,
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.lg,
  },
  emptyArtwork: {
    width: 78,
    height: 78,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: tokens.spacing.md,
  },
  emptyArtworkCore: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#dcd5ff',
  },
  emptyTitle: {
    ...tokens.typography.bodyStrong,
    color: tokens.colors.textPrimary,
    textAlign: 'center',
    marginBottom: tokens.spacing.md,
  },
  emptyButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: tokens.colors.accent,
    alignItems: 'center',
  },
  emptyButtonLabel: {
    ...tokens.typography.label,
    color: tokens.colors.accentText,
  },
});
