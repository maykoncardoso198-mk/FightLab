import { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockStudent, mockTrainerUser, User } from '../data';

const KEY = '@fightlab/user';

export type UserRole = 'student' | 'trainer';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) setUser(JSON.parse(raw));
      } catch {}
      setLoading(false);
    })();
  }, []);

  const signIn = useCallback(async (role: UserRole, name?: string) => {
    const base = role === 'trainer' ? mockTrainerUser : mockStudent;
    const u = { ...base, name: name || base.name };
    await AsyncStorage.setItem(KEY, JSON.stringify(u));
    setUser(u);
    return u;
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.removeItem(KEY);
    setUser(null);
  }, []);

  const toggleFavorite = useCallback(
    async (trainerId: string) => {
      if (!user) return;
      const has = user.favoriteTrainerIds.includes(trainerId);
      const next: User = {
        ...user,
        favoriteTrainerIds: has
          ? user.favoriteTrainerIds.filter((id) => id !== trainerId)
          : [...user.favoriteTrainerIds, trainerId],
      };
      await AsyncStorage.setItem(KEY, JSON.stringify(next));
      setUser(next);
    },
    [user]
  );

  return { user, loading, signIn, signOut, toggleFavorite };
}
