import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  role: 'volunteer' | 'admin';
  avatar?: string;
  phone?: string;
  location?: string;
  birthDate?: string;
  joinDate?: string;
  completedProjects?: number;
  volunteerHours?: number;
  recognitions?: number;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Transforma el perfil de Supabase al formato de User de la app
const transformProfile = (profile: any, email: string): User => {
  return {
    id: profile.id,
    firstName: profile.first_name || '',
    lastName: profile.last_name || '',
    fullName: `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
    email: email,
    role: profile.role || 'volunteer',
    avatar: profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(`${profile.first_name} ${profile.last_name}`)}&background=3b82f6&color=fff`,
    phone: profile.phone || '',
    location: profile.location || '',
    birthDate: profile.birth_date || '',
    joinDate: profile.created_at?.split('T')[0] || '',
    completedProjects: 0,
    volunteerHours: 0,
    recognitions: 0,
  };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar perfil desde Supabase
  const loadProfile = async (supabaseUser: SupabaseUser) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error) {
        console.error('Error loading profile:', error);
        return null;
      }

      return transformProfile(profile, supabaseUser.email || '');
    } catch (error) {
      console.error('Error in loadProfile:', error);
      return null;
    }
  };

  // Inicializar sesión y escuchar cambios
  useEffect(() => {
    // Obtener sesión actual
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        const profile = await loadProfile(session.user);
        setUser(profile);
      }
      setIsLoading(false);
    });

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      
      if (event === 'SIGNED_IN' && session?.user) {
        const profile = await loadProfile(session.user);
        setUser(profile);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error.message);
        return false;
      }

      if (data.user) {
        const profile = await loadProfile(data.user);
        setUser(profile);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login exception:', error);
      return false;
    }
  };

  const register = async (firstName: string, lastName: string, email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) {
        console.error('Register error:', error.message);
        return false;
      }

      // Si el usuario se creó exitosamente, el trigger de la BD creará el perfil
      if (data.user) {
        // Esperar un momento para que el trigger cree el perfil
        await new Promise(resolve => setTimeout(resolve, 500));
        const profile = await loadProfile(data.user);
        setUser(profile);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Register exception:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;

    try {
      // Mapear campos de User a campos de la BD
      const dbUpdates: any = {};
      if (updates.firstName !== undefined) dbUpdates.first_name = updates.firstName;
      if (updates.lastName !== undefined) dbUpdates.last_name = updates.lastName;
      if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
      if (updates.location !== undefined) dbUpdates.location = updates.location;
      if (updates.birthDate !== undefined) dbUpdates.birth_date = updates.birthDate;
      if (updates.avatar !== undefined) dbUpdates.avatar_url = updates.avatar;

      const { error } = await supabase
        .from('profiles')
        .update(dbUpdates)
        .eq('id', user.id);

      if (error) {
        console.error('Update profile error:', error);
        return;
      }

      // Actualizar estado local
      let finalUpdates = { ...updates };
      if (updates.firstName || updates.lastName) {
        const newFirstName = updates.firstName || user.firstName;
        const newLastName = updates.lastName || user.lastName;
        finalUpdates.fullName = `${newFirstName} ${newLastName}`;
      }

      setUser(prev => prev ? { ...prev, ...finalUpdates } : null);
    } catch (error) {
      console.error('Update user exception:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};
