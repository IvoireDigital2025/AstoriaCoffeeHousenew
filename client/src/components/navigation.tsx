import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Star } from "lucide-react";
import LoyaltyDashboard from "./loyalty-dashboard";

export default function Navigation() {
  const [location] = useLocation();
  const [isLoyaltyOpen, setIsLoyaltyOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/menu", label: "Menu" },
    { path: "/mood-selector", label: "Mood Selector" },
    { path: "/about", label: "About" },
    { path: "/community", label: "Community" },
    { path: "/loyalty", label: "Loyalty" },
    { path: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) => location === path;

  return (
    <>
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0">
                <img 
                  src="/attached_assets/01_1749671523922.webp"
                  alt="Coffee Pro - Coffee & Bakery Logo"
                  className="h-12 w-auto"
                />
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? "text-coffee-primary"
                        : "text-coffee-dark hover:text-coffee-primary"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <a href="https://www.doordash.com/store/coffee-pro-corpo-astoria-30999939/43312348/?srsltid=AfmBOooPARJ1ZQBO14sBiUJJaSPCVTZA9LVIo_mETjO6yppzHrZHcviN" target="_blank" rel="noopener noreferrer">
                  <Button
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                    size="sm"
                  >
                    Order Delivery
                  </Button>
                </a>
              </div>
            </div>
            
            {/* Mobile Navigation */}
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-2">
                    <Menu className="w-6 h-6 text-coffee-dark" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 p-0">
                  <div className="flex flex-col h-full">
                    <div className="p-6 border-b border-coffee-cream">
                      <img 
                        src="/attached_assets/01_1749671523922.webp"
                        alt="Coffee Pro - Coffee & Bakery Logo"
                        className="h-10 w-auto"
                      />
                    </div>
                    <div className="flex-1 overflow-y-auto">
                      <div className="px-6 py-4 space-y-2">
                        {navItems.map((item) => (
                          <Link
                            key={item.path}
                            href={item.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`block px-4 py-3 text-base font-medium transition-colors rounded-lg ${
                              isActive(item.path)
                                ? "text-coffee-primary bg-coffee-cream"
                                : "text-coffee-dark hover:text-coffee-primary hover:bg-coffee-cream"
                            }`}
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div className="p-6 space-y-3 border-t border-coffee-cream">
                      <Button
                        onClick={() => {
                          setIsLoyaltyOpen(true);
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full bg-coffee-primary hover:bg-coffee-primary/90 text-white py-3"
                      >
                        <Star className="h-4 w-4 mr-2" />
                        Loyalty Program
                      </Button>
                      <a href="https://www.doordash.com/store/coffee-pro-corpo-astoria-30999939/43312348/?srsltid=AfmBOooPARJ1ZQBO14sBiUJJaSPCVTZA9LVIo_mETjO6yppzHrZHcviN" target="_blank" rel="noopener noreferrer">
                        <Button
                          className="w-full bg-coffee-blue hover:bg-coffee-blue/90 text-white py-3"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Order Delivery
                        </Button>
                      </a>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      <LoyaltyDashboard 
        isOpen={isLoyaltyOpen} 
        onClose={() => setIsLoyaltyOpen(false)} 
      />
    </>
  );
}
