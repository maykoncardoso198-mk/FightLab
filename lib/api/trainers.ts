import { supabase, isSupabaseConfigured } from '../supabase';
import { trainers as mockTrainers } from '../../data/trainers';
import { Trainer, Modality, DaySchedule, Review } from '../../data/types';

export interface TrainerFilters {
  modality?: Modality | null;
  city?: string | null;
  minRating?: number;
  maxPrice?: number;
  query?: string;
}

// ─── mapper: DB row → Trainer type ───────────────────────────────

function mapRow(row: any): Trainer {
  const avgRating =
    row.reviews?.length > 0
      ? row.reviews.reduce((s: number, r: any) => s + r.nota, 0) / row.reviews.length
      : 0;

  const totalLessons =
    row.bookings_count?.[0]?.count ?? 0;

  const reviews: Review[] = (row.reviews ?? []).map((r: any) => ({
    id: r.id,
    studentName: r.users?.nome ?? 'Aluno',
    studentPhoto: r.users?.foto_url ?? `https://i.pravatar.cc/150?u=${r.aluno_id}`,
    rating: r.nota,
    comment: r.comentario ?? '',
    date: r.criado_em?.split('T')[0] ?? '',
  }));

  const schedule: DaySchedule[] = buildSchedule(row.availability ?? []);

  return {
    id: row.id,
    name: (row.users?.nome ?? 'PROFESSOR').toUpperCase(),
    photo: row.users?.foto_url ?? `https://i.pravatar.cc/600?u=${row.id}`,
    heroPhoto: row.users?.foto_url ?? `https://i.pravatar.cc/1200?u=${row.id}`,
    modalities: (row.modalidades ?? []) as Modality[],
    primaryModality: (row.modalidade_principal ?? row.modalidades?.[0] ?? 'Boxe') as Modality,
    city: row.users?.cidade ?? 'São Paulo',
    neighborhood: row.bairro ?? 'Centro',
    distanceKm: 0,
    pricePerHour: Number(row.preco_hora ?? 0),
    experienceYears: row.anos_experiencia ?? 0,
    graduation: row.graduacao ?? '',
    rating: Number(avgRating.toFixed(1)),
    totalLessons: Number(totalLessons),
    bio: row.bio ?? '',
    isFeatured: row.em_destaque ?? false,
    rankingPosition: row.posicao_ranking ?? 99,
    schedule,
    reviews,
    ratingHistory: [],
    nextAvailable: computeNextAvailable(row.availability ?? []),
  };
}

function buildSchedule(availability: any[]): DaySchedule[] {
  if (!availability.length) {
    // gera agenda vazia para os próximos 7 dias
    const days = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'];
    const today = new Date();
    return days.map((wd, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return {
        date: d.toISOString().split('T')[0],
        weekday: wd,
        slots: [],
      };
    });
  }

  const days = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'];
  const today = new Date();
  return days.map((wd, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const daySlots = availability.filter((a: any) => a.dia_semana === wd && a.disponivel);
    return {
      date: d.toISOString().split('T')[0],
      weekday: wd,
      slots: daySlots.map((a: any) => ({
        time: a.horario_inicio.slice(0, 5),
        available: true,
      })),
    };
  });
}

function computeNextAvailable(availability: any[]): string {
  const avail = availability.find((a: any) => a.disponivel);
  if (!avail) return 'VER AGENDA';
  return `${avail.dia_semana} · ${avail.horario_inicio.slice(0, 5)}`;
}

function applyFilters(list: Trainer[], filters: TrainerFilters): Trainer[] {
  return list.filter((t) => {
    if (filters.modality && !t.modalities.includes(filters.modality)) return false;
    if (filters.city && t.city !== filters.city) return false;
    if (filters.minRating && t.rating < filters.minRating) return false;
    if (filters.maxPrice && t.pricePerHour > filters.maxPrice) return false;
    if (filters.query) {
      const q = filters.query.toLowerCase();
      const hay = `${t.name} ${t.modalities.join(' ')} ${t.city}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

// ─── public API ──────────────────────────────────────────────────

export async function fetchTrainers(filters: TrainerFilters = {}): Promise<Trainer[]> {
  if (!isSupabaseConfigured || !supabase) {
    return applyFilters(mockTrainers, filters);
  }

  try {
    const { data, error } = await supabase
      .from('trainers')
      .select(`
        *,
        users (id, nome, foto_url, cidade),
        reviews (id, nota, comentario, criado_em, aluno_id, users (nome, foto_url)),
        availability (id, dia_semana, horario_inicio, horario_fim, disponivel)
      `);

    if (error || !data?.length) return applyFilters(mockTrainers, filters);

    return applyFilters(data.map(mapRow), filters);
  } catch {
    return applyFilters(mockTrainers, filters);
  }
}

export async function fetchTrainerById(id: string | undefined): Promise<Trainer | undefined> {
  if (!id) return undefined;

  if (!isSupabaseConfigured || !supabase) {
    return mockTrainers.find((t) => t.id === id);
  }

  try {
    const { data, error } = await supabase
      .from('trainers')
      .select(`
        *,
        users (id, nome, foto_url, cidade),
        reviews (id, nota, comentario, criado_em, aluno_id, users (nome, foto_url)),
        availability (id, dia_semana, horario_inicio, horario_fim, disponivel)
      `)
      .eq('id', id)
      .single();

    if (error || !data) return mockTrainers.find((t) => t.id === id);

    return mapRow(data);
  } catch {
    return mockTrainers.find((t) => t.id === id);
  }
}

export async function fetchRanking(): Promise<Trainer[]> {
  const all = await fetchTrainers();
  return [...all].sort((a, b) => a.rankingPosition - b.rankingPosition);
}
