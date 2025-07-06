import { useState } from "react";
import { Link } from "wouter";
import { Menu, X, Coffee, MapPin, Phone, Heart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FloatingMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { href: "/menu", icon: Coffee, label: "Menu", color: "bg-coffee-primary hover:bg-coffee-medium" },
    { href: "/locations", icon: MapPin, label: "Locations", color: "bg-blue-600 hover:bg-blue-700" },
    { href: "/contact", icon: Phone, label: "Contact", color: "bg-green-600 hover:bg-green-700" },
    { href: "/loyalty", icon: Heart, label: "Loyalty", color: "bg-coffee-accent hover:bg-orange-600" },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Menu Items */}
      {isOpen && (
        <div className="flex flex-col-reverse gap-3 mb-3">
          {menuItems.map((item, index) => (
            <Link key={item.href} href={item.href}>
              <Button
                className={`w-14 h-14 rounded-full shadow-lg text-white transition-all duration-300 ${item.color}`}
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: isOpen ? "slideUp 0.3s ease-out forwards" : "none"
                }}
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="w-6 h-6" />
                <span className="sr-only">{item.label}</span>
              </Button>
            </Link>
          ))}
        </div>
      )}

      {/* Main Menu Button */}
      <div className="flex flex-col gap-3">

        {/* Main Toggle Button */}
        <Button
          className="w-16 h-16 rounded-full bg-coffee-primary hover:bg-coffee-medium text-white shadow-xl transition-all duration-300 transform hover:scale-110"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <X className="w-8 h-8 transition-transform duration-300" />
          ) : (
            <Menu className="w-8 h-8 transition-transform duration-300" />
          )}
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}