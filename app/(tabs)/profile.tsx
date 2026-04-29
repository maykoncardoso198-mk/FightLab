import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Fonts, Radius, Spacing } from '../../constants';
import { useAuth } from '../../hooks/useAuth';
import { useBookings } from '../../hooks/useBookings';
import { trainers, mockStudent } from '../../data';
import { TrainerCard } from '../../components';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { bookings } = useBookings();
  const profile = user || mockStudent;

  const completedCount = bookings.filter((b) => b.status === 'completed').length;
  const favorites = trainers.filter((t) => profile.favoriteTrainerIds.includes(t.id));

  const totalSpent = bookings
    .filter((b) => b.status === 'completed')
    .reduce((acc, b) => acc + b.price, 0);

  const handleLogout = async () => {
    await signOut();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={styles.heroWrap}>
          <Image
            source={{ uri: profile.photo }}
            style={StyleSheet.absoluteFillObject}
            contentFit="cover"
            blurRadius={20}
          />
          <LinearGradient
            colors={['rgba(10,10,10,0.6)', 'rgba(10,10,10,0.95)', '#0A0A0A']}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.heroContent}>
            <View style={styles.topRow}>
              <Pressable hitSlop={12}>
                <Ionicons name="settings-outline" size={20} color={Colors.textPrimary} />
              </Pressable>
              <Text style={styles.brand}>PERFIL</Text>
              <Pressable hitSlop={12} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={20} color={Colors.textPrimary} />
              </Pressable>
            </View>

            <Image source={{ uri: profile.photo }} style={styles.avatar} contentFit="cover" />
            <Text style={styles.name}>{profile.name.toUpperCase()}</Text>
            <View style={styles.cityRow}>
              <Ionicons name="location" size={12} color={Colors.textSecondary} />
              <Text style={styles.city}> {profile.city}</Text>
            </View>

            <Pressable style={styles.editBtn}>
              <Ionicons name="create-outline" size={14} color={Colors.textPrimary} />
              <Text style={styles.editBtnText}>EDITAR PERFIL</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.statsRow}>
          <Stat label="AULAS" value={String(completedCount)} />
          <View style={styles.statSep} />
          <Stat label="FAVORITOS" value={String(favorites.length)} />
          <View style={styles.statSep} />
          <Stat label="INVESTIDO" value={`R$ ${totalSpent}`} small />
        </View>

        <Section title="HISTÓRICO DE AULAS" subtitle="ÚLTIMAS REALIZADAS">
          <View style={styles.history}>
            {bookings
              .filter((b) => b.status === 'completed')
              .slice(0, 3)
              .map((b) => {
                const t = trainers.find((tr) => tr.id === b.trainerId);
                if (!t) return null;
                return (
                  <Pressable
                    key={b.id}
                    onPress={() => router.push(`/trainer/${t.id}`)}
                    style={({ pressed }) => [styles.historyItem, pressed && { opacity: 0.85 }]}
                  >
                    <Image source={{ uri: t.photo }} style={styles.historyAvatar} />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.historyName}>{t.name}</Text>
                      <Text style={styles.historyMeta}>
                        {t.primaryModality} · {b.date} · {b.time}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
                  </Pressable>
                );
              })}
            {bookings.filter((b) => b.status === 'completed').length === 0 && (
              <Text style={styles.emptyHistory}>Sem aulas concluídas ainda.</Text>
            )}
          </View>
        </Section>

        <Section title="PROFESSORES FAVORITOS">
          {favorites.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: Spacing.screen, gap: 12 }}
            >
              {favorites.map((t) => (
                <TrainerCard
                  key={t.id}
                  trainer={t}
                  variant="horizontal"
                  onPress={() => router.push(`/trainer/${t.id}`)}
                />
              ))}
            </ScrollView>
          ) : (
            <View style={[styles.history, { paddingVertical: 24, alignItems: 'center' }]}>
              <Text style={styles.emptyHistory}>Você ainda não favoritou nenhum professor.</Text>
            </View>
          )}
        </Section>

        <View style={styles.menu}>
          {user?.role === 'admin' && (
            <MenuItem
              icon="shield-checkmark-outline"
              label="ÁREA ADMIN"
              onPress={() => router.push('/(admin)')}
            />
          )}
          <MenuItem icon="card-outline" label="Pagamentos" />
          <MenuItem icon="notifications-outline" label="Notificações" />
          <MenuItem icon="help-circle-outline" label="Ajuda e suporte" />
          <MenuItem icon="document-text-outline" label="Termos e privacidade" />
          <MenuItem icon="log-out-outline" label="Sair" danger onPress={handleLogout} />
        </View>

        <Text style={styles.version}>FIGHTLAB v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <View style={statStyles.item}>
      <Text style={[statStyles.value, small && { fontSize: 18 }]}>{value}</Text>
      <Text style={statStyles.label}>{label}</Text>
    </View>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ marginTop: Spacing.xl }}>
      <View style={{ paddingHorizontal: Spacing.screen, marginBottom: Spacing.md }}>
        {subtitle && (
          <Text
            style={{
              color: Colors.red,
              fontFamily: Fonts.bodyBold,
              fontSize: 11,
              letterSpacing: 1.6,
              marginBottom: 4,
            }}
          >
            {subtitle}
          </Text>
        )}
        <Text style={{ color: Colors.textPrimary, fontFamily: Fonts.display, fontSize: 22, letterSpacing: 1 }}>
          {title}
        </Text>
      </View>
      {children}
    </View>
  );
}

function MenuItem({
  icon,
  label,
  danger,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  danger?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.menuItem, pressed && { opacity: 0.85 }]}
    >
      <Ionicons name={icon} size={18} color={danger ? Colors.red : Colors.textPrimary} />
      <Text style={[styles.menuLabel, danger && { color: Colors.red }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
    </Pressable>
  );
}

const statStyles = StyleSheet.create({
  item: { flex: 1, alignItems: 'center' },
  value: {
    color: Colors.textPrimary,
    fontFamily: Fonts.numbersBlack,
    fontSize: 24,
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
  heroWrap: {
    height: 320,
    overflow: 'hidden',
  },
  heroContent: {
    flex: 1,
    paddingHorizontal: Spacing.screen,
    alignItems: 'center',
  },
  topRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 52,
  },
  brand: {
    color: Colors.textPrimary,
    fontFamily: Fonts.display,
    fontSize: 18,
    letterSpacing: 2,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.red,
    marginTop: 18,
  },
  name: {
    color: Colors.textPrimary,
    fontFamily: Fonts.display,
    fontSize: 26,
    letterSpacing: 1.4,
    marginTop: 14,
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  city: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyMedium,
    fontSize: 13,
  },
  editBtn: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    height: 36,
    borderRadius: Radius.base,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  editBtnText: {
    color: Colors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1.2,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: Spacing.screen,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    paddingVertical: 18,
    marginTop: -28,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  statSep: { width: 1, backgroundColor: Colors.divider, marginVertical: 6 },
  history: {
    paddingHorizontal: Spacing.screen,
    gap: 10,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.base,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.divider,
    gap: 12,
  },
  historyAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.skeleton,
  },
  historyName: {
    color: Colors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 14,
  },
  historyMeta: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyRegular,
    fontSize: 11,
    marginTop: 2,
  },
  emptyHistory: {
    color: Colors.textMuted,
    fontFamily: Fonts.bodyRegular,
    fontSize: 13,
    textAlign: 'center',
  },
  menu: {
    marginTop: Spacing['2xl'],
    paddingHorizontal: Spacing.screen,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    gap: 14,
  },
  menuLabel: {
    flex: 1,
    color: Colors.textPrimary,
    fontFamily: Fonts.bodyMedium,
    fontSize: 14,
  },
  version: {
    textAlign: 'center',
    color: Colors.textMuted,
    fontFamily: Fonts.bodyMedium,
    fontSize: 11,
    letterSpacing: 1.6,
    marginTop: Spacing.xl,
  },
});
