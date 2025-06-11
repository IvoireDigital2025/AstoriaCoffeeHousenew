import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coffee, Leaf, UtensilsCrossed, Plus, Check, Eye, ShoppingCart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import type { MenuItem } from "@shared/schema";
import pdfMenuPath from "@assets/coffee-pro-Menu_1749665658431.pdf";

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState<string>("pastry");
  const [addedItems, setAddedItems] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  const { data: menuItems, isLoading } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu", activeCategory],
    queryFn: async () => {
      const response = await fetch(`/api/menu?category=${activeCategory}`);
      if (!response.ok) {
        throw new Error("Failed to fetch menu items");
      }
      return response.json();
    },
  });

  const categories = [
    { id: "coffee", label: "Coffee", icon: Coffee },
    { id: "tea", label: "Tea & Other", icon: Leaf },
    { id: "pastry", label: "Pastries", icon: UtensilsCrossed },
    { id: "food", label: "Food", icon: UtensilsCrossed },
  ];

  const handleAddToCart = (itemId: number, itemName: string) => {
    setAddedItems(prev => {
      const newSet = new Set(prev);
      newSet.add(itemId);
      return newSet;
    });
    toast({
      title: "Added to order!",
      description: `${itemName} has been added to your order.`,
    });

    // Reset the button after 2 seconds
    setTimeout(() => {
      setAddedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-900 to-slate-900 relative overflow-hidden">
      {/* Futuristic Background Elements */}
      <div className="absolute inset-0 opacity-30"></div>
      <div className="absolute top-10 left-10 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Futuristic Header */}
        <div className="text-center mb-20">
          <div className="relative">
            <h1 className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent mb-6 tracking-tight">
              Coffee Pro Menu
            </h1>
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"></div>
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
          </div>
          
          <p className="text-2xl text-amber-100 mb-8 font-light tracking-wide text-center">
            Experience Coffee Pro&apos;s Authentic Middle Eastern Flavors
          </p>
          
          {/* Floating Action Buttons */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <Button 
              asChild
              className="group relative overflow-hidden bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-8 py-4 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 border border-amber-400/30"
            >
              <a 
                href={pdfMenuPath} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center font-semibold"
              >
                <Eye className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                View Full Menu
              </a>
            </Button>
            

          </div>
        </div>

        {/* Futuristic Category Filters */}
        <div className="flex flex-wrap justify-center mb-16 gap-4">
          {categories.map((category) => {
            const IconComponent = category.icon;
            const isActive = activeCategory === category.id;
            
            return (
              <Button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                variant={isActive ? "default" : "outline"}
                className={`group relative overflow-hidden px-8 py-4 font-bold text-lg rounded-full transition-all duration-300 transform hover:scale-105 ${
                  isActive
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-2xl border-2 border-amber-400"
                    : "bg-slate-800/50 text-amber-100 border-2 border-amber-500/50 hover:bg-gradient-to-r hover:from-amber-600 hover:to-orange-600 hover:text-white hover:border-amber-400"
                }`}
              >
                <IconComponent className="w-6 h-6 mr-3" />
                {category.label}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                )}
              </Button>
            );
          })}
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="overflow-hidden bg-slate-800/50 border border-amber-500/30">
                <Skeleton className="w-full h-48 bg-slate-700" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2 bg-slate-600" />
                  <Skeleton className="h-4 w-1/4 mb-4 bg-slate-600" />
                  <Skeleton className="h-4 w-full mb-2 bg-slate-600" />
                  <Skeleton className="h-4 w-3/4 mb-4 bg-slate-600" />
                  <Skeleton className="h-10 w-full bg-slate-600" />
                </CardContent>
              </Card>
            ))
          ) : (
            menuItems?.map((item) => {
              const isAdded = addedItems.has(item.id);
              
              return (
                <Card key={item.id} className="group bg-slate-800/70 backdrop-blur-sm border-2 border-amber-500/30 overflow-hidden hover:border-amber-400/50 hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-500 transform hover:scale-105">
                  <div className="relative">
                    <img
                      src={item.image || "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a"}
                      alt={item.name}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {item.available && (
                      <Badge className="absolute top-3 right-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold px-3 py-1 rounded-full shadow-lg">
                        Available
                      </Badge>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent group-hover:from-slate-900/40 transition-all duration-500"></div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-bold text-amber-100 group-hover:text-white transition-colors duration-300">
                        {item.name}
                      </h3>
                      <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                        ${item.price}
                      </span>
                    </div>
                    <p className="text-amber-200/80 mb-6 leading-relaxed">
                      {item.description}
                    </p>
                    <Button
                      onClick={() => handleAddToCart(item.id, item.name)}
                      disabled={!item.available || isAdded}
                      className={`w-full font-bold text-lg py-3 rounded-full transition-all duration-300 transform hover:scale-105 ${
                        isAdded
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-2xl"
                          : "bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-2xl hover:shadow-orange-500/30"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-5 h-5 mr-2" />
                          Added to Cart!
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5 mr-2" />
                          Add to Cart
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {menuItems && menuItems.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-amber-500/30 rounded-2xl p-12">
              <Coffee className="w-16 h-16 text-amber-400 mx-auto mb-6" />
              <p className="text-2xl text-amber-100 font-semibold">
                No items available in this category at the moment.
              </p>
              <p className="text-amber-200/60 mt-4">
                Check back soon for new authentic treats!
              </p>
            </div>
          </div>
        )}


      </div>
    </div>
  );
}