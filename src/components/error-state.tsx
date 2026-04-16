import { Pressable, StyleSheet, Text, View } from 'react-native';

import { tokens } from '../theme/tokens';

interface ErrorStateProps {
  onRetry: () => void;
  details?: string;
}

const ErrorArtwork = () => (
  <View style={styles.artwork}>
    <View style={styles.artworkCore} />
    <View style={[styles.spark, styles.sparkLeft]} />
    <View style={[styles.spark, styles.sparkRight]} />
    <View style={[styles.spark, styles.sparkBottom]} />
  </View>
);

export const ErrorState = ({ onRetry, details }: ErrorStateProps) => (
  <View style={styles.card}>
    <ErrorArtwork />
    <Text style={styles.title}>Не удалось загрузить публикацию</Text>

    {details ? <Text style={styles.details}>Причина: {details}</Text> : null}

    <Pressable
      accessibilityRole="button"
      onPress={onRetry}
      style={({ pressed }) => [
        styles.button,
        pressed ? styles.buttonPressed : null,
      ]}
    >
      <Text style={styles.buttonLabel}>Повторить</Text>
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  card: {
    marginHorizontal: tokens.spacing.lg,
    paddingTop: 28,
    paddingBottom: tokens.spacing.xl,
    paddingHorizontal: tokens.spacing.md,
    borderRadius: tokens.radius.lg,
    backgroundColor: tokens.colors.surfaceStrong,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    alignItems: 'center',
  },
  artwork: {
    width: 78,
    height: 78,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: tokens.spacing.md,
  },
  artworkCore: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#dcd5ff',
    borderWidth: 2,
    borderColor: '#b9a7ff',
  },
  spark: {
    position: 'absolute',
    width: 26,
    height: 5,
    borderRadius: 999,
    backgroundColor: '#ff4a8d',
  },
  sparkLeft: {
    left: 2,
    top: 24,
    transform: [{ rotate: '-25deg' }],
  },
  sparkRight: {
    right: 2,
    top: 24,
    transform: [{ rotate: '25deg' }],
  },
  sparkBottom: {
    bottom: 14,
    width: 32,
    backgroundColor: '#6f30ff',
  },
  title: {
    ...tokens.typography.bodyStrong,
    color: tokens.colors.textPrimary,
    textAlign: 'center',
    marginBottom: tokens.spacing.sm,
  },
  details: {
    ...tokens.typography.caption,
    color: tokens.colors.textMuted,
    textAlign: 'center',
    marginBottom: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.md,
  },
  button: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: tokens.colors.accent,
    alignItems: 'center',
  },
  buttonPressed: {
    backgroundColor: tokens.colors.accentPressed,
  },
  buttonLabel: {
    ...tokens.typography.label,
    color: tokens.colors.accentText,
  },
});
