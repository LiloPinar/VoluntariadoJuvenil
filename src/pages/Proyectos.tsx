import React, { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/Header";
import { useLocale } from '@/i18n/LocaleContext';
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { ProjectCard } from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal, Grid3x3, List, MapPin, Clock } from "lucide-react";
import { allProjects, getProjectTitle, getProjectDescription } from "@/data/projects";

type Category = "all" | "social" | "environmental" | "educational";
type SortBy = "recent" | "popular" | "hours-asc" | "hours-desc";
type ViewMode = "grid" | "list";

const Proyectos = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortBy>("recent");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showFilters, setShowFilters] = useState(false);

  const { t, locale } = useLocale();

  // Cargar proyectos desde localStorage o usar los predeterminados
  const projects = useMemo(() => {
    const savedProjects = localStorage.getItem('adminProjects');
    return savedProjects ? JSON.parse(savedProjects) : allProjects;
  }, []);

  // Scroll al top cuando se carga la página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Obtener ubicaciones únicas
  const uniqueLocations = useMemo(() => {
    const locations = new Set(projects.map(p => p.location));
    return Array.from(locations);
  }, [projects]);

  // Filtrar y ordenar proyectos
  const filteredProjects = useMemo(() => {
    let filtered = [...projects];

    // Filtrar por búsqueda
    if (searchQuery) {
      filtered = filtered.filter(project => {
        const title = getProjectTitle(project, locale);
        const description = getProjectDescription(project, locale);
        return title.toLowerCase().includes(searchQuery.toLowerCase()) ||
               description.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    // Filtrar por categoría
    if (selectedCategory !== "all") {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }

    // Filtrar por ubicación
    if (selectedLocation !== "all") {
      filtered = filtered.filter(project => project.location === selectedLocation);
    }

    // Ordenar
    switch (sortBy) {
      case "recent":
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case "popular":
        filtered.sort((a, b) => b.participants - a.participants);
        break;
      case "hours-asc":
        filtered.sort((a, b) => a.hours - b.hours);
        break;
      case "hours-desc":
        filtered.sort((a, b) => b.hours - a.hours);
        break;
    }

    return filtered;
  }, [projects, searchQuery, selectedCategory, selectedLocation, sortBy]);

  const categories = [
    { value: "all", label: t('todos'), count: projects.length },
    { value: "social", label: t('social'), count: projects.filter(p => p.category === "social").length },
    { value: "environmental", label: t('ambiental'), count: projects.filter(p => p.category === "environmental").length },
    { value: "educational", label: t('educativo'), count: projects.filter(p => p.category === "educational").length },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} currentPage="Proyectos" />
      <div className="flex flex-1">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 container px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">{t('proyectos_page_title')}</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              {t('proyectos_page_desc')}
            </p>
          </div>

          {/* Search and Filters Bar */}
          <div className="mb-6 space-y-4">
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar proyectos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 sm:h-11"
                />
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex-1 sm:flex-none h-10 sm:h-11"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filtros
                  {(selectedCategory !== "all" || selectedLocation !== "all") && (
                    <Badge variant="secondary" className="ml-2">
                      {[selectedCategory !== "all" ? 1 : 0, selectedLocation !== "all" ? 1 : 0].reduce((a, b) => a + b)}
                    </Badge>
                  )}
                </Button>

                {/* View Toggle */}
                <div className="hidden sm:flex border rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none h-11"
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none h-11"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="p-4 border rounded-lg bg-muted/30 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Category Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Categoría</label>
                    <Select value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as Category)}>
                      <SelectTrigger className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label} ({cat.count})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Location Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Ubicación
                    </label>
                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                      <SelectTrigger className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las ubicaciones</SelectItem>
                        {uniqueLocations.map((location: string) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Ordenar por</label>
                    <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortBy)}>
                      <SelectTrigger className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="recent">Más recientes</SelectItem>
                        <SelectItem value="popular">Más populares</SelectItem>
                        <SelectItem value="hours-asc">Menos horas</SelectItem>
                        <SelectItem value="hours-desc">Más horas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Clear Filters */}
                {(selectedCategory !== "all" || selectedLocation !== "all") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedCategory("all");
                      setSelectedLocation("all");
                    }}
                    className="text-primary"
                  >
                    Limpiar filtros
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Category Pills (Alternative to filters) */}
          <div className="mb-6 flex flex-wrap gap-2">
            {categories.map(cat => (
              <Button
                key={cat.value}
                variant={selectedCategory === cat.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.value as Category)}
                className="rounded-full"
              >
                {cat.label}
                <Badge variant="secondary" className="ml-2">
                  {cat.count}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Results Count */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredProjects.length} {filteredProjects.length === 1 ? t('proyecto_encontrado') : t('proyectos_encontrados')}
            </p>
          </div>

          {/* Projects Grid/List */}
          {filteredProjects.length > 0 ? (
            <div className={
              viewMode === "grid"
                ? "grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : "space-y-4"
            }>
              {filteredProjects.map(project => (
                <ProjectCard 
                  key={project.id}
                  id={project.id}
                  title={getProjectTitle(project, locale)}
                  description={getProjectDescription(project, locale)}
                  category={project.category}
                  hours={project.hours}
                  participants={project.participants}
                  location={project.location}
                  image={project.image}
                  date={project.date}
                  status={project.status}
                  isOpenForEnrollment={project.isOpenForEnrollment}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{t('no_proyectos_encontrados')}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t('ajustar_filtros')}
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedLocation("all");
                }}
              >
                {t('limpiar_filtros')}
              </Button>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Proyectos;
