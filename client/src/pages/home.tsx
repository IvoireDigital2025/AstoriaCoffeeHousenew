import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Coffee, Bot, Star, ArrowRight, MapPin } from "lucide-react";
import { Link } from "wouter";

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
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-[10s] ease-out"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&h=1380')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50" />
        <div className="absolute inset-0 bg-coffee-dark/20" />
        
        <div className="relative z-10 text-center text-white max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <div className="inline-block bg-gradient-to-r from-coffee-accent/20 to-orange-500/20 backdrop-blur-md border border-coffee-accent/40 rounded-full px-8 py-3 mb-6">
              <span className="text-coffee-accent font-semibold text-lg tracking-wider uppercase">Est. 1992 • 32+ Years of Excellence</span>
            </div>
          </div>
          
          <h1 className="text-7xl md:text-9xl font-playfair font-bold mb-10 leading-tight tracking-tight">
            Coffee <span className="text-transparent bg-gradient-to-r from-coffee-accent to-orange-500 bg-clip-text">Pro</span>
          </h1>
          
          <p className="text-2xl md:text-3xl mb-8 text-gray-200 font-light leading-relaxed max-w-4xl mx-auto">
            Crafting exceptional coffee experiences with precision and passion for over three decades
          </p>
          
          <div className="flex items-center justify-center mb-10 text-xl text-gray-300 bg-black/30 backdrop-blur-sm rounded-full px-6 py-3 inline-flex">
            <MapPin className="w-6 h-6 mr-3 text-coffee-accent" />
            <span className="font-medium">23-33 Astoria Blvd, Astoria, NY 11102</span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/menu">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-coffee-accent to-orange-500 text-white hover:from-orange-600 hover:to-orange-700 px-12 py-6 text-xl font-semibold rounded-full shadow-2xl border-2 border-transparent hover:border-white/20 transition-all duration-300 backdrop-blur-sm"
              >
                <Coffee className="w-6 h-6 mr-3" />
                Discover Our Menu
              </Button>
            </Link>
            <Link href="/loyalty">
              <Button 
                variant="outline"
                size="lg"
                className="border-2 border-white/80 text-white hover:bg-white hover:text-coffee-dark px-12 py-6 text-xl font-semibold rounded-full backdrop-blur-md transition-all duration-300 hover:shadow-2xl"
              >
                <Star className="w-6 h-6 mr-3" />
                Join Elite Rewards
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
              Why Choose Coffee Pro?
            </h2>
            <p className="text-xl text-coffee-medium">
              Discover what makes us New York's premier coffee corporation
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8 bg-coffee-cream hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-coffee-accent rounded-full flex items-center justify-center mx-auto mb-6">
                  <Coffee className="text-white w-8 h-8" />
                </div>
                <h3 className="text-2xl font-playfair font-semibold text-coffee-dark mb-4">
                  Premium Beans
                </h3>
                <p className="text-coffee-medium">
                  Sourced directly from sustainable farms, roasted in small batches for exceptional flavor
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 bg-coffee-cream hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-coffee-accent rounded-full flex items-center justify-center mx-auto mb-6">
                  <Bot className="text-white w-8 h-8" />
                </div>
                <h3 className="text-2xl font-playfair font-semibold text-coffee-dark mb-4">
                  AI-Powered Service
                </h3>
                <p className="text-coffee-medium">
                  Get instant answers to your questions with our intelligent chatbot assistant
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 bg-coffee-cream hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-coffee-accent rounded-full flex items-center justify-center mx-auto mb-6">
                  <Star className="text-white w-8 h-8" />
                </div>
                <h3 className="text-2xl font-playfair font-semibold text-coffee-dark mb-4">
                  Loyalty Rewards
                </h3>
                <p className="text-coffee-medium">
                  Earn points with every purchase and unlock exclusive perks and discounts
                </p>
              </CardContent>
            </Card>
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
