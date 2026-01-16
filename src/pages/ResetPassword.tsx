import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [valid, setValid] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Verificar si el usuario llegó via enlace de recuperación de Supabase
  useEffect(() => {
    const checkSession = async () => {
      // Supabase maneja el token automáticamente del hash de la URL
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error checking session:', error);
        toast({ title: 'Error', description: 'Hubo un error al verificar el enlace.' });
        setValid(false);
        setIsChecking(false);
        return;
      }

      if (session) {
        // El usuario está autenticado via el enlace de recuperación
        setValid(true);
      } else {
        toast({ title: 'Enlace inválido', description: 'El enlace de recuperación no es válido o ha expirado.' });
        setValid(false);
      }
      setIsChecking(false);
    };

    checkSession();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    
    if (password.length < 6) {
      toast({ title: 'Contraseña débil', description: 'La contraseña debe tener al menos 6 caracteres.' });
      return;
    }
    if (password !== confirm) {
      toast({ title: 'No coincide', description: 'Las contraseñas no coinciden.' });
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        toast({ title: 'Error', description: error.message });
        setIsLoading(false);
        return;
      }

      toast({ title: 'Contraseña actualizada', description: 'Ahora puedes iniciar sesión con tu nueva contraseña.' });
      
      // Cerrar sesión para que el usuario inicie con la nueva contraseña
      await supabase.auth.signOut();
      
      navigate('/login');
    } catch (error) {
      toast({ title: 'Error', description: 'Ocurrió un error al actualizar la contraseña.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Verificando enlace...</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Validando tu enlace de recuperación...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!valid) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Enlace inválido</CardTitle>
          </CardHeader>
          <CardContent>
            <p>El enlace de recuperación no es válido o ha expirado.</p>
            <div className="mt-4">
              <Link to="/forgot-password" className="text-primary hover:underline">
                Solicitar nuevo enlace
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Restablecer Contraseña</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input type="password" placeholder="Nueva contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div>
              <Input type="password" placeholder="Confirmar contraseña" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Guardando...' : 'Guardar contraseña'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
