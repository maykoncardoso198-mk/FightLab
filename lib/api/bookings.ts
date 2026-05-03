import { supabase, isSupabaseConfigured } from '../supabase';
import { mockBookings } from '../../data/user';
import { Booking } from '../../data/types';

// ─── mapper: DB row → Booking type ───────────────────────────────

function mapRow(row: any): Booking {
  const statusMap: Record<string, Booking['status']> = {
    pendente:   'pending',
    confirmado: 'confirmed',
    cancelado:  'cancelled',
    concluido:  'completed',
  };
  const methodMap: Record<string, Booking['paymentMethod']> = {
    pix:        'pix',
    cartao:     'card',
    assinatura: 'subscription',
  };

  return {
    id:            row.id,
    trainerId:     row.trainer_id,
    studentId:     row.aluno_id,
    date:          row.data,
    time:          row.horario?.slice(0, 5) ?? '',
    duration:      row.duracao ?? 60,
    price:         Number(row.valor_total ?? 0),
    status:        statusMap[row.status] ?? 'pending',
    paymentMethod: methodMap[row.metodo_pagamento] ?? 'pix',
  };
}

function toDbStatus(status: Booking['status']): string {
  const map: Record<Booking['status'], string> = {
    pending:   'pendente',
    confirmed: 'confirmado',
    cancelled: 'cancelado',
    completed: 'concluido',
  };
  return map[status];
}

// ─── public API ──────────────────────────────────────────────────

export async function fetchBookings(studentId?: string): Promise<Booking[]> {
  if (!isSupabaseConfigured || !supabase) return mockBookings;

  try {
    let query = supabase.from('bookings').select('*').order('criado_em', { ascending: false });
    if (studentId) query = query.eq('aluno_id', studentId);

    const { data, error } = await query;
    if (error || !data?.length) return mockBookings;

    return data.map(mapRow);
  } catch {
    return mockBookings;
  }
}

export async function fetchTrainerBookings(trainerId: string): Promise<Booking[]> {
  if (!isSupabaseConfigured || !supabase) return mockBookings;

  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('trainer_id', trainerId)
      .order('data', { ascending: true });

    if (error || !data?.length) return [];

    return data.map(mapRow);
  } catch {
    return [];
  }
}

export async function createBooking(
  booking: Omit<Booking, 'id'>
): Promise<Booking> {
  if (!isSupabaseConfigured || !supabase) {
    return { ...booking, id: `b${Date.now()}` };
  }

  const { data, error } = await supabase
    .from('bookings')
    .insert({
      aluno_id:         booking.studentId,
      trainer_id:       booking.trainerId,
      data:             booking.date,
      horario:          booking.time,
      duracao:          booking.duration,
      status:           toDbStatus(booking.status),
      valor_total:      booking.price,
      metodo_pagamento: booking.paymentMethod === 'card' ? 'cartao'
                        : booking.paymentMethod === 'subscription' ? 'assinatura'
                        : 'pix',
    })
    .select()
    .single();

  if (error || !data) {
    return { ...booking, id: `b${Date.now()}` };
  }

  return mapRow(data);
}

export async function updateBookingStatus(
  id: string,
  status: Booking['status']
): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;

  await supabase
    .from('bookings')
    .update({ status: toDbStatus(status) })
    .eq('id', id);
}
