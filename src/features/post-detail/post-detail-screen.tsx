import * as Haptics from 'expo-haptics';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  Vibration,
  View,
} from 'react-native';
import Animated, {
  type AnimatedStyle,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import type { PropsWithChildren } from 'react';

import type { Comment, Post } from '../../api/types';
import { Avatar } from '../../components/avatar';
import { ErrorState } from '../../components/error-state';
import {
  BackIcon,
  CommentIcon,
  LikeIcon,
  SendIcon,
} from '../../components/icons/feed-icons';
import { ScreenShell } from '../../components/screen-shell';
import { tokens } from '../../theme/tokens';
import { useCreateCommentMutation } from './use-create-comment-mutation';
import { useLikePostMutation } from './use-like-post-mutation';
import { usePostCommentsQuery } from './use-post-comments-query';
import { usePostDetailQuery } from './use-post-detail-query';

const topInset = Platform.OS === 'android' ? (StatusBar.currentHeight ?? 0) : 0;
const androidBottomInset =
  Platform.OS === 'android'
    ? 8
    : 0;

const KeyboardContainer = ({ children }: PropsWithChildren) => {
  if (Platform.OS === 'ios') {
    return (
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={0}
        style={styles.keyboardWrap}
      >
        {children}
      </KeyboardAvoidingView>
    );
  }

  return <View style={styles.keyboardWrap}>{children}</View>;
};

interface PostDetailScreenProps {
  postId: string;
  onBack: () => void;
}

const DetailStats = ({
  post,
  onLikePress,
  onCommentPress,
  animatedStyle,
}: {
  post: Post;
  onLikePress: () => void;
  onCommentPress: () => void;
  animatedStyle: AnimatedStyle;
}) => (
  <View style={styles.statsRow}>
    <Pressable
      onPress={onLikePress}
      style={[styles.statPill, post.isLiked ? styles.statPillLiked : null]}
    >
      <Animated.View style={animatedStyle}>
        <LikeIcon color={post.isLiked ? '#FFFFFF' : tokens.colors.iconMuted} />
      </Animated.View>
      <Animated.Text
        style={[
          styles.statValue,
          post.isLiked ? styles.statValueLiked : null,
          animatedStyle,
        ]}
      >
        {post.likesCount}
      </Animated.Text>
    </Pressable>

    <Pressable onPress={onCommentPress} style={styles.statPill}>
      <CommentIcon color={tokens.colors.iconMuted} />
      <Text style={styles.statValue}>{post.commentsCount}</Text>
    </Pressable>
  </View>
);

const PaidBodyPlaceholder = () => (
  <View style={styles.paidBodyPlaceholder}>
    <Text style={styles.paidBodyText}>
      Полный текст публикации доступен после доната
    </Text>
  </View>
);

const PostHeader = ({
  post,
  onBack,
  onLikePress,
  onCommentPress,
  likeAnimatedStyle,
}: {
  post: Post;
  onBack: () => void;
  onLikePress: () => void;
  onCommentPress: () => void;
  likeAnimatedStyle: AnimatedStyle;
}) => (
  <View>
    <View style={styles.topBar}>
      <Pressable
        accessibilityRole="button"
        onPress={onBack}
        style={styles.backButton}
      >
        <BackIcon />
      </Pressable>
      <View style={styles.authorCompact}>
        <Avatar name={post.author.displayName} uri={post.author.avatarUrl} />
        <Text style={styles.authorName}>{post.author.displayName}</Text>
      </View>
    </View>

    <View style={styles.coverFrame}>
      <Image
        source={{ uri: post.coverUrl }}
        style={StyleSheet.absoluteFillObject}
        resizeMode="cover"
        blurRadius={post.tier === 'paid' ? 12 : 0}
      />
      {post.tier === 'paid' ? <View style={styles.coverDimmer} /> : null}
    </View>

    <View style={styles.content}>
      <Text style={styles.postTitle}>{post.title}</Text>
      {post.tier === 'paid' || !post.body ? (
        <PaidBodyPlaceholder />
      ) : (
        <Text style={styles.postBody}>{post.body}</Text>
      )}
      <DetailStats
        post={post}
        onLikePress={onLikePress}
        onCommentPress={onCommentPress}
        animatedStyle={likeAnimatedStyle}
      />
    </View>

    <View style={styles.commentsHeader}>
      <Text style={styles.commentsTitle}>{post.commentsCount} комментария</Text>
      <Text style={styles.commentsSort}>Сначала новые</Text>
    </View>
  </View>
);

const CommentRow = ({ comment }: { comment: Comment }) => (
  <View style={styles.commentRow}>
    <Avatar
      name={comment.author.displayName}
      uri={comment.author.avatarUrl}
      size={36}
    />
    <View style={styles.commentBody}>
      <Text style={styles.commentAuthor}>{comment.author.displayName}</Text>
      <Text style={styles.commentText}>{comment.text}</Text>
    </View>
    <View style={styles.commentLike}>
      <LikeIcon width={15} height={14} color={tokens.colors.iconMuted} />
    </View>
  </View>
);

const CommentsFooter = ({
  isInitialLoading,
  isLoadingMore,
}: {
  isInitialLoading: boolean;
  isLoadingMore: boolean;
}) => {
  if (isInitialLoading) {
    return (
      <View style={styles.commentsFooter}>
        <ActivityIndicator color={tokens.colors.accent} />
      </View>
    );
  }

  if (!isLoadingMore) {
    return <View style={styles.commentsBottomSpacer} />;
  }

  return (
    <View style={styles.commentsFooter}>
      <ActivityIndicator color={tokens.colors.accent} />
    </View>
  );
};

export const PostDetailScreen = observer(
  ({ postId, onBack }: PostDetailScreenProps) => {
    const [commentText, setCommentText] = useState('');
    const commentInputRef = useRef<TextInput>(null);
    const likeScale = useSharedValue(1);
    const postQuery = usePostDetailQuery(postId);
    const commentsQuery = usePostCommentsQuery(postId);
    const likeMutation = useLikePostMutation(postId);
    const createCommentMutation = useCreateCommentMutation(postId);

    const post = postQuery.data;
    const comments =
      commentsQuery.data?.pages.flatMap((page) => page.comments) ?? [];

    const likeAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: likeScale.value }],
    }));

    useEffect(() => {
      likeScale.value = withSequence(
        withTiming(1.16, { duration: 110 }),
        withSpring(1, { damping: 8, stiffness: 180 }),
      );
    }, [likeScale, post?.likesCount]);

    const handleLikePress = () => {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {
        Vibration.vibrate(12);
      });
      likeMutation.mutate();
    };

    const handleCommentPress = () => {
      commentInputRef.current?.focus();
    };

    const handleEndReached = () => {
      if (!commentsQuery.hasNextPage || commentsQuery.isFetchingNextPage) {
        return;
      }

      void commentsQuery.fetchNextPage();
    };

    const submitComment = () => {
      const nextCommentText = commentText.trim();

      if (!nextCommentText || createCommentMutation.isPending) {
        return;
      }

      createCommentMutation.mutate(nextCommentText, {
        onSuccess: () => setCommentText(''),
      });
    };

    if (postQuery.isError) {
      return (
        <ScreenShell>
          <View style={styles.errorWrap}>
            <Pressable onPress={onBack} style={styles.backButton}>
              <BackIcon />
            </Pressable>
            <ErrorState onRetry={() => void postQuery.refetch()} />
          </View>
        </ScreenShell>
      );
    }

    if (postQuery.isPending || !post) {
      return (
        <ScreenShell>
          <View style={styles.centerState}>
            <ActivityIndicator color={tokens.colors.accent} />
          </View>
        </ScreenShell>
      );
    }

    return (
      <ScreenShell>
        <KeyboardContainer>
          <FlatList<Comment>
            data={comments}
            style={styles.commentsList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <CommentRow comment={item} />}
            ListHeaderComponent={
              <PostHeader
                post={post}
                onBack={onBack}
                onLikePress={handleLikePress}
                onCommentPress={handleCommentPress}
                likeAnimatedStyle={likeAnimatedStyle}
              />
            }
            ListFooterComponent={
              <CommentsFooter
                isInitialLoading={commentsQuery.isPending}
                isLoadingMore={commentsQuery.isFetchingNextPage}
              />
            }
            contentContainerStyle={styles.listContent}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.35}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.inputBar}>
            {createCommentMutation.isError ? (
              <Text style={styles.commentError}>
                Не удалось отправить комментарий
              </Text>
            ) : null}
            <View style={styles.inputRow}>
              <TextInput
                ref={commentInputRef}
                value={commentText}
                onChangeText={setCommentText}
                placeholder="Ваш комментарий"
                placeholderTextColor={tokens.colors.textMuted}
                style={styles.commentInput}
                maxLength={500}
                returnKeyType="send"
                editable={!createCommentMutation.isPending}
                onSubmitEditing={submitComment}
              />
              <Pressable
                accessibilityRole="button"
                disabled={
                  !commentText.trim() || createCommentMutation.isPending
                }
                onPress={submitComment}
                style={[
                  styles.sendButton,
                  !commentText.trim() || createCommentMutation.isPending
                    ? styles.sendButtonDisabled
                    : null,
                ]}
              >
                <SendIcon
                  color={
                    !commentText.trim() || createCommentMutation.isPending
                      ? tokens.colors.textMuted
                      : tokens.colors.accent
                  }
                />
              </Pressable>
            </View>
          </View>
        </KeyboardContainer>
      </ScreenShell>
    );
  },
);

const styles = StyleSheet.create({
  keyboardWrap: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 12,
  },
  commentsList: {
    flex: 1,
  },
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorWrap: {
    flex: 1,
    paddingTop: topInset + 12,
    paddingHorizontal: 12,
  },
  topBar: {
    paddingTop: topInset + 10,
    paddingHorizontal: 14,
    paddingBottom: 14,
    backgroundColor: tokens.colors.surfaceStrong,
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorCompact: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  authorName: {
    ...tokens.typography.label,
    color: tokens.colors.textPrimary,
    flex: 1,
  },
  coverFrame: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: tokens.colors.imageFallback,
    overflow: 'hidden',
  },
  coverDimmer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: tokens.colors.paidSurface,
  },
  content: {
    paddingHorizontal: tokens.spacing.md,
    paddingTop: tokens.spacing.md,
    paddingBottom: 14,
    backgroundColor: tokens.colors.surfaceStrong,
  },
  postTitle: {
    ...tokens.typography.title,
    color: tokens.colors.textPrimary,
    marginBottom: tokens.spacing.xs,
  },
  postBody: {
    ...tokens.typography.body,
    color: tokens.colors.textSecondary,
    marginBottom: tokens.spacing.md,
  },
  paidBodyPlaceholder: {
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.colors.backgroundMuted,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    marginBottom: tokens.spacing.md,
  },
  paidBodyText: {
    ...tokens.typography.body,
    color: tokens.colors.textMuted,
  },
  statsRow: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
  },
  statPill: {
    height: 32,
    borderRadius: 16,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    backgroundColor: tokens.colors.backgroundMuted,
  },
  statPillLiked: {
    backgroundColor: '#FF2D7A',
  },
  statValue: {
    ...tokens.typography.label,
    color: tokens.colors.iconMuted,
    fontSize: 12,
  },
  statValueLiked: {
    color: '#FFFFFF',
  },
  commentsHeader: {
    paddingHorizontal: tokens.spacing.md,
    paddingTop: tokens.spacing.sm,
    paddingBottom: tokens.spacing.xs,
    backgroundColor: tokens.colors.surfaceStrong,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  commentsTitle: {
    ...tokens.typography.caption,
    color: tokens.colors.textSecondary,
  },
  commentsSort: {
    ...tokens.typography.caption,
    color: tokens.colors.accent,
  },
  commentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.xs,
    backgroundColor: tokens.colors.surfaceStrong,
    gap: tokens.spacing.sm,
  },
  commentBody: {
    flex: 1,
  },
  commentAuthor: {
    ...tokens.typography.label,
    color: tokens.colors.textPrimary,
  },
  commentText: {
    ...tokens.typography.body,
    color: tokens.colors.textSecondary,
  },
  commentLike: {
    minWidth: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentsFooter: {
    paddingVertical: 20,
    backgroundColor: tokens.colors.surfaceStrong,
  },
  commentsBottomSpacer: {
    height: 14,
    backgroundColor: tokens.colors.surfaceStrong,
  },
  inputBar: {
    paddingHorizontal: tokens.spacing.md,
    paddingTop: tokens.spacing.sm,
    paddingBottom: tokens.spacing.sm + androidBottomInset,
    backgroundColor: tokens.colors.surfaceStrong,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.border,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  commentError: {
    ...tokens.typography.caption,
    color: tokens.colors.danger,
    marginBottom: tokens.spacing.xs,
  },
  commentInput: {
    flex: 1,
    minHeight: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    paddingHorizontal: tokens.spacing.md,
    color: tokens.colors.textPrimary,
    ...tokens.typography.body,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
