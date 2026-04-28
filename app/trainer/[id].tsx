import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Colors, Fonts, Radius, Spacing } from '../../constants';
import {
  PrimaryButton,
  ScheduleCalendar,
  StarRating,
  RatingChart,
} from '../../components';
import { useTrainerById } from '../../hooks/useTrainers';
import { useAuth } from '../../hooks/useAuth';

const { width } = Dimensions.get('window');
const HERO_HEIGHT = Math.min(width * 1.15, 480);

type Tab = 'overview' | 'agenda' | 'reviews';

export default function TrainerDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const trainer = useTrainerById(id);
  const { user, toggleFavorite } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);

  if (!trainer) {
    return (
      <View style={[styles.root, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ color: Colors.textPrimary, fontFamily: Fonts.bodyBold }}>
          Professor não encontrado
        </Text>
      </View>
    );
  }

  const isFav = user?.favoriteTrainerIds.includes(trainer.id);

  const handleFav = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    toggleFavorite(trainer.id);
  };

  const goBook = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    router.push(`/booking/${trainer.id}`);
  };

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View style={styles.heroWrap}>
          <Image
            source={{ uri: trainer.heroPhoto }}
            style={StyleSheet.absoluteFillObject}
            contentFit="cover"
          />
          <LinearGradient
            colors={['rgba(10,10,10,0.5)', 'transparent', 'rgba(10,10,10,0.4)', '#0A0A0A']}
            locations={[0, 0.25, 0.7, 1]}
            style={StyleSheet.absoluteFillObject}
          />

          <SafeAreaView edges={['top']} style={styles.heroTop}>
            <Pressable onPress={() => router.back()} style={styles.heroBtn}>
              <Ionicons name="chevron-back" size={22} color={Colors.textPrimary} />
            </Pressable>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Pressable onPress={handleFav} style={styles.heroBtn}>
                <Ionicons
                  name={isFav ? 'heart' : 'heart-outline'}
                  size={20}
                  color={isFav ? Colors.red : Colors.textPrimary}
                />
              </Pressable>
              <Pressable style={styles.heroBtn}>
                <Ionicons name="share-outline" size={20} color={Colors.textPrimary} />
              </Pressable>
            </View>
          </SafeAreaView>

          <View style={styles.heroBottom}>
            <Text style={styles.modalityTag}>{trainer.primaryModality.toUpperCase()}</Text>
            <Text style={styles.heroName}>{trainer.name}</Text>
            <View style={styles.heroMeta}>
              <Ionicons name="location" size={12} color={Colors.textSecondary} />
              <Text style={styles.heroMetaText}>
                {' '}
                {trainer.neighborhood}, {trainer.city}
              </Text>
              <Text style={styles.dot}>·</Text>
              <StarRating rating={trainer.rating} size={12} compact />
              <Text style={styles.dot}>·</Text>
              <Text style={styles.heroMetaText}>{trainer.totalLessons} aulas</Text>
            </View>
          </View>
        </View>

        <View style={styles.priceBar}>
          <View>
            <Text style={styles.priceEyebrow}>VALOR POR AULA</Text>
            <Text style={styles.price}>
              R$ {trainer.pricePerHour}
              <Text style={styles.priceUnit}>/h</Text>
            </Text>
          </View>
          <View style={styles.availability}>
            <View style={styles.dotLive} />
            <Text style={styles.availabilityText}>{trainer.nextAvailable}</Text>
          </View>
        </View>

        <View style={styles.tabs}>
          {(['overview', 'agenda', 'reviews'] as Tab[]).map((t) => (
            <Pressable
              key={t}
              onPress={() => {
                if (Platform.OS !== 'web') {
                  Haptics.selectionAsync();
                }
                setActiveTab(t);
              }}
              style={styles.tab}
            >
              <Text style={[styles.tabText, activeTab === t && styles.tabTextActive]}>
                {tabLabel(t)}
              </Text>
              {activeTab === t && <View style={styles.tabIndicator} />}
            </Pressable>
          ))}
        </View>

        {activeTab === 'overview' && (
          <View style={styles.section}>
            <View style={styles.gridWrap}>
              <GridItem label="MODALIDADES" value={trainer.modalities.join(' · ')} />
              <GridItem label="EXPERIÊNCIA" value={`${trainer.experienceYears} anos`} />
              <GridItem label="GRADUAÇÃO" value={trainer.graduation} fullWidth />
              <GridItem label="CIDADE" value={trainer.city} />
              <GridItem label="DISTÂNCIA" value={`${trainer.distanceKm.toFixed(1)} km`} />
            </View>

            <View style={styles.chartCard}>
              <View style={styles.chartHeader}>
                <View>
                  <Text style={styles.chartEyebrow}>HISTÓRICO DE AVALIAÇÃO</Text>
                  <Text style={styles.chartValue}>
                    {trainer.rating.toFixed(1)} <Text style={styles.chartUnit}>★</Text>
                  </Text>
                </View>
                <View style={styles.chartTrend}>
                  <Ionicons name="trending-up" size={14} color={Colors.red} />
                  <Text style={styles.chartTrendText}>+0.4 EM 6 MESES</Text>
                </View>
              </View>
              <RatingChart data={trainer.ratingHistory} />
            </View>

            <Text style={styles.aboutTitle}>SOBRE</Text>
            <Text style={styles.bio}>{trainer.bio}</Text>
          </View>
        )}

        {activeTab === 'agenda' && (
          <View style={[styles.section, { paddingHorizontal: 0 }]}>
            <Text style={[styles.aboutTitle, { paddingHorizontal: Spacing.screen }]}>
              SELECIONE UM HORÁRIO
            </Text>
            <ScheduleCalendar
              schedule={trainer.schedule}
              selectedDate={selectedDate || trainer.schedule[0].date}
              selectedTime={selectedTime}
              onSelectDate={setSelectedDate}
              onSelectSlot={(d, t) => {
                if (Platform.OS !== 'web') {
                  Haptics.selectionAsync();
                }
                setSelectedDate(d);
                setSelectedTime(t);
              }}
            />
            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendBox, { backgroundColor: Colors.redSoft, borderColor: Colors.red }]} />
                <Text style={styles.legendText}>Disponível</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendBox, { backgroundColor: Colors.surface, borderColor: Colors.divider }]} />
                <Text style={styles.legendText}>Indisponível</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendBox, { backgroundColor: Colors.red, borderColor: Colors.red }]} />
                <Text style={styles.legendText}>Selecionado</Text>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'reviews' && (
          <View style={styles.section}>
            <View style={styles.reviewsSummary}>
              <View>
                <Text style={styles.bigRating}>{trainer.rating.toFixed(1)}</Text>
                <StarRating rating={trainer.rating} showValue={false} size={14} />
                <Text style={styles.reviewCount}>{trainer.reviews.length} avaliações</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 24 }}>
                {[5, 4, 3, 2, 1].map((s) => {
                  const count = trainer.reviews.filter((r) => Math.round(r.rating) === s).length;
                  const total = trainer.reviews.length || 1;
                  const pct = (count / total) * 100;
                  return (
                    <View key={s} style={styles.barRow}>
                      <Text style={styles.barLabel}>{s}</Text>
                      <View style={styles.barTrack}>
                        <View style={[styles.barFill, { width: `${pct}%` }]} />
                      </View>
                      <Text style={styles.barCount}>{count}</Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {trainer.reviews.map((r) => (
              <View key={r.id} style={styles.reviewItem}>
                <Image source={{ uri: r.studentPhoto }} style={styles.reviewAvatar} />
                <View style={{ flex: 1 }}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewName}>{r.studentName}</Text>
                    <Text style={styles.reviewDate}>{r.date}</Text>
                  </View>
                  <StarRating rating={r.rating} size={11} showValue={false} />
                  <Text style={styles.reviewComment}>{r.comment}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.cta}>
        <View style={styles.ctaInner}>
          <PrimaryButton label="AGENDAR AULA" iconRight="arrow-forward" onPress={goBook} />
        </View>
      </SafeAreaView>
    </View>
  );
}

function tabLabel(t: Tab): string {
  if (t === 'overview') return 'OVERVIEW';
  if (t === 'agenda') return 'AGENDA';
  return 'AVALIAÇÕES';
}

function GridItem({
  label,
  value,
  fullWidth,
}: {
  label: string;
  value: string;
  fullWidth?: boolean;
}) {
  return (
    <View style={[gridStyles.item, fullWidth && { flexBasis: '100%' }]}>
      <Text style={gridStyles.label}>{label}</Text>
      <Text style={gridStyles.value}>{value}</Text>
    </View>
  );
}

const gridStyles = StyleSheet.create({
  item: {
    flexBasis: '48%',
    backgroundColor: Colors.surface,
    borderRadius: Radius.base,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  label: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1.4,
  },
  value: {
    color: Colors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
    marginTop: 6,
  },
});

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  heroWrap: {
    height: HERO_HEIGHT,
    backgroundColor: Colors.surface,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screen,
  },
  heroBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 24,
    paddingHorizontal: Spacing.screen,
  },
  modalityTag: {
    color: Colors.red,
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 2,
    marginBottom: 8,
  },
  heroName: {
    color: Colors.textPrimary,
    fontFamily: Fonts.display,
    fontSize: 44,
    lineHeight: 46,
    letterSpacing: 1.5,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    flexWrap: 'wrap',
  },
  heroMetaText: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyRegular,
    fontSize: 12,
  },
  dot: {
    color: Colors.textMuted,
    marginHorizontal: 8,
    fontSize: 11,
  },
  priceBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.screen,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  priceEyebrow: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1.4,
  },
  price: {
    color: Colors.textPrimary,
    fontFamily: Fonts.numbersBlack,
    fontSize: 28,
    marginTop: 2,
  },
  priceUnit: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyMedium,
    fontSize: 14,
  },
  availability: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 32,
    backgroundColor: 'rgba(214,40,40,0.12)',
    borderRadius: Radius.base,
    borderWidth: 1,
    borderColor: Colors.red,
    gap: 6,
  },
  dotLive: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.red,
  },
  availabilityText: {
    color: Colors.red,
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.screen,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  tab: {
    flex: 1,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 1.4,
  },
  tabTextActive: {
    color: Colors.textPrimary,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: -1,
    width: 32,
    height: 2,
    backgroundColor: Colors.red,
  },
  section: {
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.lg,
  },
  gridWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chartCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: 18,
    marginTop: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  chartEyebrow: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1.4,
  },
  chartValue: {
    color: Colors.textPrimary,
    fontFamily: Fonts.numbersBlack,
    fontSize: 28,
    marginTop: 4,
  },
  chartUnit: {
    color: Colors.star,
    fontSize: 18,
  },
  chartTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 26,
    backgroundColor: 'rgba(214,40,40,0.12)',
    borderRadius: 4,
    gap: 4,
  },
  chartTrendText: {
    color: Colors.red,
    fontFamily: Fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 0.8,
  },
  aboutTitle: {
    color: Colors.textPrimary,
    fontFamily: Fonts.display,
    fontSize: 22,
    letterSpacing: 1,
    marginTop: Spacing.xl,
    marginBottom: 10,
  },
  bio: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyRegular,
    fontSize: 14,
    lineHeight: 22,
  },
  legend: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.lg,
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendBox: {
    width: 14,
    height: 14,
    borderRadius: 3,
    borderWidth: 1,
  },
  legendText: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyMedium,
    fontSize: 11,
  },
  reviewsSummary: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.divider,
    marginBottom: Spacing.base,
  },
  bigRating: {
    color: Colors.textPrimary,
    fontFamily: Fonts.numbersBlack,
    fontSize: 44,
    lineHeight: 46,
  },
  reviewCount: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyMedium,
    fontSize: 11,
    marginTop: 6,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  barLabel: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyMedium,
    fontSize: 11,
    width: 10,
  },
  barTrack: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.surfaceHigh,
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: Colors.red,
  },
  barCount: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyMedium,
    fontSize: 11,
    width: 18,
    textAlign: 'right',
  },
  reviewItem: {
    flexDirection: 'row',
    paddingVertical: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    gap: 12,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.skeleton,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  reviewName: {
    color: Colors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
  },
  reviewDate: {
    color: Colors.textMuted,
    fontFamily: Fonts.bodyRegular,
    fontSize: 11,
  },
  reviewComment: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyRegular,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
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
