import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Coffee, Bot, Star, ArrowRight, MapPin } from "lucide-react";
import { Link } from "wouter";
import arabicCoffeeImage from "@assets/arabiccoffee_1024x1024@2x_1749454274939.webp";
import heritageImage from "@assets/d03601e7-1d58-4fab-a9f8-b9053c3e2530-retina-large_1749455407188.avif";
import dubaiDessertImage from "@assets/Dubai-Pistachio-Cheese-Bomb-11 (1)_1749666253720.jpg";


export default function Home() {
  const handleScrollToMenu = () => {
    // Since this is a single-page approach, we'll navigate to menu page
    window.location.href = "/menu";
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')"
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-playfair font-bold mb-6">
            Welcome to<br />Coffee Pro
          </h1>
          <p className="text-xl md:text-2xl mb-6 text-gray-200">
            Authentic Moroccan and Saudi Arabian coffee traditions meet NYC energy - 32+ years of cultural heritage in every cup.
          </p>
          <div className="flex items-center justify-center mb-8 text-lg text-gray-300">
            <MapPin className="w-5 h-5 mr-2" />
            <span>23-33 Astoria Blvd, Astoria, NY 11102</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/menu">
              <Button 
                size="lg"
                className="bg-coffee-accent text-white hover:bg-orange-600 px-8 py-4 text-lg font-semibold"
              >
                <Coffee className="w-5 h-5 mr-2" />
                View Our Menu
              </Button>
            </Link>
            <Link href="/loyalty">
              <Button 
                size="lg"
                className="bg-coffee-accent text-white hover:bg-orange-600 px-8 py-4 text-lg font-semibold"
              >
                <Star className="w-5 h-5 mr-2" />
                Join Loyalty Program
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Heritage Showcase Section */}
      <section className="py-16 bg-coffee-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-playfair font-bold text-coffee-dark mb-6">
                Authentic Coffee Heritage
              </h2>
              <p className="text-xl text-coffee-medium mb-6">
                Experience the rich traditions of Moroccan and Saudi Arabian coffee culture, 
                brought to life in the heart of New York City. Every cup tells a story of 
                generations-old brewing techniques and warm hospitality. Complement your coffee 
                with authentic Middle Eastern treats including Dubai chocolate, halva, Turkish delight, and more.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/menu">
                  <Button className="bg-coffee-primary hover:bg-coffee-medium text-white px-8 py-3">
                    Explore Our Heritage Menu
                  </Button>
                </Link>
                <Link href="/about">
                  <Button variant="outline" className="border-coffee-primary text-coffee-primary hover:bg-coffee-primary hover:text-white px-8 py-3">
                    Learn Our Story
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img 
                src={heritageImage} 
                alt="Coffee Pro heritage and atmosphere"
                className="w-full h-auto object-contain rounded-lg shadow-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-playfair font-bold text-coffee-dark mb-4">
              Heritage Meets Innovation
            </h2>
            <p className="text-xl text-coffee-medium max-w-3xl mx-auto">
              Bringing authentic Moroccan and Saudi Arabian coffee traditions to New York City - where ancient hospitality meets modern excellence
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 bg-gradient-to-br from-coffee-accent to-orange-600 relative">
                <img 
                  src={arabicCoffeeImage} 
                  alt="Traditional Arabic coffee dallah pot with cardamom and saffron spices"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20" />
                <div className="absolute bottom-4 left-4">
                  <Coffee className="text-white w-8 h-8" />
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-playfair font-semibold text-coffee-dark mb-3">
                  Arabian Heritage Blends
                </h3>
                <p className="text-coffee-medium">
                  Traditional Arabic coffee and Moroccan spiced coffee, sourced from the highlands of Yemen and Morocco's Atlas Mountains.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 bg-gradient-to-br from-coffee-primary to-coffee-dark relative">
                <img 
                  src={dubaiDessertImage}
                  alt="Dubai Pistachio Cheese Bomb - signature dessert at Coffee Pro"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20" />
                <div className="absolute bottom-4 left-4">
                  <Bot className="text-white w-8 h-8" />
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-playfair font-semibold text-coffee-dark mb-3">
                  Gourmet Snacks & Treats
                </h3>
                <p className="text-coffee-medium">
                  Indulge in our curated selection of premium Middle Eastern treats including Dubai chocolate, kunafa delights, pistachio specialties, and artisan muffins crafted fresh daily.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 bg-gradient-to-br from-coffee-accent to-yellow-500 relative">
                <img 
                  src="https://images.unsplash.com/photo-1544427920-c49ccfb85579?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                  alt="Cultural bridge connecting communities through coffee"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20" />
                <div className="absolute bottom-4 left-4">
                  <Star className="text-white w-8 h-8" />
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-playfair font-semibold text-coffee-dark mb-3">
                  Cultural Bridge
                </h3>
                <p className="text-coffee-medium">
                  Connecting NYC's diverse communities through the universal language of coffee, celebrating both Middle Eastern heritage and American innovation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Image Gallery Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-playfair font-bold text-coffee-dark mb-4">
              Experience Coffee Pro
            </h2>
            <p className="text-xl text-coffee-medium">
              Discover the Coffee Pro difference at our NYC locations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="relative overflow-hidden rounded-lg shadow-lg group">
              <img 
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600" 
                alt="Coffee Pro interior with warm lighting and comfortable seating"
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-semibold text-lg">Welcoming Atmosphere</h3>
              </div>
            </div>
            
            <div className="relative overflow-hidden rounded-lg shadow-lg group">
              <img 
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600" 
                alt="Perfect latte art created by Coffee Pro baristas"
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-semibold text-lg">Artisan Craftsmanship</h3>
              </div>
            </div>
            
            <div className="relative overflow-hidden rounded-lg shadow-lg group">
              <img 
                src="https://images.unsplash.com/photo-1453614512568-c4024d13c247?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600" 
                alt="Fresh coffee beans ready for brewing at Coffee Pro"
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-semibold text-lg">Premium Beans</h3>
              </div>
            </div>
            
            <div className="relative overflow-hidden rounded-lg shadow-lg group">
              <img 
                src="https://images.unsplash.com/photo-1521017432531-fbd92d768814?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=600" 
                alt="Friends enjoying coffee together at Coffee Pro location"
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-semibold text-lg">Community Hub</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-coffee-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-playfair font-bold mb-6">
            Ready to Experience Premium Coffee Citywide?
          </h2>
          <p className="text-xl mb-8 text-coffee-cream">
            Visit any of our Coffee Pro locations and discover your new favorite coffee destination
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-coffee-primary px-8 py-4 text-lg font-semibold"
              >
                Find Us
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/menu">
              <Button 
                size="lg"
                className="bg-coffee-accent text-white hover:bg-orange-600 px-8 py-4 text-lg font-semibold"
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
