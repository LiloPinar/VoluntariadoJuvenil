import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { ProjectCard } from "@/components/ProjectCard";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, TrendingUp, Users, Award } from "lucide-react";
import heroImage from "@/assets/hero-volunteering.jpg";
import projectEnvironmental from "@/assets/project-environmental.jpg";
import projectSocial from "@/assets/project-social.jpg";
import projectEducational from "@/assets/project-educational.jpg";
import { useLocale } from "@/i18n/LocaleContext";

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  const projects = [
    {
      title: "Reforestación Comunitaria",
      description:
        "Ayuda a plantar árboles y restaurar áreas verdes en nuestra comunidad local.",
      category: "environmental" as const,
      hours: 4,
      participants: 25,
      location: "Parque Central, Manta",
      image: projectEnvironmental,
    },
    {
      title: "Apoyo a Personas Mayores",
      description:
        "Acompaña y asiste a adultos mayores en el centro comunitario.",
      category: "social" as const,
      hours: 3,
      participants: 15,
      location: "Centro Comunitario San José",
      image: projectSocial,
    },
    {
      title: "Tutoría Académica",
      description:
        "Enseña y apoya a niños de primaria en sus estudios después de clases.",
      category: "educational" as const,
      hours: 2,
      participants: 30,
      location: "Escuela La Esperanza",
      image: projectEducational,
    },
    {
      title: "Limpieza de Playas",
      description:
        "Únete a la jornada mensual de limpieza y conservación de nuestras playas.",
      category: "environmental" as const,
      hours: 3,
      participants: 40,
      location: "Playa Murciélago",
      image: projectEnvironmental,
    },
    {
      title: "Alfabetización Digital",
      description:
        "Enseña habilidades tecnológicas básicas a personas de la tercera edad.",
      category: "educational" as const,
      hours: 2,
      participants: 12,
      location: "Biblioteca Municipal",
      image: projectEducational,
    },
    {
      title: "Banco de Alimentos",
      description:
        "Colabora en la clasificación y distribución de alimentos para familias necesitadas.",
      category: "social" as const,
      hours: 4,
      participants: 20,
      location: "Banco de Alimentos Manabí",
      image: projectSocial,
    },
  ];

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
          <section className="relative h-[500px] overflow-hidden">
            <img
              src={heroImage}
              alt="Jóvenes voluntarios trabajando juntos"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-transparent" />
            <div className="container relative flex h-full items-center px-4">
              <div className="max-w-2xl space-y-6">
                <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
                  {t('home_title')}
                </h1>
                <p className="text-lg text-muted-foreground md:text-xl">
                  {t('home_sub')}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  >
                    {t('explorar_proyectos')}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button size="lg" variant="outline">
                    {t('ver_mis_horas')}
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="border-b border-border bg-muted/30 py-12">
            <div className="container px-4">
              <div className="grid gap-6 md:grid-cols-3">
                {stats.map((stat) => (
                  <Card key={stat.label} className="text-center">
                    <CardContent className="pt-6">
                      <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <stat.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="text-3xl font-bold">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">
                        {stat.label}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Projects Section */}
          <section className="py-16">
            <div className="container px-4">
              <div className="mb-8">
                <h2 className="mb-2 text-3xl font-bold">{t('proyectos_destacados')}</h2>
                <p className="text-muted-foreground">{t('home_sub')}</p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project, index) => (
                  <ProjectCard key={index} {...project} />
                ))}
              </div>

              <div className="mt-8 text-center">
                <Button variant="outline" size="lg">
                  {t('ver_todos_proyectos')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </section>

          {/* Help Section */}
          <section className="border-t border-border bg-muted/30 py-12">
            <div className="container px-4 text-center">
              <h3 className="mb-4 text-2xl font-bold">{t('necesitas_ayuda')}</h3>
              <p className="mb-6 text-muted-foreground">{t('home_sub')}</p>
              <Button variant="outline">{t('contactar_soporte')}</Button>
            </div>
          </section>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
