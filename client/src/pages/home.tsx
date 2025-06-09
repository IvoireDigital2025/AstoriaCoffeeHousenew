import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Coffee, Bot, Star, ArrowRight } from "lucide-react";
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
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://coffeeprocorp.online/wp-content/uploads/2024/05/01.png')"
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-playfair font-bold mb-6">
            Welcome to<br />Coffee Pro
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            At Coffee Pro, we pride ourselves on offering a diverse range of exceptional coffee beverages, each crafted with precision and passion. Whether you're a fan of rich, aromatic espressos or refreshing iced coffees, our menu has something to tantalize every palate.
          </p>
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
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-coffee-dark px-8 py-4 text-lg font-semibold"
              >
                <Star className="w-5 h-5 mr-2" />
                Join Loyalty Program
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
