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
import { NavLink, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { 
  validateEmail, 
  validatePassword, 
  validateFullName, 
  validateConfirmPassword, 
  validateTerms 
} from '@/validations';

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

interface FormTouched {
  fullName?: boolean;
  email?: boolean;
  password?: boolean;
  confirmPassword?: boolean;
  terms?: boolean;
}

const Register = () => {
  const { t } = useLocale();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Estados del formulario
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Estados de validación
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({});

  // Manejo de cambios en los campos
  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFullName(value);
    if (touched.fullName) {
      setErrors(prev => ({ ...prev, fullName: validateFullName(value, t) }));
    }
  };

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
    // Re-validar confirmación si ya fue tocada
    if (touched.confirmPassword && confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: validateConfirmPassword(value, confirmPassword, t) }));
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (touched.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: validateConfirmPassword(password, value, t) }));
    }
  };

  const handleTermsChange = (checked: boolean) => {
    setAcceptTerms(checked);
    if (touched.terms) {
      setErrors(prev => ({ ...prev, terms: validateTerms(checked, t) }));
    }
  };

  // Manejo de blur
  const handleBlur = (field: keyof FormTouched) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    switch(field) {
      case 'fullName':
        setErrors(prev => ({ ...prev, fullName: validateFullName(fullName, t) }));
        break;
      case 'email':
        setErrors(prev => ({ ...prev, email: validateEmail(email, t) }));
        break;
      case 'password':
        setErrors(prev => ({ ...prev, password: validatePassword(password, t) }));
        break;
      case 'confirmPassword':
        setErrors(prev => ({ ...prev, confirmPassword: validateConfirmPassword(password, confirmPassword, t) }));
        break;
      case 'terms':
        setErrors(prev => ({ ...prev, terms: validateTerms(acceptTerms, t) }));
        break;
    }
  };

  // Manejo del envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar todos los campos
    const fullNameError = validateFullName(fullName, t);
    const emailError = validateEmail(email, t);
    const passwordError = validatePassword(password, t);
    const confirmPasswordError = validateConfirmPassword(password, confirmPassword, t);
    const termsError = validateTerms(acceptTerms, t);

    setErrors({
      fullName: fullNameError,
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
      terms: termsError,
    });

    setTouched({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true,
      terms: true,
    });

    // Si hay errores, no continuar
    if (fullNameError || emailError || passwordError || confirmPasswordError || termsError) {
      toast({
        title: "Error en el formulario",
        description: "Por favor, corrige los errores antes de continuar.",
        variant: "destructive",
      });
      return;
    }

    // Simular registro
    setIsLoading(true);

    try {
      // Aquí iría la lógica de registro real
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: t('register_success'),
        description: "¡Bienvenido a la comunidad de VoluntariaJoven!",
        className: "bg-green-50 border-green-200",
      });

      // Redirigir al login
      setTimeout(() => navigate('/login'), 1000);
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
      
      <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-muted/30 via-background to-muted/20 px-4 py-12">
        <div className="w-full max-w-md space-y-6">
          
          {/* Bienvenida */}
          <div className="text-center space-y-2">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent shadow-lg mb-4">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{t('register_title')}</h1>
            <p className="text-muted-foreground">{t('register_subtitle')}</p>
          </div>

          {/* Formulario */}
          <Card className="border-2 shadow-xl">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-xl font-semibold text-center">
                {t('registrate')}
              </CardTitle>
              <CardDescription className="text-center">
                {t('home_sub')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Campo Nombre Completo */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium">
                    {t('full_name')} <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder={t('full_name_placeholder')}
                      value={fullName}
                      onChange={handleFullNameChange}
                      onBlur={() => handleBlur('fullName')}
                      onKeyDown={(e) => handleKeyPress(e, () => document.getElementById('email')?.focus())}
                      className={`pl-10 h-11 ${errors.fullName && touched.fullName ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                      aria-invalid={!!(errors.fullName && touched.fullName)}
                      aria-describedby={errors.fullName && touched.fullName ? 'fullName-error' : undefined}
                      disabled={isLoading}
                    />
                    {!errors.fullName && touched.fullName && fullName && (
                      <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                    )}
                  </div>
                  {errors.fullName && touched.fullName && (
                    <p id="fullName-error" className="text-sm text-destructive flex items-center gap-1.5 mt-1">
                      <AlertCircle className="h-3.5 w-3.5" />
                      {errors.fullName}
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
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      onBlur={() => handleBlur('confirmPassword')}
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
                    {!errors.confirmPassword && touched.confirmPassword && confirmPassword && password === confirmPassword && (
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
                      checked={acceptTerms}
                      onCheckedChange={handleTermsChange}
                      onBlur={() => handleBlur('terms')}
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
                      <a href="#" className="font-medium text-primary hover:underline">
                        {t('terms_and_conditions')}
                      </a>{' '}
                      y{' '}
                      <a href="#" className="font-medium text-primary hover:underline">
                        {t('privacy_policy')}
                      </a>{' '}
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
                  className="w-full h-11 bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-md text-base font-semibold mt-6"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Creando cuenta...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-5 w-5" />
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
