import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts } from '../constants';

interface Props {
  rating: number;
  size?: number;
  showValue?: boolean;
  count?: number;
  compact?: boolean;
}

export function StarRating({ rating, size = 14, showValue = true, count, compact }: Props) {
  if (compact) {
    return (
      <View style={styles.row}>
        <Ionicons name="star" size={size} color={Colors.star} />
        {showValue && (
          <Text style={[styles.value, { fontSize: size }]}> {rating.toFixed(1)}</Text>
        )}
      </View>
    );
  }

  const stars = [1, 2, 3, 4, 5];
  return (
    <View style={styles.row}>
      {stars.map((s) => {
        const filled = s <= Math.round(rating);
        return (
          <Ionicons
            key={s}
            name={filled ? 'star' : 'star-outline'}
            size={size}
            color={filled ? Colors.star : Colors.textMuted}
            style={{ marginRight: 2 }}
          />
        );
      })}
      {showValue && (
        <Text style={[styles.value, { fontSize: size, marginLeft: 6 }]}>
          {rating.toFixed(1)}
        </Text>
      )}
      {count !== undefined && (
        <Text style={[styles.count, { fontSize: size - 1 }]}> · {count} aulas</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    color: Colors.textPrimary,
    fontFamily: Fonts.bodyBold,
  },
  count: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyRegular,
  },
});
