import { Mail, Phone, MapPin } from "lucide-react";
import { useLocale } from '@/i18n/LocaleContext';
import logoImage from "@/assets/VoluntariadoJuvenilLogo.jpg";

export const Footer = () => {
  const { t } = useLocale();
  return (
    <footer className="mt-auto border-t border-border bg-muted/30">
      <div className="container px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {/* Información Institucional */}
          <div className="flex flex-col">
            <div className="flex items-start gap-3 mb-3 sm:mb-4">
              <img 
                src={logoImage} 
                alt="VoluntariaJoven Logo" 
                className="h-10 w-10 sm:h-12 sm:w-12 object-cover rounded-full shadow-md border-2 border-primary/20 flex-shrink-0"
              />
              <h3 className="text-xl sm:text-2xl font-bold leading-tight">
                Voluntariado Estudiantil
              </h3>
            </div>
            <div className="space-y-1 text-xs sm:text-sm text-muted-foreground">
              <p>Universidad Laica Eloy Alfaro de Manabí</p>
              <p>Facultad de Ciencias de la Vida y Tecnologías</p>
              <p>Carrera de Software</p>
            </div>
          </div>

          {/* Soporte y Contacto */}
          <div className="flex flex-col lg:pl-8 lg:border-l border-border">
            <h3 className="mb-3 sm:mb-4 text-xl sm:text-2xl font-bold">
              Soporte y Contacto
            </h3>
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

          {/* Políticas y Términos */}
          <div className="flex flex-col sm:col-span-2 lg:col-span-1 lg:pl-8 lg:border-l border-border">
            <h3 className="mb-3 sm:mb-4 text-xl sm:text-2xl font-bold">
              Políticas y Términos
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <li>
                <span className="cursor-not-allowed opacity-60">
                  Política de Privacidad
                </span>
              </li>
              <li>
                <span className="cursor-not-allowed opacity-60">
                  Términos de Uso
                </span>
              </li>
              <li>
                <span className="cursor-not-allowed opacity-60">
                  Código de Conducta
                </span>
              </li>
              <li>
                <span className="cursor-not-allowed opacity-60">
                  Preguntas Frecuentes
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 border-t border-border pt-4 sm:pt-6 text-center text-xs sm:text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} VoluntariaJoven - Todos los derechos reservados
          </p>
        </div>
      </div>
    </footer>
  );
};
