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
        <div className="max-w-7xl mx-auto mobile-optimized">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0">
                <h1 className="text-xl sm:text-2xl font-playfair font-bold text-coffee-primary mobile-text">
                  Coffee Pro
                </h1>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:block">
              <div className="ml-10 flex items-baseline space-x-6 xl:space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`px-3 py-2 text-sm font-medium transition-colors mobile-touch ${
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
                  className="bg-coffee-primary text-white hover:bg-coffee-medium mobile-touch"
                  size="sm"
                >
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </div>
            </div>
            
            {/* Tablet/Mobile Quick Actions */}
            <div className="hidden md:flex lg:hidden items-center space-x-3">
              <Button
                onClick={() => setIsLoyaltyOpen(true)}
                className="bg-coffee-primary text-white hover:bg-coffee-medium mobile-touch"
                size="sm"
              >
                <Star className="w-4 h-4" />
              </Button>
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="mobile-touch">
                    <Menu className="w-5 h-5 text-coffee-dark" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 mobile-optimized">
                  <div className="flex flex-col space-y-3 mt-6">
                    {navItems.map((item) => (
                      <Link
                        key={item.path}
                        href={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`block px-4 py-3 text-base font-medium transition-colors mobile-touch mobile-text rounded-lg ${
                          isActive(item.path)
                            ? "text-coffee-primary bg-coffee-cream"
                            : "text-coffee-dark hover:text-coffee-primary hover:bg-coffee-cream"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            
            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center space-x-2">
              <Button
                onClick={() => setIsLoyaltyOpen(true)}
                className="bg-coffee-primary text-white hover:bg-coffee-medium mobile-touch"
                size="sm"
              >
                <Star className="w-4 h-4" />
              </Button>
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="mobile-touch">
                    <Menu className="w-5 h-5 text-coffee-dark" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72 mobile-optimized">
                  <div className="flex flex-col space-y-2 mt-6">
                    {navItems.map((item) => (
                      <Link
                        key={item.path}
                        href={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`block px-4 py-3 text-base font-medium transition-colors mobile-touch mobile-text rounded-lg ${
                          isActive(item.path)
                            ? "text-coffee-primary bg-coffee-cream"
                            : "text-coffee-dark hover:text-coffee-primary hover:bg-coffee-cream"
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
                      className="bg-coffee-primary text-white hover:bg-coffee-medium mt-4 mobile-touch w-full"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Login / Join Loyalty
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
