import { supabase } from '@/lib/supabaseClient';

export interface VolunteerRecord {
  id: string;
  auth_user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  birth_date: string | null;
  location: string | null;
  bio: string | null;
  joined_at: string;
  total_hours: number;
  created_at: string;
  updated_at: string;
}

export interface VolunteerPayload {
  auth_user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  birth_date?: string | null;
  location?: string | null;
  bio?: string | null;
  total_hours?: number;
}

const TABLE_NAME = 'volunteers';

export async function fetchVolunteerByAuthId(authUserId: string) {
  const { data, error } = await supabase
    .from<VolunteerRecord>(TABLE_NAME)
    .select('*')
    .eq('auth_user_id', authUserId)
    .single();

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}

export async function createVolunteer(payload: VolunteerPayload) {
  const { data, error } = await supabase
    .from<VolunteerRecord>(TABLE_NAME)
    .insert({
      ...payload,
      phone: payload.phone ?? null,
      birth_date: payload.birth_date ?? null,
      location: payload.location ?? null,
      bio: payload.bio ?? null,
      total_hours: payload.total_hours ?? 0,
    })
    .select()
    .single();

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}

export async function updateVolunteer(id: string, updates: Partial<VolunteerPayload>) {
  const { data, error } = await supabase
    .from<VolunteerRecord>(TABLE_NAME)
    .update({
      ...updates,
      phone: updates.phone ?? null,
      birth_date: updates.birth_date ?? null,
      location: updates.location ?? null,
      bio: updates.bio ?? null,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return { data: null, error };
  }

  return { data, error: null };
}
