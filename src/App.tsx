import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Proyectos from "./pages/Proyectos";
import DetalleProyecto from "./pages/DetalleProyecto";
import MisProyectos from "./pages/MisProyectos";
import MisHoras from "./pages/MisHoras";
import Comunidad from "./pages/Comunidad";
import Configuracion from "./pages/Configuracion";
import Ayuda from "./pages/Ayuda";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import NotFound from "./pages/NotFound";
import { LocaleProvider } from "./i18n/LocaleContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ProjectProvider } from "./contexts/ProjectContext";

const queryClient = new QueryClient();

const App = () => {
  // Aplicar modo oscuro al cargar la aplicación
  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <ProjectProvider>
            <LocaleProvider>
              <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/proyectos" element={<Proyectos />} />
              <Route path="/proyecto/:id" element={<DetalleProyecto />} />
              <Route path="/mis-proyectos" element={<MisProyectos />} />
              <Route path="/mis-horas" element={<MisHoras />} />
              <Route path="/comunidad" element={<Comunidad />} />
              <Route path="/configuracion" element={<Configuracion />} />
              <Route path="/ayuda" element={<Ayuda />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </LocaleProvider>
        </ProjectProvider>
      </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
