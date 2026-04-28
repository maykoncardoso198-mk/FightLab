import { useFonts as useExpoFonts } from 'expo-font';
import {
  BebasNeue_400Regular,
} from '@expo-google-fonts/bebas-neue';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import {
  Barlow_500Medium,
  Barlow_700Bold,
  Barlow_900Black,
} from '@expo-google-fonts/barlow';

export function useFonts() {
  const [loaded] = useExpoFonts({
    BebasNeue_400Regular,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
    Barlow_500Medium,
    Barlow_700Bold,
    Barlow_900Black,
  });
  return loaded;
}
