import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, CheckCircle2, AlertCircle } from 'lucide-react';

const TermsOfService = () => {
  // Scroll al top cuando se carga la página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage="Términos de Servicio" />
      
      <main className="flex-1 bg-gradient-to-br from-muted/30 via-background to-muted/20 px-4 py-12">
        <div className="container max-w-4xl mx-auto space-y-6">
          
          {/* Encabezado */}
          <div className="text-center space-y-2">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg mb-4">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold">Términos y Condiciones de Uso</h1>
            <p className="text-muted-foreground">
              Última actualización: 23 de octubre de 2025
            </p>
          </div>

          <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-sm text-blue-900 dark:text-blue-50">
              Al usar VoluntariaJoven, aceptas estos términos y condiciones. Por favor, léelos cuidadosamente.
            </AlertDescription>
          </Alert>

          {/* Contenido */}
          <Card className="border-2 shadow-xl">
            <CardHeader>
              <CardTitle>1. Aceptación de los Términos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                Al acceder y utilizar la plataforma VoluntariaJoven, aceptas cumplir con estos términos y condiciones de uso. Si no estás de acuerdo con alguno de estos términos, no debes utilizar la plataforma.
              </p>
              <p>
                Estos términos constituyen un acuerdo legalmente vinculante entre tú (el "Usuario") y la Universidad Laica Eloy Alfaro de Manabí (la "Universidad").
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-xl">
            <CardHeader>
              <CardTitle>2. Uso de la Plataforma</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p><strong>Registro de Cuenta:</strong></p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Debes proporcionar información precisa y completa al registrarte</li>
                <li>Debes mantener la confidencialidad de tu contraseña</li>
                <li>Debes tener al menos 18 años para registrarte</li>
                <li>Solo puedes crear una cuenta por persona</li>
              </ul>
              
              <p><strong>Uso Permitido:</strong></p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Participar en proyectos de voluntariado autorizados</li>
                <li>Registrar tus horas de servicio comunitario</li>
                <li>Interactuar respetuosamente con otros voluntarios</li>
                <li>Utilizar los recursos educativos disponibles</li>
              </ul>

              <p><strong>Uso Prohibido:</strong></p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Publicar contenido ofensivo, ilegal o inapropiado</li>
                <li>Falsificar horas de voluntariado o información personal</li>
                <li>Compartir tu cuenta con terceros</li>
                <li>Usar la plataforma para fines comerciales sin autorización</li>
                <li>Intentar acceder a cuentas de otros usuarios</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-xl">
            <CardHeader>
              <CardTitle>3. Proyectos de Voluntariado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p><strong>Participación:</strong></p>
              <ul className="list-disc pl-6 space-y-1">
                <li>La inscripción en proyectos está sujeta a disponibilidad y requisitos específicos</li>
                <li>Debes cumplir con los compromisos adquiridos al inscribirte en un proyecto</li>
                <li>La Universidad se reserva el derecho de cancelar o modificar proyectos</li>
              </ul>

              <p><strong>Registro de Horas:</strong></p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Las horas de voluntariado deben ser verificadas por un supervisor del proyecto</li>
                <li>La información falsa puede resultar en la suspensión de tu cuenta</li>
                <li>Los certificados se emiten únicamente para horas verificadas</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-xl">
            <CardHeader>
              <CardTitle>4. Responsabilidades</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p><strong>Del Usuario:</strong></p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Mantener la seguridad de tu cuenta</li>
                <li>Reportar cualquier actividad sospechosa</li>
                <li>Respetar la propiedad intelectual de la Universidad</li>
                <li>Cumplir con todas las leyes aplicables</li>
              </ul>

              <p><strong>De la Universidad:</strong></p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Proporcionar una plataforma funcional y segura</li>
                <li>Proteger tu información personal según la política de privacidad</li>
                <li>Ofrecer proyectos de voluntariado de calidad</li>
                <li>Emitir certificados para horas completadas y verificadas</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-xl">
            <CardHeader>
              <CardTitle>5. Propiedad Intelectual</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                Todo el contenido de la plataforma, incluyendo textos, imágenes, logos, y software, es propiedad de la Universidad Laica Eloy Alfaro de Manabí o de sus licenciantes.
              </p>
              <p>
                No está permitido copiar, modificar, distribuir o reproducir ningún contenido sin autorización expresa por escrito.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-xl">
            <CardHeader>
              <CardTitle>6. Limitación de Responsabilidad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                La Universidad no será responsable por:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Daños directos o indirectos derivados del uso de la plataforma</li>
                <li>Interrupciones o errores en el servicio</li>
                <li>Pérdida de datos o información</li>
                <li>Acciones de terceros en los proyectos de voluntariado</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-xl">
            <CardHeader>
              <CardTitle>7. Modificaciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                La Universidad se reserva el derecho de modificar estos términos en cualquier momento. Los cambios serán notificados a través de la plataforma y entrarán en vigencia inmediatamente después de su publicación.
              </p>
              <p>
                El uso continuado de la plataforma después de la publicación de cambios constituye tu aceptación de los nuevos términos.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-xl">
            <CardHeader>
              <CardTitle>8. Terminación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                La Universidad puede suspender o terminar tu acceso a la plataforma en cualquier momento si:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Violas estos términos y condiciones</li>
                <li>Proporcionas información falsa o engañosa</li>
                <li>Realizas actividades ilegales o no autorizadas</li>
                <li>No cumples con los compromisos de voluntariado</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-xl">
            <CardHeader>
              <CardTitle>9. Contacto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                Si tienes preguntas sobre estos términos y condiciones, puedes contactarnos:
              </p>
              <ul className="list-none space-y-2">
                <li><strong>Email:</strong> voluntariado@uleam.edu.ec</li>
                <li><strong>Teléfono:</strong> +593 5 123-4567</li>
                <li><strong>Dirección:</strong> Universidad Laica Eloy Alfaro de Manabí, Manta, Ecuador</li>
              </ul>
            </CardContent>
          </Card>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsOfService;
