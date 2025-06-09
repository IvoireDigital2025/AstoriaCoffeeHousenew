import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function About() {
  const stats = [
    { number: "32+", label: "Years Experience" },
    { number: "12+", label: "NYC Locations" },
    { number: "50K+", label: "Happy Customers" },
  ];

  const images = [
    {
      src: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      alt: "Friendly barista preparing coffee",
      className: ""
    },
    {
      src: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      alt: "Astoria neighborhood street view",
      className: "mt-8"
    },
    {
      src: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      alt: "Coffee beans and vintage grinder",
      className: "-mt-8"
    },
    {
      src: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
      alt: "Cozy coffee shop interior",
      className: ""
    }
  ];

  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-playfair font-bold text-coffee-dark mb-4">
            About Coffee Pro
          </h1>
          <p className="text-xl text-coffee-medium max-w-3xl mx-auto">
            New York's premier coffee corporation with locations across the city
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-playfair font-bold text-coffee-dark mb-6">
              Our Story
            </h2>
            <div className="space-y-6 text-lg text-coffee-medium">
              <p>
                We have more than 32 years of experience in the coffee industry. Our journey began with a passion for creating the perfect cup of coffee, and today we continue to serve exceptional beverages crafted with precision and dedication to quality.
              </p>
              <p>
                At Coffee Pro, we pride ourselves on offering a diverse range of exceptional coffee beverages, each crafted with precision and passion. Whether you're a fan of rich, aromatic espressos or refreshing iced coffees, our menu has something to tantalize every palate.
              </p>
              <p>
                Our commitment to excellence extends beyond just great coffee. We believe in building lasting relationships with our customers and creating spaces where communities can gather, connect, and enjoy the finest coffee experience.
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-8 mt-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-playfair font-bold text-coffee-accent">
                    {stat.number}
                  </div>
                  <div className="text-coffee-medium text-sm">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-2 gap-4">
            {images.map((image, index) => (
              <img
                key={index}
                src={image.src}
                alt={image.alt}
                className={`rounded-xl shadow-lg w-full h-auto object-cover ${image.className}`}
              />
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-coffee-cream rounded-xl p-12 mb-20">
          <h2 className="text-3xl font-playfair font-bold text-coffee-dark text-center mb-12">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-none shadow-none bg-transparent">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-coffee-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">🌱</span>
                </div>
                <h3 className="text-xl font-playfair font-semibold text-coffee-dark mb-3">
                  Sustainability
                </h3>
                <p className="text-coffee-medium">
                  We partner with farms that prioritize environmental responsibility and fair trade practices.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-none shadow-none bg-transparent">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-coffee-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">👥</span>
                </div>
                <h3 className="text-xl font-playfair font-semibold text-coffee-dark mb-3">
                  Community
                </h3>
                <p className="text-coffee-medium">
                  We're committed to being a positive force in every community we serve across New York City.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-none shadow-none bg-transparent">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-coffee-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">⭐</span>
                </div>
                <h3 className="text-xl font-playfair font-semibold text-coffee-dark mb-3">
                  Excellence
                </h3>
                <p className="text-coffee-medium">
                  From bean selection to brewing technique, we maintain the highest standards in everything we do.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center">
          <h2 className="text-3xl font-playfair font-bold text-coffee-dark mb-8">
            Meet Our Team
          </h2>
          <p className="text-lg text-coffee-medium mb-12 max-w-3xl mx-auto">
            Our passionate team of coffee enthusiasts is dedicated to providing you with an exceptional experience every time you visit.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Sarah Chen", role: "Head Barista", image: "https://images.unsplash.com/photo-1494790108755-2616b612b1e5?w=300&h=300&fit=crop&crop=face" },
              { name: "Marcus Rodriguez", role: "Coffee Roaster", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face" },
              { name: "Emily Thompson", role: "Store Manager", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face" }
            ].map((member, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-0">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-playfair font-semibold text-coffee-dark mb-2">
                      {member.name}
                    </h3>
                    <Badge variant="secondary" className="bg-coffee-secondary text-coffee-dark">
                      {member.role}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
