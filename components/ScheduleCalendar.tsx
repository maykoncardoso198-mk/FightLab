import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { Colors, Fonts, Radius, Spacing } from '../constants';
import { DaySchedule } from '../data';

interface Props {
  schedule: DaySchedule[];
  selectedDate?: string;
  selectedTime?: string;
  onSelectDate?: (date: string) => void;
  onSelectSlot?: (date: string, time: string) => void;
  showSlots?: boolean;
}

export function ScheduleCalendar({
  schedule,
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectSlot,
  showSlots = true,
}: Props) {
  const activeDay =
    schedule.find((d) => d.date === selectedDate) || schedule[0];

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weekRow}
      >
        {schedule.map((day) => {
          const active = day.date === activeDay.date;
          const dayNumber = parseInt(day.date.split('-')[2], 10);
          return (
            <Pressable
              key={day.date}
              onPress={() => onSelectDate?.(day.date)}
              style={[styles.day, active && styles.dayActive]}
            >
              <Text style={[styles.weekday, active && styles.weekdayActive]}>
                {day.weekday}
              </Text>
              <Text style={[styles.dayNum, active && styles.dayNumActive]}>{dayNumber}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {showSlots && (
        <View style={styles.slotsWrap}>
          {activeDay.slots.map((slot) => {
            const isSelected = selectedTime === slot.time && selectedDate === activeDay.date;
            return (
              <Pressable
                key={slot.time}
                onPress={() => slot.available && onSelectSlot?.(activeDay.date, slot.time)}
                disabled={!slot.available}
                style={[
                  styles.slot,
                  !slot.available && styles.slotDisabled,
                  slot.available && !isSelected && styles.slotAvailable,
                  isSelected && styles.slotSelected,
                ]}
              >
                <Text
                  style={[
                    styles.slotText,
                    !slot.available && styles.slotTextDisabled,
                    slot.available && styles.slotTextAvailable,
                    isSelected && styles.slotTextSelected,
                  ]}
                >
                  {slot.time}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  weekRow: {
    paddingHorizontal: Spacing.screen,
    gap: 8,
    paddingBottom: Spacing.base,
  },
  day: {
    width: 56,
    height: 70,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayActive: {
    backgroundColor: Colors.red,
    borderColor: Colors.red,
  },
  weekday: {
    color: Colors.textSecondary,
    fontFamily: Fonts.bodyMedium,
    fontSize: 11,
    letterSpacing: 1.2,
  },
  weekdayActive: {
    color: Colors.textPrimary,
  },
  dayNum: {
    color: Colors.textPrimary,
    fontFamily: Fonts.numbersBold,
    fontSize: 22,
    marginTop: 4,
  },
  dayNumActive: {
    color: Colors.textPrimary,
  },
  slotsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: Spacing.screen,
    paddingTop: Spacing.base,
  },
  slot: {
    width: 78,
    height: 44,
    borderRadius: Radius.base,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  slotAvailable: {
    backgroundColor: 'rgba(214, 40, 40, 0.12)',
    borderColor: Colors.red,
  },
  slotSelected: {
    backgroundColor: Colors.red,
    borderColor: Colors.red,
  },
  slotDisabled: {
    backgroundColor: Colors.surface,
    borderColor: Colors.divider,
  },
  slotText: {
    fontFamily: Fonts.numbersBold,
    fontSize: 14,
  },
  slotTextAvailable: {
    color: Colors.red,
  },
  slotTextSelected: {
    color: Colors.textPrimary,
  },
  slotTextDisabled: {
    color: Colors.textDisabled,
  },
});
