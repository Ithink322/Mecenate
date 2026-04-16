import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { tokens } from '../theme/tokens';
import { getInitials } from '../utils/format';

interface AvatarProps {
  name: string;
  uri: string;
  size?: number;
}

export const Avatar = ({ name, uri, size = 40 }: AvatarProps) => {
  const [hasImageError, setHasImageError] = useState(false);
  const initials = getInitials(name);

  return (
    <View
      style={[
        styles.wrapper,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      {!hasImageError ? (
        <Image
          source={{ uri }}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
          onError={() => setHasImageError(true)}
        />
      ) : null}

      {hasImageError ? <Text style={styles.initials}>{initials}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: tokens.colors.imageFallback,
  },
  initials: {
    ...tokens.typography.caption,
    color: tokens.colors.textPrimary,
  },
});
