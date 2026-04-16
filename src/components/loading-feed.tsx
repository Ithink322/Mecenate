import { StyleSheet, View } from 'react-native';

import { tokens } from '../theme/tokens';

export const LoadingFeed = () => (
  <View style={styles.container}>
    {Array.from({ length: 3 }).map((_, index) => (
      <View key={index} style={styles.card}>
        <View style={styles.authorRow}>
          <View style={styles.avatar} />
          <View style={styles.authorLine} />
        </View>
        <View style={styles.cover} />
        <View style={styles.content}>
          <View style={styles.title} />
          <View style={styles.line} />
          <View style={[styles.line, styles.shortLine]} />
          <View style={styles.stats}>
            <View style={styles.stat} />
            <View style={styles.stat} />
          </View>
        </View>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    gap: tokens.spacing.md,
  },
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
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: tokens.colors.skeleton,
  },
  authorLine: {
    width: 120,
    height: 14,
    borderRadius: 999,
    backgroundColor: tokens.colors.skeleton,
  },
  cover: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: tokens.colors.skeleton,
  },
  content: {
    padding: tokens.spacing.md,
  },
  title: {
    width: '54%',
    height: 18,
    borderRadius: 999,
    backgroundColor: tokens.colors.skeleton,
    marginBottom: tokens.spacing.sm,
  },
  line: {
    width: '82%',
    height: 12,
    borderRadius: 999,
    backgroundColor: tokens.colors.skeleton,
    marginBottom: tokens.spacing.xs,
  },
  shortLine: {
    width: '64%',
    marginBottom: tokens.spacing.md,
  },
  stats: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
  },
  stat: {
    width: 64,
    height: 32,
    borderRadius: 16,
    backgroundColor: tokens.colors.skeleton,
  },
});
