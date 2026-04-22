import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProgressProvider } from "@/store/progress";
import { AuthProvider } from "@/store/auth";
import { RequireAuth, RedirectIfAuthed } from "@/components/auth/RequireAuth";
import Landing from "./pages/Landing.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Profile from "./pages/Profile.tsx";
import SignIn from "./pages/auth/SignIn.tsx";
import SignUp from "./pages/auth/SignUp.tsx";
import ForgotPassword from "./pages/auth/ForgotPassword.tsx";
import ResetPassword from "./pages/auth/ResetPassword.tsx";
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
      <BrowserRouter>
        <AuthProvider>
          <ProgressProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Public */}
              <Route path="/" element={<Landing />} />
              <Route path="/sign-in" element={<RedirectIfAuthed><SignIn /></RedirectIfAuthed>} />
              <Route path="/sign-up" element={<RedirectIfAuthed><SignUp /></RedirectIfAuthed>} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Authed */}
              <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
              <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
              <Route path="/learn" element={<RequireAuth><LearnPage /></RequireAuth>} />
              <Route path="/chapters" element={<RequireAuth><ChaptersIndexPage /></RequireAuth>} />
              <Route path="/chapter/:id" element={<RequireAuth><ChapterPage /></RequireAuth>} />
              <Route path="/sim/scheduling" element={<RequireAuth><SchedulingPage /></RequireAuth>} />
              <Route path="/sim/page-replacement" element={<RequireAuth><PageReplacementPage /></RequireAuth>} />
              <Route path="/sim/semaphore" element={<RequireAuth><SemaphorePage /></RequireAuth>} />
              <Route path="/quiz" element={<RequireAuth><QuizPage /></RequireAuth>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </ProgressProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
