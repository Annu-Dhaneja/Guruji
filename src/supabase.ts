import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Safe extraction of Supabase environment credentials
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('placeholder')
);

// Fallback dummy client if credentials not yet configured
let supabaseInstance: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  } catch (err) {
    console.warn('[Supabase] Failed to initialize client:', err);
  }
}

export const supabase = supabaseInstance;

/**
 * Helper to upload asset to Supabase Storage if configured, or return fallback URL
 */
export async function uploadToSupabaseStorage(
  bucket: string,
  path: string,
  file: File | Blob
): Promise<{ url: string | null; error: Error | null }> {
  if (!supabase) {
    return { url: null, error: new Error('Supabase not configured') };
  }

  try {
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
      upsert: true,
    });

    if (error) throw error;

    const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(data.path);
    return { url: publicData.publicUrl, error: null };
  } catch (err: any) {
    return { url: null, error: err };
  }
}
