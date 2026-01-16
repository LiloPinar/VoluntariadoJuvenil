import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file.'
  )
}

// Cliente de Supabase con tipos TypeScript
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
  },
})

// Helper para subir archivos a Storage
export const uploadFile = async (
  bucket: string,
  path: string,
  file: File
): Promise<{ path: string | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true, // Permite sobrescribir el archivo existente
      })

    if (error) throw error

    return { path: data.path, error: null }
  } catch (error) {
    return { path: null, error: error as Error }
  }
}

// Helper para eliminar archivos de Storage
export const deleteFile = async (
  bucket: string,
  path: string
): Promise<{ error: Error | null }> => {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path])

    if (error) throw error

    return { error: null }
  } catch (error) {
    return { error: error as Error }
  }
}

// Helper para obtener URL pública de un archivo
export const getPublicUrl = (bucket: string, path: string): string => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}
