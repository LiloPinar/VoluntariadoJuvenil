import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Scale, Users, BookOpen } from 'lucide-react';

const CodeOfConduct = () => {
  // Scroll al top cuando se carga la página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header currentPage="Código de Conducta" />
      
      <main className="flex-1 bg-gradient-to-br from-muted/30 via-background to-muted/20 px-4 py-12">
        <div className="container max-w-4xl mx-auto space-y-6">
          
          {/* Encabezado */}
          <div className="text-center space-y-2">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg mb-4">
              <Scale className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold">Código de Conducta</h1>
            <p className="text-muted-foreground">
              Última actualización: 8 de diciembre de 2025
            </p>
          </div>

          <Alert className="bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800">
            <BookOpen className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <AlertDescription className="text-sm text-purple-900 dark:text-purple-50">
              Este código establece las normas de comportamiento y responsabilidades de todos los usuarios de la plataforma VoluntariaJoven.
            </AlertDescription>
          </Alert>

          {/* ASPECTOS GENERALES */}
          <Card className="border-2 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                ASPECTOS GENERALES
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              
              {/* Información */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">INFORMACIÓN</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  La plataforma <strong>VoluntariaJoven</strong> es administrada por la Universidad Laica Eloy Alfaro de Manabí, 
                  Facultad de Ciencias de la Vida y Tecnologías, con sede en Manta, Ecuador. Para los efectos de este código 
                  de conducta se denominará <strong>LA PLATAFORMA</strong>.
                </p>
              </div>

              {/* Naturaleza Jurídica */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">NATURALEZA JURÍDICA</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  El presente código de conducta regula la relación contractual de carácter educativo y comunitario que une 
                  a los <strong>USUARIOS</strong> que acceden a la plataforma virtual y a <strong>LA PLATAFORMA</strong>, 
                  especialmente en la autorización de uso que esta otorga a favor de aquellos.
                </p>
              </div>

              {/* Definiciones */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">DEFINICIONES</h3>
                <div className="space-y-4 pl-4 border-l-2 border-purple-200 dark:border-purple-800">
                  
                  <div>
                    <p className="font-medium text-sm mb-1">Usuarios:</p>
                    <p className="text-sm text-muted-foreground">
                      Toda persona natural que, como destinatario final, usa la plataforma para participar en actividades 
                      de voluntariado, registro de horas de servicio comunitario, o cualquier otro tipo de interacción 
                      con el fin de contribuir al bienestar social y desarrollo personal.
                    </p>
                  </div>

                  <div>
                    <p className="font-medium text-sm mb-1">Voluntario:</p>
                    <p className="text-sm text-muted-foreground">
                      Persona natural que acepta realizar la gestión de actividades de voluntariado solicitadas por 
                      otros usuarios o coordinadores a través de la plataforma. El voluntario actúa por cuenta y 
                      riesgo propio y libre de cualquier tipo de responsabilidad que pueda surgir durante la prestación 
                      del servicio comunitario.
                    </p>
                  </div>

                  <div>
                    <p className="font-medium text-sm mb-1">Coordinador:</p>
                    <p className="text-sm text-muted-foreground">
                      Persona autorizada por la Universidad para supervisar, validar y gestionar proyectos de voluntariado, 
                      así como aprobar el registro de horas de servicio de los voluntarios participantes.
                    </p>
                  </div>

                  <div>
                    <p className="font-medium text-sm mb-1">Mensajes de datos:</p>
                    <p className="text-sm text-muted-foreground">
                      La información generada, enviada, recibida, almacenada o comunicada por medios electrónicos, 
                      ópticos o similares, como pudieran ser, entre otros: el Intercambio Electrónico de Datos (EDI), 
                      Internet, el correo electrónico, el telegrama o el telefax.
                    </p>
                  </div>

                  <div>
                    <p className="font-medium text-sm mb-1">Actividad Digital:</p>
                    <p className="text-sm text-muted-foreground">
                      Comprende el envío, transmisión, recepción, almacenamiento de mensajes de datos por vía electrónica. 
                      Las dudas que surjan respecto de la eficacia y validez de los mensajes de datos y demás actividades 
                      digitales se resolverán conforme a lo establecido en la legislación ecuatoriana vigente.
                    </p>
                  </div>

                </div>
              </div>

            </CardContent>
          </Card>

          {/* DERECHOS Y OBLIGACIONES */}
          <Card className="border-2 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                DERECHOS Y OBLIGACIONES DE LOS USUARIOS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Derechos:</h3>
                <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                  <li>Acceder libremente a la plataforma y sus servicios</li>
                  <li>Registrar y validar sus horas de servicio comunitario</li>
                  <li>Recibir certificados de participación por las actividades realizadas</li>
                  <li>Proponer nuevos proyectos de voluntariado</li>
                  <li>Protección de sus datos personales según la política de privacidad</li>
                  <li>Recibir notificaciones sobre oportunidades de voluntariado</li>
                  <li>Solicitar la cancelación de su cuenta en cualquier momento</li>
                  <li>Reportar incidencias o problemas con la plataforma</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Obligaciones:</h3>
                <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                  <li>Proporcionar información veraz y actualizada al momento del registro</li>
                  <li>Mantener la confidencialidad de sus credenciales de acceso</li>
                  <li>Cumplir con los compromisos adquiridos en los proyectos de voluntariado</li>
                  <li>Registrar únicamente horas de servicio que hayan sido efectivamente realizadas</li>
                  <li>Comportarse de manera respetuosa con otros usuarios y coordinadores</li>
                  <li>No utilizar la plataforma para fines comerciales no autorizados</li>
                  <li>Reportar cualquier uso indebido o sospechoso de la plataforma</li>
                  <li>Respetar la propiedad intelectual de los contenidos de la plataforma</li>
                  <li>No compartir su cuenta con terceros</li>
                  <li>Cumplir con todas las normas establecidas en los términos de uso</li>
                </ul>
              </div>

            </CardContent>
          </Card>

          {/* NORMAS DE COMPORTAMIENTO */}
          <Card className="border-2 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
              <CardTitle>NORMAS DE COMPORTAMIENTO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Conductas Esperadas:</h3>
                <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                  <li>Actuar con honestidad e integridad en todas las interacciones</li>
                  <li>Promover un ambiente de respeto, inclusión y diversidad</li>
                  <li>Comunicarse de manera profesional y constructiva</li>
                  <li>Colaborar activamente en el cumplimiento de los objetivos de los proyectos</li>
                  <li>Mantener la puntualidad en las actividades programadas</li>
                  <li>Cuidar los recursos y materiales proporcionados</li>
                  <li>Representar dignamente a la Universidad en las actividades externas</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Conductas Prohibidas:</h3>
                <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                  <li>Cualquier forma de discriminación, acoso o violencia</li>
                  <li>Publicar contenido ofensivo, difamatorio o ilegal</li>
                  <li>Falsificar información, documentos o registros de horas</li>
                  <li>Utilizar la plataforma para actividades políticas partidistas</li>
                  <li>Compartir información confidencial de otros usuarios</li>
                  <li>Intentar vulnerar la seguridad de la plataforma</li>
                  <li>Utilizar bots o sistemas automatizados no autorizados</li>
                  <li>Realizar actividades de lucro personal sin autorización</li>
                </ul>
              </div>

            </CardContent>
          </Card>

          {/* SANCIONES */}
          <Card className="border-2 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950 dark:to-red-900">
              <CardTitle>SANCIONES Y CONSECUENCIAS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              
              <p className="text-sm text-muted-foreground leading-relaxed">
                El incumplimiento de este código de conducta puede resultar en las siguientes acciones:
              </p>

              <div className="space-y-4 pl-4 border-l-2 border-red-200 dark:border-red-800">
                
                <div>
                  <p className="font-medium text-sm mb-1">1. Advertencia Formal:</p>
                  <p className="text-sm text-muted-foreground">
                    Notificación escrita al usuario sobre la conducta inapropiada y solicitud de corrección inmediata.
                  </p>
                </div>

                <div>
                  <p className="font-medium text-sm mb-1">2. Suspensión Temporal:</p>
                  <p className="text-sm text-muted-foreground">
                    Inhabilitación temporal de la cuenta por un período determinado, durante el cual el usuario no 
                    podrá acceder a la plataforma ni participar en actividades.
                  </p>
                </div>

                <div>
                  <p className="font-medium text-sm mb-1">3. Suspensión Permanente:</p>
                  <p className="text-sm text-muted-foreground">
                    Cancelación definitiva de la cuenta y prohibición de crear nuevas cuentas en caso de violaciones 
                    graves o reincidencia.
                  </p>
                </div>

                <div>
                  <p className="font-medium text-sm mb-1">4. Acciones Legales:</p>
                  <p className="text-sm text-muted-foreground">
                    En casos de actividades ilegales o que causen daño significativo, la Universidad se reserva el 
                    derecho de emprender acciones legales conforme a la legislación ecuatoriana.
                  </p>
                </div>

              </div>

            </CardContent>
          </Card>

          {/* MODIFICACIONES */}
          <Card className="border-2 shadow-xl">
            <CardHeader>
              <CardTitle>MODIFICACIONES AL CÓDIGO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground leading-relaxed">
              <p>
                La Universidad se reserva el derecho de modificar este código de conducta en cualquier momento. 
                Los cambios entrarán en vigor inmediatamente después de su publicación en la plataforma.
              </p>
              <p>
                Los usuarios serán notificados de cambios significativos a través del correo electrónico registrado. 
                El uso continuado de la plataforma después de la publicación de modificaciones constituye la aceptación 
                de los nuevos términos.
              </p>
            </CardContent>
          </Card>

          {/* Contacto */}
          <Card className="border-2 shadow-xl bg-gradient-to-br from-muted/50 to-background">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <p className="text-sm font-medium">¿Preguntas sobre el Código de Conducta?</p>
                <p className="text-sm text-muted-foreground">
                  Contacta con nosotros en{' '}
                  <a href="mailto:voluntariado@uleam.edu.ec" className="text-purple-600 hover:underline">
                    voluntariado@uleam.edu.ec
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CodeOfConduct;
