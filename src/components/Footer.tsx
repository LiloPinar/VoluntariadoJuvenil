import { Mail, Phone, MapPin } from "lucide-react";
import { useLocale } from '@/i18n/LocaleContext';

export const Footer = () => {
  const { t } = useLocale();
  return (
    <footer className="mt-auto border-t border-border bg-muted/30">
      <div className="container px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold">
              {t('informacion_institucional') || 'Información Institucional'}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Universidad Laica Eloy Alfaro de Manabí
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Facultad de Ciencias de la Vida y Tecnologías
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground">Carrera de Software</p>
          </div>

          <div>
            <h3 className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold">{t('soporte_contacto') || 'Soporte y Contacto'}</h3>
            <div className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                <span className="break-all">voluntariado@uleam.edu.ec</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                <span>+593 5 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
                <span>Manta, Ecuador</span>
              </div>
            </div>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold">
              Políticas y Términos
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary hover:underline">
                  {t('politica_privacidad') || 'Política de Privacidad'}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary hover:underline">
                  {t('terminos_uso') || 'Términos de Uso'}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary hover:underline">
                  {t('codigo_conducta') || 'Código de Conducta'}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary hover:underline">
                  {t('preguntas_frecuentes') || 'Preguntas Frecuentes'}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 border-t border-border pt-4 sm:pt-6 text-center text-xs sm:text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} VoluntariaJoven - {t('todos_los_derechos') || 'Todos los derechos reservados'}
          </p>
        </div>
      </div>
    </footer>
  );
};
