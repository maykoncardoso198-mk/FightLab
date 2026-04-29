import { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Pressable,
  TextInput,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts, Radius, Spacing } from '../../constants';
import { ModalityChip } from '../../components';
import { trainers } from '../../data/trainers';
import {
  mockAdminStats,
  mockStudents,
  mockStudent,
  mockAllBookings,
} from '../../data/user';
import { User, Booking } from '../../data/types';

type AdminTab = 'overview' | 'trainers' | 'students' | 'bookings';

const TABS: { key: AdminTab; label: string }[] = [
  { key: 'overview', label: 'VISÃO GERAL' },
  { key: 'trainers', label: 'PROFESSORES' },
  { key: 'students', label: 'ALUNOS' },
  { key: 'bookings', label: 'AGENDAMENTOS' },
];

const allStudents: User[] = [mockStudent, ...mockStudents];

export default function AdminScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerEyebrow}>ÁREA ADMIN</Text>
          <Text style={styles.headerBrand}>
            FIGHT<Text style={{ color: Colors.red }}>LAB</Text>
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Tab chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsRow}
        style={styles.tabsScroll}
      >
        {TABS.map((t) => (
          <Pressable
            key={t.key}
            onPress={() => setActiveTab(t.key)}
            style={[styles.tabChip, activeTab === t.key && styles.tabChipActive]}
          >
            <Text style={[styles.tabLabel, activeTab === t.key && styles.tabLabelActive]}>
              {t.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Content */}
      {activeTab === 'overview' && <OverviewSection />}
      {activeTab === 'trainers' && <TrainersSection router={router} />}
      {activeTab === 'students' && <StudentsSection />}
      {activeTab === 'bookings' && <BookingsSection />}
    </SafeAreaView>
  );
}

// ─── Overview ────────────────────────────────────────────────────────────────

function OverviewSection() {
  const stats = mockAdminStats;
  const maxBooking = Math.max(...stats.weeklyBookings);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.sectionContent}
    >
      <Text style={styles.sectionEyebrow}>RESUMO DA PLATAFORMA</Text>
      <Text style={styles.sectionTitle}>MÉTRICAS GERAIS</Text>

      {/* KPI Grid */}
      <View style={styles.kpiGrid}>
        <View style={styles.kpiRow}>
          <KpiCard label="ALUNOS" value={String(stats.totalStudents)} icon="people-outline" />
          <KpiCard label="PROFESSORES" value={String(stats.activeTrainers)} icon="barbell-outline" />
        </View>
        <View style={styles.kpiRow}>
          <KpiCard label="AGENDAMENTOS" value={String(stats.totalBookings)} icon="calendar-outline" />
          <KpiCard
            label="RECEITA MÊS"
            value={`R$ ${stats.monthlyRevenue.toLocaleString('pt-BR')}`}
            icon="cash-outline"
            small
          />
        </View>
      </View>

      {/* Weekly bookings chart */}
      <Text style={[styles.sectionEyebrow, { marginTop: Spacing.xl }]}>AGENDAMENTOS</Text>
      <Text style={styles.sectionTitle}>ESTA SEMANA</Text>

      <View style={styles.chartCard}>
        <View style={styles.chartArea}>
          {stats.weeklyBookings.map((v, i) => {
            const h = maxBooking > 0 ? Math.max((v / maxBooking) * 90, 6) : 6;
            return (
              <View key={i} style={styles.chartCol}>
                <Text style={styles.chartValLabel}>{v}</Text>
                <View style={[styles.chartBar, { height: h }]} />
              </View>
            );
          })}
        </View>
        <View style={styles.chartXRow}>
          {stats.weekDays.map((d) => (
            <Text key={d} style={styles.chartXLabel}>{d}</Text>
          ))}
        </View>
      </View>

      {/* Top modalities */}
      <Text style={[styles.sectionEyebrow, { marginTop: Spacing.xl }]}>MODALIDADES</Text>
      <Text style={styles.sectionTitle}>TOP 3</Text>

      <View style={styles.modalitiesCard}>
        {stats.topModalities.map((m, i) => {
          const pct = m.count / stats.topModalities[0].count;
          return (
            <View key={m.modality} style={i < 2 ? { marginBottom: 20 } : undefined}>
              <View style={styles.modalityRow}>
                <View style={styles.modalityLeft}>
                  <Text style={styles.medalText}>{['🥇', '🥈', '🥉'][i]}</Text>
                  <Text style={styles.modalityName}>{m.modality.toUpperCase()}</Text>
                </View>
                <Text style={styles.modalityCount}>{m.count} aulas</Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${pct * 100}%` as any }]} />
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

function KpiCard({
  label,
  value,
  icon,
  small,
}: {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  small?: boolean;
}) {
  return (
    <View style={styles.kpiCard}>
      <View style={styles.kpiIconWrap}>
        <Ionicons name={icon} size={18} color={Colors.red} />
      </View>
      <Text style={[styles.kpiValue, small && { fontSize: 20 }]}>{value}</Text>
      <Text style={styles.kpiLabel}>{label}</Text>
    </View>
  );
}

// ─── Trainers ─────────────────────────────────────────────────────────────────

function TrainersSection({ router }: { router: ReturnType<typeof useRouter> }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return trainers;
    const q = query.toLowerCase();
    return trainers.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.primaryModality.toLowerCase().includes(q) ||
        t.city.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color={Colors.textSecondary} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Buscar professor, modalidade ou cidade..."
          placeholderTextColor={Colors.textMuted}
          style={styles.searchInput}
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery('')} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
          </Pressable>
        )}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(t) => t.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/trainer/${item.id}`)}
            style={({ pressed }) => [styles.trainerRow, pressed && { opacity: 0.88 }]}
          >
            <Image source={{ uri: item.photo }} style={styles.trainerAvatar} contentFit="cover" />
            <View style={{ flex: 1 }}>
              <Text style={styles.trainerModality}>{item.primaryModality.toUpperCase()}</Text>
              <Text numberOfLines={1} style={styles.trainerName}>{item.name}</Text>
              <View style={styles.trainerMetaRow}>
                <Ionicons name="location" size={10} color={Colors.textSecondary} />
                <Text style={styles.trainerCity}> {item.city}</Text>
              </View>
              <View style={styles.trainerStatsRow}>
                <Ionicons name="star" size={11} color={Colors.star} />
                <Text style={styles.trainerStat}> {item.rating.toFixed(1)}</Text>
                <Text style={styles.trainerDot}>·</Text>
                <Text style={styles.trainerStat}>{item.totalLessons} aulas</Text>
                <Text style={styles.trainerDot}>·</Text>
                <Text style={styles.trainerStat}>R$ {item.pricePerHour}/h</Text>
              </View>
            </View>
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>ATIVO</Text>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="search" size={32} color={Colors.textMuted} />
            <Text style={styles.emptyText}>Nenhum professor encontrado</Text>
          </View>
        }
      />
    </View>
  );
}

// ─── Students ─────────────────────────────────────────────────────────────────

function StudentsSection() {
  return (
    <FlatList
      data={allStudents}
      keyExtractor={(s) => s.id}
      contentContainerStyle={styles.listContent}
      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      ListHeaderComponent={
        <Text style={styles.listCount}>{allStudents.length} ALUNOS CADASTRADOS</Text>
      }
      renderItem={({ item }) => {
        const studentBookings = mockAllBookings.filter((b) => b.studentId === item.id);
        const totalSpent = studentBookings
          .filter((b) => b.status === 'completed')
          .reduce((acc, b) => acc + b.price, 0);

        return (
          <View style={styles.studentRow}>
            <Image source={{ uri: item.photo }} style={styles.studentAvatar} contentFit="cover" />
            <View style={{ flex: 1 }}>
              <Text style={styles.studentName}>{item.name}</Text>
              <View style={styles.studentCityRow}>
                <Ionicons name="location" size={11} color={Colors.textSecondary} />
                <Text style={styles.studentCity}> {item.city}</Text>
              </View>
            </View>
            <View style={{ alignItems: 'flex-end', gap: 4 }}>
              <Text style={styles.studentStat}>{studentBookings.length} aulas</Text>
              <Text style={styles.studentSpent}>R$ {totalSpent}</Text>
            </View>
          </View>
        );
      }}
    />
  );
}

// ─── Bookings ─────────────────────────────────────────────────────────────────

type StatusFilter = 'all' | 'confirmed' | 'completed' | 'cancelled';

const STATUS_FILTERS: { key: StatusFilter; label: string }[] = [
  { key: 'all', label: 'TODOS' },
  { key: 'confirmed', label: 'CONFIRMADOS' },
  { key: 'completed', label: 'REALIZADOS' },
  { key: 'cancelled', label: 'CANCELADOS' },
];

function BookingsSection() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const filtered = useMemo(
    () =>
      statusFilter === 'all'
        ? mockAllBookings
        : mockAllBookings.filter((b) => b.status === statusFilter),
    [statusFilter]
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
        style={styles.filterScroll}
      >
        {STATUS_FILTERS.map((f) => (
          <ModalityChip
            key={f.key}
            label={f.label}
            size="sm"
            active={statusFilter === f.key}
            onPress={() => setStatusFilter(f.key)}
          />
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={(b) => b.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListHeaderComponent={
          <Text style={styles.listCount}>{filtered.length} AGENDAMENTOS</Text>
        }
        renderItem={({ item }) => <BookingRow booking={item} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="calendar-outline" size={32} color={Colors.textMuted} />
            <Text style={styles.emptyText}>Nenhum agendamento encontrado</Text>
          </View>
        }
      />
    </View>
  );
}

function BookingRow({ booking }: { booking: Booking }) {
  const trainer = trainers.find((t) => t.id === booking.trainerId);
  const student = allStudents.find((s) => s.id === booking.studentId);
  if (!trainer) return null;

  return (
    <View style={styles.bookingRow}>
      <Image source={{ uri: trainer.photo }} style={styles.bookingAvatar} contentFit="cover" />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.bookingModality}>{trainer.primaryModality.toUpperCase()}</Text>
        <Text numberOfLines={1} style={styles.bookingTrainer}>{trainer.name}</Text>
        <View style={styles.bookingStudentRow}>
          <Ionicons name="person-outline" size={10} color={Colors.textSecondary} />
          <Text style={styles.bookingStudent}> {student?.name ?? '—'}</Text>
        </View>
        <View style={styles.bookingMetaRow}>
          <Ionicons name="calendar" size={10} color={Colors.textSecondary} />
          <Text style={styles.bookingMeta}> {formatDate(booking.date)}</Text>
          <Text style={styles.bookingDot}>·</Text>
          <Ionicons name="time" size={10} color={Colors.textSecondary} />
          <Text style={styles.bookingMeta}> {booking.time}</Text>
        </View>
      </View>
      <View style={{ alignItems: 'flex-end', gap: 6 }}>
        <View style={[styles.statusBadge, statusBadgeStyle(booking.status)]}>
          <Text style={[styles.statusText, statusTextColor(booking.status)]}>
            {labelFor(booking.status)}
          </Text>
        </View>
        <Text style={styles.bookingPrice}>R$ {booking.price}</Text>
      </View>
    </View>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (iso: string) => {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).toUpperCase();
};

const labelFor = (status: string) => {
  if (status === 'confirmed') return 'CONFIRMADO';
  if (status === 'completed') return 'REALIZADO';
  if (status === 'cancelled') return 'CANCELADO';
  return 'PENDENTE';
};

const statusBadgeStyle = (status: string) => {
  if (status === 'confirmed') return { backgroundColor: 'rgba(214,40,40,0.12)' };
  if (status === 'completed') return { backgroundColor: 'rgba(34,197,94,0.12)' };
  if (status === 'cancelled') return { backgroundColor: 'rgba(255,255,255,0.05)' };
  return {};
};

const statusTextColor = (status: string) => {
  if (status === 'confirmed') return { color: Colors.red };
  if (status === 'completed') return { color: Colors.success };
  return {};
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.screen,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerEyebrow: {
    color: Colors.red,
    fontFamily: Fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1.8,
  },
  headerBrand: {
    color: Colors.textPrimary,
    fontFamily: Fonts.display,
    fontSize: 20,
    letterSpacing: 2,
  },

  // Tab chips
  tabsScroll: { flexGrow: 0, borderBottomWidth: 1, borderBottomColor: Colors.divider },
  tabsRow: { paddingHorizontal: Spacing.screen, paddingVertical: 12, gap: 8 },
  tabChip: {
    paddingHorizontal: 16,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabChipActive: { backgroundColor: Colors.red, borderColor: Colors.red },
  tabLabel: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1.2,
  },
  tabLabelActive: { color: Colors.textPrimary },

  // Section shared
  sectionContent: { paddingHorizontal: Spacing.screen, paddingTop: Spacing.lg, paddingBottom: 32 },
  sectionEyebrow: {
    color: Colors.red,
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1.6,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontFamily: Fonts.display,
    fontSize: 22,
    letterSpacing: 1,
    marginTop: 2,
    marginBottom: Spacing.base,
  },

  // KPI
  kpiGrid: { gap: 10 },
  kpiRow: { flexDirection: 'row', gap: 10 },
  kpiCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  kpiIconWrap: {
    width: 34,
    height: 34,
    borderRadius: Radius.base,
    backgroundColor: Colors.redSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  kpiValue: {
    color: Colors.textPrimary,
    fontFamily: Fonts.numbersBlack,
    fontSize: 28,
    letterSpacing: 0.5,
  },
  kpiLabel: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyMedium,
    fontSize: 10,
    letterSpacing: 1.2,
    marginTop: 4,
  },

  // Chart
  chartCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  chartArea: {
    height: 110,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
  },
  chartCol: { flex: 1, alignItems: 'center', gap: 4 },
  chartValLabel: {
    color: Colors.textMuted,
    fontFamily: Fonts.bodyMedium,
    fontSize: 10,
  },
  chartBar: {
    width: '100%',
    backgroundColor: Colors.red,
    borderRadius: 3,
    minHeight: 6,
  },
  chartXRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 6,
  },
  chartXLabel: {
    flex: 1,
    textAlign: 'center',
    color: Colors.textMuted,
    fontFamily: Fonts.bodyMedium,
    fontSize: 9,
    letterSpacing: 0.8,
  },

  // Modalities
  modalitiesCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  modalityRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  modalityLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  medalText: { fontSize: 16 },
  modalityName: {
    color: Colors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 13,
    letterSpacing: 0.8,
  },
  modalityCount: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyMedium,
    fontSize: 12,
  },
  progressTrack: {
    height: 4,
    backgroundColor: Colors.surfaceHigh,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: { height: 4, backgroundColor: Colors.red, borderRadius: 2 },

  // Search bar
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: Spacing.screen,
    marginBottom: 4,
    height: 46,
    borderRadius: Radius.base,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
  },
  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontFamily: Fonts.bodyRegular,
    fontSize: 14,
    marginLeft: 10,
    height: '100%',
  },

  // List shared
  listContent: { paddingHorizontal: Spacing.screen, paddingBottom: 32, paddingTop: 4 },
  listCount: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1.4,
    marginBottom: 12,
    marginTop: 8,
  },

  // Trainer row
  trainerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.divider,
    gap: 12,
  },
  trainerAvatar: { width: 56, height: 56, borderRadius: 8, backgroundColor: Colors.skeleton },
  trainerModality: {
    color: Colors.red,
    fontFamily: Fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1.2,
  },
  trainerName: {
    color: Colors.textPrimary,
    fontFamily: Fonts.display,
    fontSize: 16,
    letterSpacing: 0.6,
    marginTop: 2,
  },
  trainerMetaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  trainerCity: { color: Colors.textSecondary, fontFamily: Fonts.bodyRegular, fontSize: 11 },
  trainerStatsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 3 },
  trainerStat: { color: Colors.textSecondary, fontFamily: Fonts.bodyRegular, fontSize: 11 },
  trainerDot: { color: Colors.textMuted, fontSize: 11 },
  activeBadge: {
    paddingHorizontal: 10,
    height: 22,
    backgroundColor: 'rgba(34,197,94,0.12)',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeBadgeText: {
    color: Colors.success,
    fontFamily: Fonts.bodyBold,
    fontSize: 9,
    letterSpacing: 1,
  },

  // Student row
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.divider,
    gap: 12,
  },
  studentAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.skeleton },
  studentName: { color: Colors.textPrimary, fontFamily: Fonts.bodyBold, fontSize: 14 },
  studentCityRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  studentCity: { color: Colors.textSecondary, fontFamily: Fonts.bodyRegular, fontSize: 12 },
  studentStat: { color: Colors.textSecondary, fontFamily: Fonts.bodyMedium, fontSize: 12 },
  studentSpent: { color: Colors.textPrimary, fontFamily: Fonts.numbersBold, fontSize: 14 },

  // Filter row (bookings)
  filterScroll: { flexGrow: 0 },
  filterRow: { paddingHorizontal: Spacing.screen, paddingVertical: 12, gap: 8 },

  // Booking row
  bookingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  bookingAvatar: { width: 52, height: 52, borderRadius: 8, backgroundColor: Colors.skeleton },
  bookingModality: {
    color: Colors.red,
    fontFamily: Fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1.2,
  },
  bookingTrainer: {
    color: Colors.textPrimary,
    fontFamily: Fonts.display,
    fontSize: 15,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  bookingStudentRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  bookingStudent: { color: Colors.textSecondary, fontFamily: Fonts.bodyRegular, fontSize: 11 },
  bookingMetaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  bookingMeta: { color: Colors.textSecondary, fontFamily: Fonts.bodyRegular, fontSize: 11 },
  bookingDot: { color: Colors.textMuted, marginHorizontal: 5 },
  statusBadge: {
    paddingHorizontal: 10,
    height: 22,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceHigh,
  },
  statusText: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyBold,
    fontSize: 9,
    letterSpacing: 1,
  },
  bookingPrice: {
    color: Colors.textPrimary,
    fontFamily: Fonts.numbersBold,
    fontSize: 14,
  },

  // Empty state
  empty: { alignItems: 'center', paddingVertical: 48 },
  emptyText: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyMedium,
    fontSize: 14,
    marginTop: 12,
  },
});
