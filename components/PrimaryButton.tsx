import { Pressable, Text, StyleSheet, ActivityIndicator, View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors, Fonts, BUTTON_HEIGHT, Radius } from '../constants';

interface Props {
  label: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'outline' | 'ghost';
  iconLeft?: keyof typeof Ionicons.glyphMap;
  iconRight?: keyof typeof Ionicons.glyphMap;
  haptic?: boolean;
  fullWidth?: boolean;
}

export function PrimaryButton({
  label,
  onPress,
  loading,
  disabled,
  variant = 'primary',
  iconLeft,
  iconRight,
  haptic = true,
  fullWidth = true,
}: Props) {
  const isOutline = variant === 'outline';
  const isGhost = variant === 'ghost';

  const handlePress = () => {
    if (haptic && Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onPress?.();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.btn,
        fullWidth && { alignSelf: 'stretch' },
        isOutline && styles.outline,
        isGhost && styles.ghost,
        pressed && { opacity: 0.85 },
        disabled && { opacity: 0.4 },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={Colors.textPrimary} />
      ) : (
        <View style={styles.row}>
          {iconLeft && (
            <Ionicons
              name={iconLeft}
              size={18}
              color={isOutline || isGhost ? Colors.textPrimary : Colors.textPrimary}
              style={{ marginRight: 8 }}
            />
          )}
          <Text style={styles.label}>{label}</Text>
          {iconRight && (
            <Ionicons
              name={iconRight}
              size={18}
              color={Colors.textPrimary}
              style={{ marginLeft: 8 }}
            />
          )}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    height: BUTTON_HEIGHT,
    borderRadius: Radius.base,
    backgroundColor: Colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    color: Colors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});
