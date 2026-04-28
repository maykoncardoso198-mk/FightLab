import { View, Pressable, Text, StyleSheet } from 'react-native';
import { Colors, Fonts, Radius } from '../constants';

interface Props {
  slots: { time: string; available: boolean }[];
  selected?: string;
  onSelect: (time: string) => void;
}

export function TimeSlotPicker({ slots, selected, onSelect }: Props) {
  return (
    <View style={styles.wrap}>
      {slots.map((s) => {
        const isSelected = s.time === selected;
        return (
          <Pressable
            key={s.time}
            onPress={() => s.available && onSelect(s.time)}
            disabled={!s.available}
            style={[
              styles.chip,
              !s.available && styles.disabled,
              s.available && !isSelected && styles.available,
              isSelected && styles.selected,
            ]}
          >
            <Text
              style={[
                styles.text,
                !s.available && styles.textDisabled,
                s.available && styles.textAvailable,
                isSelected && styles.textSelected,
              ]}
            >
              {s.time}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    paddingHorizontal: 18,
    height: 46,
    minWidth: 92,
    borderRadius: Radius.base,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  available: {
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  selected: {
    backgroundColor: Colors.red,
    borderColor: Colors.red,
  },
  disabled: {
    backgroundColor: Colors.surface,
    borderColor: Colors.divider,
  },
  text: {
    fontFamily: Fonts.numbersBold,
    fontSize: 15,
  },
  textAvailable: {
    color: Colors.textPrimary,
  },
  textSelected: {
    color: Colors.textPrimary,
  },
  textDisabled: {
    color: Colors.textDisabled,
  },
});
