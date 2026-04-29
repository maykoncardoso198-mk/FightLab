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
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts, Radius, Spacing } from '../../constants';
import { Input, PrimaryButton } from '../../components';
import { useAuth } from '../../hooks/useAuth';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    await signIn('student');
    setLoading(false);
    router.replace('/(tabs)');
  };

  const handleAdminAccess = async () => {
    await signIn('admin');
    router.replace('/(admin)');
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
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.eyebrow}>BEM-VINDO DE VOLTA</Text>
          <Text style={styles.title}>ENTRAR{'\n'}NA ARENA</Text>

          <View style={{ marginTop: 36 }}>
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
              placeholder="••••••••"
            />

            <Pressable style={{ alignSelf: 'flex-end', marginTop: 4 }}>
              <Text style={styles.forgot}>Esqueci minha senha</Text>
            </Pressable>
          </View>

          <View style={{ marginTop: 28 }}>
            <PrimaryButton label="ENTRAR" onPress={handleLogin} loading={loading} />
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
            onPress={() => router.replace('/(auth)/register')}
          >
            <Text style={styles.bottomLinkText}>
              Não tem conta? <Text style={{ color: Colors.red, fontFamily: Fonts.bodyBold }}>Cadastre-se</Text>
            </Text>
          </Pressable>

          <Pressable style={styles.adminLink} onPress={handleAdminAccess}>
            <Ionicons name="shield-checkmark-outline" size={13} color={Colors.textMuted} />
            <Text style={styles.adminLinkText}>Acesso Admin (demo)</Text>
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
    paddingHorizontal: Spacing.screen,
    paddingVertical: 12,
  },
  content: {
    paddingHorizontal: Spacing.screen,
    paddingTop: 12,
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
    fontSize: 48,
    lineHeight: 50,
    letterSpacing: 1.5,
    marginTop: 8,
  },
  forgot: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyMedium,
    fontSize: 12,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 28,
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
    marginTop: 28,
  },
  bottomLinkText: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyRegular,
    fontSize: 14,
  },
  adminLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 20,
    paddingVertical: 8,
  },
  adminLinkText: {
    color: Colors.textMuted,
    fontFamily: Fonts.bodyMedium,
    fontSize: 12,
    letterSpacing: 0.5,
  },
});
