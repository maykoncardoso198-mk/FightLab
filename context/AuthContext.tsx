import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { User } from '../data/types';
import { mockAdmin, mockStudent, mockTrainerUser } from '../data/user';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  apiSignIn,
  apiSignUp,
  apiSignOut,
  getSessionUser,
  SignUpParams,
} from '../lib/api/auth';
import { uploadAvatar, persistUserPhoto } from '../lib/api/storage';

const FAV_KEY = '@fightlab/favorites';

// Lazy AsyncStorage — avoids SSR crash (window is not defined)
function asyncStorage() {
  if (typeof window === 'undefined') return null;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require('@react-native-async-storage/async-storage').default;
}

async function loadFavorites(userId: string): Promise<string[]> {
  const storage = asyncStorage();
  if (!storage) return [];
  try {
    const raw = await storage.getItem(`${FAV_KEY}/${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function saveFavorites(userId: string, ids: string[]): Promise<void> {
  const storage = asyncStorage();
  if (!storage) return;
  try {
    await storage.setItem(`${FAV_KEY}/${userId}`, JSON.stringify(ids));
  } catch {}
}

// ─── Context shape ────────────────────────────────────────────────

export interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (params: SignUpParams) => Promise<{ error?: string }>;
  signInAsAdmin: () => Promise<void>;
  signInAsDemo: (role?: 'student' | 'trainer') => Promise<void>;
  signOut: () => Promise<void>;
  toggleFavorite: (trainerId: string) => Promise<void>;
  updateUserPhoto: (uri: string) => Promise<{ error?: string }>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    // Restore existing session on mount
    getSessionUser().then(async (u) => {
      if (!mounted.current) return;
      if (u) {
        const favs = await loadFavorites(u.id);
        setUser({ ...u, favoriteTrainerIds: favs });
      }
      setLoading(false);
    });

    // React to auth state changes (token refresh, sign-out from another tab, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted.current) return;
      if (event === 'SIGNED_IN' && session?.user) {
        const u = await getSessionUser();
        if (u && mounted.current) {
          const favs = await loadFavorites(u.id);
          setUser({ ...u, favoriteTrainerIds: favs });
        }
      } else if (event === 'SIGNED_OUT') {
        if (mounted.current) setUser(null);
      }
    });

    return () => {
      mounted.current = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const result = await apiSignIn(email, password);
    if (result.error) return { error: result.error };
    if (result.user) {
      const favs = await loadFavorites(result.user.id);
      setUser({ ...result.user, favoriteTrainerIds: favs });
    }
    return {};
  }, []);

  const signUp = useCallback(async (params: SignUpParams) => {
    const result = await apiSignUp(params);
    if (result.error) return { error: result.error };
    if (result.user) setUser({ ...result.user, favoriteTrainerIds: [] });
    return {};
  }, []);

  const signInAsAdmin = useCallback(async () => {
    setUser(mockAdmin);
  }, []);

  const signInAsDemo = useCallback(async (role: 'student' | 'trainer' = 'student') => {
    setUser(role === 'trainer' ? mockTrainerUser : mockStudent);
  }, []);

  const signOut = useCallback(async () => {
    await apiSignOut();
    setUser(null);
  }, []);

  const updateUserPhoto = useCallback(
    async (uri: string) => {
      if (!user) return { error: 'Não autenticado.' };
      const result = await uploadAvatar(user.id, uri);
      if (result.error) return { error: result.error };
      if (result.url) {
        await persistUserPhoto(user.id, result.url);
        setUser((prev) => (prev ? { ...prev, photo: result.url! } : prev));
      }
      return {};
    },
    [user]
  );

  const toggleFavorite = useCallback(
    async (trainerId: string) => {
      if (!user) return;
      const has = user.favoriteTrainerIds.includes(trainerId);
      const next = has
        ? user.favoriteTrainerIds.filter((id) => id !== trainerId)
        : [...user.favoriteTrainerIds, trainerId];
      await saveFavorites(user.id, next);
      setUser({ ...user, favoriteTrainerIds: next });
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, signUp, signInAsAdmin, signInAsDemo, signOut, toggleFavorite, updateUserPhoto }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
