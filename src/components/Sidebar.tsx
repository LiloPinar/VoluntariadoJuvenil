import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Calendar,
  Award,
  Users,
  Settings,
  HelpCircle,
  ChevronRight,
  Eye,
  Volume2,
  Contrast,
  Type,
  Bell,
  BookmarkCheck,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLocale } from '@/i18n/LocaleContext';
import { useAuthContext } from '@/contexts/AuthContext';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: Home, label: "inicio", shortcut: "Alt+H" },
  { icon: Calendar, label: "proyectos", shortcut: "Alt+P" },
  { icon: BookmarkCheck, label: "mis_proyectos", shortcut: "Alt+Y" },
  { icon: Award, label: "mis_horas", shortcut: "Alt+M" },
  { icon: FileCheck, label: "certificados", shortcut: "Alt+E" },
  { icon: Users, label: "comunidad", shortcut: "Alt+C" },
  { icon: Settings, label: "configuracion", shortcut: "Alt+S" },
  { icon: HelpCircle, label: "ayuda", shortcut: "Alt+A" },
];

const accessibilityItems = [
  { icon: Eye, label: "Alertas Visuales" },
  { icon: Volume2, label: "Lectura por Voz" },
  { icon: Contrast, label: "Alto Contraste" },
  { icon: Type, label: "Texto Ampliado" },
];

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useLocale();
  const { isAuthenticated } = useAuthContext();

  // Mapeo de etiquetas a rutas
  const routeMap: Record<string, string> = {
    inicio: "/",
    proyectos: "/proyectos",
    mis_proyectos: "/mis-proyectos",
    mis_horas: "/mis-horas",
    certificados: "/certificados",
    comunidad: "/comunidad",
    configuracion: "/configuracion",
    ayuda: "/ayuda",
  };

  // Filtrar menuItems según autenticación
  const visibleMenuItems = menuItems.filter(item => {
    // Si no está autenticado, ocultar items que requieren auth
    if (!isAuthenticated && (
      item.label === "mis_proyectos" || 
      item.label === "mis_horas" ||
      item.label === "certificados"
    )) {
      return false;
    }
    return true;
  });

  const handleNavigation = (label: string) => {
    const route = routeMap[label];
    if (route) {
      navigate(route);
      onClose();
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          // show only on small screens; hide on md+ because header menu replaces it
          "fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r border-sidebar-border bg-sidebar transition-transform duration-300 md:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <nav className="flex h-full flex-col gap-2 overflow-y-auto p-4">
          {visibleMenuItems.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              onClick={() => handleNavigation(item.label)}
            >
              <item.icon className="h-5 w-5" />
              <span className="flex-1 text-left">{t(item.label)}</span>
              <kbd className="hidden rounded bg-muted px-1.5 py-0.5 text-xs opacity-60 lg:inline-block">
                {item.shortcut}
              </kbd>
            </Button>
          ))}

          <div className="my-2 h-px bg-sidebar-border" />

          <Collapsible
            open={isAccessibilityOpen}
            onOpenChange={setIsAccessibilityOpen}
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <Bell className="h-5 w-5" />
                <span className="flex-1 text-left">{t('accesibilidad')}</span>
                <ChevronRight
                  className={cn(
                    "h-4 w-4 transition-transform",
                    isAccessibilityOpen && "rotate-90"
                  )}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="ml-8 mt-1 space-y-1">
              {accessibilityItems.map((item) => (
                <Button
                  key={item.label}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <item.icon className="h-4 w-4" />
                  <span className="text-sm">{t(item.label)}</span>
                </Button>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </nav>
      </aside>
    </>
  );
};
