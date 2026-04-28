import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts, Radius, Spacing } from '../../constants';
import {
  TrainerCardFeatured,
  RankingItem,
  TrainerCard,
  SectionHeader,
  ModalityChip,
} from '../../components';
import { featuredDuel, modalitiesList, Modality } from '../../data';
import { useTrainers, useRanking } from '../../hooks/useTrainers';

export default function HomeScreen() {
  const router = useRouter();
  const [activeModality, setActiveModality] = useState<Modality | null>(null);
  const [query, setQuery] = useState('');
  const ranking = useRanking().slice(0, 5);
  const nearby = useTrainers({ modality: activeModality }).slice(0, 6);

  const goSearch = () => router.push('/(tabs)/search');
  const goTrainer = (id: string) => router.push(`/trainer/${id}`);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.topBar}>
        <Pressable hitSlop={12} style={styles.iconBtn}>
          <Ionicons name="menu" size={24} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.brand}>
          FIGHT<Text style={{ color: Colors.red }}>LAB</Text>
        </Text>
        <Pressable hitSlop={12} style={styles.iconBtn}>
          <Ionicons name="notifications-outline" size={22} color={Colors.textPrimary} />
          <View style={styles.notificationDot} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <Pressable style={styles.searchBar} onPress={goSearch}>
          <Ionicons name="search" size={18} color={Colors.textSecondary} />
          <Text style={styles.searchPlaceholder}>Buscar professor, modalidade, cidade...</Text>
          <View style={styles.filterBtn}>
            <Ionicons name="options-outline" size={16} color={Colors.textPrimary} />
          </View>
        </Pressable>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.modalityRow}
        >
          <ModalityChip
            label="TODAS"
            active={activeModality === null}
            onPress={() => setActiveModality(null)}
          />
          {modalitiesList.map((m) => (
            <ModalityChip
              key={m}
              label={m}
              active={activeModality === m}
              onPress={() => setActiveModality(m as Modality)}
            />
          ))}
        </ScrollView>

        <View style={styles.featuredWrap}>
          <TrainerCardFeatured
            trainerA={featuredDuel.trainerA}
            trainerB={featuredDuel.trainerB}
            countdown={featuredDuel.countdown}
            title={featuredDuel.duelTitle}
            onPressA={() => goTrainer(featuredDuel.trainerA.id)}
            onPressB={() => goTrainer(featuredDuel.trainerB.id)}
          />
        </View>

        <SectionHeader
          subtitle="RANKING"
          title="BEST OF THE BEST"
          actionLabel="VER TODOS"
          onActionPress={goSearch}
        />
        <View style={styles.rankingWrap}>
          {ranking.map((t) => (
            <RankingItem
              key={t.id}
              trainer={t}
              position={t.rankingPosition}
              onPress={() => goTrainer(t.id)}
            />
          ))}
        </View>

        <SectionHeader
          subtitle="NA SUA REGIÃO"
          title="PERTO DE VOCÊ"
          actionLabel="VER MAPA"
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.nearbyRow}
        >
          {nearby.map((t) => (
            <TrainerCard
              key={t.id}
              trainer={t}
              variant="horizontal"
              onPress={() => goTrainer(t.id)}
            />
          ))}
        </ScrollView>

        <View style={styles.bannerWrap}>
          <View style={styles.banner}>
            <View style={{ flex: 1 }}>
              <Text style={styles.bannerEyebrow}>FIGHTLAB PASS</Text>
              <Text style={styles.bannerTitle}>10 AULAS{'\n'}-15% OFF</Text>
              <Text style={styles.bannerSubtitle}>
                Pacote mensal com qualquer professor da plataforma.
              </Text>
            </View>
            <Pressable style={styles.bannerCta}>
              <Text style={styles.bannerCtaText}>VER PLANOS</Text>
              <Ionicons name="arrow-forward" size={14} color={Colors.textPrimary} />
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screen,
    height: 52,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  brand: {
    color: Colors.textPrimary,
    fontFamily: Fonts.display,
    fontSize: 22,
    letterSpacing: 2.2,
  },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.red,
  },
  searchBar: {
    marginTop: Spacing.base,
    marginHorizontal: Spacing.screen,
    height: 48,
    borderRadius: Radius.base,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 14,
    paddingRight: 6,
  },
  searchPlaceholder: {
    flex: 1,
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyRegular,
    fontSize: 13,
    marginLeft: 10,
  },
  filterBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    backgroundColor: Colors.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalityRow: {
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.base,
    gap: 8,
  },
  featuredWrap: {
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.lg,
  },
  rankingWrap: {
    paddingHorizontal: Spacing.screen,
  },
  nearbyRow: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: 8,
  },
  bannerWrap: {
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.xl,
  },
  banner: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  bannerEyebrow: {
    color: Colors.red,
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1.6,
  },
  bannerTitle: {
    color: Colors.textPrimary,
    fontFamily: Fonts.display,
    fontSize: 28,
    lineHeight: 30,
    letterSpacing: 1,
    marginTop: 6,
  },
  bannerSubtitle: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyRegular,
    fontSize: 12,
    marginTop: 8,
    maxWidth: 220,
  },
  bannerCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: Colors.red,
    borderRadius: Radius.base,
  },
  bannerCtaText: {
    color: Colors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1,
  },
});
