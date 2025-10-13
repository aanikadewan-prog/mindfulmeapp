import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { CrisisFooter } from "@/components/CrisisFooter";
import CheckIn from "./pages/CheckIn";
import Journal from "./pages/Journal";
import Progress from "./pages/Progress";
import Activities from "./pages/Activities";
import CleanCounter from "./pages/CleanCounter";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
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
                    <Route path="/" element={<CheckIn />} />
                    <Route path="/journal" element={<Journal />} />
                    <Route path="/progress" element={<Progress />} />
                    <Route path="/activities" element={<Activities />} />
                    <Route path="/clean" element={<CleanCounter />} />
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

export default App;
