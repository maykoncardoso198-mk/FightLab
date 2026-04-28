import { useMemo } from 'react';
import { trainers, Trainer, Modality } from '../data';

interface Filters {
  modality?: Modality | null;
  city?: string | null;
  minRating?: number;
  maxPrice?: number;
  query?: string;
}

export function useTrainers(filters: Filters = {}) {
  const list = useMemo(() => {
    return trainers.filter((t) => {
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
  }, [filters.modality, filters.city, filters.minRating, filters.maxPrice, filters.query]);

  return list;
}

export function useTrainerById(id: string | undefined): Trainer | undefined {
  return useMemo(() => trainers.find((t) => t.id === id), [id]);
}

export function useRanking(): Trainer[] {
  return useMemo(
    () => [...trainers].sort((a, b) => a.rankingPosition - b.rankingPosition),
    []
  );
}
