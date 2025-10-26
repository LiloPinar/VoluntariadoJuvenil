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
import { UserPlus, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, User } from 'lucide-react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useRegisterForm } from '@/hooks/useRegisterForm';
import { useAuthContext } from '@/contexts/AuthContext';

const Register = () => {
  const { t, locale } = useLocale();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { register: authRegister } = useAuthContext();
  const { formData, errors, touched, handleChange, handleBlur, validateAll } = useRegisterForm();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    // Registrar usuario
    setIsLoading(true);

    try {
      const registerSuccess = await authRegister(formData.firstName, formData.lastName, formData.email, formData.password);

      if (registerSuccess) {
        toast({
          title: t('register_success'),
          description: "¡Bienvenido a la comunidad de VoluntariaJoven!",
          className: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 dark:text-green-50",
        });
        
        // Redirigir a la página de retorno o al inicio (ya está logueado automáticamente)
        const returnTo = (location.state as { returnTo?: string })?.returnTo || '/';
        setTimeout(() => navigate(returnTo), 1000);
      } else {
        toast({
          title: "Email ya registrado",
          description: "Este correo electrónico ya está en uso. Intenta iniciar sesión.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: t('register_error'),
        description: "Por favor, intenta nuevamente más tarde.",
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
      <Header currentPage={t('registrate')} />
      
      <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-muted/30 via-background to-muted/20 px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-md space-y-4 sm:space-y-6">
          
          {/* Bienvenida */}
          <div className="text-center space-y-2">
            <div className="inline-flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent shadow-lg mb-3 sm:mb-4">
              <UserPlus className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t('register_title')}</h1>
            <p className="text-sm sm:text-base text-muted-foreground">{t('register_subtitle')}</p>
          </div>

          {/* Formulario */}
          <Card className="border-2 shadow-xl">
            <CardHeader className="space-y-1 pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl font-semibold text-center">
                {t('registrate')}
              </CardTitle>
              <CardDescription className="text-center text-xs sm:text-sm">
                {t('home_sub')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                
                {/* Campo Nombre */}
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium">
                    {t('first_name')} <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder={t('first_name_placeholder')}
                      value={formData.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value, t)}
                      onBlur={() => handleBlur('firstName', t)}
                      onKeyDown={(e) => handleKeyPress(e, () => document.getElementById('lastName')?.focus())}
                      className={`pl-10 h-11 ${errors.firstName && touched.firstName ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                      aria-invalid={!!(errors.firstName && touched.firstName)}
                      aria-describedby={errors.firstName && touched.firstName ? 'firstName-error' : undefined}
                      disabled={isLoading}
                    />
                    {!errors.firstName && touched.firstName && formData.firstName && (
                      <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                    )}
                  </div>
                  {errors.firstName && touched.firstName && (
                    <p id="firstName-error" className="text-sm text-destructive flex items-center gap-1.5 mt-1">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.firstName}
                    </p>
                  )}
                </div>

                {/* Campo Apellido */}
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium">
                    {t('last_name')} <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="lastName"
                      type="text"
                      placeholder={t('last_name_placeholder')}
                      value={formData.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value, t)}
                      onBlur={() => handleBlur('lastName', t)}
                      onKeyDown={(e) => handleKeyPress(e, () => document.getElementById('email')?.focus())}
                      className={`pl-10 h-11 ${errors.lastName && touched.lastName ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                      aria-invalid={!!(errors.lastName && touched.lastName)}
                      aria-describedby={errors.lastName && touched.lastName ? 'lastName-error' : undefined}
                      disabled={isLoading}
                    />
                    {!errors.lastName && touched.lastName && formData.lastName && (
                      <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                    )}
                  </div>
                  {errors.lastName && touched.lastName && (
                    <p id="lastName-error" className="text-sm text-destructive flex items-center gap-1.5 mt-1">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.lastName}
                    </p>
                  )}
                </div>

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
                      onKeyDown={(e) => handleKeyPress(e, () => document.getElementById('confirmPassword')?.focus())}
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

                {/* Campo Confirmar Contraseña */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">
                    {t('confirm_password')} <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder={t('confirm_password_placeholder')}
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange('confirmPassword', e.target.value, t)}
                      onBlur={() => handleBlur('confirmPassword', t)}
                      className={`pl-10 pr-10 h-11 ${errors.confirmPassword && touched.confirmPassword ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                      aria-invalid={!!(errors.confirmPassword && touched.confirmPassword)}
                      aria-describedby={errors.confirmPassword && touched.confirmPassword ? 'confirmPassword-error' : undefined}
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                    {!errors.confirmPassword && touched.confirmPassword && formData.confirmPassword && formData.password === formData.confirmPassword && (
                      <CheckCircle2 className="absolute right-10 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                    )}
                  </div>
                  {errors.confirmPassword && touched.confirmPassword && (
                    <p id="confirmPassword-error" className="text-sm text-destructive flex items-center gap-1.5 mt-1">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Términos y Condiciones */}
                <div className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.acceptTerms}
                      onCheckedChange={(checked) => handleChange('acceptTerms', checked as boolean, t)}
                      onBlur={() => handleBlur('terms', t)}
                      className={`mt-0.5 ${errors.terms && touched.terms ? 'border-destructive' : ''}`}
                      aria-invalid={!!(errors.terms && touched.terms)}
                      aria-describedby={errors.terms && touched.terms ? 'terms-error' : undefined}
                      disabled={isLoading}
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm leading-tight cursor-pointer"
                    >
                      {t('accept_terms')}{' '}
                      <NavLink to="/terms" className="font-medium text-primary hover:underline" target="_blank">
                        {t('terms_and_conditions')}
                      </NavLink>{' '}
                      y{' '}
                      <NavLink to="/privacy" className="font-medium text-primary hover:underline" target="_blank">
                        {t('privacy_policy')}
                      </NavLink>{' '}
                      <span className="text-destructive">*</span>
                    </label>
                  </div>
                  {errors.terms && touched.terms && (
                    <p id="terms-error" className="text-sm text-destructive flex items-center gap-1.5 mt-1">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.terms}
                    </p>
                  )}
                </div>

                {/* Botón de envío */}
                <Button
                  type="submit"
                  className="w-full h-10 sm:h-11 bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-md text-sm sm:text-base font-semibold mt-4 sm:mt-6"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Creando cuenta...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                      {t('register_button')}
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

                {/* Link a login */}
                <div className="text-center text-sm">
                  <span className="text-muted-foreground">{t('already_have_account')} </span>
                  <NavLink
                    to="/login"
                    className="font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-1"
                  >
                    {t('login_here')}
                  </NavLink>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Información de seguridad */}
          <Alert className="bg-muted/50 border-border">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-sm">
              Tu información está protegida y encriptada. Nunca compartiremos tus datos personales con terceros.
            </AlertDescription>
          </Alert>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Register;
