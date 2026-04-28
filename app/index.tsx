import { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts } from '../constants';
import { PrimaryButton } from '../components';

const { height } = Dimensions.get('window');

const HERO =
  'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=1200&q=80';

export default function SplashScreen() {
  const router = useRouter();
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.ease) });
  }, [opacity]);

  const fade = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <View style={styles.root}>
      <Animated.View style={[StyleSheet.absoluteFillObject, fade]}>
        <Image source={{ uri: HERO }} style={StyleSheet.absoluteFillObject} contentFit="cover" />
        <LinearGradient
          colors={['rgba(10,10,10,0.55)', 'rgba(10,10,10,0.35)', 'rgba(10,10,10,0.95)', '#0A0A0A']}
          locations={[0, 0.4, 0.85, 1]}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <Animated.View style={[styles.topText, fade]}>
          <Text style={styles.eyebrow}>FIGHTLAB</Text>
          <Text style={styles.headline}>ENCONTRE{'\n'}SEU PERSONAL{'\n'}FIGHT</Text>
          <Text style={styles.tagline}>
            Aulas particulares com lutadores e treinadores de elite.
          </Text>
        </Animated.View>

        <Animated.View style={[styles.bottomBlock, fade]}>
          <Text style={styles.logo}>FIGHT<Text style={styles.logoAccent}>LAB</Text></Text>
          <View style={{ height: 24 }} />
          <PrimaryButton
            label="COMEÇAR"
            iconRight="arrow-forward"
            onPress={() => router.push('/onboarding')}
          />
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safe: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  topText: {
    paddingTop: 12,
  },
  eyebrow: {
    color: Colors.red,
    fontFamily: Fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 3,
    marginBottom: 16,
  },
  headline: {
    color: Colors.textPrimary,
    fontFamily: Fonts.display,
    fontSize: 56,
    lineHeight: 56,
    letterSpacing: 1.5,
  },
  tagline: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyRegular,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 18,
    maxWidth: 300,
  },
  bottomBlock: {
    paddingBottom: 12,
  },
  logo: {
    color: Colors.textPrimary,
    fontFamily: Fonts.display,
    fontSize: 44,
    letterSpacing: 3,
    textAlign: 'center',
  },
  logoAccent: {
    color: Colors.red,
  },
});
