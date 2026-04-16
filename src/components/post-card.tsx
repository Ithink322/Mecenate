import type { ReactNode } from 'react';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import type { Post } from '../api/types';
import { tokens } from '../theme/tokens';
import { Avatar } from './avatar';
import { CommentIcon, LikeIcon } from './icons/feed-icons';

interface PostCardProps {
  post: Post;
}

const StatsRow = ({
  isLiked,
  likesCount,
  commentsCount,
}: {
  isLiked: boolean;
  likesCount: number;
  commentsCount: number;
}) => (
  <View style={styles.statsRow}>
    <View style={[styles.statPill, isLiked ? styles.statPillLiked : null]}>
      <LikeIcon color={isLiked ? '#FFFFFF' : tokens.colors.iconMuted} />
      <Text style={[styles.statValue, isLiked ? styles.statValueLiked : null]}>
        {likesCount}
      </Text>
    </View>

    <View style={styles.statPill}>
      <CommentIcon color={tokens.colors.iconMuted} />
      <Text style={styles.statValue}>{commentsCount}</Text>
    </View>
  </View>
);

const CoverImage = ({
  uri,
  children,
}: {
  uri: string;
  children?: ReactNode;
}) => {
  const [hasError, setHasError] = useState(false);

  return (
    <View style={styles.coverFrame}>
      {!hasError ? (
        <Image
          source={{ uri }}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
          onError={() => setHasError(true)}
        />
      ) : null}
      {children}
    </View>
  );
};

const PaidOverlay = () => (
  <View style={styles.coverDimmer}>
    <View style={styles.paidOverlay}>
      <View style={styles.paidBadge}>
        <Text style={styles.paidBadgeText}>$</Text>
      </View>
      <Text style={styles.paidTitle}>
        Контент скрыт пользователем. Доступ откроется после доната
      </Text>
      <Pressable
        style={({ pressed }) => [
          styles.paidButton,
          pressed ? styles.paidButtonPressed : null,
        ]}
      >
        <Text style={styles.paidButtonLabel}>Отправить донат</Text>
      </Pressable>
    </View>
  </View>
);

const PaidSkeleton = () => (
  <View style={styles.paidSkeletonBlock}>
    <View style={styles.paidSkeletonLine} />
    <View style={[styles.paidSkeletonLine, styles.paidSkeletonLineShort]} />
  </View>
);

export const PostCard = ({ post }: PostCardProps) => (
  <View style={styles.card}>
    <View style={styles.authorRow}>
      <Avatar name={post.author.displayName} uri={post.author.avatarUrl} />
      <Text style={styles.authorName}>{post.author.displayName}</Text>
    </View>

    <CoverImage uri={post.coverUrl}>
      {post.tier === 'paid' ? <PaidOverlay /> : null}
    </CoverImage>

    {post.tier === 'paid' ? (
      <PaidSkeleton />
    ) : (
      <View style={styles.content}>
        <Text style={styles.postTitle}>{post.title}</Text>
        <Text style={styles.preview}>{post.preview}</Text>
        <StatsRow
          isLiked={post.isLiked}
          likesCount={post.likesCount}
          commentsCount={post.commentsCount}
        />
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: tokens.radius.lg,
    backgroundColor: tokens.colors.surfaceStrong,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    overflow: 'hidden',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: 14,
  },
  authorName: {
    ...tokens.typography.bodyStrong,
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  content: {
    padding: tokens.spacing.md,
  },
  postTitle: {
    ...tokens.typography.title,
    color: tokens.colors.textPrimary,
    marginBottom: tokens.spacing.xs,
  },
  preview: {
    ...tokens.typography.body,
    color: tokens.colors.textSecondary,
    marginBottom: tokens.spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    height: 32,
    borderRadius: 16,
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
  paidOverlay: {
    alignItems: 'center',
    width: '100%',
  },
  paidBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: tokens.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  paidBadgeText: {
    fontSize: 24,
    fontWeight: '700',
    color: tokens.colors.paidAccent,
  },
  paidTitle: {
    ...tokens.typography.hero,
    fontSize: 18,
    lineHeight: 26,
    color: tokens.colors.accentText,
    textAlign: 'center',
    marginBottom: 18,
    maxWidth: 280,
  },
  paidButton: {
    minWidth: 208,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: tokens.colors.accent,
    alignItems: 'center',
  },
  paidButtonPressed: {
    backgroundColor: tokens.colors.accentPressed,
  },
  paidButtonLabel: {
    ...tokens.typography.bodyStrong,
    color: tokens.colors.accentText,
  },
  paidSkeletonBlock: {
    paddingHorizontal: tokens.spacing.md,
    paddingTop: tokens.spacing.md,
    paddingBottom: tokens.spacing.md,
    gap: tokens.spacing.sm,
  },
  paidSkeletonLine: {
    height: 18,
    borderRadius: 999,
    backgroundColor: tokens.colors.skeleton,
  },
  paidSkeletonLineShort: {
    width: '78%',
  },
});
