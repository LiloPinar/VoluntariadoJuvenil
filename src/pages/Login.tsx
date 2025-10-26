import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLocale } from '@/i18n/LocaleContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LogIn, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useLoginForm } from '@/hooks/useLoginForm';
import { useAuthContext } from '@/contexts/AuthContext';

const Login = () => {
  const { t } = useLocale();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { login: authContextLogin } = useAuthContext();
  const { rememberedEmail, login: authLogin } = useAuth();
  const { formData, errors, touched, handleChange, handleBlur, validateAll } = useLoginForm(rememberedEmail);

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Manejo del envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAll(t)) {
      toast({
        title: "Error en el formulario",
        description: "Por favor, corrige los errores antes de continuar.",
        variant: "destructive",
      });
      return;
    }

    // Intentar iniciar sesión con el hook useAuth
    setIsLoading(true);

    try {
      const result = await authLogin(formData.email, formData.password, formData.rememberMe);

      if (result.success) {
        // Login exitoso - Guardar en AuthContext
        const loginSuccess = await authContextLogin(formData.email, formData.password);
        
        if (loginSuccess) {
          toast({
            title: t('login_success'),
            description: `${t('home_title')}`,
            className: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 dark:text-green-50",
          });
          
          // Redirigir a la página de retorno o al inicio
          const returnTo = (location.state as { returnTo?: string })?.returnTo || '/';
          setTimeout(() => navigate(returnTo), 500);
        }
      } else {
        if (result.isLocked) {
          toast({
            title: "🔒 Cuenta bloqueada temporalmente",
            description: result.message,
            variant: "destructive",
            duration: 6000,
          });
        } else if (result.userNotFound) {
          // Usuario no existe - mensaje sin contador
          toast({
            title: "📧 Correo no encontrado",
            description: result.message,
            variant: "destructive",
            duration: 5000,
          });
        } else if (result.wrongPassword) {
          // Contraseña incorrecta - mensaje con contador
          toast({
            title: "🔑 Contraseña incorrecta",
            description: result.message,
            variant: "destructive",
            duration: 5000,
          });
        } else {
          // Caso genérico
          toast({
            title: "❌ Error al iniciar sesión",
            description: result.message,
            variant: "destructive",
            duration: 5000,
          });
        }
      }
    } catch (error) {
      toast({
        title: t('login_error'),
        description: "Ocurrió un error inesperado. Por favor, intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Manejo de Enter para navegar
  const handleKeyPress = (e: React.KeyboardEvent, nextField?: () => void) => {
    if (e.key === 'Enter' && nextField) {
      e.preventDefault();
      nextField();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage={t('inicio_sesion')} />
      
      <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-muted/30 via-background to-muted/20 px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-md space-y-4 sm:space-y-6">
          
          {/* Bienvenida */}
          <div className="text-center space-y-2">
            <div className="inline-flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent shadow-lg mb-3 sm:mb-4">
              <LogIn className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t('login_title')}</h1>
            <p className="text-sm sm:text-base text-muted-foreground">{t('login_subtitle')}</p>
          </div>

          {/* Formulario */}
          <Card className="border-2 shadow-xl">
            <CardHeader className="space-y-1 pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl font-semibold text-center">
                {t('inicio_sesion')}
              </CardTitle>
              <CardDescription className="text-center text-xs sm:text-sm">
                {t('home_sub')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                
                {/* Alerta de bloqueo - REMOVIDA: No debe aparecer aquí porque el bloqueo se verifica por email específico al enviar */}

                {/* Campo Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    {t('email')} <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={t('email_placeholder')}
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value, t)}
                      onBlur={() => handleBlur('email', t)}
                      onKeyDown={(e) => handleKeyPress(e, () => document.getElementById('password')?.focus())}
                      className={`pl-10 h-11 ${errors.email && touched.email ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                      aria-invalid={!!(errors.email && touched.email)}
                      aria-describedby={errors.email && touched.email ? 'email-error' : undefined}
                      disabled={isLoading}
                    />
                    {!errors.email && touched.email && formData.email && (
                      <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                    )}
                  </div>
                  {errors.email && touched.email && (
                    <p id="email-error" className="text-sm text-destructive flex items-center gap-1.5 mt-1">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Campo Contraseña */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    {t('password')} <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t('password_placeholder')}
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value, t)}
                      onBlur={() => handleBlur('password', t)}
                      className={`pl-10 pr-10 h-11 ${errors.password && touched.password ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                      aria-invalid={!!(errors.password && touched.password)}
                      aria-describedby={errors.password && touched.password ? 'password-error' : undefined}
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {errors.password && touched.password && (
                    <p id="password-error" className="text-sm text-destructive flex items-center gap-1.5 mt-1">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Recordarme y Olvidé contraseña */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) => handleChange('rememberMe', checked as boolean, t)}
                      disabled={isLoading}
                    />
                    <label
                      htmlFor="remember"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {t('remember_me')}
                    </label>
                  </div>
                  <NavLink
                    to="/forgot-password"
                    className="text-sm font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-1"
                    tabIndex={isLoading ? -1 : 0}
                  >
                    {t('forgot_password')}
                  </NavLink>
                </div>

                {/* Botón de envío */}
                <Button
                  type="submit"
                  className="w-full h-10 sm:h-11 bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-md text-sm sm:text-base font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Iniciando sesión...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      {t('login_button')}
                    </>
                  )}
                </Button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      o
                    </span>
                  </div>
                </div>

                {/* Link a registro */}
                <div className="text-center text-sm">
                  <span className="text-muted-foreground">{t('no_account')} </span>
                  <NavLink
                    to="/register"
                    className="font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-1"
                  >
                    {t('create_account')}
                  </NavLink>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Información adicional */}
          <Alert className="bg-muted/50 border-border">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Al iniciar sesión, aceptas nuestros{' '}
              <a href="#" className="font-medium text-primary hover:underline">
                Términos de Servicio
              </a>{' '}
              y{' '}
              <a href="#" className="font-medium text-primary hover:underline">
                Política de Privacidad
              </a>
              .
            </AlertDescription>
          </Alert>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
