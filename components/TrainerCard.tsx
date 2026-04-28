import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Radius, Spacing } from '../constants';
import { Trainer } from '../data';
import { StarRating } from './StarRating';

interface Props {
  trainer: Trainer;
  onPress?: () => void;
  variant?: 'compact' | 'horizontal';
}

export function TrainerCard({ trainer, onPress, variant = 'compact' }: Props) {
  if (variant === 'horizontal') {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.hCard, pressed && { opacity: 0.85 }]}
      >
        <Image source={{ uri: trainer.photo }} style={styles.hImage} contentFit="cover" />
        <View style={styles.hGradient} />
        <View style={styles.hInfo}>
          <Text style={styles.hModality}>{trainer.primaryModality.toUpperCase()}</Text>
          <Text numberOfLines={1} style={styles.hName}>
            {trainer.name}
          </Text>
          <View style={styles.hMeta}>
            <Ionicons name="location" size={11} color={Colors.textSecondary} />
            <Text style={styles.hMetaText}> {trainer.distanceKm.toFixed(1)} km</Text>
            <Text style={styles.hMetaText}>  ·  </Text>
            <StarRating rating={trainer.rating} size={11} compact />
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.92 }]}
    >
      <Image source={{ uri: trainer.photo }} style={styles.image} contentFit="cover" />
      <View style={styles.info}>
        <Text style={styles.modality}>{trainer.primaryModality.toUpperCase()}</Text>
        <Text numberOfLines={1} style={styles.name}>
          {trainer.name}
        </Text>
        <Text style={styles.city}>
          {trainer.neighborhood} · {trainer.city}
        </Text>
        <View style={styles.bottomRow}>
          <StarRating rating={trainer.rating} size={12} compact />
          <Text style={styles.price}>R$ {trainer.pricePerHour}/h</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // compact (search list)
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  image: {
    width: 110,
    height: 110,
    backgroundColor: Colors.skeleton,
  },
  info: {
    flex: 1,
    padding: Spacing.base,
    justifyContent: 'space-between',
  },
  modality: {
    color: Colors.red,
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1.4,
  },
  name: {
    color: Colors.textPrimary,
    fontFamily: Fonts.display,
    fontSize: 18,
    letterSpacing: 0.8,
    marginTop: 2,
  },
  city: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyRegular,
    fontSize: 12,
    marginTop: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  price: {
    color: Colors.textPrimary,
    fontFamily: Fonts.numbersBold,
    fontSize: 14,
  },

  // horizontal (Perto de Você)
  hCard: {
    width: 180,
    height: 240,
    borderRadius: Radius.md,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
    marginRight: 12,
  },
  hImage: {
    width: '100%',
    height: '100%',
  },
  hGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  hInfo: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 14,
  },
  hModality: {
    color: Colors.red,
    fontFamily: Fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1.4,
  },
  hName: {
    color: Colors.textPrimary,
    fontFamily: Fonts.display,
    fontSize: 18,
    letterSpacing: 0.8,
    marginTop: 2,
  },
  hMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  hMetaText: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyRegular,
    fontSize: 11,
  },
});
