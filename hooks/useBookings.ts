import { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Booking, mockBookings } from '../data';

const KEY = '@fightlab/bookings';

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) setBookings(JSON.parse(raw));
      } catch {}
      setLoading(false);
    })();
  }, []);

  const persist = async (next: Booking[]) => {
    setBookings(next);
    await AsyncStorage.setItem(KEY, JSON.stringify(next));
  };

  const addBooking = useCallback(
    async (booking: Omit<Booking, 'id'>) => {
      const next: Booking = { ...booking, id: `b${Date.now()}` };
      await persist([next, ...bookings]);
      return next;
    },
    [bookings]
  );

  const cancelBooking = useCallback(
    async (id: string) => {
      const next = bookings.map((b) =>
        b.id === id ? { ...b, status: 'cancelled' as const } : b
      );
      await persist(next);
    },
    [bookings]
  );

  return { bookings, loading, addBooking, cancelBooking };
}
