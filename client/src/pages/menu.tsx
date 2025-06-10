import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coffee, Leaf, UtensilsCrossed, Plus, Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import type { MenuItem } from "@shared/schema";

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState<string>("coffee");
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
    { id: "food", label: "Food", icon: UtensilsCrossed },
  ];

  const handleAddToCart = (itemId: number, itemName: string) => {
    setAddedItems(prev => new Set([...prev, itemId]));
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
    <div className="min-h-screen bg-coffee-cream py-12 sm:py-20">
      <div className="max-w-7xl mx-auto mobile-optimized">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl font-playfair font-bold text-coffee-dark mb-4 mobile-text">
            Our Menu
          </h1>
          <p className="text-lg sm:text-xl text-coffee-medium mobile-text">
            Crafted with love, served with passion
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center mb-8 sm:mb-12 gap-2 sm:gap-4">
          {categories.map((category) => {
            const IconComponent = category.icon;
            const isActive = activeCategory === category.id;
            
            return (
              <Button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                variant={isActive ? "default" : "outline"}
                className={`px-4 sm:px-6 py-2 sm:py-3 font-medium text-sm sm:text-base mobile-touch ${
                  isActive
                    ? "bg-coffee-primary text-white hover:bg-coffee-medium"
                    : "bg-white text-coffee-primary border-2 border-coffee-primary hover:bg-coffee-primary hover:text-white"
                }`}
              >
                <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                {category.label}
              </Button>
            );
          })}
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="overflow-hidden mobile-touch">
                <Skeleton className="w-full h-40 sm:h-48" />
                <CardContent className="p-4 sm:p-6">
                  <Skeleton className="h-5 sm:h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/4 mb-3 sm:mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-3 sm:mb-4" />
                  <Skeleton className="h-10 sm:h-12 w-full" />
                </CardContent>
              </Card>
            ))
          ) : (
            menuItems?.map((item) => {
              const isAdded = addedItems.has(item.id);
              
              return (
                <Card key={item.id} className="bg-white shadow-lg overflow-hidden hover:shadow-xl transition-shadow mobile-touch">
                  <div className="relative">
                    <img
                      src={item.image || "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a"}
                      alt={item.name}
                      className="w-full h-40 sm:h-48 object-cover"
                    />
                    {item.available && (
                      <Badge className="absolute top-2 right-2 bg-green-500 text-white text-xs">
                        Available
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex justify-between items-start mb-2 sm:mb-3">
                      <h3 className="text-lg sm:text-xl font-playfair font-semibold text-coffee-dark mobile-text flex-1 pr-2">
                        {item.name}
                      </h3>
                      <span className="text-coffee-accent font-bold text-lg sm:text-xl flex-shrink-0">
                        {item.price}
                      </span>
                    </div>
                    <p className="text-coffee-medium mb-3 sm:mb-4 line-clamp-3 mobile-text text-sm sm:text-base">
                      {item.description}
                    </p>
                    <Button
                      onClick={() => handleAddToCart(item.id, item.name)}
                      disabled={!item.available || isAdded}
                      className={`w-full font-medium transition-colors mobile-touch text-sm sm:text-base ${
                        isAdded
                          ? "bg-green-500 hover:bg-green-600 text-white"
                          : "bg-coffee-accent hover:bg-orange-600 text-white"
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Added!
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Add to Order
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
          <div className="text-center py-8 sm:py-12">
            <p className="text-coffee-medium text-base sm:text-lg mobile-text">
              No items available in this category at the moment.
            </p>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="text-center mt-12 sm:mt-16">
          <div className="bg-white rounded-lg p-6 sm:p-8 shadow-lg mobile-optimized">
            <h3 className="text-xl sm:text-2xl font-playfair font-semibold text-coffee-dark mb-3 sm:mb-4 mobile-text">
              Can't Find What You're Looking For?
            </h3>
            <p className="text-coffee-medium mb-4 sm:mb-6 mobile-text text-sm sm:text-base">
              Our baristas are happy to create custom drinks or recommend something special just for you.
            </p>
            <Button 
              className="bg-coffee-primary hover:bg-coffee-medium text-white px-6 sm:px-8 py-3 mobile-touch text-sm sm:text-base"
            >
              Ask Our AI Assistant
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
