import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLocale } from '@/i18n/LocaleContext';
import { useAuthContext } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { validatePassword } from '@/validations';
import { 
  KeyRound, 
  Trash2, 
  Bell, 
  Eye, 
  EyeOff,
  Volume2, 
  Contrast, 
  Type,
  Moon,
  Sun,
  AlertCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Configuracion = () => {
  const { t } = useLocale();
  const { user, logout } = useAuthContext();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Estados para cambio de contraseña
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  // Estados para mostrar/ocultar contraseñas
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Estados para notificaciones
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [projectNotifications, setProjectNotifications] = useState(() => {
    const saved = localStorage.getItem('projectNotifications');
    return saved !== null ? saved === 'true' : true; // Por defecto activado
  });
  const [reminderNotifications, setReminderNotifications] = useState(() => {
    const saved = localStorage.getItem('reminderNotifications');
    return saved !== null ? saved === 'true' : true; // Por defecto activado
  });

  // Estados para accesibilidad
  const [voiceReading, setVoiceReading] = useState(() => {
    return localStorage.getItem('voiceReading') === 'true';
  });
  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem('highContrast') === 'true';
  });
  const [largeText, setLargeText] = useState(() => {
    return localStorage.getItem('largeText') === 'true';
  });
  const [darkMode, setDarkMode] = useState(() => {
    // Cargar preferencia de localStorage
    return localStorage.getItem('darkMode') === 'true';
  });

  // Scroll al top cuando se carga la página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Aplicar tema oscuro al cargar
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Aplicar alto contraste
  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  // Aplicar texto ampliado
  useEffect(() => {
    if (largeText) {
      document.documentElement.classList.add('large-text');
    } else {
      document.documentElement.classList.remove('large-text');
    }
  }, [largeText]);

  // Manejo cambio de contraseña
  const handlePasswordChange = (field: string, value: string) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }));
    
    // Validar en tiempo real
    if (field === 'newPassword') {
      const error = validatePassword(value, t);
      setPasswordErrors(prev => ({ ...prev, newPassword: error }));
    }
    
    if (field === 'confirmPassword') {
      const error = value !== passwordForm.newPassword ? 'Las contraseñas no coinciden' : '';
      setPasswordErrors(prev => ({ ...prev, confirmPassword: error }));
    }
  };

  const handleSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    const errors: Record<string, string> = {};
    
    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Campo requerido';
    }
    
    const newPasswordError = validatePassword(passwordForm.newPassword, t);
    if (newPasswordError) {
      errors.newPassword = newPasswordError;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    setPasswordErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return;
    }
    
    setIsChangingPassword(true);
    
    try {
      // Obtener usuarios de localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === user?.id);
      
      if (userIndex === -1) {
        throw new Error('Usuario no encontrado');
      }
      
      // Verificar contraseña actual
      if (users[userIndex].password !== passwordForm.currentPassword) {
        setPasswordErrors({ currentPassword: 'La contraseña actual es incorrecta' });
        toast({
          title: "Contraseña incorrecta",
          description: "La contraseña actual que ingresaste no es correcta.",
          variant: "destructive",
        });
        setIsChangingPassword(false);
        return;
      }
      
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Actualizar contraseña en la lista de usuarios
      users[userIndex].password = passwordForm.newPassword;
      localStorage.setItem('users', JSON.stringify(users));
      
      toast({
        title: "Contraseña actualizada",
        description: "Tu contraseña se ha cambiado correctamente. Serás redirigido al inicio de sesión.",
        className: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 dark:text-green-50",
      });
      
      // Limpiar formulario
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordErrors({});
      
      // Cerrar sesión y redirigir al login después de 2 segundos
      setTimeout(() => {
        logout();
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      toast({
        title: "Error al cambiar contraseña",
        description: "Por favor, intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = () => {
    // Eliminar cuenta
    toast({
      title: "Cuenta eliminada",
      description: "Tu cuenta ha sido eliminada permanentemente.",
      variant: "destructive",
    });
    
    logout();
    navigate('/');
  };

  const handleToggleDarkMode = (checked: boolean) => {
    setDarkMode(checked);
    
    // Aplicar o remover clase 'dark' al HTML
    if (checked) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
    
    toast({
      title: checked ? "Modo oscuro activado" : "Modo claro activado",
      description: "El tema se ha actualizado correctamente.",
    });
  };

  const handleToggleHighContrast = (checked: boolean) => {
    setHighContrast(checked);
    localStorage.setItem('highContrast', checked.toString());
    
    toast({
      title: checked ? "Alto contraste activado" : "Alto contraste desactivado",
      description: checked ? "Se aumentó el contraste de colores para mejor visibilidad." : "Se restauró el contraste normal.",
    });
  };

  const handleToggleLargeText = (checked: boolean) => {
    setLargeText(checked);
    localStorage.setItem('largeText', checked.toString());
    
    toast({
      title: checked ? "Texto ampliado activado" : "Texto normal",
      description: checked ? "El tamaño del texto se ha incrementado." : "Se restauró el tamaño normal del texto.",
    });
  };

  const handleToggleVoiceReading = (checked: boolean) => {
    setVoiceReading(checked);
    localStorage.setItem('voiceReading', checked.toString());
    
    // Disparar evento personalizado para que SelectionReader se actualice
    window.dispatchEvent(new Event('voiceReadingChanged'));
    
    toast({
      title: checked ? "Lectura por voz activada" : "Lectura por voz desactivada",
      description: checked ? "Selecciona texto para escucharlo en voz alta." : "La lectura automática está deshabilitada.",
    });
  };

  const handleToggleProjectNotifications = (checked: boolean) => {
    setProjectNotifications(checked);
    localStorage.setItem('projectNotifications', checked.toString());
    
    toast({
      title: checked ? "Notificaciones de proyectos activadas" : "Notificaciones de proyectos desactivadas",
      description: checked ? "Recibirás avisos sobre nuevos proyectos." : "No recibirás avisos sobre nuevos proyectos.",
    });
  };

  const handleToggleReminderNotifications = (checked: boolean) => {
    setReminderNotifications(checked);
    localStorage.setItem('reminderNotifications', checked.toString());
    
    toast({
      title: checked ? "Recordatorios activados" : "Recordatorios desactivados",
      description: checked ? "Recibirás recordatorios de eventos y actividades." : "No recibirás recordatorios.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage="Configuración" />
      
      <main className="flex-1 bg-gradient-to-br from-muted/30 via-background to-muted/20 px-4 py-12">
        <div className="container max-w-4xl mx-auto space-y-8">
          
          {/* Encabezado */}
          <div>
            <h1 className="text-3xl font-bold">{t('configuracion_title')}</h1>
            <p className="text-muted-foreground mt-1">
              {t('configuracion_desc')}
            </p>
          </div>

          {/* Seguridad - Cambiar Contraseña */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <KeyRound className="h-5 w-5" />
                Seguridad
              </CardTitle>
              <CardDescription>
                Cambia tu contraseña para mantener tu cuenta segura
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Contraseña Actual</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                      className={passwordErrors.currentPassword ? 'border-destructive pr-10' : 'pr-10'}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {passwordErrors.currentPassword && (
                    <p className="text-sm text-destructive">{passwordErrors.currentPassword}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nueva Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      className={passwordErrors.newPassword ? 'border-destructive pr-10' : 'pr-10'}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {passwordErrors.newPassword && (
                    <p className="text-sm text-destructive">{passwordErrors.newPassword}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      className={passwordErrors.confirmPassword ? 'border-destructive pr-10' : 'pr-10'}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {passwordErrors.confirmPassword && (
                    <p className="text-sm text-destructive">{passwordErrors.confirmPassword}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  disabled={isChangingPassword}
                  className="w-full sm:w-auto"
                >
                  {isChangingPassword ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cambiando...
                    </>
                  ) : (
                    <>
                      <KeyRound className="mr-2 h-4 w-4" />
                      Cambiar Contraseña
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Apariencia */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                Apariencia
              </CardTitle>
              <CardDescription>
                Personaliza la apariencia de la aplicación
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Modo Oscuro</Label>
                  <p className="text-sm text-muted-foreground">
                    Cambia entre tema claro y oscuro
                  </p>
                </div>
                <Switch
                  checked={darkMode}
                  onCheckedChange={handleToggleDarkMode}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notificaciones */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                {t('preferencias_notificaciones')}
              </CardTitle>
              <CardDescription>
                Administra cómo y cuándo recibes notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Notificaciones por Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Recibe actualizaciones en tu correo
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">{t('notif_nuevos_proyectos')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('notif_nuevos_proyectos_desc')}
                  </p>
                </div>
                <Switch
                  checked={projectNotifications}
                  onCheckedChange={handleToggleProjectNotifications}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">{t('notif_recordatorios')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('notif_recordatorios_desc')}
                  </p>
                </div>
                <Switch
                  checked={reminderNotifications}
                  onCheckedChange={handleToggleReminderNotifications}
                />
              </div>
            </CardContent>
          </Card>

          {/* Accesibilidad */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                {t('preferencias_accesibilidad')}
              </CardTitle>
              <CardDescription>
                Opciones para mejorar tu experiencia de uso
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5 flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label className="text-base">{t('lectura_voz')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('lectura_voz_desc')}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={voiceReading}
                  onCheckedChange={handleToggleVoiceReading}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5 flex items-center gap-2">
                  <Contrast className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label className="text-base">{t('alto_contraste')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('alto_contraste_desc')}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={highContrast}
                  onCheckedChange={handleToggleHighContrast}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5 flex items-center gap-2">
                  <Type className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label className="text-base">{t('texto_ampliado')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('texto_ampliado_desc')}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={largeText}
                  onCheckedChange={handleToggleLargeText}
                />
              </div>
            </CardContent>
          </Card>

          {/* Zona Peligrosa - Eliminar Cuenta */}
          <Card className="border-2 border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Trash2 className="h-5 w-5" />
                Zona Peligrosa
              </CardTitle>
              <CardDescription>
                Acciones irreversibles sobre tu cuenta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-destructive/50 bg-destructive/10">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <AlertDescription className="text-sm">
                  <strong>Advertencia:</strong> Esta acción no se puede deshacer. Se eliminarán permanentemente todos tus datos, proyectos y estadísticas.
                </AlertDescription>
              </Alert>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full sm:w-auto">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar mi cuenta
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. Eliminará permanentemente tu cuenta
                      y removerá todos tus datos de nuestros servidores.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      Sí, eliminar mi cuenta
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>

          {/* Info adicional */}
          <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-sm text-blue-900 dark:text-blue-50">
              Todos los cambios se guardan automáticamente y se aplican inmediatamente.
            </AlertDescription>
          </Alert>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Configuracion;
