import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Roms from "@/pages/roms";
import RomDetail from "@/pages/rom-detail";
import Community from "@/pages/community";
import SubmitRom from "@/pages/submit-rom";
import SimpleRomSubmit from "@/pages/simple-rom-submit";
import RomSubmissionDb from "@/pages/rom-submission-db";
import InstallationGuide from "@/pages/installation-guide";
import { DeveloperLogin } from "@/pages/developer-login";
import { DeveloperRegister } from "@/pages/developer-register";
import { DeveloperDashboard } from "@/pages/developer-dashboard";
import { RomUpload } from "@/pages/rom-upload";
import { MyRoms } from "@/pages/my-roms";
import { AdminPanel } from "@/pages/admin-panel";
import { AdminLogin } from "@/pages/admin-login";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/roms" component={Roms} />
          <Route path="/roms/:id" component={RomDetail} />
          <Route path="/community" component={Community} />
          <Route path="/submit" component={RomSubmissionDb} />
          <Route path="/installation-guide" component={InstallationGuide} />
          <Route path="/developer/login" component={DeveloperLogin} />
          <Route path="/developer/register" component={DeveloperRegister} />
          <Route path="/developer/dashboard" component={DeveloperDashboard} />
          <Route path="/developer/upload" component={RomUpload} />
          <Route path="/developer/my-roms" component={MyRoms} />
          <Route path="/admin/login" component={AdminLogin} />
          <Route path="/admin" component={AdminPanel} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
