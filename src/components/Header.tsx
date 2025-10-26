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
  ChevronRight,
  LogIn,
  UserPlus,
  User,
  LogOut,
  KeyRound,
  BookmarkCheck,
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
import { useAuthContext } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavLink, useNavigate } from "react-router-dom";

interface HeaderProps {
  currentPage: string;
  onMenuClick?: () => void;
}

const navItems = [
  { icon: Home, label: "Inicio" },
  { icon: Calendar, label: "Proyectos" },
  { icon: BookmarkCheck, label: "Mis Proyectos" },
  { icon: Award, label: "Mis Horas" },
  { icon: Users, label: "Comunidad" },
];

export const Header = ({ currentPage, onMenuClick }: HeaderProps) => {
  const [showShortcuts, setShowShortcuts] = useState(false);
  const { locale, t, setLocale } = useLocale();
  const { user, isAuthenticated, logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Primera fila: Logo + Nombre + Búsqueda + Idioma + Auth */}
      <div className="container flex h-14 items-center gap-2 sm:gap-3 px-3 sm:px-4 border-b border-border/50">
        {/* Mobile hamburger (shows on small screens) */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden shrink-0"
          onClick={() => onMenuClick?.()}
          aria-label="Abrir menú"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo + Nombre Sistema */}
        <NavLink to="/" className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity">
          <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary via-secondary to-accent shadow-md">
            <span className="text-base sm:text-lg font-bold text-white">V</span>
          </div>
          <div className="hidden sm:flex flex-col">
            <h1 className="text-sm sm:text-base font-bold leading-tight">VoluntariaJoven</h1>
            <span className="text-xs text-muted-foreground leading-tight">{currentPage}</span>
          </div>
        </NavLink>

        {/* Barra búsqueda - Hidden on mobile */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('buscar_placeholder')}
              className="w-full pl-9 pr-3 h-9 text-sm"
            />
          </div>
        </div>

        {/* Idioma - Responsive */}
        <Select value={locale} onValueChange={(v) => setLocale(v as any)}>
          <SelectTrigger className="w-[100px] sm:w-[130px] h-9 gap-1 sm:gap-2 shrink-0">
            <Globe className="h-3 w-3 sm:h-4 sm:w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-background">
            <SelectItem value="es">Español</SelectItem>
            <SelectItem value="en">English</SelectItem>
          </SelectContent>
        </Select>

        {/* Auth Buttons (navigate to login/register) */}
        {/* Botones de autenticación o Menú de usuario */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0 ml-auto">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowShortcuts(true)} 
            className="hidden lg:inline-flex h-9 w-9 p-0" 
            aria-label="Atajos de teclado"
          >
            <HelpCircle className="h-4 w-4" />
          </Button>
          
          {isAuthenticated && user ? (
            // Usuario logueado - Mostrar avatar y menú
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 gap-1 sm:gap-2 px-1 sm:px-2">
                  <Avatar className="h-6 w-6 sm:h-7 sm:w-7">
                    <AvatarImage src={user.avatar} alt={user.fullName} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {getInitials(user.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs sm:text-sm font-medium hidden lg:inline max-w-[100px] xl:max-w-[120px] truncate">
                    {user.fullName.split(' ')[0]}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-background">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.fullName}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <NavLink to="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Mi Perfil</span>
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NavLink to="/configuracion" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configuración</span>
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // Usuario NO logueado - Mostrar botones de login/registro
            <>
              <NavLink to="/login" className="hidden sm:inline-flex">
                <Button variant="ghost" size="sm" className="gap-1 sm:gap-1.5 h-9 px-2 sm:px-3">
                  <LogIn className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm">Inicia sesión</span>
                </Button>
              </NavLink>

              <NavLink to="/register" className="inline-flex">
                <Button
                  size="sm"
                  className="gap-1 sm:gap-1.5 h-9 px-2 sm:px-3 bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-sm"
                >
                  <UserPlus className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="text-xs sm:text-sm">Regístrate</span>
                </Button>
              </NavLink>
            </>
          )}
        </div>
      </div>

      {/* Segunda fila: Menú + Navegación */}
      <div className="container flex h-12 items-center gap-2 sm:gap-4 px-3 sm:px-4">
        {/* Menu Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1 sm:gap-2 h-9 px-2 sm:px-3 shrink-0">
              <Menu className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">Menú</span>
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
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Horizontal Navigation - Responsive */}
        <nav className="flex items-center gap-0.5 sm:gap-1 mx-auto overflow-x-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={
                item.label === "Inicio"
                  ? "/"
                  : item.label === "Proyectos"
                  ? "/proyectos"
                  : item.label === "Mis Proyectos"
                  ? "/mis-proyectos"
                  : item.label === "Mis Horas"
                  ? "/mis-horas"
                  : "/comunidad"
              }
              className={({ isActive }) =>
                `flex items-center gap-1 sm:gap-1.5 h-9 px-2 sm:px-3 rounded text-xs sm:text-sm whitespace-nowrap ${
                  isActive ? "text-primary font-semibold" : "text-foreground hover:text-primary"
                }`
              }
            >
              <item.icon className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
              <span className="hidden sm:inline">
                {item.label === 'Inicio' 
                  ? t('inicio') 
                  : item.label === 'Proyectos' 
                  ? t('proyectos') 
                  : item.label === 'Mis Proyectos'
                  ? 'Mis Proyectos'
                  : item.label === 'Mis Horas' 
                  ? t('mis_horas') 
                  : t('comunidad')}
              </span>
            </NavLink>
          ))}
        </nav>
      </div>
      <ShortcutHelp open={showShortcuts} onClose={() => setShowShortcuts(false)} />
    </header>
  );
};
