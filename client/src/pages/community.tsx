import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coffee, Users, Heart, Star, MessageCircle } from "lucide-react";

// Community photos imports
import communityPhoto1 from "@assets/IMG_4125_1751590186680.jpg";
import communityPhoto2 from "@assets/IMG_4126_1751590186681.jpg";
import communityPhoto3 from "@assets/IMG_4127_1751590186681.jpg";
import communityPhoto4 from "@assets/IMG_4128_1751590186681.jpg";
import communityPhoto5 from "@assets/IMG_4129_1751590186681.jpg";
import communityPhoto6 from "@assets/IMG_4124_1751590186681.jpg";
import communityPhoto7 from "@assets/IMG_4123_1751590186682.jpg";
import communityPhoto8 from "@assets/IMG_4130_1751590186682.jpg";
import communityPhoto9 from "@assets/IMG_4132_1751590186682.jpg";
import communityPhoto10 from "@assets/IMG_4133_1751590186682.jpg";
import communityPhoto11 from "@assets/IMG_4134_1751590186682.jpg";

export default function Community() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-cream via-amber-50 to-coffee-cream">
      {/* Header Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-3 bg-coffee-primary/10 rounded-full">
              <Users className="w-8 h-8 text-coffee-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-coffee-primary via-amber-700 to-coffee-accent bg-clip-text text-transparent">
              Our Community
            </h1>
            <div className="p-3 bg-amber-100 rounded-full">
              <Heart className="w-8 h-8 text-amber-600" />
            </div>
          </div>
          <p className="text-xl text-coffee-dark/80 max-w-3xl mx-auto leading-relaxed">
            Meet the wonderful people who make Coffee Pro a vibrant community hub. 
            From our dedicated staff to our loyal customers, every person contributes to our rich cultural tapestry.
          </p>
          <div className="mt-6 h-1 w-32 bg-gradient-to-r from-coffee-primary to-amber-500 rounded-full mx-auto"></div>
        </div>
      </section>

      {/* Upload Section - Placeholder for community photos */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-white/95 backdrop-blur-sm border border-coffee-accent/20 shadow-xl rounded-2xl mb-12">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Coffee className="w-6 h-6 text-coffee-primary" />
                <h2 className="text-2xl font-bold text-coffee-dark">Community Gallery</h2>
              </div>
              <p className="text-coffee-medium mb-8">
                Meet the wonderful people who make Coffee Pro a vibrant community hub. These authentic moments 
                capture the warmth, cultural connection, and genuine friendships that flourish in our space.
              </p>
              
              {/* Community Photo Gallery */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Row 1 */}
                <Card className="overflow-hidden group hover:shadow-xl transition-shadow duration-300 rounded-xl">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={communityPhoto1} 
                      alt="Happy family with Coffee Pro name cards"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-bold text-coffee-dark mb-2">Coffee Family Time</h4>
                    <p className="text-coffee-medium text-sm">A beautiful family moment with Arabic name cards, showing how Coffee Pro brings generations together.</p>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden group hover:shadow-xl transition-shadow duration-300 rounded-xl">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={communityPhoto2} 
                      alt="Friends at the AlUla photo spot"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-bold text-coffee-dark mb-2">AlUla Heritage Corner</h4>
                    <p className="text-coffee-medium text-sm">Friends celebrating at our signature AlUla-inspired photo spot with Arabic name cards.</p>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden group hover:shadow-xl transition-shadow duration-300 rounded-xl">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={communityPhoto3} 
                      alt="Customer enjoying coffee and holding Arabic name card"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-bold text-coffee-dark mb-2">Cultural Connection</h4>
                    <p className="text-coffee-medium text-sm">A loyal customer proudly displaying her Arabic name card, connecting with Middle Eastern culture.</p>
                  </CardContent>
                </Card>

                {/* Row 2 */}
                <Card className="overflow-hidden group hover:shadow-xl transition-shadow duration-300 rounded-xl">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={communityPhoto4} 
                      alt="Two friends sharing coffee and conversation"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-bold text-coffee-dark mb-2">Friendship & Coffee</h4>
                    <p className="text-coffee-medium text-sm">Friends bonding over authentic Middle Eastern coffee with their personalized Arabic name cards.</p>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden group hover:shadow-xl transition-shadow duration-300 rounded-xl">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={communityPhoto5} 
                      alt="Customers enjoying the traditional atmosphere"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-bold text-coffee-dark mb-2">Traditional Atmosphere</h4>
                    <p className="text-coffee-medium text-sm">Customers relaxing in our authentic Middle Eastern atmosphere with geometric patterns and warm lighting.</p>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden group hover:shadow-xl transition-shadow duration-300 rounded-xl">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={communityPhoto6} 
                      alt="Couple at AlUla heritage spot"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-bold text-coffee-dark mb-2">Heritage Celebration</h4>
                    <p className="text-coffee-medium text-sm">A couple celebrating their visit with Arabic name cards at our AlUla-inspired heritage corner.</p>
                  </CardContent>
                </Card>

                {/* Row 3 */}
                <Card className="overflow-hidden group hover:shadow-xl transition-shadow duration-300 rounded-xl">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={communityPhoto7} 
                      alt="Young family with baby at Coffee Pro"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-bold text-coffee-dark mb-2">New Generation</h4>
                    <p className="text-coffee-medium text-sm">A young family introducing the next generation to Middle Eastern coffee culture and hospitality.</p>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden group hover:shadow-xl transition-shadow duration-300 rounded-xl">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={communityPhoto8} 
                      alt="Student studying with coffee"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-bold text-coffee-dark mb-2">Study & Focus</h4>
                    <p className="text-coffee-medium text-sm">A dedicated student finding the perfect study atmosphere among our traditional geometric patterns.</p>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden group hover:shadow-xl transition-shadow duration-300 rounded-xl">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={communityPhoto9} 
                      alt="International visitors at AlUla spot"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-bold text-coffee-dark mb-2">Global Community</h4>
                    <p className="text-coffee-medium text-sm">International visitors experiencing authentic Saudi Arabian culture at our AlUla heritage corner.</p>
                  </CardContent>
                </Card>

                {/* Row 4 */}
                <Card className="overflow-hidden group hover:shadow-xl transition-shadow duration-300 rounded-xl">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={communityPhoto10} 
                      alt="Regular customers at heritage corner"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-bold text-coffee-dark mb-2">Cultural Exchange</h4>
                    <p className="text-coffee-medium text-sm">Regular customers from different backgrounds coming together to appreciate Middle Eastern heritage.</p>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden group hover:shadow-xl transition-shadow duration-300 rounded-xl">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={communityPhoto11} 
                      alt="Business professionals networking"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-bold text-coffee-dark mb-2">Professional Networking</h4>
                    <p className="text-coffee-medium text-sm">Business professionals building connections in our warm, culturally rich environment.</p>
                  </CardContent>
                </Card>

                {/* Featured Social Media Post */}
                <Card className="overflow-hidden group hover:shadow-xl transition-shadow duration-300 rounded-xl md:col-span-2 lg:col-span-1">
                  <div className="aspect-square overflow-hidden relative">
                    <img 
                      src={communityPhoto1} 
                      alt="Coffee Pro Instagram post"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-coffee-primary to-amber-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      Featured
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-bold text-coffee-dark mb-2">Social Media Love</h4>
                    <p className="text-coffee-medium text-sm">Our community sharing their Coffee Pro experiences on social media with #coffeepro #alula #queenscoffee.</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Community Values Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-coffee-dark mb-4">
              What Makes Our Community Special
            </h2>
            <p className="text-lg text-coffee-medium max-w-2xl mx-auto">
              Our community is built on shared values of hospitality, cultural appreciation, and genuine connection.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Cultural Heritage */}
            <Card className="bg-white/90 backdrop-blur-sm border border-coffee-accent/20 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-coffee-primary/20 to-amber-200/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Coffee className="w-8 h-8 text-coffee-primary" />
                </div>
                <h3 className="text-xl font-bold text-coffee-dark mb-4">Cultural Heritage</h3>
                <p className="text-coffee-medium leading-relaxed">
                  We celebrate 32+ years of Moroccan and Saudi Arabian coffee traditions, 
                  bringing authentic flavors and hospitality to New York City.
                </p>
                <Badge className="mt-4 bg-gradient-to-r from-coffee-primary to-amber-600 text-white">
                  Authentic Traditions
                </Badge>
              </CardContent>
            </Card>

            {/* Community Connection */}
            <Card className="bg-white/90 backdrop-blur-sm border border-coffee-accent/20 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-coffee-primary/20 to-amber-200/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-coffee-primary" />
                </div>
                <h3 className="text-xl font-bold text-coffee-dark mb-4">Community Connection</h3>
                <p className="text-coffee-medium leading-relaxed">
                  Every customer becomes part of our extended family. We create lasting relationships 
                  that go beyond just serving great coffee.
                </p>
                <Badge className="mt-4 bg-gradient-to-r from-coffee-primary to-amber-600 text-white">
                  Family Atmosphere
                </Badge>
              </CardContent>
            </Card>

            {/* Quality & Service */}
            <Card className="bg-white/90 backdrop-blur-sm border border-coffee-accent/20 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-coffee-primary/20 to-amber-200/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Star className="w-8 h-8 text-coffee-primary" />
                </div>
                <h3 className="text-xl font-bold text-coffee-dark mb-4">Quality & Service</h3>
                <p className="text-coffee-medium leading-relaxed">
                  We're committed to excellence in every cup, every pastry, and every interaction. 
                  Our community deserves nothing less than the best.
                </p>
                <Badge className="mt-4 bg-gradient-to-r from-coffee-primary to-amber-600 text-white">
                  Excellence First
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Community Testimonials */}
      <section className="py-16 px-6 bg-gradient-to-r from-coffee-primary/5 to-amber-100/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-coffee-dark mb-4">
              What Our Community Says
            </h2>
            <p className="text-lg text-coffee-medium max-w-2xl mx-auto">
              Hear from the people who make Coffee Pro their daily destination.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Sample testimonials - these would be replaced with real community feedback */}
            {[
              {
                name: "Sarah M.",
                role: "Regular Customer",
                text: "Coffee Pro feels like a second home. The staff remembers my order and always greets me with a smile. The authentic Middle Eastern atmosphere is unmatched in NYC.",
                rating: 5
              },
              {
                name: "Ahmed K.",
                role: "Community Member",
                text: "As someone from the Middle East, finding authentic coffee and hospitality here brings me so much joy. It's like a little piece of home in Queens.",
                rating: 5
              },
              {
                name: "Maria L.",
                role: "Local Resident",
                text: "I've been coming here since they opened. The quality is consistently excellent, and the cultural experience is educational and enriching for my whole family.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <Card key={index} className="bg-white/90 backdrop-blur-sm border border-coffee-accent/20 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-coffee-medium mb-4 italic leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-coffee-primary/20 to-amber-200/30 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-coffee-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-coffee-dark">{testimonial.name}</p>
                      <p className="text-sm text-coffee-medium">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-gradient-to-r from-coffee-primary/10 to-amber-100/30 border border-coffee-accent/20 shadow-xl rounded-2xl">
            <CardContent className="p-12">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Coffee className="w-8 h-8 text-coffee-primary" />
                <h2 className="text-3xl font-bold text-coffee-dark">Join Our Community</h2>
              </div>
              <p className="text-xl text-coffee-medium mb-8 leading-relaxed">
                Whether you're a coffee enthusiast, cultural explorer, or simply looking for a welcoming place to connect, 
                Coffee Pro is your home away from home.
              </p>
              <div className="text-lg text-coffee-dark">
                <p className="mb-2">📍 23-33 Astoria Blvd, Astoria, NY 11102</p>
                <p className="mb-2">☕ Open Daily - Bringing authentic Middle Eastern hospitality to NYC</p>
                <p>🏛️ Inspired by the ancient beauty of AlUla, Saudi Arabia</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}