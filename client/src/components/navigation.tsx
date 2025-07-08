import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Menu, ChevronDown } from "lucide-react";


export default function Navigation() {
  const [location] = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/menu", label: "Menu" },
    { path: "/about", label: "About" },
    { path: "/community", label: "Community" },
    { path: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) => location === path;

  return (
    <>
      <nav className="bg-white shadow-lg sticky top-0 z-50 border-b border-coffee-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 transform hover:scale-105 transition-transform duration-200">
                <img 
                  src="/attached_assets/01_1749671523922.webp"
                  alt="Coffee Pro - Coffee & Bakery Logo"
                  className="h-14 w-auto"
                />
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-6">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                      isActive(item.path)
                        ? "text-coffee-primary border-b-2 border-coffee-primary"
                        : "text-coffee-dark hover:text-coffee-primary"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="px-3 py-2 text-sm font-medium text-coffee-dark hover:text-coffee-primary flex items-center gap-1"
                    >
                      More
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link href="/mood-selector" className="w-full">
                        Mood Selector
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/loyalty" className="w-full">
                        Loyalty Program
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex items-center space-x-3 ml-6">
                  <Link href="/franchise">
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 py-2 text-sm"
                      size="sm"
                    >
                      Franchise Opportunity
                    </Button>
                  </Link>
                  <a href="https://www.doordash.com/store/coffee-pro-corpo-astoria-30999939/43312348/?srsltid=AfmBOooPARJ1ZQBO14sBiUJJaSPCVTZA9LVIo_mETjO6yppzHrZHcviN" target="_blank" rel="noopener noreferrer">
                    <Button
                      className="bg-orange-600 hover:bg-orange-700 text-white font-medium px-3 py-2 text-sm"
                      size="sm"
                    >
                      Order Delivery
                    </Button>
                  </a>
                </div>
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
                <SheetContent side="right" className="w-80 p-0 bg-gradient-to-b from-white to-coffee-cream/20">
                  <div className="flex flex-col h-full">
                    <div className="p-6 border-b border-coffee-cream bg-white">
                      <img 
                        src="/attached_assets/01_1749671523922.webp"
                        alt="Coffee Pro - Coffee & Bakery Logo"
                        className="h-12 w-auto"
                      />
                    </div>
                    <div className="flex-1 overflow-y-auto">
                      <div className="px-6 py-6 space-y-3">
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
                    <div className="p-6 space-y-4 border-t border-coffee-cream bg-white">
                      <Link href="/franchise">
                        <Button
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Franchise Opportunity
                        </Button>
                      </Link>
                      <a href="https://www.doordash.com/store/coffee-pro-corpo-astoria-30999939/43312348/?srsltid=AfmBOooPARJ1ZQBO14sBiUJJaSPCVTZA9LVIo_mETjO6yppzHrZHcviN" target="_blank" rel="noopener noreferrer">
                        <Button
                          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 rounded-lg transition-colors"
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


    </>
  );
}
