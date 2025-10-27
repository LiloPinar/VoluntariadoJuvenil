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
  Bell,
} from "lucide-react";
import { useState } from "react";
import ShortcutHelp from "@/components/ShortcutHelp";
import { GlobalSearch } from "@/components/GlobalSearch";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { NavLink, useNavigate } from "react-router-dom";
import logoImage from "@/assets/VoluntariadoJuvenilLogo.jpg";

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
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Nuevo Proyecto: Limpieza de Playas", message: "Se ha publicado un nuevo proyecto ambiental", time: "Hace 5 min", unread: true },
    { id: 2, title: "Proyecto Actualizado", message: "Apoyo Educativo tiene nuevas plazas disponibles", time: "Hace 1 hora", unread: true },
    { id: 3, title: "Recordatorio", message: "Tienes un proyecto próximo este fin de semana", time: "Hace 3 horas", unread: false },
  ]);
  const { locale, t, setLocale } = useLocale();
  const { user, isAuthenticated, logout } = useAuthContext();
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, unread: false } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  // Filtrar navItems según autenticación
  const visibleNavItems = navItems.filter(item => {
    // Si no está autenticado, ocultar "Mis Proyectos" y "Mis Horas"
    if (!isAuthenticated && (item.label === "Mis Proyectos" || item.label === "Mis Horas")) {
      return false;
    }
    return true;
  });

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
      {/* Header unificado: Logo + Navegación + Idioma + Auth */}
      <div className="flex h-14 items-center gap-2 sm:gap-4 pl-2 sm:pl-3 pr-6 sm:pr-8">
        
        {/* Logo + Nombre Sistema - Pegado a la izquierda */}
        <NavLink to="/" className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity">
          <img 
            src={logoImage} 
            alt="VoluntariaJoven Logo" 
            className="h-10 w-10 sm:h-12 sm:w-12 object-cover rounded-full shadow-md border-2 border-primary/20"
          />
          <div className="hidden sm:flex flex-col">
            <h1 className="text-sm sm:text-base font-bold leading-tight">VoluntariaJoven</h1>
            <span className="text-xs text-muted-foreground leading-tight">{currentPage}</span>
          </div>
        </NavLink>

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

        {/* Botón Panel Admin solo para admin - Solo ícono */}
        {isAuthenticated && user?.role === 'admin' && (
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex h-10 w-10"
            onClick={() => navigate('/admin/dashboard')}
            title="Panel de Administración"
          >
            <Users className="h-5 w-5" />
          </Button>
        )}

        {/* Navegación principal - centrada */}
        <nav className="flex items-center gap-0.5 sm:gap-1 mx-auto overflow-x-auto">
          {visibleNavItems.map((item) => (
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

        {/* Buscador Global */}
        <GlobalSearch />

        {/* Botón de Notificaciones */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="relative h-9 w-9"
              aria-label="Notificaciones"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="font-semibold">{t('notifications')}</h3>
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={markAllAsRead}
                  className="h-8 text-xs"
                >
                  {t('mark_all_read')}
                </Button>
              )}
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  {t('no_notifications')}
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`border-b p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                      notification.unread ? 'bg-primary/5' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium leading-none">
                            {notification.title}
                          </p>
                          {notification.unread && (
                            <div className="h-2 w-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* Botones de autenticación o Menú de usuario */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
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
      <ShortcutHelp open={showShortcuts} onClose={() => setShowShortcuts(false)} />
    </header>
  );
};
