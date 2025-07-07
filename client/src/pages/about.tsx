import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function About() {
  const stats = [
    { number: "12", label: "Months Established" },
    { number: "1", label: "Astoria Location" },
    { number: "Growing", label: "Happy Customers" },
  ];

  const images = [
    {
      src: "/attached_assets/unnamed (7)_1751846156927.webp",
      alt: "Coffee Pro interior showing professional coffee equipment and elegant lighting",
      className: ""
    },
    {
      src: "/attached_assets/ChatGPT Image Jul 6, 2025, 05_10_05 PM_1751845854267.png",
      alt: "Premium coffee beans used at Coffee Pro",
      className: "mt-8"
    },
    {
      src: "/attached_assets/unnamed (3)_1751845854268.webp",
      alt: "Authentic Middle Eastern pastry with pistachio filling at Coffee Pro",
      className: "-mt-8"
    },
    {
      src: "/attached_assets/unnamed_1751845854269.webp",
      alt: "Coffee Pro heritage corner with traditional Middle Eastern ambiance",
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
                Coffee Pro, an oasis of warmth and flavor in the vibrant heart of Astoria Boulevard in Long Island City, welcomes you with a unique blend of coffee artistry and Egyptian heritage. Established twelve months ago, this cozy coffee shop captivates visitors with its enchanting decor, inspired by the rich cultural traditions of Egypt.
              </p>
              <p>
                Indulge in high-quality coffee, carefully crafted using the finest beans, reflecting the team's passion and unyielding commitment to excellence. From locally made pastries to authentic coffee experiences, Coffee Pro is a sanctuary where you can savor the distinctive taste of coffee and embark on a sensory journey that celebrates tradition and innovation.
              </p>
              <p>
                Our space serves as a bridge between the rich coffee heritage of Egypt and the dynamic energy of New York City, creating an atmosphere where every visit becomes a memorable experience rooted in authenticity and craftsmanship.
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
                  <span className="text-white text-2xl">🌟</span>
                </div>
                <h3 className="text-xl font-playfair font-semibold text-coffee-dark mb-3">
                  Quality Excellence
                </h3>
                <p className="text-coffee-medium">
                  We source premium beans from around the world and craft each cup with traditional Egyptian techniques and modern expertise.
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


      </div>
    </div>
  );
}
