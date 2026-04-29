import { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  FlatList,
  Modal,
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

type SortOption = 'relevancia' | 'avaliacao' | 'preco' | 'distancia';
const sortOptions: { key: SortOption; label: string }[] = [
  { key: 'relevancia', label: 'Relevância' },
  { key: 'avaliacao', label: 'Maior avaliação' },
  { key: 'preco', label: 'Menor preço' },
  { key: 'distancia', label: 'Mais próximo' },
];

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [modality, setModality] = useState<Modality | null>(null);
  const [city, setCity] = useState<string>('Todas');
  const [priceIdx, setPriceIdx] = useState(0);
  const [ratingIdx, setRatingIdx] = useState(0);
  const [sort, setSort] = useState<SortOption>('relevancia');
  const [sortModalVisible, setSortModalVisible] = useState(false);

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

  const baseList = useTrainers(filters);
  const list = useMemo(() => {
    const copy = [...baseList];
    if (sort === 'avaliacao') copy.sort((a, b) => b.rating - a.rating);
    else if (sort === 'preco') copy.sort((a, b) => a.pricePerHour - b.pricePerHour);
    else if (sort === 'distancia') copy.sort((a, b) => a.distanceKm - b.distanceKm);
    return copy;
  }, [baseList, sort]);

  const currentSortLabel = sortOptions.find((o) => o.key === sort)?.label ?? 'Relevância';

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <Modal
        visible={sortModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSortModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setSortModalVisible(false)}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>ORDENAR POR</Text>
            {sortOptions.map((o) => (
              <Pressable
                key={o.key}
                onPress={() => { setSort(o.key); setSortModalVisible(false); }}
                style={styles.modalOption}
              >
                <Text style={[styles.modalOptionText, sort === o.key && styles.modalOptionActive]}>
                  {o.label}
                </Text>
                {sort === o.key && (
                  <Ionicons name="checkmark" size={16} color={Colors.red} />
                )}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>

      <View style={styles.header}>
        <Text style={styles.title}>BUSCAR</Text>
        <Pressable hitSlop={12} onPress={() => setSortModalVisible(true)}>
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
              <Pressable hitSlop={8} style={styles.sortBtn} onPress={() => setSortModalVisible(true)}>
                <Text style={styles.sortText}>{currentSortLabel.toUpperCase()}</Text>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
    borderTopWidth: 1,
    borderColor: Colors.divider,
  },
  modalTitle: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1.6,
    marginBottom: 16,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  modalOptionText: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyMedium,
    fontSize: 15,
  },
  modalOptionActive: {
    color: Colors.textPrimary,
    fontFamily: Fonts.bodyBold,
  },
});
