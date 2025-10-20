import { Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="mt-auto border-t border-border bg-muted/30">
      <div className="container px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-4 text-lg font-semibold">
              Información Institucional
            </h3>
            <p className="text-sm text-muted-foreground">
              Universidad Laica Eloy Alfaro de Manabí
            </p>
            <p className="text-sm text-muted-foreground">
              Facultad de Ciencias de la Vida y Tecnologías
            </p>
            <p className="text-sm text-muted-foreground">Carrera de Software</p>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Soporte y Contacto</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>voluntariado@uleam.edu.ec</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+593 5 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Manta, Ecuador</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">
              Políticas y Términos
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary hover:underline">
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary hover:underline">
                  Términos de Uso
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary hover:underline">
                  Código de Conducta
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary hover:underline">
                  Preguntas Frecuentes
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} VoluntariaJoven - Todos los derechos
            reservados
          </p>
        </div>
      </div>
    </footer>
  );
};
