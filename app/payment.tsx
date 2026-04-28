import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Colors, Fonts, Radius, Spacing } from '../constants';
import { PrimaryButton } from '../components';
import { useTrainerById } from '../hooks/useTrainers';
import { useBookings } from '../hooks/useBookings';

type Method = 'pix' | 'card' | 'subscription';

export default function PaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ trainerId: string; date: string; time: string }>();
  const trainer = useTrainerById(params.trainerId);
  const { addBooking } = useBookings();
  const [method, setMethod] = useState<Method>('pix');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [loading, setLoading] = useState(false);

  if (!trainer) return null;

  const subtotal = trainer.pricePerHour;
  const subscriptionTotal = Math.round(trainer.pricePerHour * 10 * 0.85);

  const handlePay = async () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1100));
    await addBooking({
      trainerId: trainer.id,
      studentId: 'u1',
      date: params.date as string,
      time: params.time as string,
      duration: 60,
      price: subtotal,
      status: 'confirmed',
      paymentMethod: method,
    });
    setLoading(false);
    router.replace({
      pathname: '/confirmation',
      params: {
        trainerId: trainer.id,
        date: params.date,
        time: params.time,
      },
    });
  };

  return (
    <View style={styles.root}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Ionicons name="chevron-back" size={26} color={Colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>PAGAMENTO</Text>
          <View style={{ width: 26 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <View style={styles.summary}>
            <Image source={{ uri: trainer.photo }} style={styles.avatar} />
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.summaryName}>{trainer.name}</Text>
              <Text style={styles.summaryMeta}>
                {trainer.primaryModality} · {params.date} · {params.time}
              </Text>
              <Text style={styles.summaryPrice}>
                R$ {trainer.pricePerHour.toFixed(2)}
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>FORMA DE PAGAMENTO</Text>

          <MethodCard
            active={method === 'pix'}
            onPress={() => {
              if (Platform.OS !== 'web') {
                Haptics.selectionAsync();
              }
              setMethod('pix');
            }}
            icon="qr-code"
            title="PIX"
            subtitle="Pagamento instantâneo · Sem taxas"
            badge="RECOMENDADO"
          />
          <MethodCard
            active={method === 'card'}
            onPress={() => {
              if (Platform.OS !== 'web') {
                Haptics.selectionAsync();
              }
              setMethod('card');
            }}
            icon="card"
            title="Cartão de Crédito"
            subtitle="Visa, Mastercard, Elo, Amex"
          />
          <MethodCard
            active={method === 'subscription'}
            onPress={() => {
              if (Platform.OS !== 'web') {
                Haptics.selectionAsync();
              }
              setMethod('subscription');
            }}
            icon="repeat"
            title="Assinatura Mensal"
            subtitle={`Pacote 10 aulas · 15% off · R$ ${subscriptionTotal}`}
          />

          {method === 'pix' && (
            <View style={styles.pixCard}>
              <View style={styles.qrCodePlaceholder}>
                <Ionicons name="qr-code" size={120} color={Colors.textPrimary} />
              </View>
              <Text style={styles.pixTitle}>Escaneie o QR Code para pagar</Text>
              <Text style={styles.pixSubtitle}>
                Ou copie a chave PIX abaixo. Confirmação automática em segundos.
              </Text>
              <Pressable style={styles.pixKeyBox}>
                <Text style={styles.pixKey}>00020126580014BR.GOV.BCB.PIX...FIGHTLAB</Text>
                <Ionicons name="copy-outline" size={16} color={Colors.red} />
              </Pressable>
            </View>
          )}

          {method === 'card' && (
            <View style={styles.cardForm}>
              <Field label="NÚMERO DO CARTÃO">
                <TextInput
                  value={cardNumber}
                  onChangeText={(v) => setCardNumber(formatCard(v))}
                  placeholder="0000 0000 0000 0000"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="number-pad"
                  maxLength={19}
                  style={styles.input}
                />
                <Ionicons name="card" size={18} color={Colors.textSecondary} />
              </Field>
              <Field label="NOME COMO ESTÁ NO CARTÃO">
                <TextInput
                  value={cardName}
                  onChangeText={(v) => setCardName(v.toUpperCase())}
                  placeholder="NOME COMPLETO"
                  placeholderTextColor={Colors.textMuted}
                  autoCapitalize="characters"
                  style={styles.input}
                />
              </Field>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <Field label="VALIDADE">
                    <TextInput
                      value={cardExpiry}
                      onChangeText={(v) => setCardExpiry(formatExpiry(v))}
                      placeholder="MM/AA"
                      placeholderTextColor={Colors.textMuted}
                      keyboardType="number-pad"
                      maxLength={5}
                      style={styles.input}
                    />
                  </Field>
                </View>
                <View style={{ flex: 1 }}>
                  <Field label="CVV">
                    <TextInput
                      value={cardCVV}
                      onChangeText={setCardCVV}
                      placeholder="123"
                      placeholderTextColor={Colors.textMuted}
                      keyboardType="number-pad"
                      maxLength={4}
                      secureTextEntry
                      style={styles.input}
                    />
                  </Field>
                </View>
              </View>
            </View>
          )}

          {method === 'subscription' && (
            <View style={styles.subCard}>
              <View style={styles.subBadge}>
                <Text style={styles.subBadgeText}>FIGHTLAB PASS</Text>
              </View>
              <Text style={styles.subTitle}>10 AULAS · 15% OFF</Text>
              <Text style={styles.subSub}>
                Use com qualquer professor da plataforma. Renovação mensal flexível.
              </Text>
              <View style={styles.subPriceRow}>
                <Text style={styles.subOldPrice}>R$ {trainer.pricePerHour * 10}</Text>
                <Text style={styles.subNewPrice}>R$ {subscriptionTotal}</Text>
                <Text style={styles.subInterval}>/MÊS</Text>
              </View>
              <View style={styles.subPerks}>
                <SubPerk icon="checkmark-circle" text="Cancelamento gratuito a qualquer momento" />
                <SubPerk icon="checkmark-circle" text="Aulas avulsas após o pacote com 5% off" />
                <SubPerk icon="checkmark-circle" text="Prioridade no agendamento" />
              </View>
            </View>
          )}

          <View style={styles.totalBox}>
            <Text style={styles.totalLabel}>TOTAL A PAGAR</Text>
            <Text style={styles.totalValue}>
              R${' '}
              {(method === 'subscription' ? subscriptionTotal : subtotal).toFixed(2)}
            </Text>
          </View>

          <View style={styles.secureBox}>
            <Ionicons name="shield-checkmark" size={14} color={Colors.textSecondary} />
            <Text style={styles.secureText}>
              Seus dados são protegidos com criptografia de ponta a ponta.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>

      <SafeAreaView edges={['bottom']} style={styles.cta}>
        <View style={styles.ctaInner}>
          <PrimaryButton
            label={method === 'pix' ? 'JÁ PAGUEI' : 'PAGAMENTO SEGURO'}
            iconLeft="lock-closed"
            onPress={handlePay}
            loading={loading}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

function MethodCard({
  active,
  onPress,
  icon,
  title,
  subtitle,
  badge,
}: {
  active: boolean;
  onPress: () => void;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  badge?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.method,
        active && styles.methodActive,
        pressed && { opacity: 0.92 },
      ]}
    >
      <View style={styles.methodIcon}>
        <Ionicons
          name={icon}
          size={20}
          color={active ? Colors.red : Colors.textPrimary}
        />
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={styles.methodTitle}>{title}</Text>
          {badge && (
            <View style={styles.methodBadge}>
              <Text style={styles.methodBadgeText}>{badge}</Text>
            </View>
          )}
        </View>
        <Text style={styles.methodSubtitle}>{subtitle}</Text>
      </View>
      <View style={[styles.radio, active && styles.radioActive]}>
        {active && <View style={styles.radioInner} />}
      </View>
    </Pressable>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.fieldWrap}>{children}</View>
    </View>
  );
}

function SubPerk({
  icon,
  text,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
}) {
  return (
    <View style={styles.perkRow}>
      <Ionicons name={icon} size={14} color={Colors.red} />
      <Text style={styles.perkText}>{text}</Text>
    </View>
  );
}

function formatCard(v: string) {
  return v
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ');
}

function formatExpiry(v: string) {
  const digits = v.replace(/\D/g, '').slice(0, 4);
  if (digits.length < 3) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
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
  headerTitle: {
    color: Colors.textPrimary,
    fontFamily: Fonts.display,
    fontSize: 22,
    letterSpacing: 1.6,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.screen,
    paddingVertical: 14,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.divider,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 8,
    backgroundColor: Colors.skeleton,
  },
  summaryName: {
    color: Colors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
  },
  summaryMeta: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyRegular,
    fontSize: 11,
    marginTop: 2,
  },
  summaryPrice: {
    color: Colors.red,
    fontFamily: Fonts.numbersBold,
    fontSize: 14,
    marginTop: 4,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1.6,
    paddingHorizontal: Spacing.screen,
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  method: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: 16,
    marginHorizontal: Spacing.screen,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.divider,
    gap: 14,
  },
  methodActive: {
    borderColor: Colors.red,
    backgroundColor: Colors.surfaceElevated,
  },
  methodIcon: {
    width: 42,
    height: 42,
    borderRadius: Radius.base,
    backgroundColor: Colors.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodTitle: {
    color: Colors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
  },
  methodSubtitle: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyRegular,
    fontSize: 11,
    marginTop: 2,
  },
  methodBadge: {
    backgroundColor: 'rgba(214,40,40,0.15)',
    paddingHorizontal: 6,
    height: 18,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodBadgeText: {
    color: Colors.red,
    fontFamily: Fonts.bodyBold,
    fontSize: 9,
    letterSpacing: 0.8,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: Colors.red,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.red,
  },
  pixCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: 22,
    marginHorizontal: Spacing.screen,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.divider,
    alignItems: 'center',
  },
  qrCodePlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: Colors.textPrimary,
    borderRadius: Radius.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pixTitle: {
    color: Colors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 15,
    marginTop: 18,
  },
  pixSubtitle: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyRegular,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  pixKeyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceHigh,
    borderRadius: Radius.base,
    padding: 12,
    marginTop: 14,
    width: '100%',
    gap: 10,
  },
  pixKey: {
    flex: 1,
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyMedium,
    fontSize: 11,
  },
  cardForm: {
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.md,
  },
  fieldLabel: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1.4,
    marginBottom: 6,
  },
  fieldWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderRadius: Radius.base,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    color: Colors.textPrimary,
    fontFamily: Fonts.bodyMedium,
    fontSize: 14,
    height: '100%',
  },
  subCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: 22,
    marginHorizontal: Spacing.screen,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.red,
  },
  subBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    height: 22,
    borderRadius: 4,
    backgroundColor: Colors.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subBadgeText: {
    color: Colors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1.2,
  },
  subTitle: {
    color: Colors.textPrimary,
    fontFamily: Fonts.display,
    fontSize: 28,
    letterSpacing: 1.2,
    marginTop: 12,
  },
  subSub: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyRegular,
    fontSize: 13,
    marginTop: 6,
    lineHeight: 19,
  },
  subPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 14,
    gap: 8,
  },
  subOldPrice: {
    color: Colors.textMuted,
    fontFamily: Fonts.bodyMedium,
    fontSize: 16,
    textDecorationLine: 'line-through',
  },
  subNewPrice: {
    color: Colors.red,
    fontFamily: Fonts.numbersBlack,
    fontSize: 32,
  },
  subInterval: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyMedium,
    fontSize: 11,
    letterSpacing: 1,
  },
  subPerks: {
    marginTop: 14,
    gap: 8,
  },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  perkText: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyRegular,
    fontSize: 12,
  },
  totalBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: Spacing.screen,
    marginTop: Spacing.lg,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.divider,
  },
  totalLabel: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1.6,
  },
  totalValue: {
    color: Colors.red,
    fontFamily: Fonts.numbersBlack,
    fontSize: 24,
  },
  secureBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.base,
    gap: 6,
  },
  secureText: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyRegular,
    fontSize: 11,
    textAlign: 'center',
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
