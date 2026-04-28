import { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts, Radius, Spacing } from '../../constants';
import { ModalityChip, TrainerCard } from '../../components';
import { useTrainers } from '../../hooks/useTrainers';
import { Modality, modalitiesList } from '../../data';

const cities = ['Todas', 'São Paulo', 'Rio de Janeiro', 'Curitiba', 'Belo Horizonte', 'Salvador'];
const priceRanges = [
  { label: 'Qualquer', max: undefined },
  { label: 'Até R$ 150', max: 150 },
  { label: 'Até R$ 200', max: 200 },
  { label: 'Até R$ 250', max: 250 },
];
const ratingRanges = [
  { label: 'Qualquer', min: 0 },
  { label: '4.5+', min: 4.5 },
  { label: '4.8+', min: 4.8 },
];

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [modality, setModality] = useState<Modality | null>(null);
  const [city, setCity] = useState<string>('Todas');
  const [priceIdx, setPriceIdx] = useState(0);
  const [ratingIdx, setRatingIdx] = useState(0);

  const filters = useMemo(
    () => ({
      query,
      modality,
      city: city === 'Todas' ? null : city,
      maxPrice: priceRanges[priceIdx].max,
      minRating: ratingRanges[ratingIdx].min || undefined,
    }),
    [query, modality, city, priceIdx, ratingIdx]
  );

  const list = useTrainers(filters);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>BUSCAR</Text>
        <Pressable hitSlop={12}>
          <Ionicons name="filter" size={20} color={Colors.textPrimary} />
        </Pressable>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color={Colors.textSecondary} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Nome, modalidade, cidade..."
          placeholderTextColor={Colors.textMuted}
          style={styles.input}
          returnKeyType="search"
        />
        {query.length > 0 && (
          <Pressable onPress={() => setQuery('')} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
          </Pressable>
        )}
      </View>

      <FlatList
        data={list}
        keyExtractor={(t) => t.id}
        ListHeaderComponent={
          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipsRow}
            >
              <ModalityChip
                label="TODAS"
                active={modality === null}
                onPress={() => setModality(null)}
              />
              {modalitiesList.map((m) => (
                <ModalityChip
                  key={m}
                  label={m}
                  active={modality === m}
                  onPress={() => setModality(m as Modality)}
                />
              ))}
            </ScrollView>

            <FilterSection title="CIDADE">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.subChipsRow}
              >
                {cities.map((c) => (
                  <ModalityChip
                    key={c}
                    label={c}
                    size="sm"
                    active={city === c}
                    onPress={() => setCity(c)}
                  />
                ))}
              </ScrollView>
            </FilterSection>

            <FilterSection title="FAIXA DE PREÇO">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.subChipsRow}
              >
                {priceRanges.map((p, i) => (
                  <ModalityChip
                    key={p.label}
                    label={p.label}
                    size="sm"
                    active={priceIdx === i}
                    onPress={() => setPriceIdx(i)}
                  />
                ))}
              </ScrollView>
            </FilterSection>

            <FilterSection title="AVALIAÇÃO MÍNIMA">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.subChipsRow}
              >
                {ratingRanges.map((r, i) => (
                  <ModalityChip
                    key={r.label}
                    label={r.label}
                    size="sm"
                    active={ratingIdx === i}
                    onPress={() => setRatingIdx(i)}
                  />
                ))}
              </ScrollView>
            </FilterSection>

            <View style={styles.resultHeader}>
              <Text style={styles.resultCount}>{list.length} PROFESSORES</Text>
              <Pressable hitSlop={8} style={styles.sortBtn}>
                <Text style={styles.sortText}>RELEVÂNCIA</Text>
                <Ionicons name="chevron-down" size={14} color={Colors.textPrimary} />
              </Pressable>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <TrainerCard trainer={item} onPress={() => router.push(`/trainer/${item.id}`)} />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="search" size={36} color={Colors.textMuted} />
            <Text style={styles.emptyText}>Nenhum professor encontrado</Text>
            <Text style={styles.emptySub}>Tente ajustar os filtros.</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginTop: Spacing.base }}>
      <Text style={styles.filterTitle}>{title}</Text>
      {children}
    </View>
  );
}

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
  searchBar: {
    marginHorizontal: Spacing.screen,
    height: 48,
    borderRadius: Radius.base,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    color: Colors.textPrimary,
    fontFamily: Fonts.bodyRegular,
    fontSize: 14,
    height: '100%',
    marginLeft: 10,
  },
  chipsRow: {
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.base,
    gap: 8,
  },
  subChipsRow: {
    paddingHorizontal: Spacing.screen,
    gap: 6,
    paddingTop: 6,
  },
  filterTitle: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1.4,
    paddingHorizontal: Spacing.screen,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    marginBottom: Spacing.base,
  },
  resultCount: {
    color: Colors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 1.4,
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sortText: {
    color: Colors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1.2,
  },
  listContent: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: 32,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: Colors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 16,
    marginTop: 12,
  },
  emptySub: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyRegular,
    fontSize: 13,
    marginTop: 4,
  },
});
