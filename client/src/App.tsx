import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";


import Home from "@/pages/home";
import Menu from "@/pages/menu";
import About from "@/pages/about";
import Locations from "@/pages/locations";
import Contact from "@/pages/contact";

import Community from "@/pages/community";
import MoodSelectorPage from "@/pages/mood-selector";
import AdminDashboard from "@/pages/admin-dashboard";
import AdminLogin from "@/pages/admin-login";
import StaffAccess from "@/pages/staff-access";
import Loyalty from "@/pages/loyalty";
import LoyaltyCheckin from "@/pages/loyalty-checkin";
import Franchise from "@/pages/franchise";
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

          <Route path="/community" component={Community} />
          <Route path="/mood-selector" component={MoodSelectorPage} />
          <Route path="/loyalty" component={Loyalty} />
          <Route path="/loyalty/checkin" component={LoyaltyCheckin} />
          <Route path="/franchise" component={Franchise} />
          <Route path="/staff" component={StaffAccess} />
          <Route path="/admin/login" component={AdminLogin} />
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/admin/contacts" component={AdminDashboard} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />

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
