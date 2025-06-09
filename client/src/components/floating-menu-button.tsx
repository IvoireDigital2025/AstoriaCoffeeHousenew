import { useState, useEffect } from "react";
import { Menu, X, Coffee, Star, Heart, Sparkles, Crown, Compass } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const culturalIcons = [
  { icon: Coffee, label: "Arabic Coffee", rotation: 0, color: "from-amber-600 to-yellow-700" },
  { icon: Star, label: "Moroccan Heritage", rotation: 72, color: "from-red-600 to-orange-600" },
  { icon: Crown, label: "Saudi Tradition", rotation: 144, color: "from-green-600 to-emerald-600" },
  { icon: Heart, label: "Hospitality", rotation: 216, color: "from-rose-600 to-pink-600" },
  { icon: Sparkles, label: "Excellence", rotation: 288, color: "from-purple-600 to-indigo-600" }
];

export default function FloatingMenuButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIconIndex, setCurrentIconIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      const interval = setInterval(() => {
        setCurrentIconIndex((prev) => (prev + 1) % culturalIcons.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const CurrentIcon = culturalIcons[currentIconIndex].icon;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-500 transform ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
      }`}
    >
      {/* Menu Items */}
      <div className={`mb-4 space-y-3 transition-all duration-300 ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"}`}>
        <Link href="/menu">
          <Button
            size="sm"
            className="bg-coffee-primary hover:bg-coffee-medium text-white shadow-lg flex items-center gap-2 px-4 py-2 rounded-full"
            onClick={() => setIsOpen(false)}
          >
            <Coffee className="w-4 h-4" />
            Menu
          </Button>
        </Link>
        
        <Link href="/loyalty">
          <Button
            size="sm"
            className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg flex items-center gap-2 px-4 py-2 rounded-full"
            onClick={() => setIsOpen(false)}
          >
            <Star className="w-4 h-4" />
            Loyalty
          </Button>
        </Link>
        
        <Link href="/locations">
          <Button
            size="sm"
            className="bg-coffee-accent hover:bg-orange-600 text-white shadow-lg flex items-center gap-2 px-4 py-2 rounded-full"
            onClick={() => setIsOpen(false)}
          >
            <Heart className="w-4 h-4" />
            Locations
          </Button>
        </Link>
        
        <Link href="/contact">
          <Button
            size="sm"
            className="bg-yellow-600 hover:bg-yellow-700 text-white shadow-lg flex items-center gap-2 px-4 py-2 rounded-full"
            onClick={() => setIsOpen(false)}
          >
            <Sparkles className="w-4 h-4" />
            Contact
          </Button>
        </Link>
      </div>

      {/* Main Floating Button */}
      <button
        onClick={toggleMenu}
        className="relative w-16 h-16 bg-gradient-to-br from-coffee-accent to-orange-600 hover:from-orange-600 hover:to-coffee-accent text-white rounded-full shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
        aria-label="Toggle menu"
      >
        {/* Cultural Pattern Background */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-coffee-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Rotating Cultural Icons */}
        <div className="relative z-10">
          {isOpen ? (
            <X className="w-6 h-6 transition-transform duration-300 rotate-180" />
          ) : (
            <div className="relative">
              <CurrentIcon 
                className="w-6 h-6 transition-all duration-500 transform"
                style={{ 
                  transform: `rotate(${culturalIcons[currentIconIndex].rotation}deg)` 
                }}
              />
              {/* Subtle pulse animation */}
              <div className="absolute inset-0 w-6 h-6 rounded-full bg-white/20 animate-ping" />
            </div>
          )}
        </div>

        {/* Decorative elements inspired by Middle Eastern patterns */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-coffee-gold rounded-full opacity-70 animate-pulse" />
        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-yellow-400 rounded-full opacity-60 animate-pulse delay-75" />
      </button>

      {/* Cultural inspiration tooltip */}
      {!isOpen && (
        <div className="absolute -top-12 right-0 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          {culturalIcons[currentIconIndex].label}
        </div>
      )}
    </div>
  );
}