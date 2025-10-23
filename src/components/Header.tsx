import {
  Search,
  Globe,
  Menu,
  Home,
  Calendar,
  Award,
  Users,
  Settings,
  HelpCircle,
  Bell,
  Eye,
  Volume2,
  Contrast,
  Type,
  ChevronRight,
  LogIn,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import ShortcutHelp from "@/components/ShortcutHelp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocale } from "@/i18n/LocaleContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { NavLink } from "react-router-dom";

interface HeaderProps {
  currentPage: string;
  onMenuClick?: () => void;
}

const navItems = [
  { icon: Home, label: "Inicio" },
  { icon: Calendar, label: "Proyectos" },
  { icon: Award, label: "Mis Horas" },
  { icon: Users, label: "Comunidad" },
];

const accessibilityItems = [
  { icon: Eye, label: "Alertas Visuales" },
  { icon: Volume2, label: "Lectura por Voz" },
  { icon: Contrast, label: "Alto Contraste" },
  { icon: Type, label: "Texto Ampliado" },
];

export const Header = ({ currentPage, onMenuClick }: HeaderProps) => {
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const { locale, t, setLocale } = useLocale();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Primera fila: Logo + Nombre + Búsqueda + Idioma + Auth */}
      <div className="container flex h-14 items-center gap-3 px-4 border-b border-border/50">
        {/* Mobile hamburger (shows on small screens) */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => onMenuClick?.()}
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo + Nombre Sistema */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary via-secondary to-accent shadow-sm">
            <span className="text-base font-bold text-white">V</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm font-bold leading-tight">VoluntariaJoven</h1>
            <span className="text-[10px] text-muted-foreground leading-tight">{currentPage}</span>
          </div>
        </div>

        {/* Barra búsqueda */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('buscar_placeholder')}
              className="w-full pl-9 pr-3 h-9 text-sm"
            />
          </div>
        </div>

        {/* Idioma */}
        <Select value={locale} onValueChange={(v) => setLocale(v as any)}>
          <SelectTrigger className="w-[130px] h-9 gap-2 shrink-0">
            <Globe className="h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-background">
            <SelectItem value="es">Español</SelectItem>
            <SelectItem value="en">English</SelectItem>
          </SelectContent>
        </Select>

        {/* Auth Buttons (navigate to login/register) */}
        <div className="flex items-center gap-2 shrink-0 ml-auto">
          <Button variant="ghost" size="sm" onClick={() => setShowShortcuts(true)} className="hidden sm:inline-flex" aria-label="Atajos de teclado">
            <HelpCircle className="h-4 w-4" />
          </Button>
          <NavLink to="/login" className="hidden sm:inline-flex">
            <Button variant="ghost" size="sm" className="gap-1.5 h-9">
              <LogIn className="h-4 w-4" />
              <span className="text-sm">Inicia sesión</span>
            </Button>
          </NavLink>

          <NavLink to="/register" className="inline-flex">
            <Button
              size="sm"
              className="gap-1.5 h-9 bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-sm"
            >
              <UserPlus className="h-4 w-4" />
              <span className="text-sm hidden md:inline">Regístrate</span>
            </Button>
          </NavLink>
        </div>
      </div>

      {/* Segunda fila: Menú + Navegación */}
      <div className="container flex h-12 items-center gap-4 px-4">
        {/* Menu Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 h-9">
              <Menu className="h-4 w-4" />
              <span className="text-sm">Menú</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 bg-background">
            <DropdownMenuLabel>{t('menu')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <NavLink to="/configuracion">
                <Settings className="mr-2 h-4 w-4" />
                <span>{t('configuracion')}</span>
              </NavLink>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <NavLink to="/ayuda">
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>{t('ayuda')}</span>
              </NavLink>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Bell className="mr-2 h-4 w-4" />
                <span>{t('accesibilidad')}</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="bg-background">
                {accessibilityItems.map((item) => (
                  <DropdownMenuItem key={item.label}>
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{t(item.label.toLowerCase().replace(/ /g, '_'))}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Horizontal Navigation */}
        <nav className="flex items-center gap-1 mx-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={
                item.label === "Inicio"
                  ? "/"
                  : item.label === "Proyectos"
                  ? "/proyectos"
                  : item.label === "Mis Horas"
                  ? "/mis-horas"
                  : "/comunidad"
              }
              className={({ isActive }) =>
                `flex items-center gap-1.5 h-9 px-3 rounded text-sm ${
                  isActive ? "text-primary font-semibold" : "text-foreground hover:text-primary"
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              <span className="text-sm">{t(item.label === 'Inicio' ? 'inicio' : item.label === 'Proyectos' ? 'proyectos' : item.label === 'Mis Horas' ? 'mis_horas' : 'comunidad')}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      <ShortcutHelp open={showShortcuts} onClose={() => setShowShortcuts(false)} />
    </header>
  );
};
