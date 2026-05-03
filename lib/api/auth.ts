import { supabase, isSupabaseConfigured } from '../supabase';
import { User } from '../../data/types';
import { mockStudent } from '../../data/user';

export interface SignUpParams {
  name: string;
  email: string;
  password: string;
  city?: string;
  role: 'student' | 'trainer';
}

function mapUserRow(row: any): User {
  const roleMap: Record<string, User['role']> = {
    aluno: 'student',
    professor: 'trainer',
    admin: 'admin',
  };
  return {
    id: row.id,
    name: row.nome ?? '',
    email: row.email ?? '',
    city: row.cidade ?? '',
    photo: row.foto_url ?? `https://i.pravatar.cc/150?u=${row.id}`,
    role: roleMap[row.tipo] ?? 'student',
    favoriteTrainerIds: [],
  };
}

function translateError(msg: string): string {
  if (msg.includes('Invalid login credentials')) return 'Email ou senha incorretos.';
  if (msg.includes('Email not confirmed')) return 'Confirme seu email antes de entrar.';
  if (msg.includes('User already registered')) return 'Este email já está cadastrado.';
  if (msg.includes('Password should be at least')) return 'Senha deve ter no mínimo 6 caracteres.';
  if (msg.includes('Unable to validate email')) return 'Email inválido.';
  return msg;
}

export async function apiSignIn(
  email: string,
  password: string
): Promise<{ user?: User; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return { user: { ...mockStudent, email } };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: translateError(error.message) };

    const { data: profile, error: pErr } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (pErr || !profile) return { error: 'Perfil não encontrado.' };
    return { user: mapUserRow(profile) };
  } catch {
    return { error: 'Erro de conexão. Tente novamente.' };
  }
}

export async function apiSignUp(
  params: SignUpParams
): Promise<{ user?: User; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      user: {
        ...mockStudent,
        name: params.name,
        email: params.email,
        city: params.city ?? '',
        role: params.role,
      },
    };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: params.email,
      password: params.password,
      options: {
        data: {
          nome: params.name,
          tipo: params.role === 'trainer' ? 'professor' : 'aluno',
        },
      },
    });

    if (error) return { error: translateError(error.message) };
    if (!data.user) return { error: 'Erro ao criar conta.' };

    if (params.city) {
      await supabase
        .from('users')
        .update({ cidade: params.city })
        .eq('id', data.user.id);
    }

    return {
      user: {
        id: data.user.id,
        name: params.name,
        email: params.email,
        city: params.city ?? '',
        photo: `https://i.pravatar.cc/150?u=${data.user.id}`,
        role: params.role,
        favoriteTrainerIds: [],
      },
    };
  } catch {
    return { error: 'Erro de conexão. Tente novamente.' };
  }
}

export async function apiSignOut(): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    await supabase.auth.signOut();
  } catch {}
}

export async function getSessionUser(): Promise<User | null> {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session?.user) return null;

    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    return data ? mapUserRow(data) : null;
  } catch {
    return null;
  }
}
