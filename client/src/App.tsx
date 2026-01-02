import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Dashboard from "@/pages/Dashboard";
import Recommendations from "@/pages/Recommendations";
import TvSetup from "@/pages/TvSetup";
import Preferences from "@/pages/Preferences";
import CustomerInterface from "@/pages/CustomerInterface";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/recommendations" component={Recommendations} />
      <Route path="/setup" component={TvSetup} />
      <Route path="/preferences" component={Preferences} />
      <Route path="/customer" component={CustomerInterface} />
      <Route component={NotFound} />
    </Switch>
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
