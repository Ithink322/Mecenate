import { Platform } from 'react-native';

const headingFamily = Platform.select({
  ios: 'SF Pro Display',
  android: 'sans-serif-medium',
  default: undefined,
});

const bodyFamily = Platform.select({
  ios: 'SF Pro Text',
  android: 'sans-serif',
  default: undefined,
});

export const tokens = {
  colors: {
    background: '#f4f6fb',
    backgroundMuted: '#eff2f8',
    surface: '#ffffff',
    surfaceStrong: '#ffffff',
    border: '#e7ebf3',
    textPrimary: '#242833',
    textSecondary: '#323744',
    textMuted: '#7e8798',
    accent: '#651fff',
    accentPressed: '#5319d1',
    accentSoft: '#efe8ff',
    accentText: '#ffffff',
    danger: '#242833',
    paidSurface: 'rgba(24, 28, 37, 0.72)',
    paidAccent: '#ffffff',
    paidBorder: 'rgba(255,255,255,0.16)',
    skeleton: '#edf1f7',
    imageFallback: '#d8deea',
    shadow: '#1f2430',
    verified: '#2c8d6b',
    iconMuted: '#697386',
  },
  spacing: {
    xxs: 4,
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
  radius: {
    sm: 10,
    md: 16,
    lg: 18,
    xl: 24,
    pill: 999,
  },
  typography: {
    hero: {
      fontFamily: headingFamily,
      fontSize: 24,
      lineHeight: 28,
      fontWeight: '700' as const,
    },
    title: {
      fontFamily: headingFamily,
      fontSize: 18,
      lineHeight: 24,
      fontWeight: '700' as const,
    },
    body: {
      fontFamily: bodyFamily,
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '400' as const,
    },
    bodyStrong: {
      fontFamily: bodyFamily,
      fontSize: 16,
      lineHeight: 20,
      fontWeight: '700' as const,
    },
    label: {
      fontFamily: bodyFamily,
      fontSize: 13,
      lineHeight: 16,
      fontWeight: '600' as const,
    },
    caption: {
      fontFamily: bodyFamily,
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '500' as const,
    },
  },
};
