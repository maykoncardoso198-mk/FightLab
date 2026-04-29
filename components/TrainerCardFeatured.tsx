import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Radius, Spacing } from '../constants';
import { Trainer } from '../data';

interface Props {
  trainerA: Trainer;
  trainerB: Trainer;
  onPressA?: () => void;
  onPressB?: () => void;
}

export function TrainerCardFeatured({ trainerA, trainerB, onPressA, onPressB }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="flame" size={14} color={Colors.red} />
        <Text style={styles.headerText}>MAIS AULAS DA SEMANA</Text>
      </View>

      <View style={styles.duel}>
        <Pressable
          onPress={onPressA}
          style={({ pressed }) => [styles.side, pressed && { opacity: 0.85 }]}
        >
          <Image source={{ uri: trainerA.photo }} style={styles.image} contentFit="cover" />
          <View style={styles.sideGradient} />
          <View style={styles.rankBadge}>
            <Text style={styles.rankText}>#1</Text>
          </View>
          <View style={styles.sideInfo}>
            <Text style={styles.modality}>{trainerA.primaryModality.toUpperCase()}</Text>
            <Text numberOfLines={2} style={styles.name}>
              {trainerA.name}
            </Text>
            <Text style={styles.lessonCount}>{trainerA.totalLessons} aulas</Text>
          </View>
        </Pressable>

        <View style={styles.center}>
          <View style={styles.trophyCircle}>
            <Ionicons name="trophy" size={20} color={Colors.textPrimary} />
          </View>
        </View>

        <Pressable
          onPress={onPressB}
          style={({ pressed }) => [styles.side, pressed && { opacity: 0.85 }]}
        >
          <Image source={{ uri: trainerB.photo }} style={styles.image} contentFit="cover" />
          <View style={styles.sideGradient} />
          <View style={[styles.rankBadge, styles.rankBadgeRight]}>
            <Text style={styles.rankText}>#2</Text>
          </View>
          <View style={[styles.sideInfo, styles.sideInfoRight]}>
            <Text style={[styles.modality, styles.alignRight]}>
              {trainerB.primaryModality.toUpperCase()}
            </Text>
            <Text numberOfLines={2} style={[styles.name, styles.alignRight]}>
              {trainerB.name}
            </Text>
            <Text style={[styles.lessonCount, styles.alignRight]}>
              {trainerB.totalLessons} aulas
            </Text>
          </View>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Ionicons name="stats-chart" size={13} color={Colors.textSecondary} />
        <Text style={styles.footerText}>PROFESSORES MAIS CONTRATADOS</Text>
        <Text style={styles.footerAccent}>ESTA SEMANA</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  header: {
    paddingHorizontal: Spacing.base,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  headerText: {
    color: Colors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1.6,
  },
  duel: {
    height: 220,
    flexDirection: 'row',
  },
  side: {
    flex: 1,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.skeleton,
  },
  sideGradient: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.52)',
  },
  rankBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: Colors.red,
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  rankBadgeRight: {
    left: undefined,
    right: 12,
  },
  rankText: {
    color: Colors.textPrimary,
    fontFamily: Fonts.numbersBlack,
    fontSize: 12,
    letterSpacing: 0.5,
  },
  sideInfo: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 14,
  },
  sideInfoRight: {
    alignItems: 'flex-end',
  },
  alignRight: {
    textAlign: 'right',
  },
  modality: {
    color: Colors.red,
    fontFamily: Fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1.4,
  },
  name: {
    color: Colors.textPrimary,
    fontFamily: Fonts.display,
    fontSize: 16,
    letterSpacing: 0.6,
    marginTop: 4,
  },
  lessonCount: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyRegular,
    fontSize: 11,
    marginTop: 4,
  },
  center: {
    width: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  trophyCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceHigh,
    borderWidth: 1,
    borderColor: 'rgba(214,40,40,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    gap: 6,
  },
  footerText: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyMedium,
    fontSize: 10,
    letterSpacing: 1.4,
    flex: 1,
  },
  footerAccent: {
    color: Colors.red,
    fontFamily: Fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1.2,
  },
});
