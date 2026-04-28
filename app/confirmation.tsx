import { useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  withSpring,
  withSequence,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { Colors, Fonts, Radius, Spacing } from '../constants';
import { PrimaryButton } from '../components';
import { useTrainerById } from '../hooks/useTrainers';

export default function ConfirmationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ trainerId: string; date: string; time: string }>();
  const trainer = useTrainerById(params.trainerId);

  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const checkScale = useSharedValue(0);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    scale.value = withSequence(
      withSpring(1.15, { damping: 10 }),
      withSpring(1, { damping: 12 })
    );
    checkScale.value = withDelay(180, withSpring(1, { damping: 8 }));
    opacity.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.ease) });
  }, [scale, checkScale, opacity]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));
  const fadeStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  if (!trainer) return null;

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <Animated.View style={[styles.ringWrap, ringStyle]}>
          <View style={styles.ringOuter}>
            <View style={styles.ringInner}>
              <Animated.View style={checkStyle}>
                <Ionicons name="checkmark" size={48} color={Colors.textPrimary} />
              </Animated.View>
            </View>
          </View>
        </Animated.View>

        <Animated.View style={[fadeStyle, { alignItems: 'center', marginTop: Spacing.xl }]}>
          <Text style={styles.eyebrow}>PAGAMENTO APROVADO</Text>
          <Text style={styles.title}>AULA{'\n'}CONFIRMADA</Text>
          <Text style={styles.subtitle}>
            Você receberá um lembrete 1 hora antes. Bom treino, atleta.
          </Text>
        </Animated.View>

        <Animated.View style={[fadeStyle, styles.card]}>
          <Image source={{ uri: trainer.photo }} style={styles.avatar} />
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={styles.cardModality}>
              {trainer.primaryModality.toUpperCase()}
            </Text>
            <Text style={styles.cardName} numberOfLines={1}>
              {trainer.name}
            </Text>
            <View style={styles.cardMeta}>
              <Ionicons name="calendar" size={11} color={Colors.textSecondary} />
              <Text style={styles.cardMetaText}> {formatDate(params.date as string)}</Text>
              <Text style={styles.dot}>·</Text>
              <Ionicons name="time" size={11} color={Colors.textSecondary} />
              <Text style={styles.cardMetaText}> {params.time}</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View style={[fadeStyle, styles.detailGrid]}>
          <DetailItem label="DURAÇÃO" value="60 MIN" />
          <DetailItem label="VALOR" value={`R$ ${trainer.pricePerHour}`} />
          <DetailItem label="LOCAL" value={trainer.neighborhood} fullWidth />
        </Animated.View>
      </View>

      <Animated.View style={[fadeStyle, styles.footer]}>
        <PrimaryButton
          label="ABRIR CHAT COM PROFESSOR"
          iconLeft="chatbubble-ellipses"
          onPress={() => router.replace(`/chat/${trainer.id}`)}
        />
        <View style={{ height: 10 }} />
        <PrimaryButton
          label="IR PARA O INÍCIO"
          variant="outline"
          onPress={() => router.replace('/(tabs)')}
        />
      </Animated.View>
    </SafeAreaView>
  );
}

function DetailItem({
  label,
  value,
  fullWidth,
}: {
  label: string;
  value: string;
  fullWidth?: boolean;
}) {
  return (
    <View style={[styles.detailItem, fullWidth && { flexBasis: '100%' }]}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d
    .toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })
    .toUpperCase();
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing['2xl'],
  },
  ringWrap: {
    marginTop: 30,
  },
  ringOuter: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(214,40,40,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringInner: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: Colors.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyebrow: {
    color: Colors.red,
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 2,
  },
  title: {
    color: Colors.textPrimary,
    fontFamily: Fonts.display,
    fontSize: 52,
    lineHeight: 54,
    letterSpacing: 1.4,
    textAlign: 'center',
    marginTop: 8,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyRegular,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 20,
    maxWidth: 300,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: 14,
    width: '100%',
    marginTop: Spacing['2xl'],
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: Colors.skeleton,
  },
  cardModality: {
    color: Colors.red,
    fontFamily: Fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1.4,
  },
  cardName: {
    color: Colors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
    marginTop: 2,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  cardMetaText: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyRegular,
    fontSize: 11,
  },
  dot: {
    color: Colors.textMuted,
    marginHorizontal: 6,
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    marginTop: 12,
    gap: 10,
  },
  detailItem: {
    flexBasis: '48%',
    backgroundColor: Colors.surface,
    borderRadius: Radius.base,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  detailLabel: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyBold,
    fontSize: 9,
    letterSpacing: 1.2,
  },
  detailValue: {
    color: Colors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
    marginTop: 4,
  },
  footer: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: 8,
  },
});
