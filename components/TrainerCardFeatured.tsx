import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Radius, Spacing } from '../constants';
import { Trainer } from '../data';

interface Props {
  trainerA: Trainer;
  trainerB: Trainer;
  countdown: string;
  title: string;
  onPressA?: () => void;
  onPressB?: () => void;
}

export function TrainerCardFeatured({
  trainerA,
  trainerB,
  countdown,
  title,
  onPressA,
  onPressB,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.dot} />
        <Text style={styles.headerText}>{title}</Text>
      </View>

      <View style={styles.duel}>
        <Pressable
          onPress={onPressA}
          style={({ pressed }) => [styles.side, pressed && { opacity: 0.85 }]}
        >
          <Image source={{ uri: trainerA.photo }} style={styles.image} contentFit="cover" />
          <View style={[styles.sideGradient, { left: 0 }]} />
          <View style={styles.sideInfo}>
            <Text style={styles.modality}>{trainerA.primaryModality.toUpperCase()}</Text>
            <Text numberOfLines={2} style={styles.name}>
              {trainerA.name}
            </Text>
            <Text style={styles.subtitle}>
              {trainerA.rating.toFixed(1)} ★ · {trainerA.totalLessons} aulas
            </Text>
          </View>
        </Pressable>

        <View style={styles.center}>
          <View style={styles.vsCircle}>
            <Text style={styles.vsText}>VS</Text>
          </View>
        </View>

        <Pressable
          onPress={onPressB}
          style={({ pressed }) => [styles.side, pressed && { opacity: 0.85 }]}
        >
          <Image source={{ uri: trainerB.photo }} style={styles.image} contentFit="cover" />
          <View style={[styles.sideGradient, { right: 0 }]} />
          <View style={[styles.sideInfo, styles.sideInfoRight]}>
            <Text style={[styles.modality, styles.alignRight]}>
              {trainerB.primaryModality.toUpperCase()}
            </Text>
            <Text numberOfLines={2} style={[styles.name, styles.alignRight]}>
              {trainerB.name}
            </Text>
            <Text style={[styles.subtitle, styles.alignRight]}>
              {trainerB.rating.toFixed(1)} ★ · {trainerB.totalLessons} aulas
            </Text>
          </View>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
        <Text style={styles.footerText}>PRÓXIMA DISPONIBILIDADE EM</Text>
        <Text style={styles.countdown}>{countdown}</Text>
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.red,
    marginRight: 8,
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
    backgroundColor: 'rgba(0,0,0,0.55)',
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
  subtitle: {
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
  vsCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vsText: {
    color: Colors.textPrimary,
    fontFamily: Fonts.numbersBlack,
    fontSize: 16,
    letterSpacing: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  footerText: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyMedium,
    fontSize: 10,
    letterSpacing: 1.4,
    marginLeft: 6,
    flex: 1,
  },
  countdown: {
    color: Colors.red,
    fontFamily: Fonts.numbersBold,
    fontSize: 14,
    letterSpacing: 1,
  },
});
