import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string; // Calculado: firstName + lastName
  email: string;
  role: 'volunteer' | 'admin'; // Rol del usuario
  avatar?: string;
  phone?: string;
  location?: string;
  birthDate?: string;
  joinDate?: string;
  // Estadísticas del usuario
  completedProjects?: number;
  volunteerHours?: number;
  recognitions?: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean; // Estado de carga para evitar redirecciones prematuras
  login: (email: string, password: string) => Promise<boolean>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Emails de administradores
const ADMIN_EMAILS = [
  'admin@voluntariajoven.com', 
  'admin@gmail.com', 
  'saul@admin.com',
  // Agrega tu email aquí para tener acceso de administrador
  // 'tuemail@example.com'
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Estado de carga inicial

  // Función helper para determinar el rol
  const getUserRole = (email: string): 'volunteer' | 'admin' => {
    return ADMIN_EMAILS.includes(email.toLowerCase()) ? 'admin' : 'volunteer';
  };

  // Cargar usuario desde localStorage al montar y crear admin por defecto si no existe
  useEffect(() => {
    // Migración: Actualizar usuarios antiguos con fullName a firstName/lastName y rol
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    let needsUpdate = false;

    // Crear cuenta admin por defecto si no existe
    const defaultAdminEmail = 'admin@gmail.com';
    const defaultAdminPassword = 'admin123';
    if (!users.some((u: any) => u.email === defaultAdminEmail)) {
      const adminUser = {
        id: Date.now().toString(),
        firstName: 'Admin',
        lastName: 'Principal',
        fullName: 'Admin Principal',
        email: defaultAdminEmail,
        password: defaultAdminPassword,
        role: 'admin',
        avatar: `https://ui-avatars.com/api/?name=Admin+Principal&background=3b82f6&color=fff`,
        phone: '',
        location: '',
        birthDate: '',
        joinDate: new Date().toISOString().split('T')[0],
        completedProjects: 0,
        volunteerHours: 0,
        recognitions: 0,
      };
      users.push(adminUser);
      localStorage.setItem('users', JSON.stringify(users));
    }

    const migratedUsers = users.map((u: any) => {
      let updated = { ...u };
      if (!u.firstName || !u.lastName) {
        needsUpdate = true;
        const nameParts = (u.fullName || 'Usuario Anónimo').split(' ');
        updated = {
          ...updated,
          firstName: nameParts[0] || 'Usuario',
          lastName: nameParts.slice(1).join(' ') || 'Anónimo',
          fullName: u.fullName || `${nameParts[0]} ${nameParts.slice(1).join(' ')}`,
        };
      }
      // Asignar rol si no existe
      if (!u.role) {
        needsUpdate = true;
        updated.role = getUserRole(u.email);
      }
      return updated;
    });
    if (needsUpdate) {
      localStorage.setItem('users', JSON.stringify(migratedUsers));
    }

    // Cargar usuario actual
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      // Migrar usuario actual si es necesario
      let migratedCurrentUser = { ...parsedUser };
      let needsMigration = false;
      if (!parsedUser.firstName || !parsedUser.lastName) {
        needsMigration = true;
        const nameParts = (parsedUser.fullName || 'Usuario Anónimo').split(' ');
        migratedCurrentUser = {
          ...migratedCurrentUser,
          firstName: nameParts[0] || 'Usuario',
          lastName: nameParts.slice(1).join(' ') || 'Anónimo',
          fullName: parsedUser.fullName || `${nameParts[0]} ${nameParts.slice(1).join(' ')}`,
        };
      }
      // Asignar rol si no existe
      if (!parsedUser.role) {
        needsMigration = true;
        migratedCurrentUser.role = getUserRole(parsedUser.email);
      }
      if (needsMigration) {
        setUser(migratedCurrentUser);
        localStorage.setItem('currentUser', JSON.stringify(migratedCurrentUser));
      } else {
        setUser(parsedUser);
      }
    }
    
    // Marcar como cargado después de verificar localStorage
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulación - En producción conectar con API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Buscar usuario en localStorage (simulación de BD)
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      // Asegurar que tenga rol
      const userWithRole = {
        ...userWithoutPassword,
        role: userWithoutPassword.role || getUserRole(email)
      };
      setUser(userWithRole);
      localStorage.setItem('currentUser', JSON.stringify(userWithRole));
      return true;
    }
    
    return false;
  };

  const register = async (firstName: string, lastName: string, email: string, password: string): Promise<boolean> => {
    // Simulación - En producción conectar con API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Verificar si el email ya existe
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const emailExists = users.some((u: any) => u.email === email);
    
    if (emailExists) {
      return false;
    }
    
    const fullName = `${firstName} ${lastName}`;
    const role = getUserRole(email);
    
    // Crear nuevo usuario
    const newUser = {
      id: Date.now().toString(),
      firstName,
      lastName,
      fullName,
      email,
      password, // En producción: hashear con bcrypt
      role, // Asignar rol
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=3b82f6&color=fff`,
      phone: '',
      location: '',
      birthDate: '',
      joinDate: new Date().toISOString().split('T')[0], // Fecha actual
      // Estadísticas iniciales en 0
      completedProjects: 0,
      volunteerHours: 0,
      recognitions: 0,
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto-login después de registro
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    
    // Si se actualiza firstName o lastName, recalcular fullName
    let finalUpdates = { ...updates };
    if (updates.firstName || updates.lastName) {
      const newFirstName = updates.firstName || user.firstName;
      const newLastName = updates.lastName || user.lastName;
      finalUpdates.fullName = `${newFirstName} ${newLastName}`;
    }
    
    const updatedUser = { ...user, ...finalUpdates };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Actualizar también en la lista de usuarios
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...finalUpdates };
      localStorage.setItem('users', JSON.stringify(users));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
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
