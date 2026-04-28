import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Radius } from '../constants';

interface Props extends TextInputProps {
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  error?: string;
}

export function Input({ label, icon, error, style, ...rest }: Props) {
  const [focused, setFocused] = useState(false);
  const borderColor = error
    ? Colors.red
    : focused
    ? Colors.red
    : Colors.border;

  return (
    <View style={styles.wrap}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.fieldWrap, { borderColor }]}>
        {icon && (
          <Ionicons
            name={icon}
            size={18}
            color={focused ? Colors.red : Colors.textSecondary}
            style={{ marginRight: 10 }}
          />
        )}
        <TextInput
          {...rest}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          placeholderTextColor={Colors.textMuted}
          style={[styles.input, style]}
        />
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 14,
  },
  label: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyMedium,
    fontSize: 11,
    letterSpacing: 1.2,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  fieldWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderRadius: Radius.base,
    borderWidth: 1,
    backgroundColor: Colors.surface,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    color: Colors.textPrimary,
    fontFamily: Fonts.bodyRegular,
    fontSize: 15,
    height: '100%',
  },
  error: {
    color: Colors.red,
    fontFamily: Fonts.bodyRegular,
    fontSize: 12,
    marginTop: 4,
  },
});
