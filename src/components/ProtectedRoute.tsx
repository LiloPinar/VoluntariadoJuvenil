import { Navigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireRole?: 'volunteer' | 'admin';
}

export const ProtectedRoute = ({ children, requireRole }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuthContext();

  // Mientras carga, no redirigir (evita flash de login)
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si requiere un rol específico y no coincide, redirigir
  if (requireRole && user?.role !== requireRole) {
    // Si es admin tratando de acceder a rutas de voluntario, permitir
    if (user?.role === 'admin' && requireRole === 'volunteer') {
      return <>{children}</>;
    }
    // Si es voluntario tratando de acceder a rutas de admin, redirigir
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
