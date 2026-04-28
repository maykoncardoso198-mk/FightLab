import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Fonts, Spacing } from '../constants';

interface Props {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
}

export function SectionHeader({ title, subtitle, actionLabel, onActionPress }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={{ flex: 1 }}>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        <Text style={styles.title}>{title}</Text>
      </View>
      {actionLabel && (
        <Pressable onPress={onActionPress} style={({ pressed }) => pressed && { opacity: 0.7 }}>
          <Text style={styles.action}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.base,
  },
  subtitle: {
    color: Colors.red,
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1.6,
    marginBottom: 6,
  },
  title: {
    color: Colors.textPrimary,
    fontFamily: Fonts.display,
    fontSize: 26,
    letterSpacing: 1,
  },
  action: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyMedium,
    fontSize: 12,
    letterSpacing: 0.8,
  },
});
