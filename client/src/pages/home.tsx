import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Coffee, Bot, Star, ArrowRight, MapPin, Heart, Sparkles } from "lucide-react";
import { Link } from "wouter";
import arabicCoffeeImage from "@assets/arabiccoffee_1024x1024@2x_1749454274939.webp";
import additionalImage from "@assets/338b525f-7666-44a3-beae-b78b71fa427d_1749454633453.avif";

export default function Home() {
  const handleScrollToMenu = () => {
    // Since this is a single-page approach, we'll navigate to menu page
    window.location.href = "/menu";
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')"
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-coffee-dark/50 to-amber-900/40" />
        
        {/* Decorative Cultural Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-32 h-32 border-2 border-coffee-gold rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-32 w-24 h-24 border border-coffee-gold transform rotate-45 animate-spin" style={{ animationDuration: '20s' }}></div>
          <div className="absolute bottom-32 left-32 w-16 h-16 bg-coffee-gold rounded-full opacity-40 animate-bounce"></div>
          <div className="absolute bottom-20 right-20 w-20 h-20 border-2 border-coffee-gold rounded-full"></div>
        </div>
        
        <div className="relative z-10 text-center text-white max-w-5xl mx-auto px-4">
          {/* Heritage Badge */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-coffee-accent/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6 border border-coffee-gold/40">
              <Star className="w-5 h-5 text-coffee-gold animate-pulse" />
              <span className="text-coffee-gold font-semibold tracking-wide">32+ Years of Authentic Heritage</span>
            </div>
          </div>
          
          {/* Main Title */}
          <h1 className="text-6xl md:text-8xl font-playfair font-bold mb-8 leading-tight">
            Welcome to<br />
            <span className="bg-gradient-to-r from-coffee-gold via-yellow-400 to-amber-300 bg-clip-text text-transparent">
              Coffee Pro
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl mb-10 text-gray-100 max-w-4xl mx-auto leading-relaxed">
            Where the sacred coffee rituals of <span className="text-coffee-gold font-bold">Morocco</span> and 
            <span className="text-coffee-gold font-bold"> Saudi Arabia</span> meet the vibrant energy of New York City
          </p>
          
          {/* Location Badge */}
          <div className="flex items-center justify-center mb-12">
            <div className="bg-white/15 backdrop-blur-md rounded-full px-8 py-4 border border-white/30 shadow-xl">
              <MapPin className="w-5 h-5 mr-3 inline text-coffee-gold" />
              <span className="text-white font-medium text-lg">23-33 Astoria Blvd, Astoria, NY 11102</span>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 items-center justify-center">
            <Link href="/menu">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-coffee-accent to-orange-600 hover:from-orange-600 hover:to-red-600 text-white font-bold px-12 py-6 text-xl rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-coffee-gold/50"
              >
                <Coffee className="w-6 h-6 mr-3" />
                Explore Heritage Menu
              </Button>
            </Link>
            <Link href="/loyalty">
              <Button 
                size="lg"
                className="bg-transparent border-3 border-coffee-gold text-coffee-gold hover:bg-coffee-gold hover:text-coffee-dark font-bold px-12 py-6 text-xl rounded-full transition-all duration-300 backdrop-blur-sm shadow-xl"
              >
                <Star className="w-6 h-6 mr-3" />
                Join Loyalty Program
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-coffee-gold rounded-full flex justify-center">
            <div className="w-1 h-3 bg-coffee-gold rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Heritage Showcase Section */}
      <section className="py-20 bg-gradient-to-br from-coffee-cream to-amber-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-coffee-gold rounded-full -translate-x-48 -translate-y-48"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-coffee-accent rounded-full translate-x-40 translate-y-40"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              {/* Section Badge */}
              <div className="inline-flex items-center gap-2 bg-coffee-accent/10 rounded-full px-4 py-2 border border-coffee-accent/20">
                <Heart className="w-4 h-4 text-coffee-accent" />
                <span className="text-coffee-accent font-semibold text-sm uppercase tracking-wide">Cultural Heritage</span>
              </div>
              
              <h2 className="text-5xl font-playfair font-bold text-coffee-dark leading-tight">
                Authentic Coffee<br />
                <span className="text-coffee-accent">Heritage</span>
              </h2>
              
              <div className="space-y-4 text-lg text-coffee-medium leading-relaxed">
                <p>
                  Experience the rich traditions of <span className="font-bold text-coffee-dark">Moroccan</span> and 
                  <span className="font-bold text-coffee-dark"> Saudi Arabian</span> coffee culture, brought to life in the heart of New York City.
                </p>
                <p>
                  Every cup tells a story of generations-old brewing techniques and warm hospitality. 
                  Complement your coffee with authentic Middle Eastern treats including 
                  <span className="font-semibold text-coffee-accent"> Dubai chocolate</span>, 
                  <span className="font-semibold text-coffee-accent"> halva</span>, 
                  <span className="font-semibold text-coffee-accent"> Turkish delight</span>, and more.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/menu">
                  <Button size="lg" className="bg-coffee-primary hover:bg-coffee-medium text-white px-10 py-4 font-semibold rounded-full shadow-lg transform hover:scale-105 transition-all">
                    <Coffee className="w-5 h-5 mr-2" />
                    Explore Heritage Menu
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline" className="border-2 border-coffee-primary text-coffee-primary hover:bg-coffee-primary hover:text-white px-10 py-4 font-semibold rounded-full transition-all">
                    <Star className="w-5 h-5 mr-2" />
                    Learn Our Story
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-coffee-accent to-orange-500 rounded-2xl blur-xl opacity-20"></div>
              <div className="relative bg-white rounded-2xl p-6 shadow-2xl">
                <img 
                  src={additionalImage} 
                  alt="Coffee Pro heritage and atmosphere"
                  className="w-full h-auto object-contain rounded-xl"
                />
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute -top-6 -right-6 w-12 h-12 bg-coffee-gold rounded-full opacity-80 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-coffee-accent rounded-full opacity-60"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <svg className="absolute top-10 left-10 w-32 h-32 text-coffee-accent" fill="currentColor" viewBox="0 0 100 100">
            <polygon points="50,5 61,35 91,35 70,57 80,91 50,70 20,91 30,57 9,35 39,35" />
          </svg>
          <svg className="absolute bottom-20 right-20 w-24 h-24 text-coffee-gold" fill="currentColor" viewBox="0 0 100 100">
            <polygon points="50,5 61,35 91,35 70,57 80,91 50,70 20,91 30,57 9,35 39,35" />
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-coffee-gold/10 rounded-full px-6 py-2 mb-6 border border-coffee-gold/20">
              <Sparkles className="w-4 h-4 text-coffee-gold" />
              <span className="text-coffee-gold font-semibold text-sm uppercase tracking-wide">Why Choose Coffee Pro</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-playfair font-bold text-coffee-dark mb-6 leading-tight">
              Heritage Meets<br />
              <span className="text-coffee-accent">Innovation</span>
            </h2>
            
            <p className="text-xl text-coffee-medium max-w-4xl mx-auto leading-relaxed">
              Bringing authentic Moroccan and Saudi Arabian coffee traditions to New York City - 
              where ancient hospitality meets modern excellence
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
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
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                  alt="Traditional Moroccan tea ceremony with hospitality"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20" />
                <div className="absolute bottom-4 left-4">
                  <Bot className="text-white w-8 h-8" />
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-playfair font-semibold text-coffee-dark mb-3">
                  Traditional Hospitality
                </h3>
                <p className="text-coffee-medium">
                  Honoring the generous hospitality traditions of Morocco and Saudi Arabia, where coffee is a sacred ritual of welcome and community.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="h-48 bg-gradient-to-br from-coffee-accent to-yellow-500 relative">
                <img 
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                  alt="Diverse NYC community enjoying coffee together"
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
