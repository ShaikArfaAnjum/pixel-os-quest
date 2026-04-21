import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProgressProvider } from "@/store/progress";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import SchedulingPage from "./pages/SchedulingPage.tsx";
import PageReplacementPage from "./pages/PageReplacementPage.tsx";
import SemaphorePage from "./pages/SemaphorePage.tsx";
import QuizPage from "./pages/QuizPage.tsx";
import LearnPage from "./pages/LearnPage.tsx";
import ChapterPage, { ChaptersIndexPage } from "./pages/ChapterPage.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ProgressProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/chapters" element={<ChaptersIndexPage />} />
            <Route path="/chapter/:id" element={<ChapterPage />} />
            <Route path="/sim/scheduling" element={<SchedulingPage />} />
            <Route path="/sim/page-replacement" element={<PageReplacementPage />} />
            <Route path="/sim/semaphore" element={<SemaphorePage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ProgressProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
