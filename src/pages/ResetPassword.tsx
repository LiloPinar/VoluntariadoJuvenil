import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const params = new URLSearchParams(location.search);
  const token = params.get('token') || '';

  const [valid, setValid] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    const stored = JSON.parse(localStorage.getItem('passwordResetTokens') || '[]');
    const found = stored.find((t: any) => t.token === token);
    if (!found) {
      toast({ title: 'Enlace inválido', description: 'El enlace de recuperación no es válido.' });
      setValid(false);
      return;
    }
    if (found.expiresAt < Date.now()) {
      toast({ title: 'Enlace expirado', description: 'El enlace de recuperación ha expirado.' });
      setValid(false);
      return;
    }
    setValid(true);
  }, [token]);

  const handleSubmit = (e: React.FormEvent) => {
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
    // Buscar token y actualizar contraseña en localStorage
    const stored = JSON.parse(localStorage.getItem('passwordResetTokens') || '[]');
    const found = stored.find((t: any) => t.token === token);
    if (!found) {
      toast({ title: 'Error', description: 'Token no encontrado.' });
      setIsLoading(false);
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const idx = users.findIndex((u: any) => u.email === found.email);
    if (idx === -1) {
      toast({ title: 'Error', description: 'Usuario no encontrado.' });
      setIsLoading(false);
      return;
    }

    users[idx].password = password; // En producción: hashear
    localStorage.setItem('users', JSON.stringify(users));

    // Borrar token
    const remaining = stored.filter((t: any) => t.token !== token);
    localStorage.setItem('passwordResetTokens', JSON.stringify(remaining));

    toast({ title: 'Contraseña actualizada', description: 'Ahora puedes iniciar sesión con tu nueva contraseña.' });

    setIsLoading(false);
    navigate('/login');
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Enlace inválido</CardTitle>
          </CardHeader>
          <CardContent>
            <p>El enlace de recuperación no contiene un token válido.</p>
            <div className="mt-4">
              <Link to="/forgot-password">
                Volver a solicitar enlace
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
          {!valid ? (
            <p>Validando enlace...</p>
          ) : (
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
