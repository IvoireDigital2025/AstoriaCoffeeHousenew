import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coffee, Users, Star, MapPin, Clock, Award } from "lucide-react";

export default function About() {
  const stats = [
    { number: "12", label: "Months Established", icon: Clock },
    { number: "1", label: "Astoria Location", icon: MapPin },
    { number: "4.9", label: "Google Rating", icon: Star },
  ];

  const values = [
    {
      icon: Coffee,
      title: "Quality Excellence",
      description: "We source premium beans from around the world and craft each cup with traditional Egyptian techniques and modern expertise.",
      badge: "Premium Coffee"
    },
    {
      icon: Users,
      title: "Community",
      description: "We create a sanctuary in Astoria where locals and visitors can experience authentic Egyptian hospitality.",
      badge: "Cultural Connection"
    },
    {
      icon: Award,
      title: "Heritage",
      description: "We honor Egyptian coffee traditions while embracing innovation, creating a bridge between authentic cultural heritage and modern coffee artistry.",
      badge: "Cultural Heritage"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-coffee-cream/20">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-coffee-primary/10 to-amber-100/30 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-6 bg-coffee-primary text-white px-6 py-2 text-sm">
              Authentic Egyptian Coffee Culture
            </Badge>
            <h1 className="text-5xl md:text-6xl font-playfair font-bold text-coffee-dark mb-6">
              About Coffee Pro
            </h1>
            <p className="text-xl md:text-2xl text-coffee-medium max-w-4xl mx-auto leading-relaxed">
              An oasis of warmth and flavor in the vibrant heart of Astoria Boulevard, bringing Egyptian coffee traditions to New York City.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index} className="text-center border-none shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                  <CardContent className="pt-8 pb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-coffee-primary to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-4xl font-playfair font-bold text-coffee-dark mb-2">
                      {stat.number}
                    </h3>
                    <p className="text-coffee-medium font-medium">
                      {stat.label}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <Badge className="mb-4 bg-amber-100 text-coffee-dark px-4 py-2">
                  Our Journey
                </Badge>
                <h2 className="text-4xl font-playfair font-bold text-coffee-dark mb-6">
                  Our Story
                </h2>
              </div>
              <div className="space-y-6 text-lg text-coffee-medium leading-relaxed">
                <p>
                  Coffee Pro was founded from a deep passion for coffee, baking, and cultural connection. Inspired by the journey of the coffee bean - from its origins in fertile lands to its transformation into the perfect roast - and the rich baking traditions of the Middle East, especially Egypt, our brand blends heritage with craft.
                </p>
                <p>
                  Our identity draws from the natural beauty of the desert dunes, symbolizing growth, warmth, and timeless rituals of sharing coffee. At Coffee Pro, every cup and every pastry is a reflection of tradition, quality, and hospitality.
                </p>
                <p>
                  Born from one founder's dream to bring people together through flavor and experience, Coffee Pro is now a growing brand inviting passionate partners to join the journey.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <img
                src="/attached_assets/IMG_4484_1752039133460.JPG"
                alt="Coffee Pro brand identity and design elements featuring logo and coffee aesthetic"
                className="rounded-2xl shadow-2xl w-full max-w-sm h-auto object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Owner Section */}
      <section className="py-12 bg-gradient-to-r from-coffee-cream/30 to-amber-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="lg:order-2 space-y-8">
              <div>
                <Badge className="mb-4 bg-coffee-primary text-white px-4 py-2">
                  Leadership
                </Badge>
                <h2 className="text-4xl font-playfair font-bold text-coffee-dark mb-6">
                  Meet the Owner
                </h2>
              </div>
              <div className="space-y-6">
                <h3 className="text-3xl font-playfair font-semibold text-coffee-primary">
                  Mohamed
                </h3>
                <p className="text-lg text-coffee-medium leading-relaxed">
                  The owner, Mohamed, has a passion for coffee and has combined his travels with his love for Arabic culture in the cafe's design and menu. His vision brings authentic Egyptian hospitality to the heart of Astoria, creating a space where tradition meets innovation.
                </p>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-amber-100 text-coffee-dark">
                    Founder & Owner
                  </Badge>
                  <Badge className="bg-coffee-primary/10 text-coffee-primary">
                    Cultural Ambassador
                  </Badge>
                </div>
              </div>
            </div>
            <div className="lg:order-1 flex justify-center items-end">
              <div className="mt-8">
                <img
                  src="/attached_assets/PHOTO MOHAMED_1751955903969.JPG"
                  alt="Mohamed, owner of Coffee Pro, passionate about coffee and Arabic culture"
                  className="rounded-2xl shadow-2xl w-full max-w-48 h-auto object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-amber-100 text-coffee-dark px-4 py-2">
              What We Stand For
            </Badge>
            <h2 className="text-4xl font-playfair font-bold text-coffee-dark mb-6">
              Our Values
            </h2>
            <p className="text-xl text-coffee-medium max-w-3xl mx-auto">
              The principles that guide every cup we serve and every connection we make
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-none shadow-lg bg-gradient-to-br from-white to-coffee-cream/20">
                  <CardHeader className="text-center pb-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-coffee-primary to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                    <Badge className="mb-3 bg-amber-100 text-coffee-dark text-xs">
                      {value.badge}
                    </Badge>
                    <CardTitle className="text-2xl font-playfair font-bold text-coffee-dark">
                      {value.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-coffee-medium leading-relaxed text-center">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-coffee-primary to-amber-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-white mb-6">
            Join the Coffee Pro Family
          </h2>
          <p className="text-xl text-white/90 mb-8 leading-relaxed">
            We invite you to become part of the Coffee Pro family - to bring this shared passion to your community and to create a space where people don't just grab coffee, they stay for the story.
          </p>
          <Badge className="bg-white text-coffee-primary px-6 py-3 text-lg font-semibold">
            Experience Authentic Egyptian Coffee Culture
          </Badge>
        </div>
      </section>
    </div>
  );
}