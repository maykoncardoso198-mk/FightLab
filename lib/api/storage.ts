import { supabase, isSupabaseConfigured } from '../supabase';

const BUCKET = 'avatars';

export async function uploadAvatar(
  userId: string,
  uri: string
): Promise<{ url?: string; error?: string }> {
  // Demo mode: return the original URI unchanged
  if (!isSupabaseConfigured || !supabase) return { url: uri };

  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const ext = blob.type === 'image/png' ? 'png' : 'jpg';
    const path = `${userId}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, blob, {
        upsert: true,
        contentType: blob.type || 'image/jpeg',
      });

    if (uploadError) return { error: uploadError.message };

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    // Cache-bust so a re-uploaded avatar refreshes immediately
    return { url: `${data.publicUrl}?t=${Date.now()}` };
  } catch (e: any) {
    return { error: e?.message ?? 'Erro ao enviar foto.' };
  }
}

export async function persistUserPhoto(userId: string, url: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    await supabase.from('users').update({ foto_url: url }).eq('id', userId);
  } catch {}
}
