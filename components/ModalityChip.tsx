import { Pressable, Text, StyleSheet } from 'react-native';
import { Colors, Fonts, Radius } from '../constants';

interface Props {
  label: string;
  active?: boolean;
  onPress?: () => void;
  size?: 'sm' | 'md';
}

export function ModalityChip({ label, active, onPress, size = 'md' }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        size === 'sm' && styles.chipSm,
        active && styles.active,
        pressed && { opacity: 0.85 },
      ]}
    >
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipSm: {
    height: 30,
    paddingHorizontal: 12,
  },
  active: {
    backgroundColor: Colors.red,
    borderColor: Colors.red,
  },
  label: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyMedium,
    fontSize: 13,
    letterSpacing: 0.4,
  },
  labelActive: {
    color: Colors.textPrimary,
    fontFamily: Fonts.bodyBold,
  },
});
