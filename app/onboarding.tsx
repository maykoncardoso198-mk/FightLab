import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Colors, Fonts, Radius, Spacing } from '../constants';
import { PrimaryButton } from '../components';

type Role = 'student' | 'trainer';

export default function OnboardingScreen() {
  const router = useRouter();
  const [role, setRole] = useState<Role | null>(null);

  const choose = (r: Role) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    setRole(r);
  };

  const next = () => {
    if (!role) return;
    router.push({ pathname: '/(auth)/register', params: { role } });
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={26} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.brand}>
          FIGHT<Text style={{ color: Colors.red }}>LAB</Text>
        </Text>
        <View style={{ width: 26 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.eyebrow}>ESCOLHA SEU PERFIL</Text>
        <Text style={styles.title}>QUEM É VOCÊ{'\n'}NO RING?</Text>
        <Text style={styles.subtitle}>
          Personalizamos sua experiência com base na sua escolha. Você pode mudar depois.
        </Text>

        <View style={styles.cards}>
          <RoleCard
            icon="fitness"
            title="SOU ALUNO"
            subtitle="Quero treinar com os melhores"
            selected={role === 'student'}
            onPress={() => choose('student')}
          />
          <RoleCard
            icon="ribbon"
            title="SOU PROFESSOR"
            subtitle="Ofereço aulas particulares"
            selected={role === 'trainer'}
            onPress={() => choose('trainer')}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          label="CONTINUAR"
          iconRight="arrow-forward"
          onPress={next}
          disabled={!role}
        />
      </View>
    </SafeAreaView>
  );
}

interface RoleCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  selected: boolean;
  onPress: () => void;
}

function RoleCard({ icon, title, subtitle, selected, onPress }: RoleCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        cardStyles.card,
        selected && cardStyles.cardSelected,
        pressed && { opacity: 0.92 },
      ]}
    >
      <View style={cardStyles.iconWrap}>
        <Ionicons
          name={icon}
          size={26}
          color={selected ? Colors.red : Colors.textPrimary}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={cardStyles.title}>{title}</Text>
        <Text style={cardStyles.subtitle}>{subtitle}</Text>
      </View>
      <View style={[cardStyles.radio, selected && cardStyles.radioSelected]}>
        {selected && <View style={cardStyles.radioInner} />}
      </View>
    </Pressable>
  );
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
  brand: {
    color: Colors.textPrimary,
    fontFamily: Fonts.display,
    fontSize: 18,
    letterSpacing: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.screen,
    paddingTop: 24,
  },
  eyebrow: {
    color: Colors.red,
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 2,
  },
  title: {
    color: Colors.textPrimary,
    fontFamily: Fonts.display,
    fontSize: 48,
    letterSpacing: 1.5,
    lineHeight: 50,
    marginTop: 8,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyRegular,
    fontSize: 14,
    marginTop: 14,
    lineHeight: 20,
  },
  cards: {
    marginTop: 36,
    gap: 14,
  },
  footer: {
    paddingHorizontal: Spacing.screen,
    paddingBottom: 12,
  },
});

const cardStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
  cardSelected: {
    borderColor: Colors.red,
    backgroundColor: Colors.surfaceElevated,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: Radius.base,
    backgroundColor: Colors.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  title: {
    color: Colors.textPrimary,
    fontFamily: Fonts.display,
    fontSize: 22,
    letterSpacing: 1,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyRegular,
    fontSize: 13,
    marginTop: 4,
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
  radioSelected: {
    borderColor: Colors.red,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.red,
  },
});
