import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { ProjectCard } from "@/components/ProjectCard";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, TrendingUp, Users, Award } from "lucide-react";
import heroImage from "@/assets/hero-volunteering.jpg";
import { useLocale } from "@/i18n/LocaleContext";
import { allProjects } from "@/data/projects";

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Tomar los primeros 6 proyectos para mostrar en la página de inicio
  const featuredProjects = allProjects.slice(0, 6);

  const stats = [
    {
      icon: Users,
      value: "2,500+",
      label: "Voluntarios Activos",
    },
    {
      icon: Award,
      value: "45,000+",
      label: "Horas de Servicio",
    },
    {
      icon: TrendingUp,
      value: "150+",
      label: "Proyectos Completados",
    },
  ];

  const { t } = useLocale();

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        currentPage="Inicio"
      />

      <div className="flex flex-1">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className="flex-1">
          {/* Hero Section */}
          <section className="relative h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden">
            <img
              src={heroImage}
              alt="Jóvenes voluntarios trabajando juntos"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-transparent" />
            <div className="container relative flex h-full items-center px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl space-y-4 sm:space-y-6">
                <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
                  {t('home_title')}
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground md:text-xl">
                  {t('home_sub')}
                </p>
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 w-full sm:w-auto"
                  >
                    {t('explorar_proyectos')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    {t('ver_mis_horas')}
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="border-b border-border bg-muted/30 py-8 sm:py-12">
            <div className="container px-4 sm:px-6 lg:px-8">
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3">
                {stats.map((stat) => (
                  <Card key={stat.label} className="text-center">
                    <CardContent className="pt-4 sm:pt-6">
                      <div className="mb-2 sm:mb-3 inline-flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-primary/10">
                        <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      </div>
                      <div className="text-2xl sm:text-3xl font-bold">{stat.value}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">
                        {stat.label}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Projects Section */}
          <section className="py-12 sm:py-16">
            <div className="container px-4 sm:px-6 lg:px-8">
              <div className="mb-6 sm:mb-8">
                <h2 className="mb-2 text-2xl sm:text-3xl font-bold">{t('proyectos_destacados')}</h2>
                <p className="text-sm sm:text-base text-muted-foreground">{t('home_sub')}</p>
              </div>

              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {featuredProjects.map((project) => (
                  <ProjectCard key={project.id} {...project} />
                ))}
              </div>

              <div className="mt-6 sm:mt-8 text-center">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  {t('ver_todos_proyectos')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </section>

          {/* Help Section */}
          <section className="border-t border-border bg-muted/30 py-8 sm:py-12">
            <div className="container px-4 sm:px-6 lg:px-8 text-center">
              <h3 className="mb-3 sm:mb-4 text-xl sm:text-2xl font-bold">{t('necesitas_ayuda')}</h3>
              <p className="mb-4 sm:mb-6 text-sm sm:text-base text-muted-foreground">{t('home_sub')}</p>
              <Button variant="outline" className="w-full sm:w-auto">{t('contactar_soporte')}</Button>
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
