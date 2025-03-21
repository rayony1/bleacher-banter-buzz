import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { AuthProvider } from "./lib/auth";
import BottomNav from "./components/layout/BottomNav";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import Scoreboard from "./pages/Scoreboard";
import Predictions from "./pages/Predictions";
import NotFound from "./pages/NotFound";
import AuthCallback from "./pages/AuthCallback";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import InAppNotificationListener from './components/notifications/InAppNotificationListener';

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      viewportMeta.setAttribute(
        'content', 
        'width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=1'
      );
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
            <InAppNotificationListener />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

// AppContent component to conditionally render BottomNav
const AppContent = () => {
  const location = useLocation();
  const [showBottomNav, setShowBottomNav] = useState(true);
  
  useEffect(() => {
    // Hide bottom nav on auth-related pages, landing page, terms, and privacy pages
    const noNavPaths = ["/auth", "/auth/callback", "/terms", "/privacy"];
    const isAuthPath = noNavPaths.some(path => location.pathname.startsWith(path));
    const isLandingPage = location.pathname === "/";
    
    setShowBottomNav(!isAuthPath && !isLandingPage);
  }, [location]);
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/scoreboard" element={<Scoreboard />} />
        <Route path="/predictions" element={<Predictions />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {showBottomNav && <BottomNav />}
    </>
  );
};

export default App;
