import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Colors, Fonts, Radius, Spacing } from '../../constants';
import { PrimaryButton, ScheduleCalendar, TimeSlotPicker } from '../../components';
import { useTrainerById } from '../../hooks/useTrainers';

export default function BookingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const trainer = useTrainerById(id);
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);

  if (!trainer) return null;
  const date = selectedDate || trainer.schedule[0].date;
  const day = trainer.schedule.find((d) => d.date === date) || trainer.schedule[0];

  const next = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (step === 1 && selectedDate) setStep(2);
    else if (step === 2 && selectedTime) setStep(3);
    else if (step === 3) {
      router.push({
        pathname: '/payment',
        params: {
          trainerId: trainer.id,
          date,
          time: selectedTime,
        },
      });
    }
  };

  const back = () => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    if (step > 1) setStep(step - 1);
    else router.back();
  };

  const canProceed =
    (step === 1 && !!selectedDate) ||
    (step === 2 && !!selectedTime) ||
    step === 3;

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <View style={styles.header}>
          <Pressable onPress={back} hitSlop={10}>
            <Ionicons name="chevron-back" size={26} color={Colors.textPrimary} />
          </Pressable>
          <View>
            <Text style={styles.headerEyebrow}>PASSO {step} DE 3</Text>
            <Text style={styles.headerTitle}>{stepTitle(step)}</Text>
          </View>
          <View style={{ width: 26 }} />
        </View>

        <View style={styles.progressBar}>
          <View style={[styles.progressSeg, step >= 1 && styles.progressSegActive]} />
          <View style={[styles.progressSeg, step >= 2 && styles.progressSegActive]} />
          <View style={[styles.progressSeg, step >= 3 && styles.progressSegActive]} />
        </View>

        <View style={styles.summaryBar}>
          <Image source={{ uri: trainer.photo }} style={styles.tinyAvatar} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.summaryName} numberOfLines={1}>
              {trainer.name}
            </Text>
            <Text style={styles.summaryMeta}>
              {trainer.primaryModality} · R$ {trainer.pricePerHour}/h
            </Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {step === 1 && (
            <View>
              <Text style={styles.stepTitle}>ESCOLHA O DIA</Text>
              <Text style={styles.stepSubtitle}>
                Disponibilidade atualizada em tempo real.
              </Text>
              <View style={{ marginTop: Spacing.lg }}>
                <ScheduleCalendar
                  schedule={trainer.schedule}
                  selectedDate={selectedDate}
                  onSelectDate={(d) => {
                    if (Platform.OS !== 'web') {
                      Haptics.selectionAsync();
                    }
                    setSelectedDate(d);
                    setSelectedTime(undefined);
                  }}
                  showSlots={false}
                />
              </View>
            </View>
          )}

          {step === 2 && (
            <View style={styles.stepWrap}>
              <Text style={styles.stepTitle}>ESCOLHA O HORÁRIO</Text>
              <Text style={styles.stepSubtitle}>
                Aulas têm 60 minutos por padrão.
              </Text>
              <View style={{ marginTop: Spacing.lg }}>
                <TimeSlotPicker
                  slots={day.slots}
                  selected={selectedTime}
                  onSelect={(t) => {
                    if (Platform.OS !== 'web') {
                      Haptics.selectionAsync();
                    }
                    setSelectedTime(t);
                  }}
                />
              </View>
            </View>
          )}

          {step === 3 && (
            <View style={styles.stepWrap}>
              <Text style={styles.stepTitle}>RESUMO DA AULA</Text>
              <Text style={styles.stepSubtitle}>
                Revise os detalhes antes de confirmar.
              </Text>

              <View style={styles.recap}>
                <RecapRow icon="person" label="PROFESSOR" value={trainer.name} />
                <RecapRow icon="fitness" label="MODALIDADE" value={trainer.primaryModality} />
                <RecapRow icon="calendar" label="DATA" value={formatDate(date)} />
                <RecapRow icon="time" label="HORÁRIO" value={`${selectedTime} - ${addHour(selectedTime)}`} />
                <RecapRow icon="hourglass" label="DURAÇÃO" value="60 minutos" />
                <RecapRow icon="location" label="LOCAL" value={`${trainer.neighborhood}, ${trainer.city}`} />
              </View>

              <View style={styles.totalCard}>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Aula particular (1h)</Text>
                  <Text style={styles.totalValue}>R$ {trainer.pricePerHour.toFixed(2)}</Text>
                </View>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Taxa da plataforma</Text>
                  <Text style={styles.totalValue}>R$ 0,00</Text>
                </View>
                <View style={[styles.totalRow, { marginTop: 10, borderTopWidth: 1, borderTopColor: Colors.divider, paddingTop: 12 }]}>
                  <Text style={styles.totalFinalLabel}>TOTAL</Text>
                  <Text style={styles.totalFinalValue}>R$ {trainer.pricePerHour.toFixed(2)}</Text>
                </View>
              </View>

              <View style={styles.policyBox}>
                <Ionicons name="shield-checkmark" size={16} color={Colors.red} />
                <Text style={styles.policyText}>
                  Cancelamento gratuito até 6h antes da aula.
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      <SafeAreaView edges={['bottom']} style={styles.cta}>
        <View style={styles.ctaInner}>
          <PrimaryButton
            label={step === 3 ? 'CONFIRMAR E PAGAR' : 'CONTINUAR'}
            iconRight="arrow-forward"
            onPress={next}
            disabled={!canProceed}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

function RecapRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.recapRow}>
      <View style={styles.recapIcon}>
        <Ionicons name={icon} size={14} color={Colors.red} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.recapLabel}>{label}</Text>
        <Text style={styles.recapValue}>{value}</Text>
      </View>
    </View>
  );
}

function stepTitle(s: number): string {
  if (s === 1) return 'AGENDAR AULA';
  if (s === 2) return 'AGENDAR AULA';
  return 'RESUMO';
}

function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'long',
  }).toUpperCase();
}

function addHour(time?: string): string {
  if (!time) return '';
  const [h, m] = time.split(':').map(Number);
  const next = (h + 1) % 24;
  return `${String(next).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screen,
    paddingVertical: 12,
  },
  headerEyebrow: {
    color: Colors.red,
    fontFamily: Fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1.4,
    textAlign: 'center',
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontFamily: Fonts.display,
    fontSize: 18,
    letterSpacing: 1.4,
    textAlign: 'center',
    marginTop: 2,
  },
  progressBar: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.screen,
    gap: 6,
    marginTop: 4,
    marginBottom: Spacing.base,
  },
  progressSeg: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: Colors.surfaceHigh,
  },
  progressSegActive: {
    backgroundColor: Colors.red,
  },
  summaryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.screen,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  tinyAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.skeleton,
  },
  summaryName: {
    color: Colors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 13,
  },
  summaryMeta: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyRegular,
    fontSize: 11,
    marginTop: 2,
  },
  stepWrap: {
    paddingHorizontal: Spacing.screen,
  },
  stepTitle: {
    color: Colors.textPrimary,
    fontFamily: Fonts.display,
    fontSize: 28,
    letterSpacing: 1.4,
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.lg,
  },
  stepSubtitle: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyRegular,
    fontSize: 13,
    paddingHorizontal: Spacing.screen,
    marginTop: 6,
  },
  recap: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    marginTop: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.divider,
    overflow: 'hidden',
  },
  recapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  recapIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(214,40,40,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  recapLabel: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1.4,
  },
  recapValue: {
    color: Colors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
    marginTop: 2,
  },
  totalCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: 18,
    marginTop: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  totalLabel: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyRegular,
    fontSize: 13,
  },
  totalValue: {
    color: Colors.textPrimary,
    fontFamily: Fonts.bodyMedium,
    fontSize: 13,
  },
  totalFinalLabel: {
    color: Colors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 1.4,
  },
  totalFinalValue: {
    color: Colors.red,
    fontFamily: Fonts.numbersBlack,
    fontSize: 22,
  },
  policyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(214,40,40,0.08)',
    borderRadius: Radius.base,
    padding: 12,
    marginTop: Spacing.base,
    borderWidth: 1,
    borderColor: 'rgba(214,40,40,0.25)',
  },
  policyText: {
    flex: 1,
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyMedium,
    fontSize: 12,
    lineHeight: 17,
  },
  cta: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  ctaInner: {
    paddingHorizontal: Spacing.screen,
    paddingVertical: 12,
  },
});
