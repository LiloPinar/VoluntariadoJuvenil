import { useState, useEffect, useRef } from 'react';
import { Search, Home, Calendar, Award, Users, Settings, HelpCircle, FileText, X, BookmarkCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface SearchResult {
  type: 'page' | 'project';
  title: string;
  description?: string;
  path: string;
  icon: any;
  category?: string;
  keywords?: string[];
}

export const GlobalSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();

  // Páginas disponibles con palabras clave
  const pages: SearchResult[] = [
    { 
      type: 'page' as const, 
      title: 'Inicio', 
      description: 'Página principal', 
      path: '/', 
      icon: Home,
      keywords: ['home', 'principal', 'voluntarios activos', '2500', 'horas de servicio', '45000', 'proyectos completados', '150', 'estadísticas']
    },
    { 
      type: 'page' as const, 
      title: 'Proyectos', 
      description: 'Explora proyectos de voluntariado', 
      path: '/proyectos', 
      icon: Calendar,
      keywords: ['explorar', 'buscar', 'voluntariado', 'inscribirse']
    },
    ...(isAuthenticated ? [
      { 
        type: 'page' as const, 
        title: 'Mis Proyectos', 
        description: 'Proyectos en los que estás inscrito', 
        path: '/mis-proyectos', 
        icon: BookmarkCheck,
        keywords: ['inscritos', 'inscripciones', 'pendientes', 'aprobados']
      },
      { 
        type: 'page' as const, 
        title: 'Mis Horas', 
        description: 'Registro de horas de voluntariado', 
        path: '/mis-horas', 
        icon: Award,
        keywords: ['registro', 'completadas', 'certificado', 'tiempo']
      },
    ] : []),
    { 
      type: 'page' as const, 
      title: 'Comunidad', 
      description: 'Conecta con otros voluntarios', 
      path: '/comunidad', 
      icon: Users,
      keywords: ['conectar', 'voluntarios', 'red', 'social']
    },
    { 
      type: 'page' as const, 
      title: 'Configuración', 
      description: 'Ajustes de la aplicación', 
      path: '/configuracion', 
      icon: Settings,
      keywords: ['ajustes', 'preferencias', 'tema']
    },
    { 
      type: 'page' as const, 
      title: 'Ayuda', 
      description: 'Centro de ayuda y soporte', 
      path: '/ayuda', 
      icon: HelpCircle,
      keywords: ['soporte', 'preguntas', 'faq']
    },
    ...(isAuthenticated ? [
      { 
        type: 'page' as const, 
        title: 'Mi Perfil', 
        description: 'Ver y editar tu perfil', 
        path: '/profile', 
        icon: Users,
        keywords: ['cuenta', 'datos', 'información']
      },
    ] : []),
  ];

  // Cargar proyectos desde localStorage
  const getProjects = (): SearchResult[] => {
    const savedProjects = localStorage.getItem('adminProjects');
    const allProjects = savedProjects ? JSON.parse(savedProjects) : [];
    
    return allProjects.map((project: any) => ({
      type: 'project' as const,
      title: project.title,
      description: project.description,
      path: `/proyecto/${project.id}`,
      icon: Calendar,
      category: project.category === 'social' ? 'Social' : project.category === 'environmental' ? 'Ambiental' : 'Educativo',
    }));
  };

  // Buscar en páginas y proyectos
  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      setSelectedIndex(0);
      return;
    }

    const query = searchQuery.toLowerCase();
    const projects = getProjects();
    const allItems = [...pages, ...projects];

    const filtered = allItems.filter(item => {
      // Búsqueda en título
      const titleMatch = item.title.toLowerCase().includes(query);
      
      // Búsqueda en descripción
      const descriptionMatch = item.description?.toLowerCase().includes(query);
      
      // Búsqueda en categoría
      const categoryMatch = item.category?.toLowerCase().includes(query);
      
      // Búsqueda en keywords - busca si alguna keyword CONTIENE la query
      const keywordsMatch = item.keywords?.some(keyword => 
        keyword.toLowerCase().includes(query)
      );
      
      return titleMatch || descriptionMatch || categoryMatch || keywordsMatch;
    });

    // Ordenar por relevancia: primero coincidencias en título, luego el resto
    filtered.sort((a, b) => {
      const aTitleMatch = a.title.toLowerCase().includes(query);
      const bTitleMatch = b.title.toLowerCase().includes(query);
      
      if (aTitleMatch && !bTitleMatch) return -1;
      if (!aTitleMatch && bTitleMatch) return 1;
      
      // Si ambos o ninguno coincide en título, ordenar por tipo (páginas primero)
      if (a.type === 'page' && b.type === 'project') return -1;
      if (a.type === 'project' && b.type === 'page') return 1;
      
      return 0;
    });

    setResults(filtered.slice(0, 6));
    setSelectedIndex(0);
  }, [searchQuery, isAuthenticated]);

  // Navegación con teclado
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setSearchQuery('');
      }

      if (results.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % results.length);
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
        }
        if (e.key === 'Enter' && results[selectedIndex]) {
          e.preventDefault();
          handleSelect(results[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  const handleSelect = (result: SearchResult) => {
    // Navegar con el query para resaltar en la página destino
    navigate(result.path, { state: { searchQuery } });
    setIsOpen(false);
    setSearchQuery('');
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'Social':
        return 'bg-accent text-accent-foreground';
      case 'Ambiental':
        return 'bg-secondary text-secondary-foreground';
      case 'Educativo':
        return 'bg-primary text-primary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0"
          aria-label="Buscar"
        >
          <Search className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[400px] p-0" 
        align="end"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          inputRef.current?.focus();
        }}
      >
        <div className="flex items-center border-b px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground mr-2" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-0 focus-visible:ring-0 h-8 px-0"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 ml-1"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        <div className="max-h-[300px] overflow-y-auto">
          {searchQuery && results.length === 0 && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No se encontraron resultados
            </div>
          )}

          {results.length > 0 && (
            <div className="p-1">
              {results.map((result, index) => {
                const Icon = result.icon;
                return (
                  <button
                    key={`${result.type}-${result.path}`}
                    onClick={() => handleSelect(result)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={cn(
                      "w-full flex items-start gap-2 p-2 rounded text-left transition-colors text-sm",
                      selectedIndex === index
                        ? 'bg-accent text-accent-foreground'
                        : 'hover:bg-accent/50'
                    )}
                  >
                    <Icon className="h-4 w-4 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-medium text-sm truncate">
                          {result.title}
                        </p>
                        {result.category && (
                          <Badge variant="secondary" className={`text-xs px-1 py-0 h-4 ${getCategoryColor(result.category)}`}>
                            {result.category}
                          </Badge>
                        )}
                      </div>
                      {result.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {result.description}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {!searchQuery && (
            <div className="py-6 text-center text-xs text-muted-foreground">
              Busca páginas o proyectos
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
