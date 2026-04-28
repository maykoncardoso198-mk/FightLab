import { View, Text, StyleSheet } from 'react-native';
import { Colors, Fonts } from '../constants';
import { RatingPoint } from '../data';

interface Props {
  data: RatingPoint[];
  height?: number;
}

export function RatingChart({ data, height = 90 }: Props) {
  const max = 5;
  return (
    <View>
      <View style={[styles.chart, { height }]}>
        {data.map((p) => {
          const h = (p.value / max) * height;
          return (
            <View key={p.month} style={styles.col}>
              <View style={[styles.bar, { height: h }]} />
            </View>
          );
        })}
      </View>
      <View style={styles.labels}>
        {data.map((p) => (
          <Text key={p.month} style={styles.label}>
            {p.month}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
  },
  col: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '70%',
    backgroundColor: Colors.red,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  labels: {
    flexDirection: 'row',
    marginTop: 6,
    gap: 6,
  },
  label: {
    flex: 1,
    textAlign: 'center',
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyMedium,
    fontSize: 10,
    letterSpacing: 0.8,
  },
});
