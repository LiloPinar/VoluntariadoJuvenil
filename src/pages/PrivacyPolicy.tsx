import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Lock } from 'lucide-react';

const PrivacyPolicy = () => {
  // Scroll al top cuando se carga la página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage="Política de Privacidad" />
      
      <main className="flex-1 bg-gradient-to-br from-muted/30 via-background to-muted/20 px-4 py-12">
        <div className="container max-w-4xl mx-auto space-y-6">
          
          {/* Encabezado */}
          <div className="text-center space-y-2">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold">Política de Privacidad</h1>
            <p className="text-muted-foreground">
              Última actualización: 23 de octubre de 2025
            </p>
          </div>

          <Alert className="bg-green-50 border-green-200">
            <Lock className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-sm text-green-900">
              En VoluntariaJoven, tu privacidad es nuestra prioridad. Todos tus datos están protegidos y encriptados.
            </AlertDescription>
          </Alert>

          {/* Contenido */}
          <Card className="border-2 shadow-xl">
            <CardHeader>
              <CardTitle>1. Información que Recopilamos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p><strong>Información Personal:</strong></p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Nombre completo</li>
                <li>Correo electrónico</li>
                <li>Número de teléfono</li>
                <li>Fecha de nacimiento</li>
                <li>Ubicación (ciudad)</li>
                <li>Fotografía de perfil (opcional)</li>
              </ul>
              
              <p><strong>Información de Actividad:</strong></p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Proyectos en los que participas</li>
                <li>Horas de voluntariado registradas</li>
                <li>Interacciones en la plataforma</li>
                <li>Preferencias de notificaciones</li>
              </ul>

              <p><strong>Información Técnica:</strong></p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Dirección IP</li>
                <li>Tipo de navegador y dispositivo</li>
                <li>Fecha y hora de acceso</li>
                <li>Páginas visitadas</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-xl">
            <CardHeader>
              <CardTitle>2. Cómo Usamos tu Información</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>Utilizamos tu información personal para:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Gestionar tu cuenta y perfil de usuario</li>
                <li>Facilitar tu participación en proyectos de voluntariado</li>
                <li>Registrar y verificar tus horas de servicio comunitario</li>
                <li>Emitir certificados de participación</li>
                <li>Enviarte notificaciones sobre proyectos relevantes</li>
                <li>Mejorar nuestros servicios y la experiencia del usuario</li>
                <li>Comunicarnos contigo sobre actualizaciones y cambios</li>
                <li>Cumplir con requisitos legales y regulatorios</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-xl">
            <CardHeader>
              <CardTitle>3. Compartir tu Información</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p><strong>NO vendemos ni alquilamos tu información personal a terceros.</strong></p>
              
              <p>Compartimos información únicamente en los siguientes casos:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Coordinadores de Proyectos:</strong> Información básica para facilitar tu participación</li>
                <li><strong>Autoridades Universitarias:</strong> Para verificación académica y emisión de certificados</li>
                <li><strong>Proveedores de Servicios:</strong> Empresas que nos ayudan a operar la plataforma (hosting, email)</li>
                <li><strong>Requisitos Legales:</strong> Cuando sea requerido por ley o para proteger derechos</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-xl">
            <CardHeader>
              <CardTitle>4. Seguridad de los Datos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>Implementamos múltiples medidas de seguridad para proteger tu información:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Encriptación:</strong> Todos los datos se transmiten mediante SSL/TLS</li>
                <li><strong>Contraseñas:</strong> Se almacenan utilizando hash seguro (bcrypt)</li>
                <li><strong>Acceso Restringido:</strong> Solo personal autorizado puede acceder a datos personales</li>
                <li><strong>Auditorías:</strong> Revisiones periódicas de seguridad</li>
                <li><strong>Backup:</strong> Copias de seguridad regulares y encriptadas</li>
                <li><strong>Monitoreo:</strong> Detección de actividades sospechosas 24/7</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-xl">
            <CardHeader>
              <CardTitle>5. Tus Derechos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>Tienes derecho a:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Acceder:</strong> Solicitar una copia de tu información personal</li>
                <li><strong>Rectificar:</strong> Corregir información inexacta o incompleta</li>
                <li><strong>Eliminar:</strong> Solicitar la eliminación de tus datos personales</li>
                <li><strong>Restringir:</strong> Limitar el procesamiento de tu información</li>
                <li><strong>Portar:</strong> Recibir tus datos en un formato estructurado</li>
                <li><strong>Objetar:</strong> Oponerte al procesamiento de tus datos</li>
                <li><strong>Revocar:</strong> Retirar el consentimiento en cualquier momento</li>
              </ul>
              
              <p className="mt-3">
                Para ejercer cualquiera de estos derechos, contáctanos en: <strong>privacidad@uleam.edu.ec</strong>
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-xl">
            <CardHeader>
              <CardTitle>6. Cookies y Tecnologías Similares</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>Utilizamos cookies y tecnologías similares para:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Mantener tu sesión activa</li>
                <li>Recordar tus preferencias</li>
                <li>Analizar el uso de la plataforma</li>
                <li>Mejorar la experiencia del usuario</li>
              </ul>
              
              <p className="mt-3">
                Puedes configurar tu navegador para rechazar cookies, pero esto puede afectar la funcionalidad de la plataforma.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-xl">
            <CardHeader>
              <CardTitle>7. Retención de Datos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                Conservamos tu información personal durante el tiempo que sea necesario para:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Proporcionar nuestros servicios</li>
                <li>Cumplir con obligaciones legales</li>
                <li>Resolver disputas</li>
                <li>Hacer cumplir nuestros acuerdos</li>
              </ul>
              
              <p className="mt-3">
                Cuando ya no necesitemos tu información, la eliminaremos de forma segura o la anonimizaremos.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-xl">
            <CardHeader>
              <CardTitle>8. Privacidad de Menores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                La plataforma está diseñada para usuarios mayores de 18 años. No recopilamos intencionalmente información de menores de edad sin el consentimiento de los padres o tutores.
              </p>
              <p>
                Si descubrimos que hemos recopilado información de un menor sin autorización, la eliminaremos inmediatamente.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-xl">
            <CardHeader>
              <CardTitle>9. Cambios a Esta Política</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                Podemos actualizar esta política de privacidad periódicamente para reflejar cambios en nuestras prácticas o requisitos legales.
              </p>
              <p>
                Te notificaremos sobre cambios significativos mediante:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Un aviso destacado en la plataforma</li>
                <li>Un correo electrónico a tu dirección registrada</li>
                <li>Una notificación push (si las has habilitado)</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-xl">
            <CardHeader>
              <CardTitle>10. Contacto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                Si tienes preguntas, inquietudes o solicitudes relacionadas con esta política de privacidad:
              </p>
              <ul className="list-none space-y-2">
                <li><strong>Email Principal:</strong> privacidad@uleam.edu.ec</li>
                <li><strong>Email Voluntariado:</strong> voluntariado@uleam.edu.ec</li>
                <li><strong>Teléfono:</strong> +593 5 123-4567</li>
                <li><strong>Dirección:</strong> Universidad Laica Eloy Alfaro de Manabí, Manta, Ecuador</li>
                <li><strong>Horario de Atención:</strong> Lunes a Viernes, 8:00 AM - 5:00 PM</li>
              </ul>
            </CardContent>
          </Card>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
