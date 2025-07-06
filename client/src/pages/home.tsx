import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Coffee, Bot, Star, ArrowRight, MapPin } from "lucide-react";
import { Link } from "wouter";
import NewsletterSignup from "@/components/newsletter-signup";
import arabicCoffeeImage from "@assets/arabiccoffee_1024x1024@2x_1749454274939.webp";
import heritageImage from "@assets/ChatGPT Image Jul 6, 2025, 04_37_42 PM_1751838026092.png";
import dubaiDessertImage from "@assets/Dubai-Pistachio-Cheese-Bomb-11 (1)_1749666253720.jpg";
import alulaHeritagePhoto from "@assets/alula_heritage_photo.png";



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
          <div className="mb-6">
            <img 
              src="/attached_assets/01_1749671523922.webp"
              alt="Coffee Pro - Coffee & Bakery Logo"
              className="h-24 md:h-32 w-auto mx-auto mb-4"
            />
            <h1 className="text-3xl md:text-5xl font-playfair font-bold">
              Welcome to Coffee Pro
            </h1>
          </div>
          <p className="text-xl md:text-2xl mb-6 text-gray-200">
            Authentic Egyptian coffee traditions meet NYC energy - bringing you the finest coffee culture from the heart of Egypt.
          </p>
          <div className="flex items-center justify-center mb-8 text-lg text-gray-300">
            <MapPin className="w-5 h-5 mr-2" />
            <span>23-33 Astoria Blvd, Astoria, NY 11102</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/menu">
              <Button 
                size="lg"
                className="bg-coffee-secondary text-white hover:bg-blue-600 px-8 py-4 text-lg font-semibold"
              >
                <Coffee className="w-5 h-5 mr-2" />
                View Our Menu
              </Button>
            </Link>
            <Link href="/loyalty">
              <Button 
                size="lg"
                className="bg-coffee-secondary text-white hover:bg-blue-600 px-8 py-4 text-lg font-semibold"
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
                Experience the rich traditions of Egyptian coffee culture, 
                brought to life in the heart of New York City. Every cup tells a story of 
                authentic brewing techniques and warm hospitality. Complement your coffee 
                with authentic Middle Eastern treats including Dubai chocolate, Kunafa, and more.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/menu">
                  <Button className="bg-coffee-secondary hover:bg-blue-600 text-white px-8 py-3">
                    Explore Our Heritage Menu
                  </Button>
                </Link>

                <Link href="/about">
                  <Button variant="outline" className="border-coffee-secondary text-coffee-secondary hover:bg-coffee-secondary hover:text-white px-8 py-3">
                    Learn Our Story
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative flex justify-center">
              <div className="w-full max-w-md aspect-square overflow-hidden rounded-lg shadow-xl">
                <img 
                  src={heritageImage} 
                  alt="Elegant golden coffee cup with luxurious design showcasing Coffee Pro's premium coffee heritage"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent rounded-lg pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* New Drinks Spotlight Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-playfair font-bold text-coffee-dark mb-4">
              New Signature Drinks
            </h2>
            <p className="text-xl text-coffee-medium max-w-3xl mx-auto">
              Discover our latest creations - innovative drinks that blend traditional coffee craftsmanship with exciting new flavors
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Tiramisu Pro Frappe */}
            <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="relative">
                <img 
                  src="/attached_assets/IMG_3206_1751827043234.jpg"
                  alt="Tiramisu Pro Frappe - a luxurious coffee frappe with mascarpone flavors and chocolate garnish"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">NEW</span>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-playfair font-bold text-coffee-dark mb-3">
                  Tiramisu Pro Frappe
                </h3>
                <p className="text-coffee-medium mb-4">
                  A luxurious coffee frappe inspired by the classic Italian dessert, blending rich espresso with creamy mascarpone flavors
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-primary font-medium">Cold Specialty Drink</span>
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                </div>
              </CardContent>
            </Card>

            {/* Strawfee Clouds */}
            <Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="relative">
                <img 
                  src="/attached_assets/IMG_3227_1751760271057.jpg"
                  alt="Strawfee Clouds - a dreamy strawberry and coffee fusion drink with cloud-like whipped cream and strawberry drizzle"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-secondary text-white px-3 py-1 rounded-full text-sm font-semibold">NEW</span>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-playfair font-bold text-coffee-dark mb-3">
                  Strawfee Clouds
                </h3>
                <p className="text-coffee-medium mb-4">
                  A dreamy strawberry and coffee fusion drink with a cloud-like texture, perfectly balancing fruity sweetness with bold coffee notes
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-secondary font-medium">Signature Creation</span>
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/menu">
              <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg">
                Visit Coffee Pro to Try These New Drinks
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
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
              Bringing authentic Egyptian coffee traditions to New York City - where traditional hospitality meets modern excellence
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
                  Egyptian Coffee Heritage
                </h3>
                <p className="text-coffee-medium">
                  Traditional Egyptian coffee and authentic Middle Eastern blends, bringing the finest coffee culture from Egypt to NYC.
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
                  src={alulaHeritagePhoto}
                  alt="AlUla heritage celebration with community at Coffee Pro"
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
            Discover Coffee Pro Locations
          </h2>
          <p className="text-xl mb-8 text-coffee-cream">
            Explore our menu and visit our Coffee Pro location in Astoria Boulevard, Long Island City
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-coffee-secondary text-coffee-secondary hover:bg-coffee-secondary hover:text-white px-8 py-4 text-lg font-semibold"
              >
                Find Us
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/menu">
              <Button 
                size="lg"
                className="bg-coffee-secondary text-white hover:bg-blue-600 px-8 py-4 text-lg font-semibold"
              >
                View Menu
                <Coffee className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>



      {/* Newsletter Signup Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-coffee-primary/5 to-amber-100/30">
        <div className="max-w-4xl mx-auto">
          <NewsletterSignup />
        </div>
      </section>
    </div>
  );
}
