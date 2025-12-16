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
import CodeOfConduct from "./pages/CodeOfConduct";
import NotFound from "./pages/NotFound";
import ResetPassword from "./pages/ResetPassword";
import PropuestaProyecto from "./pages/PropuestaProyecto";
import AdminDashboard from "./pages/admin/Dashboard";
import ProjectManagement from "./pages/admin/ProjectManagement";
import ActivityValidation from "./pages/admin/ActivityValidation";
import ProposalManagement from "./pages/admin/ProposalManagement";
import IncidentManagement from "./pages/admin/IncidentManagement";
import WithdrawalManagement from "./pages/admin/WithdrawalManagement";
import { LocaleProvider } from "./i18n/LocaleContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ProjectProvider } from "./contexts/ProjectContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import SelectionReader from "./components/SelectionReader";

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
          <NotificationProvider>
            <ProjectProvider>
              <LocaleProvider>
                <SelectionReader />
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
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/code-of-conduct" element={<CodeOfConduct />} />
              <Route path="/proponer-proyecto" element={<PropuestaProyecto />} />
              {/* Rutas de administrador */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute requireRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/projects" 
                element={
                  <ProtectedRoute requireRole="admin">
                    <ProjectManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/activities" 
                element={
                  <ProtectedRoute requireRole="admin">
                    <ActivityValidation />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/proposals" 
                element={
                  <ProtectedRoute requireRole="admin">
                    <ProposalManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/incidents" 
                element={
                  <ProtectedRoute requireRole="admin">
                    <IncidentManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/withdrawals" 
                element={
                  <ProtectedRoute requireRole="admin">
                    <WithdrawalManagement />
                  </ProtectedRoute>
                } 
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
                </Routes>
              </LocaleProvider>
            </ProjectProvider>
          </NotificationProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
