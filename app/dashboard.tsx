import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts, Radius, Spacing } from '../constants';
import { PrimaryButton } from '../components';
import { useAuth } from '../hooks/useAuth';
import { mockTeacherStats, mockTrainerUser } from '../data';

export default function DashboardScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const profile = user || mockTrainerUser;

  const stats = mockTeacherStats;
  const maxRevenue = Math.max(...stats.weeklyRevenue);

  const handleLogout = async () => {
    await signOut();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greetingEyebrow}>BEM-VINDO DE VOLTA</Text>
            <Text style={styles.greeting}>OLÁ, {profile.name.split(' ')[0].toUpperCase()}</Text>
          </View>
          <Pressable hitSlop={12} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color={Colors.textPrimary} />
          </Pressable>
          <Pressable hitSlop={12} style={{ marginLeft: 14 }}>
            <Ionicons name="notifications-outline" size={22} color={Colors.textPrimary} />
            <View style={styles.dot} />
          </Pressable>
        </View>

        <View style={styles.metricsGrid}>
          <MetricCard
            label="FATURAMENTO MÊS"
            value={`R$ ${stats.monthRevenue.toLocaleString('pt-BR')}`}
            trend="+12%"
            big
          />
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <MetricCard
              label="AULAS"
              value={String(stats.totalLessonsThisMonth)}
              trend="+8"
            />
            <MetricCard
              label="AVALIAÇÃO"
              value={stats.averageRating.toFixed(1)}
              trend="↑ 0.1"
              suffix="★"
            />
          </View>
        </View>

        <View style={styles.nextLessonWrap}>
          <View style={styles.nextLessonHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={styles.liveDot} />
              <Text style={styles.nextLessonEyebrow}>PRÓXIMA AULA</Text>
            </View>
            <View style={styles.timer}>
              <Ionicons name="time" size={11} color={Colors.red} />
              <Text style={styles.timerText}>EM 02:14</Text>
            </View>
          </View>

          <View style={styles.nextLessonBody}>
            <View style={styles.nextLessonAvatar}>
              <Ionicons name="person" size={24} color={Colors.textPrimary} />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.nextLessonName}>PEDRO ROCHA</Text>
              <Text style={styles.nextLessonMeta}>Kickboxing · 18:00 · 60 min</Text>
            </View>
            <Pressable style={styles.chatBtn}>
              <Ionicons name="chatbubble-ellipses" size={16} color={Colors.textPrimary} />
            </Pressable>
          </View>
        </View>

        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>FATURAMENTO SEMANAL</Text>
            <Text style={styles.sectionTotal}>R$ {stats.weeklyRevenue.reduce((a, b) => a + b, 0).toLocaleString('pt-BR')}</Text>
          </View>

          <View style={styles.chartCard}>
            <View style={styles.chartArea}>
              {stats.weeklyRevenue.map((v, i) => {
                const h = (v / maxRevenue) * 110;
                return (
                  <View key={i} style={styles.chartCol}>
                    <View style={styles.chartLabelTop}>
                      <Text style={styles.chartLabelTopText}>{v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}</Text>
                    </View>
                    <View style={[styles.chartBar, { height: h }]} />
                  </View>
                );
              })}
            </View>
            <View style={styles.chartXLabels}>
              {stats.weekDays.map((d) => (
                <Text key={d} style={styles.chartXLabel}>
                  {d}
                </Text>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>AULAS DE HOJE</Text>
            <Pressable hitSlop={8}>
              <Text style={styles.sectionLink}>VER AGENDA</Text>
            </Pressable>
          </View>

          <View style={styles.lessonsList}>
            {stats.todayLessons.map((l, i) => (
              <View
                key={i}
                style={[
                  styles.lessonRow,
                  l.status === 'next' && styles.lessonRowNext,
                ]}
              >
                <View style={styles.lessonTimeWrap}>
                  <Text
                    style={[
                      styles.lessonTime,
                      l.status === 'next' && { color: Colors.red },
                      l.status === 'completed' && { color: Colors.textMuted },
                    ]}
                  >
                    {l.time}
                  </Text>
                  <View
                    style={[
                      styles.lessonStatusDot,
                      l.status === 'next' && { backgroundColor: Colors.red },
                      l.status === 'completed' && { backgroundColor: Colors.success },
                    ]}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.lessonStudent,
                      l.status === 'completed' && { color: Colors.textSecondary },
                    ]}
                  >
                    {l.studentName}
                  </Text>
                  <Text style={styles.lessonModality}>{l.modality}</Text>
                </View>
                <Text
                  style={[
                    styles.lessonBadge,
                    l.status === 'next' && { color: Colors.red },
                    l.status === 'completed' && { color: Colors.success },
                  ]}
                >
                  {labelFor(l.status)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.quickActions}>
          <PrimaryButton
            label="EDITAR DISPONIBILIDADE"
            iconLeft="calendar"
            onPress={() => {}}
          />
          <View style={{ height: 10 }} />
          <PrimaryButton
            label="EDITAR PERFIL"
            iconLeft="create"
            variant="outline"
            onPress={() => {}}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MetricCard({
  label,
  value,
  trend,
  suffix,
  big,
}: {
  label: string;
  value: string;
  trend?: string;
  suffix?: string;
  big?: boolean;
}) {
  return (
    <View style={[styles.metricCard, big && styles.metricCardBig]}>
      <Text style={styles.metricLabel}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 6 }}>
        <Text style={[styles.metricValue, big && { fontSize: 32 }]}>{value}</Text>
        {suffix && <Text style={styles.metricSuffix}> {suffix}</Text>}
      </View>
      {trend && (
        <View style={styles.trendBadge}>
          <Ionicons name="trending-up" size={11} color={Colors.red} />
          <Text style={styles.trendText}>{trend}</Text>
        </View>
      )}
    </View>
  );
}

const labelFor = (s: string) => {
  if (s === 'completed') return 'CONCLUÍDA';
  if (s === 'next') return 'PRÓXIMA';
  return 'AGENDADA';
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.screen,
    paddingVertical: 14,
  },
  greetingEyebrow: {
    color: Colors.red,
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1.6,
  },
  greeting: {
    color: Colors.textPrimary,
    fontFamily: Fonts.display,
    fontSize: 28,
    letterSpacing: 1.2,
    marginTop: 4,
  },
  dot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.red,
  },
  metricsGrid: {
    paddingHorizontal: Spacing.screen,
    gap: 10,
    marginTop: 8,
  },
  metricCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  metricCardBig: {
    paddingVertical: 22,
  },
  metricLabel: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1.4,
  },
  metricValue: {
    color: Colors.textPrimary,
    fontFamily: Fonts.numbersBlack,
    fontSize: 22,
  },
  metricSuffix: {
    color: Colors.star,
    fontFamily: Fonts.numbersBold,
    fontSize: 16,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: 'rgba(214,40,40,0.12)',
    borderRadius: 4,
  },
  trendText: {
    color: Colors.red,
    fontFamily: Fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 0.6,
  },
  nextLessonWrap: {
    marginHorizontal: Spacing.screen,
    marginTop: Spacing.base,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.red,
  },
  nextLessonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: 'rgba(214,40,40,0.08)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(214,40,40,0.2)',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.red,
  },
  nextLessonEyebrow: {
    color: Colors.red,
    fontFamily: Fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1.4,
  },
  timer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timerText: {
    color: Colors.red,
    fontFamily: Fonts.numbersBold,
    fontSize: 11,
    letterSpacing: 0.8,
  },
  nextLessonBody: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  nextLessonAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextLessonName: {
    color: Colors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 15,
    letterSpacing: 0.8,
  },
  nextLessonMeta: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyRegular,
    fontSize: 12,
    marginTop: 2,
  },
  chatBtn: {
    width: 42,
    height: 42,
    borderRadius: Radius.base,
    backgroundColor: Colors.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionBlock: {
    marginTop: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screen,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontFamily: Fonts.display,
    fontSize: 20,
    letterSpacing: 1,
  },
  sectionTotal: {
    color: Colors.red,
    fontFamily: Fonts.numbersBold,
    fontSize: 16,
  },
  sectionLink: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1.2,
  },
  chartCard: {
    marginHorizontal: Spacing.screen,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  chartArea: {
    height: 140,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
  },
  chartCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  chartLabelTop: {
    marginBottom: 4,
  },
  chartLabelTopText: {
    color: Colors.textSecondary,
    fontFamily: Fonts.numbersBold,
    fontSize: 9,
  },
  chartBar: {
    width: '70%',
    backgroundColor: Colors.red,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  chartXLabels: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 6,
  },
  chartXLabel: {
    flex: 1,
    textAlign: 'center',
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyMedium,
    fontSize: 10,
    letterSpacing: 0.8,
  },
  lessonsList: {
    marginHorizontal: Spacing.screen,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.divider,
    overflow: 'hidden',
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  lessonRowNext: {
    backgroundColor: 'rgba(214,40,40,0.06)',
  },
  lessonTimeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 86,
    gap: 8,
  },
  lessonTime: {
    color: Colors.textPrimary,
    fontFamily: Fonts.numbersBold,
    fontSize: 16,
  },
  lessonStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.textMuted,
  },
  lessonStudent: {
    color: Colors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
  },
  lessonModality: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyRegular,
    fontSize: 11,
    marginTop: 2,
  },
  lessonBadge: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1.2,
  },
  quickActions: {
    paddingHorizontal: Spacing.screen,
    marginTop: Spacing['2xl'],
  },
});
