import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coffee, Users, Heart, Star, MessageCircle, Play, Instagram } from "lucide-react";
import NewsletterSignup from "@/components/newsletter-signup";

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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
                      alt="Friends at the coffee shop"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-bold text-coffee-dark mb-2">Coffee Friendship Corner</h4>
                    <p className="text-coffee-medium text-sm">Friends celebrating at our cozy coffee spot with Arabic name cards and warm hospitality.</p>
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
                      alt="Couple at Coffee Pro"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-bold text-coffee-dark mb-2">Special Moments</h4>
                    <p className="text-coffee-medium text-sm">A couple celebrating their visit with Arabic name cards at our warm and welcoming coffee shop.</p>
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
                      alt="International visitors at Coffee Pro"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-bold text-coffee-dark mb-2">Global Community</h4>
                    <p className="text-coffee-medium text-sm">International visitors experiencing authentic Egyptian culture at our heritage corner.</p>
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
                    <p className="text-coffee-medium text-sm">Our community sharing their Coffee Pro experiences on social media with #coffeepro #egyptian #queenscoffee.</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Instagram Video Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-coffee-primary/5 to-amber-100/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full">
                <Instagram className="w-8 h-8 text-pink-600" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-coffee-dark">
                Our Most Popular Video
              </h2>
            </div>
            <p className="text-lg text-coffee-medium max-w-2xl mx-auto mb-8">
              See why our community loves Coffee Pro! Watch our most popular Instagram video featuring authentic Egyptian coffee culture and the warm atmosphere that makes us special.
            </p>
          </div>

          <Card className="bg-white/95 backdrop-blur-sm border border-coffee-accent/20 shadow-xl rounded-2xl overflow-hidden">
            <CardContent className="p-8 text-center">
              <div className="relative bg-gradient-to-br from-coffee-primary/10 to-amber-100/30 rounded-xl p-12 mb-6">
                <h3 className="text-2xl font-bold text-coffee-dark mb-4">
                  Experience Coffee Pro's Authentic Egyptian Atmosphere
                </h3>
                <p className="text-coffee-medium text-lg mb-6">
                  Join thousands of viewers who've discovered the magic of our coffee shop through this viral Instagram video.
                </p>
                <a 
                  href="https://www.instagram.com/reel/DJU2jSQxJ6p/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Instagram className="w-5 h-5" />
                  Watch on Instagram
                </a>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="bg-coffee-cream/50 rounded-xl p-6">
                  <div className="text-2xl font-bold text-coffee-primary mb-2">50,000+</div>
                  <div className="text-coffee-medium">Views</div>
                </div>
                <div className="bg-coffee-cream/50 rounded-xl p-6">
                  <div className="text-2xl font-bold text-coffee-primary mb-2">1,500+</div>
                  <div className="text-coffee-medium">Likes</div>
                </div>
                <div className="bg-coffee-cream/50 rounded-xl p-6">
                  <div className="text-2xl font-bold text-coffee-primary mb-2">100+</div>
                  <div className="text-coffee-medium">Comments</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>



      {/* Community Testimonials */}
      <section className="py-16 px-6 bg-gradient-to-r from-coffee-primary/5 to-amber-100/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-coffee-dark mb-4">
              Google Reviews
            </h2>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="flex text-orange-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <span className="text-lg font-semibold text-coffee-dark">4.9</span>
              <span className="text-coffee-medium">from 223 reviews</span>
            </div>
            <p className="text-lg text-coffee-medium max-w-2xl mx-auto">
              Authentic feedback from our valued customers on Google.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Summer Choi",
                role: "",
                text: "One of the best dessert spots I've been to in New York! The desserts were absolutely delicious—perfectly balanced flavors and not too sweet. I especially loved the pistachio cheese bomb. The atmosphere was cozy and inviting.",
                rating: 5
              },
              {
                name: "Jona Lama",
                role: "", 
                text: "Coffee Pro is a fantastic spot for great coffee and pastries. The quality is excellent, and the cozy atmosphere makes it a perfect place to unwind. The staff are incredibly gentle and cheerful, adding a warm, welcoming touch to the experience. Highly recommend for coffee lovers!",
                rating: 5
              },
              {
                name: "Janaan Harb",
                role: "",
                text: "I got the cutest strawberry matcha with oat milk, a smoked salmon sandwich (I added avocado) and a Dubai muffin. The food was great and the staff were super sweet.",
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
                <p>🏛️ Inspired by the ancient beauty of Egyptian heritage</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Newsletter Signup Section */}
      <section className="py-12 px-6 bg-gradient-to-r from-coffee-primary/5 to-amber-100/20">
        <div className="max-w-2xl mx-auto">
          <NewsletterSignup variant="compact" />
        </div>
      </section>
    </div>
  );
}