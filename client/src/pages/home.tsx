import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Coffee, Bot, Star, ArrowRight, MapPin } from "lucide-react";
import { Link } from "wouter";
import arabicCoffeeImage from "@assets/arabiccoffee_1024x1024@2x_1749454274939.webp";
import coffeeLatteArtImage from "@assets/maxresdefault_1749570208990.jpg";
import dessertImage from "@assets/21c491c8-1452-4705-93f3-d1340aab72de-retina-large_1749586388276.avif";

export default function Home() {
  const handleScrollToMenu = () => {
    // Since this is a single-page approach, we'll navigate to menu page
    window.location.href = "/menu";
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')"
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 py-20 mobile-optimized">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-playfair font-bold mb-6 mobile-text">
            Welcome to<br />Coffee Pro
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 text-gray-200 mobile-text max-w-3xl mx-auto">
            Authentic Moroccan and Saudi Arabian coffee traditions meet NYC energy - 32+ years of cultural heritage in every cup.
          </p>
          <div className="flex items-center justify-center mb-8 text-base sm:text-lg text-gray-300 mobile-text">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
            <span className="text-center">23-33 Astoria Blvd, Astoria, NY 11102</span>
          </div>
          <div className="flex flex-col gap-4 justify-center max-w-md mx-auto sm:max-w-none sm:flex-row">
            <Link href="/menu" className="w-full sm:w-auto">
              <Button 
                size="lg"
                className="w-full sm:w-auto bg-coffee-accent text-white hover:bg-orange-600 px-8 py-4 text-lg font-semibold mobile-touch"
              >
                <Coffee className="w-5 h-5 mr-2" />
                View Our Menu
              </Button>
            </Link>
            <Link href="/loyalty" className="w-full sm:w-auto">
              <Button 
                size="lg"
                className="w-full sm:w-auto bg-coffee-accent text-white hover:bg-orange-600 px-8 py-4 text-lg font-semibold mobile-touch"
              >
                <Star className="w-5 h-5 mr-2" />
                Join Loyalty Program
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Heritage Showcase Section */}
      <section className="py-12 sm:py-16 bg-coffee-cream">
        <div className="max-w-7xl mx-auto mobile-optimized">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl sm:text-4xl font-playfair font-bold text-coffee-dark mb-4 sm:mb-6 mobile-text">
                Authentic Coffee Heritage
              </h2>
              <p className="text-lg sm:text-xl text-coffee-medium mb-4 sm:mb-6 mobile-text">
                Experience the rich traditions of Moroccan and Saudi Arabian coffee culture, 
                brought to life in the heart of New York City. Every cup tells a story of 
                generations-old brewing techniques and warm hospitality. Complement your coffee 
                with authentic Middle Eastern treats including Dubai chocolate, halva, Turkish delight, and more.
              </p>
              <div className="flex flex-col gap-3 sm:gap-4">
                <Link href="/menu" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-coffee-primary hover:bg-coffee-medium text-white px-8 py-3 mobile-touch">
                    Explore Our Heritage Menu
                  </Button>
                </Link>
                <Link href="/about" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto border-coffee-primary text-coffee-primary hover:bg-coffee-primary hover:text-white px-8 py-3 mobile-touch">
                    Learn Our Story
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative order-1 lg:order-2">
              <img 
                src={coffeeLatteArtImage} 
                alt="Artisanal coffee with perfect latte art"
                className="w-full h-auto object-contain rounded-lg shadow-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto mobile-optimized">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-playfair font-bold text-coffee-dark mb-4 mobile-text">
              Heritage Meets Innovation
            </h2>
            <p className="text-lg sm:text-xl text-coffee-medium max-w-3xl mx-auto mobile-text">
              Bringing authentic Moroccan and Saudi Arabian coffee traditions to New York City - where ancient hospitality meets modern excellence
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 mobile-touch">
              <div className="h-40 sm:h-48 bg-gradient-to-br from-coffee-accent to-orange-600 relative">
                <img 
                  src={arabicCoffeeImage} 
                  alt="Traditional Arabic coffee dallah pot with cardamom and saffron spices"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20" />
                <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4">
                  <Coffee className="text-white w-6 h-6 sm:w-8 sm:h-8" />
                </div>
              </div>
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-playfair font-semibold text-coffee-dark mb-2 sm:mb-3 mobile-text">
                  Arabian Heritage Blends
                </h3>
                <p className="text-coffee-medium mobile-text">
                  Traditional Arabic coffee and Moroccan spiced coffee, sourced from the highlands of Yemen and Morocco's Atlas Mountains.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 mobile-touch">
              <div className="h-40 sm:h-48 bg-gradient-to-br from-coffee-primary to-coffee-dark relative">
                <img 
                  src={dessertImage} 
                  alt="Exquisite Middle Eastern desserts including baklava, halva, and Turkish delight"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20" />
                <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4">
                  <Bot className="text-white w-6 h-6 sm:w-8 sm:h-8" />
                </div>
              </div>
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-playfair font-semibold text-coffee-dark mb-2 sm:mb-3 mobile-text">
                  Amazing Dessert Collection
                </h3>
                <p className="text-coffee-medium mobile-text">
                  Indulge in our authentic Middle Eastern desserts including Dubai chocolate, halva, Turkish delight, baklava, and our signature coffee-infused treats. Each dessert is crafted with traditional recipes and premium ingredients.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 mobile-touch sm:col-span-2 lg:col-span-1">
              <div className="h-40 sm:h-48 bg-gradient-to-br from-coffee-accent to-yellow-500 relative">
                <img 
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                  alt="Diverse NYC community enjoying coffee together"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20" />
                <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4">
                  <Star className="text-white w-6 h-6 sm:w-8 sm:h-8" />
                </div>
              </div>
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-playfair font-semibold text-coffee-dark mb-2 sm:mb-3 mobile-text">
                  Cultural Bridge
                </h3>
                <p className="text-coffee-medium mobile-text">
                  Connecting NYC's diverse communities through the universal language of coffee, celebrating both Middle Eastern heritage and American innovation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Image Gallery Section */}
      <section className="py-12 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto mobile-optimized">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-playfair font-bold text-coffee-dark mb-4 mobile-text">
              Experience Coffee Pro
            </h2>
            <p className="text-lg sm:text-xl text-coffee-medium mobile-text">
              Discover the Coffee Pro difference at our NYC locations
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="relative overflow-hidden rounded-lg shadow-lg group mobile-touch">
              <img 
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600" 
                alt="Coffee Pro interior with warm lighting and comfortable seating"
                className="w-full h-48 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity" />
              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 text-white">
                <h3 className="font-semibold text-base sm:text-lg mobile-text">Welcoming Atmosphere</h3>
              </div>
            </div>
            
            <div className="relative overflow-hidden rounded-lg shadow-lg group mobile-touch">
              <img 
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600" 
                alt="Perfect latte art created by Coffee Pro baristas"
                className="w-full h-48 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity" />
              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 text-white">
                <h3 className="font-semibold text-base sm:text-lg mobile-text">Artisan Craftsmanship</h3>
              </div>
            </div>
            
            <div className="relative overflow-hidden rounded-lg shadow-lg group mobile-touch">
              <img 
                src="https://images.unsplash.com/photo-1453614512568-c4024d13c247?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600" 
                alt="Fresh coffee beans ready for brewing at Coffee Pro"
                className="w-full h-48 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity" />
              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 text-white">
                <h3 className="font-semibold text-base sm:text-lg mobile-text">Premium Beans</h3>
              </div>
            </div>
            
            <div className="relative overflow-hidden rounded-lg shadow-lg group mobile-touch sm:col-span-2 lg:col-span-1">
              <img 
                src="https://images.unsplash.com/photo-1521017432531-fbd92d768814?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600" 
                alt="Friends enjoying coffee together at Coffee Pro location"
                className="w-full h-48 sm:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity" />
              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 text-white">
                <h3 className="font-semibold text-base sm:text-lg mobile-text">Community Hub</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-12 sm:py-20 bg-coffee-primary text-white">
        <div className="max-w-7xl mx-auto mobile-optimized text-center">
          <h2 className="text-3xl sm:text-4xl font-playfair font-bold mb-4 sm:mb-6 mobile-text">
            Ready to Experience Premium Coffee Citywide?
          </h2>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8 text-coffee-cream mobile-text">
            Visit any of our Coffee Pro locations and discover your new favorite coffee destination
          </p>
          <div className="flex flex-col gap-3 sm:gap-4 justify-center max-w-md mx-auto sm:max-w-none sm:flex-row">
            <Link href="/contact" className="w-full sm:w-auto">
              <Button 
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-coffee-primary px-8 py-4 text-lg font-semibold mobile-touch"
              >
                Find Us
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/menu" className="w-full sm:w-auto">
              <Button 
                size="lg"
                className="w-full sm:w-auto bg-coffee-accent text-white hover:bg-orange-600 px-8 py-4 text-lg font-semibold mobile-touch"
              >
                Order Now
                <Coffee className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
