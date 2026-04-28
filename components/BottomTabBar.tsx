import { View, Pressable, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Colors, Fonts } from '../constants';

const ICONS: Record<string, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
  index: { active: 'home', inactive: 'home-outline' },
  search: { active: 'search', inactive: 'search-outline' },
  agenda: { active: 'calendar', inactive: 'calendar-outline' },
  profile: { active: 'person', inactive: 'person-outline' },
};

const LABELS: Record<string, string> = {
  index: 'Home',
  search: 'Buscar',
  agenda: 'Agenda',
  profile: 'Perfil',
};

export function BottomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={styles.innerRow}>
        {state.routes.map((route, idx) => {
          const focused = state.index === idx;
          const cfg = ICONS[route.name] || ICONS.index;
          const label = LABELS[route.name] || route.name;

          const onPress = () => {
            Haptics.selectionAsync();
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable key={route.key} style={styles.tab} onPress={onPress}>
              <Ionicons
                name={focused ? cfg.active : cfg.inactive}
                size={22}
                color={focused ? Colors.red : Colors.textMuted}
              />
              <Text style={[styles.label, focused && styles.labelActive]}>{label}</Text>
              {focused && <View style={styles.indicator} />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  innerRow: {
    flexDirection: 'row',
    paddingTop: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  label: {
    color: Colors.textMuted,
    fontFamily: Fonts.bodyMedium,
    fontSize: 10,
    letterSpacing: 0.6,
    marginTop: 4,
  },
  labelActive: {
    color: Colors.red,
    fontFamily: Fonts.bodyBold,
  },
  indicator: {
    position: 'absolute',
    top: 0,
    width: 28,
    height: 2,
    backgroundColor: Colors.red,
  },
});
