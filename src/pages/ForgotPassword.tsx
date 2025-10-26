import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLocale } from '@/i18n/LocaleContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, ArrowLeft, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { validateEmail } from '@/validations';

const ForgotPassword = () => {
  const { t } = useLocale();
  const { toast } = useToast();

  // Estados
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Validación
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);

  // Manejo de cambio
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (touched) {
      setError(validateEmail(value, t));
    }
  };

  // Manejo de blur
  const handleBlur = () => {
    setTouched(true);
    setError(validateEmail(email, t));
  };

  // Enviar email de recuperación
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailError = validateEmail(email, t);
    setError(emailError);
    setTouched(true);

    if (emailError) {
      toast({
        title: "Error en el formulario",
        description: "Por favor, ingresa un email válido.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simular envío de email (aquí iría la llamada real al backend)
      await new Promise(resolve => setTimeout(resolve, 1500));

      setEmailSent(true);
      setCountdown(60); // 60 segundos

      // Iniciar countdown
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      toast({
        title: "Email enviado",
        description: "Revisa tu bandeja de entrada para recuperar tu contraseña.",
        className: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 dark:text-green-50",
      });
    } catch (error) {
      toast({
        title: "Error al enviar",
        description: "No se pudo enviar el email. Intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reenviar email
  const handleResend = () => {
    setEmailSent(false);
    setEmail('');
    setError('');
    setTouched(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage="Recuperar Contraseña" />
      
      <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-muted/30 via-background to-muted/20 px-4 py-12">
        <div className="w-full max-w-md space-y-6">
          
          {!emailSent ? (
            <>
              {/* Encabezado */}
              <div className="text-center space-y-2">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg mb-4">
                  <Mail className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">¿Olvidaste tu contraseña?</h1>
                <p className="text-muted-foreground">
                  No te preocupes, te enviaremos instrucciones para restablecerla
                </p>
              </div>

              {/* Formulario */}
              <Card className="border-2 shadow-xl">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-xl font-semibold text-center">
                    Recuperar Contraseña
                  </CardTitle>
                  <CardDescription className="text-center">
                    Ingresa tu correo electrónico registrado
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* Campo Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Correo Electrónico <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder={t('email_placeholder')}
                          value={email}
                          onChange={handleEmailChange}
                          onBlur={handleBlur}
                          className={`pl-10 h-11 ${error && touched ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                          aria-invalid={!!(error && touched)}
                          aria-describedby={error && touched ? 'email-error' : undefined}
                          disabled={isLoading}
                        />
                        {!error && touched && email && (
                          <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                        )}
                      </div>
                      {error && touched && (
                        <p id="email-error" className="text-sm text-destructive flex items-center gap-1.5 mt-1">
                          <AlertCircle className="h-3.5 w-3.5" />
                          {error}
                        </p>
                      )}
                    </div>

                    {/* Información */}
                    <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                      <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <AlertDescription className="text-sm text-blue-900 dark:text-blue-50">
                        Te enviaremos un enlace para restablecer tu contraseña. El enlace será válido por 1 hora.
                      </AlertDescription>
                    </Alert>

                    {/* Botón de envío */}
                    <Button
                      type="submit"
                      className="w-full h-11 bg-gradient-to-r from-orange-500 to-orange-600 hover:opacity-90 shadow-md text-base font-semibold"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Mail className="mr-2 h-5 w-5" />
                          Enviar Instrucciones
                        </>
                      )}
                    </Button>

                    {/* Link a login */}
                    <div className="text-center text-sm">
                      <NavLink
                        to="/login"
                        className="inline-flex items-center gap-2 font-medium text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-1"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Volver al inicio de sesión
                      </NavLink>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              {/* Email Enviado Exitosamente */}
              <div className="text-center space-y-2">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg mb-4">
                  <CheckCircle2 className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">¡Email Enviado!</h1>
                <p className="text-muted-foreground">
                  Revisa tu bandeja de entrada
                </p>
              </div>

              <Card className="border-2 shadow-xl">
                <CardContent className="pt-6 space-y-4">
                  <div className="text-center space-y-3">
                    <p className="text-base">
                      Hemos enviado instrucciones de recuperación a:
                    </p>
                    <p className="text-lg font-semibold text-primary">
                      {email}
                    </p>
                    
                    <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                      <p className="text-sm font-medium">Instrucciones:</p>
                      <ul className="text-sm text-muted-foreground space-y-1 text-left">
                        <li>• Revisa tu bandeja de entrada y carpeta de spam</li>
                        <li>• Haz clic en el enlace de recuperación</li>
                        <li>• El enlace expira en 1 hora</li>
                        <li>• Sigue las instrucciones para crear una nueva contraseña</li>
                      </ul>
                    </div>
                  </div>

                  {countdown > 0 ? (
                    <Alert className="bg-orange-50 border-orange-200">
                      <Clock className="h-4 w-4 text-orange-600" />
                      <AlertDescription className="text-sm text-orange-900">
                        Podrás reenviar el email en <strong>{countdown}</strong> segundos
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Button
                      onClick={handleResend}
                      variant="outline"
                      className="w-full"
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Reenviar Email
                    </Button>
                  )}

                  <div className="text-center text-sm pt-2">
                    <NavLink
                      to="/login"
                      className="inline-flex items-center gap-2 font-medium text-primary hover:underline"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Volver al inicio de sesión
                    </NavLink>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ForgotPassword;
