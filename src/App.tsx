import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/FirebaseAuthContext";
import { BlockchainAuthProvider } from "@/contexts/BlockchainAuthContext";
import { useUnifiedAuth } from "@/hooks/useUnifiedAuth";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import HowItWorks from "./pages/HowItWorks";
import Insurance from "./pages/Insurance";
import Donate from "./pages/Donate";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import BlockchainLogin from "./pages/BlockchainLogin";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Claims from "./pages/Claims";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isAuthenticated } = useUnifiedAuth();

  // If authenticated, show only the dashboard (management system)
  if (isAuthenticated) {
    return <Dashboard />;
  }

  // If not authenticated, show the public website
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/insurance" element={<Insurance />} />
      <Route path="/donate" element={<Donate />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/blockchain-login" element={<BlockchainLogin />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/claims" element={<Claims />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <BlockchainAuthProvider>
            <AppProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <AppContent />
                </BrowserRouter>
              </TooltipProvider>
            </AppProvider>
          </BlockchainAuthProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
