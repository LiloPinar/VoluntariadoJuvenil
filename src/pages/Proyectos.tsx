import React, { useState } from "react";
import { Header } from "@/components/Header";
import { useLocale } from '@/i18n/LocaleContext';
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";

const Proyectos = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { t } = useLocale();

 

  return (
    <div className="flex min-h-screen flex-col">
      <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} currentPage="Proyectos" />
      <div className="flex flex-1">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="flex-1 container px-4 py-8">
          <h1 className="text-3xl font-bold">{t('proyectos_title')}</h1>
          <p className="mt-4 text-muted-foreground">{t('proyectos_desc')}</p>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Proyectos;
