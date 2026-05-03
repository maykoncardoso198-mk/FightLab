import { useState, useEffect, useMemo } from 'react';
import { trainers as mockTrainers } from '../data';
import { Trainer, Modality } from '../data';
import {
  fetchTrainers,
  fetchTrainerById as apiFetchById,
  fetchRanking,
  TrainerFilters,
} from '../lib/api/trainers';
import { isSupabaseConfigured } from '../lib/supabase';

export function useTrainers(filters: TrainerFilters = {}) {
  const [data, setData] = useState<Trainer[]>(() => {
    // Inicia com mock data para não haver flash vazio
    return mockTrainers.filter((t) => {
      if (filters.modality && !t.modalities.includes(filters.modality as Modality)) return false;
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
  });

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    fetchTrainers(filters).then(setData);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.modality, filters.city, filters.minRating, filters.maxPrice, filters.query]);

  return data;
}

export function useTrainerById(id: string | undefined): Trainer | undefined {
  const [trainer, setTrainer] = useState<Trainer | undefined>(
    () => mockTrainers.find((t) => t.id === id)
  );

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    apiFetchById(id).then((t) => { if (t) setTrainer(t); });
  }, [id]);

  return trainer;
}

export function useRanking(): Trainer[] {
  const [data, setData] = useState<Trainer[]>(() =>
    [...mockTrainers].sort((a, b) => a.rankingPosition - b.rankingPosition)
  );

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    fetchRanking().then(setData);
  }, []);

  return data;
}
