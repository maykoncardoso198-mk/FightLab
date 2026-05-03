import { useEffect, useState, useCallback } from 'react';
import { Booking, mockBookings } from '../data';
import {
  fetchBookings,
  createBooking,
  updateBookingStatus,
} from '../lib/api/bookings';
import { isSupabaseConfigured } from '../lib/supabase';

export function useBookings(studentId?: string) {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings(studentId).then((data) => {
      setBookings(data);
      setLoading(false);
    });
  }, [studentId]);

  const addBooking = useCallback(
    async (booking: Omit<Booking, 'id'>) => {
      const created = await createBooking(booking);
      setBookings((prev) => [created, ...prev]);
      return created;
    },
    []
  );

  const cancelBooking = useCallback(
    async (id: string) => {
      await updateBookingStatus(id, 'cancelled');
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: 'cancelled' as const } : b))
      );
    },
    []
  );

  return { bookings, loading, addBooking, cancelBooking };
}
