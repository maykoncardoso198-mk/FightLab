import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing } from '../constants';
import { Trainer } from '../data';

interface Props {
  trainer: Trainer;
  position: number;
  onPress?: () => void;
}

export function RankingItem({ trainer, position, onPress }: Props) {
  const isTopThree = position <= 3;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.85 }]}
    >
      <Text style={[styles.rank, isTopThree && styles.rankTop]}>#{position}</Text>
      <Image source={{ uri: trainer.photo }} style={styles.avatar} contentFit="cover" />
      <View style={styles.info}>
        <Text numberOfLines={1} style={styles.name}>
          {trainer.name}
        </Text>
        <Text style={styles.modality}>
          {trainer.primaryModality} · {trainer.city}
        </Text>
        <View style={styles.recordRow}>
          <Ionicons name="star" size={11} color={Colors.star} />
          <Text style={styles.record}>
            {' '}
            {trainer.rating.toFixed(1)} · {trainer.totalLessons} aulas
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  rank: {
    width: 56,
    fontFamily: Fonts.display,
    fontSize: 30,
    letterSpacing: 1,
    color: Colors.textMuted,
  },
  rankTop: {
    color: Colors.red,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.skeleton,
    marginRight: Spacing.md,
  },
  info: {
    flex: 1,
  },
  name: {
    color: Colors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 15,
  },
  modality: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyRegular,
    fontSize: 12,
    marginTop: 2,
  },
  recordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  record: {
    color: Colors.textPrimary,
    fontFamily: Fonts.bodyMedium,
    fontSize: 12,
  },
});
