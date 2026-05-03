import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts, Radius, Spacing } from '../../constants';
import { Input, PrimaryButton, ModalityChip } from '../../components';
import { useAuth } from '../../hooks/useAuth';
import { modalitiesList, Modality } from '../../data';

type Role = 'student' | 'trainer';

export default function RegisterScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ role?: Role }>();
  const role: Role = (params.role as Role) || 'student';
  const { signUp } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('');
  const [experience, setExperience] = useState('');
  const [pricePerHour, setPricePerHour] = useState('');
  const [modalities, setModalities] = useState<Modality[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isTeacher = role === 'trainer';

  const toggleModality = (m: Modality) => {
    setModalities((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
    );
  };

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Preencha nome, email e senha.');
      return;
    }
    setError('');
    setLoading(true);
    const result = await signUp({ name: name.trim(), email: email.trim(), password, city: city.trim(), role });
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (isTeacher) router.replace('/dashboard');
    else router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="chevron-back" size={26} color={Colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerBadge}>{isTeacher ? 'PROFESSOR' : 'ALUNO'}</Text>
          <View style={{ width: 26 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.eyebrow}>CRIE SUA CONTA</Text>
          <Text style={styles.title}>
            {isTeacher ? 'ENTRE NO\nROSTER' : 'JUNTE-SE\nÀ ARENA'}
          </Text>
          <Text style={styles.subtitle}>
            {isTeacher
              ? 'Configure seu perfil para começar a receber alunos.'
              : 'Configure seu perfil em menos de um minuto.'}
          </Text>

          <View style={{ marginTop: 28 }}>
            <Input
              label="Nome completo"
              icon="person-outline"
              value={name}
              onChangeText={setName}
              placeholder="Como devemos te chamar?"
            />
            <Input
              label="Email"
              icon="mail-outline"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              placeholder="seu@email.com"
            />
            <Input
              label="Senha"
              icon="lock-closed-outline"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              placeholder="Mínimo 8 caracteres"
            />
            <Input
              label="Cidade"
              icon="location-outline"
              value={city}
              onChangeText={setCity}
              placeholder="Sua cidade"
            />

            {isTeacher && (
              <>
                <Text style={styles.sectionLabel}>MODALIDADES QUE ENSINA</Text>
                <View style={styles.chipsWrap}>
                  {modalitiesList.map((m) => (
                    <ModalityChip
                      key={m}
                      label={m}
                      active={modalities.includes(m as Modality)}
                      onPress={() => toggleModality(m as Modality)}
                    />
                  ))}
                </View>

                <View style={{ height: 18 }} />
                <Input
                  label="Anos de experiência"
                  icon="trophy-outline"
                  keyboardType="number-pad"
                  value={experience}
                  onChangeText={setExperience}
                  placeholder="Ex: 8"
                />
                <Input
                  label="Valor por hora (R$)"
                  icon="cash-outline"
                  keyboardType="number-pad"
                  value={pricePerHour}
                  onChangeText={setPricePerHour}
                  placeholder="Ex: 180"
                />
              </>
            )}
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle-outline" size={14} color={Colors.red} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={{ marginTop: 16 }}>
            <PrimaryButton label="CRIAR CONTA" onPress={handleRegister} loading={loading} />
          </View>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OU CONTINUE COM</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialRow}>
            <SocialButton icon="logo-google" label="Google" />
            <SocialButton icon="logo-apple" label="Apple" />
          </View>

          <Pressable
            style={styles.bottomLink}
            onPress={() => router.replace('/(auth)/login')}
          >
            <Text style={styles.bottomLinkText}>
              Já tem conta?{' '}
              <Text style={{ color: Colors.red, fontFamily: Fonts.bodyBold }}>Entrar</Text>
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function SocialButton({
  icon,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}) {
  return (
    <Pressable style={({ pressed }) => [styles.social, pressed && { opacity: 0.85 }]}>
      <Ionicons name={icon} size={18} color={Colors.textPrimary} />
      <Text style={styles.socialText}>{label}</Text>
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
  headerBadge: {
    color: Colors.red,
    fontFamily: Fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 2,
  },
  content: {
    paddingHorizontal: Spacing.screen,
    paddingTop: 8,
    paddingBottom: 30,
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
    fontSize: 44,
    lineHeight: 46,
    letterSpacing: 1.5,
    marginTop: 8,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyRegular,
    fontSize: 13,
    marginTop: 10,
    lineHeight: 19,
  },
  sectionLabel: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyMedium,
    fontSize: 11,
    letterSpacing: 1.2,
    marginBottom: 8,
    marginTop: 8,
    textTransform: 'uppercase',
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.divider,
  },
  dividerText: {
    color: Colors.textMuted,
    fontFamily: Fonts.bodyMedium,
    fontSize: 11,
    letterSpacing: 1.4,
    marginHorizontal: 12,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },
  social: {
    flex: 1,
    height: 50,
    borderRadius: Radius.base,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  socialText: {
    color: Colors.textPrimary,
    fontFamily: Fonts.bodyBold,
    fontSize: 13,
    letterSpacing: 0.5,
  },
  bottomLink: {
    alignItems: 'center',
    marginTop: 22,
  },
  bottomLinkText: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyRegular,
    fontSize: 14,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(214,40,40,0.08)',
    borderRadius: Radius.sm,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 12,
  },
  errorText: {
    color: Colors.red,
    fontFamily: Fonts.bodyMedium,
    fontSize: 13,
    flex: 1,
  },
});
