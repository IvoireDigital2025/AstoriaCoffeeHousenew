import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, Star } from "lucide-react";
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
    { path: "/locations", label: "Locations" },
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
                <Button
                  onClick={() => setIsLoyaltyOpen(true)}
                  className="bg-coffee-primary text-white hover:bg-coffee-medium"
                  size="sm"
                >
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </div>
            </div>
            
            {/* Mobile Navigation */}
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="w-6 h-6 text-coffee-dark" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="flex flex-col space-y-4 mt-8">
                    {navItems.map((item) => (
                      <Link
                        key={item.path}
                        href={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`block px-3 py-2 text-base font-medium transition-colors ${
                          isActive(item.path)
                            ? "text-coffee-primary"
                            : "text-coffee-dark hover:text-coffee-primary"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                    <Button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsLoyaltyOpen(true);
                      }}
                      className="bg-coffee-primary text-white hover:bg-coffee-medium mt-4"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Login
                    </Button>
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
