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
import { LogIn, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { validateEmail, validatePassword } from '@/validations';

const Login = () => {
  const { t } = useLocale();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Estados del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Estados de validación
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});

  // Manejo de cambios en los campos
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (touched.email) {
      setErrors(prev => ({ ...prev, email: validateEmail(value, t) }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (touched.password) {
      setErrors(prev => ({ ...prev, password: validatePassword(value, t) }));
    }
  };

  // Manejo de blur (cuando el usuario sale del campo)
  const handleBlur = (field: 'email' | 'password') => {
    setTouched(prev => ({ ...prev, [field]: true }));
    if (field === 'email') {
      setErrors(prev => ({ ...prev, email: validateEmail(email, t) }));
    } else {
      setErrors(prev => ({ ...prev, password: validatePassword(password, t) }));
    }
  };

  // Manejo del envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar todos los campos
    const emailError = validateEmail(email, t);
    const passwordError = validatePassword(password, t);

    setErrors({ email: emailError, password: passwordError });
    setTouched({ email: true, password: true });

    // Si hay errores, no continuar
    if (emailError || passwordError) {
      toast({
        title: "Error en el formulario",
        description: "Por favor, corrige los errores antes de continuar.",
        variant: "destructive",
      });
      return;
    }

    // Simular inicio de sesión
    setIsLoading(true);

    try {
      // Aquí iría la lógica de autenticación real
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: t('login_success'),
        description: `${t('home_title')}`,
        className: "bg-green-50 border-green-200",
      });

      // Redirigir al inicio
      setTimeout(() => navigate('/'), 500);
    } catch (error) {
      toast({
        title: t('login_error'),
        description: "Por favor, verifica tus credenciales e intenta nuevamente.",
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
      
      <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-muted/30 via-background to-muted/20 px-4 py-12">
        <div className="w-full max-w-md space-y-6">
          
          {/* Bienvenida */}
          <div className="text-center space-y-2">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent shadow-lg mb-4">
              <LogIn className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{t('login_title')}</h1>
            <p className="text-muted-foreground">{t('login_subtitle')}</p>
          </div>

          {/* Formulario */}
          <Card className="border-2 shadow-xl">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-xl font-semibold text-center">
                {t('inicio_sesion')}
              </CardTitle>
              <CardDescription className="text-center">
                {t('home_sub')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                
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
                      value={email}
                      onChange={handleEmailChange}
                      onBlur={() => handleBlur('email')}
                      onKeyDown={(e) => handleKeyPress(e, () => document.getElementById('password')?.focus())}
                      className={`pl-10 h-11 ${errors.email && touched.email ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                      aria-invalid={!!(errors.email && touched.email)}
                      aria-describedby={errors.email && touched.email ? 'email-error' : undefined}
                      disabled={isLoading}
                    />
                    {!errors.email && touched.email && email && (
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
                      value={password}
                      onChange={handlePasswordChange}
                      onBlur={() => handleBlur('password')}
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
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      disabled={isLoading}
                    />
                    <label
                      htmlFor="remember"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {t('remember_me')}
                    </label>
                  </div>
                  <a
                    href="#"
                    className="text-sm font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-1"
                    tabIndex={isLoading ? -1 : 0}
                  >
                    {t('forgot_password')}
                  </a>
                </div>

                {/* Botón de envío */}
                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-md text-base font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Iniciando sesión...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-5 w-5" />
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
