import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts, Radius, Spacing } from '../../constants';
import { useBookings } from '../../hooks/useBookings';
import { trainers } from '../../data';

export default function AgendaScreen() {
  const router = useRouter();
  const { bookings } = useBookings();

  const upcoming = bookings.filter((b) => b.status === 'confirmed' || b.status === 'pending');
  const past = bookings.filter((b) => b.status === 'completed' || b.status === 'cancelled');

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>AGENDA</Text>
        <Pressable hitSlop={12}>
          <Ionicons name="calendar-outline" size={22} color={Colors.textPrimary} />
        </Pressable>
      </View>

      <FlatList
        data={[...upcoming, ...past]}
        keyExtractor={(b) => b.id}
        contentContainerStyle={{ paddingHorizontal: Spacing.screen, paddingBottom: 32 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListHeaderComponent={
          <View style={styles.summary}>
            <SummaryItem label="CONFIRMADAS" value={String(upcoming.length)} accent />
            <View style={styles.sep} />
            <SummaryItem label="REALIZADAS" value={String(past.length)} />
            <View style={styles.sep} />
            <SummaryItem label="HORAS TOTAIS" value={String(bookings.length)} />
          </View>
        }
        renderItem={({ item, index }) => {
          const trainer = trainers.find((t) => t.id === item.trainerId);
          if (!trainer) return null;
          const isUpcoming = item.status === 'confirmed' || item.status === 'pending';

          return (
            <>
              {(index === 0 && isUpcoming) ||
              (index === upcoming.length && upcoming.length > 0) ? (
                <Text style={styles.sectionLabel}>
                  {isUpcoming ? 'PRÓXIMAS AULAS' : 'HISTÓRICO'}
                </Text>
              ) : null}
              {index === 0 && upcoming.length === 0 ? (
                <Text style={styles.sectionLabel}>HISTÓRICO</Text>
              ) : null}
              <Pressable
                onPress={() => router.push(`/trainer/${trainer.id}`)}
                style={({ pressed }) => [styles.card, pressed && { opacity: 0.92 }]}
              >
                <Image
                  source={{ uri: trainer.photo }}
                  style={styles.avatar}
                  contentFit="cover"
                />
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text style={styles.modality}>
                    {trainer.primaryModality.toUpperCase()}
                  </Text>
                  <Text numberOfLines={1} style={styles.name}>
                    {trainer.name}
                  </Text>
                  <View style={styles.metaRow}>
                    <Ionicons name="calendar" size={11} color={Colors.textSecondary} />
                    <Text style={styles.meta}> {formatDate(item.date)}</Text>
                    <Text style={styles.metaDot}>·</Text>
                    <Ionicons name="time" size={11} color={Colors.textSecondary} />
                    <Text style={styles.meta}> {item.time}</Text>
                  </View>
                </View>
                <View>
                  <View
                    style={[
                      styles.status,
                      item.status === 'confirmed' && styles.statusConfirmed,
                      item.status === 'completed' && styles.statusCompleted,
                      item.status === 'cancelled' && styles.statusCancelled,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        item.status === 'confirmed' && { color: Colors.red },
                      ]}
                    >
                      {labelFor(item.status)}
                    </Text>
                  </View>
                  <Text style={styles.price}>R$ {item.price}</Text>
                </View>
              </Pressable>
            </>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="calendar-outline" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>NADA AGENDADO</Text>
            <Text style={styles.emptyText}>
              Encontre o seu personal fight e agende sua primeira aula.
            </Text>
            <Pressable
              style={styles.emptyBtn}
              onPress={() => router.push('/(tabs)/search')}
            >
              <Text style={styles.emptyBtnText}>BUSCAR PROFESSORES</Text>
            </Pressable>
          </View>
        }
      />
    </SafeAreaView>
  );
}

function SummaryItem({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <View style={summaryStyles.item}>
      <Text style={[summaryStyles.value, accent && { color: Colors.red }]}>{value}</Text>
      <Text style={summaryStyles.label}>{label}</Text>
    </View>
  );
}

const labelFor = (status: string) => {
  if (status === 'confirmed') return 'CONFIRMADA';
  if (status === 'completed') return 'REALIZADA';
  if (status === 'cancelled') return 'CANCELADA';
  return 'PENDENTE';
};

const formatDate = (iso: string) => {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).toUpperCase();
};

const summaryStyles = StyleSheet.create({
  item: { flex: 1, alignItems: 'center' },
  value: {
    color: Colors.textPrimary,
    fontFamily: Fonts.numbersBlack,
    fontSize: 26,
  },
  label: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyMedium,
    fontSize: 10,
    letterSpacing: 1.2,
    marginTop: 2,
  },
});

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screen,
    height: 52,
  },
  title: {
    color: Colors.textPrimary,
    fontFamily: Fonts.display,
    fontSize: 28,
    letterSpacing: 1.5,
  },
  summary: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    paddingVertical: 18,
    marginVertical: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  sep: {
    width: 1,
    backgroundColor: Colors.divider,
    marginVertical: 6,
  },
  sectionLabel: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1.4,
    marginTop: 8,
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: Colors.skeleton,
  },
  modality: {
    color: Colors.red,
    fontFamily: Fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1.2,
  },
  name: {
    color: Colors.textPrimary,
    fontFamily: Fonts.display,
    fontSize: 16,
    letterSpacing: 0.6,
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  meta: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyRegular,
    fontSize: 11,
  },
  metaDot: {
    color: Colors.textMuted,
    fontFamily: Fonts.bodyRegular,
    fontSize: 11,
    marginHorizontal: 6,
  },
  status: {
    paddingHorizontal: 10,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    backgroundColor: Colors.surfaceHigh,
  },
  statusConfirmed: { backgroundColor: 'rgba(214,40,40,0.12)' },
  statusCompleted: { backgroundColor: 'rgba(34,197,94,0.12)' },
  statusCancelled: { backgroundColor: 'rgba(255,255,255,0.05)' },
  statusText: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyBold,
    fontSize: 9,
    letterSpacing: 1,
  },
  price: {
    color: Colors.textPrimary,
    fontFamily: Fonts.numbersBold,
    fontSize: 14,
    textAlign: 'right',
    marginTop: 6,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    color: Colors.textPrimary,
    fontFamily: Fonts.display,
    fontSize: 22,
    letterSpacing: 1.4,
    marginTop: 18,
  },
  emptyText: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyRegular,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  emptyBtn: {
    marginTop: 24,
    paddingHorizontal: 22,
    height: 44,
    borderRadius: Radius.base,
    backgroundColor: Colors.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyBtnText: {
    color: Colors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 1.4,
  },
});
