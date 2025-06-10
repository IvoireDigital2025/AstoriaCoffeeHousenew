import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import coffeeArtImage from "@assets/maxresdefault_1749569245558.jpg";

export default function About() {
  const stats = [
    { number: "5", label: "Months Established" },
    { number: "1", label: "Astoria Location" },
    { number: "Growing", label: "Happy Customers" },
  ];

  const images = [
    {
      src: coffeeArtImage,
      alt: "Professional latte art creation at Coffee Pro",
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
            An oasis of warmth and flavor in the vibrant heart of Astoria Boulevard
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
                Coffee Pro, an oasis of warmth and flavor in the vibrant heart of Astoria Boulevard in Long Island City, welcomes you with a unique blend of coffee artistry and Saudi Arabian heritage. Established just five months ago, this cozy coffee shop captivates visitors with its enchanting decor, inspired by the ancient beauty of AlUla.
              </p>
              <p>
                Indulge in high-quality coffee, carefully crafted using the finest beans, reflecting the team's passion and unyielding commitment to excellence. From locally made pastries to authentic coffee experiences, Coffee Pro is a sanctuary where you can savor the distinctive taste of coffee and embark on a sensory journey that celebrates tradition and innovation.
              </p>
              <p>
                Our space serves as a bridge between the rich coffee heritage of Saudi Arabia and the dynamic energy of New York City, creating an atmosphere where every visit becomes a memorable experience rooted in authenticity and craftsmanship.
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
                  <span className="text-white text-2xl">🏺</span>
                </div>
                <h3 className="text-xl font-playfair font-semibold text-coffee-dark mb-3">
                  AlUla Heritage
                </h3>
                <p className="text-coffee-medium">
                  Our decor and atmosphere are inspired by the ancient beauty of AlUla, connecting our space to Saudi Arabian cultural roots.
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
                  We create a sanctuary in Astoria where locals and visitors can experience authentic Saudi Arabian hospitality.
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
                  Our passion and unyielding commitment to excellence ensures every cup reflects the finest coffee artistry and craftsmanship.
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
