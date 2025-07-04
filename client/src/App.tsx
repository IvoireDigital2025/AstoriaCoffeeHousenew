import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import Chatbot from "@/components/chatbot";

import Home from "@/pages/home";
import Menu from "@/pages/menu";
import About from "@/pages/about";
import Locations from "@/pages/locations";
import Contact from "@/pages/contact";
import Loyalty from "@/pages/loyalty";
import Community from "@/pages/community";
import MoodSelectorPage from "@/pages/mood-selector";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <>
      <Navigation />
      <main>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/menu" component={Menu} />
          <Route path="/about" component={About} />
          <Route path="/locations" component={Locations} />
          <Route path="/contact" component={Contact} />
          <Route path="/loyalty" component={Loyalty} />
          <Route path="/community" component={Community} />
          <Route path="/mood-selector" component={MoodSelectorPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <Chatbot />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-coffee-cream">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
