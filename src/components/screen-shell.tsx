import type { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { tokens } from '../theme/tokens';

export const ScreenShell = ({ children }: PropsWithChildren) => (
  <View style={styles.container}>{children}</View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
});
