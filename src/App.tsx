import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { CrisisFooter } from "@/components/CrisisFooter";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Home from "./pages/Home";
import CheckIn from "./pages/CheckIn";
import Journal from "./pages/Journal";
import Progress from "./pages/Progress";
import Activities from "./pages/Activities";
import BreathingTimer from "./pages/BreathingTimer";
import SoothingSounds from "./pages/SoothingSounds";
import MindfulTea from "./pages/MindfulTea";
import MorningRitual from "./pages/MorningRitual";
import GratitudePractice from "./pages/GratitudePractice";
import SelfCompassion from "./pages/SelfCompassion";
import PhoneFreeHour from "./pages/PhoneFreeHour";
import SocialMediaPause from "./pages/SocialMediaPause";
import EveningWindDown from "./pages/EveningWindDown";
import ShortWalk from "./pages/ShortWalk";
import ProgressiveRelaxation from "./pages/ProgressiveRelaxation";
import GentleStretching from "./pages/GentleStretching";
import CleanCounter from "./pages/CleanCounter";
import Vent from "./pages/Vent";
import Rewards from "./pages/Rewards";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import Help from "./pages/Help";
import Goals from "./pages/Goals";

import { useEffect } from "react";
import { initializeNotifications } from "./utils/notifications";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Initialize notifications on app load
    initializeNotifications();
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex h-14 items-center px-4">
                <SidebarTrigger className="-ml-1" />
                <div className="flex-1 text-center">
                  <h1 className="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    MindfulMe
                  </h1>
                </div>
                <div className="w-10" />
              </div>
            </header>
            <div className="flex flex-1 overflow-hidden">
              <AppSidebar />
              <main className="flex-1 overflow-y-auto">
                <div className="container py-8">
                  <Routes>
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                    <Route path="/check-in" element={<ProtectedRoute><CheckIn /></ProtectedRoute>} />
                    <Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
                    <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
                    <Route path="/activities" element={<ProtectedRoute><Activities /></ProtectedRoute>} />
                    <Route path="/breathing" element={<ProtectedRoute><BreathingTimer /></ProtectedRoute>} />
                    <Route path="/sounds" element={<ProtectedRoute><SoothingSounds /></ProtectedRoute>} />
                    <Route path="/tea" element={<ProtectedRoute><MindfulTea /></ProtectedRoute>} />
                    <Route path="/morning" element={<ProtectedRoute><MorningRitual /></ProtectedRoute>} />
                    <Route path="/gratitude" element={<ProtectedRoute><GratitudePractice /></ProtectedRoute>} />
                    <Route path="/self-compassion" element={<ProtectedRoute><SelfCompassion /></ProtectedRoute>} />
                    <Route path="/phone-free" element={<ProtectedRoute><PhoneFreeHour /></ProtectedRoute>} />
                    <Route path="/social-pause" element={<ProtectedRoute><SocialMediaPause /></ProtectedRoute>} />
                    <Route path="/evening-wind-down" element={<ProtectedRoute><EveningWindDown /></ProtectedRoute>} />
                    <Route path="/short-walk" element={<ProtectedRoute><ShortWalk /></ProtectedRoute>} />
                    <Route path="/progressive-relaxation" element={<ProtectedRoute><ProgressiveRelaxation /></ProtectedRoute>} />
                    <Route path="/gentle-stretching" element={<ProtectedRoute><GentleStretching /></ProtectedRoute>} />
                    <Route path="/clean" element={<ProtectedRoute><CleanCounter /></ProtectedRoute>} />
                    <Route path="/vent" element={<ProtectedRoute><Vent /></ProtectedRoute>} />
                    <Route path="/rewards" element={<ProtectedRoute><Rewards /></ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                    <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
                    <Route path="/help" element={<ProtectedRoute><Help /></ProtectedRoute>} />
                    <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
                    
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </main>
            </div>
            <CrisisFooter />
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
