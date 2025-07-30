import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Coffee, Gift, User, Phone, Mail, CheckCircle, Star, Trophy } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function Loyalty() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [isRegistered, setIsRegistered] = useState(false);

  const registrationMutation = useMutation({
    mutationFn: async (data: { name: string; phone: string; email: string }) => {
      return await apiRequest("POST", "/api/loyalty/register", data);
    },
    onSuccess: () => {
      setIsRegistered(true);
      toast({
        title: "Registration Successful!",
        description: "Welcome to Coffee Pro Loyalty Program! Start earning rewards with your next visit.",
        duration: 5000,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registrationMutation.mutate(formData);
  };

  const handleReset = () => {
    setFormData({ name: "", phone: "", email: "" });
    setIsRegistered(false);
  };

  if (isRegistered) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-coffee-cream to-white p-4 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="mx-auto mb-6">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-coffee-dark mb-4">Welcome to Coffee Pro Loyalty!</h2>
            <p className="text-coffee-medium mb-6">
              You're now part of our loyalty program! Visit our store and check-in to start earning rewards.
            </p>
            <div className="bg-coffee-cream/30 rounded-lg p-4 mb-6">
              <p className="text-sm text-coffee-dark font-semibold mb-2">How to earn rewards:</p>
              <ul className="text-sm text-coffee-medium space-y-1">
                <li>• Visit Coffee Pro in Astoria</li>
                <li>• Scan the QR code at the front desk</li>
                <li>• Get 1 point per visit</li>
                <li>• Earn a free coffee at 5 points!</li>
              </ul>
            </div>
            <Button 
              onClick={handleReset}
              className="w-full bg-coffee-primary hover:bg-coffee-medium text-white"
            >
              <Coffee className="w-4 h-4 mr-2" />
              Register Another Person
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-inter bg-gradient-to-br from-coffee-cream via-white to-blue-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-primary opacity-10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-secondary opacity-10 rounded-full blur-3xl"></div>
      
      {/* Enhanced Hero Section */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center slide-in-up">
          <div className="mx-auto mb-12">
            <div className="glass-card p-8 mb-8 backdrop-blur-md inline-block">
              <Coffee className="w-24 h-24 text-coffee-primary mx-auto mb-6 pulse-slow" />
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-playfair font-bold text-coffee-dark mb-6 leading-tight">
                Join Coffee Pro 
                <span className="gradient-text block">Loyalty</span>
              </h1>
              <div className="h-1 w-32 bg-gradient-primary rounded-full mx-auto mb-6"></div>
              <p className="text-lg sm:text-xl text-coffee-medium font-light">
                Earn rewards with every visit to our Astoria location
              </p>
            </div>
          </div>

          {/* Enhanced Benefits Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="glass-card hover-lift border-0 backdrop-blur-md">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-primary rounded-full p-4 w-fit mx-auto mb-6">
                  <Gift className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-playfair font-semibold text-coffee-dark mb-4">Easy Rewards</h3>
                <p className="text-coffee-medium leading-relaxed">Get 1 point per visit, earn a free coffee at 5 points</p>
              </CardContent>
            </Card>

            <Card className="glass-card hover-lift border-0 backdrop-blur-md">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-secondary rounded-full p-4 w-fit mx-auto mb-6">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-playfair font-semibold text-coffee-dark mb-4">Exclusive Perks</h3>
                <p className="text-coffee-medium leading-relaxed">Special offers and early access to new menu items</p>
              </CardContent>
            </Card>

            <Card className="glass-card hover-lift border-0 backdrop-blur-md">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-accent rounded-full p-4 w-fit mx-auto mb-6">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-playfair font-semibold text-coffee-dark mb-4">Weekly Promotions</h3>
                <p className="text-coffee-medium leading-relaxed">Exclusive weekly deals and special offers for members</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Registration Form */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-lg mx-auto">
          <Card className="glass-card shadow-xl border-0 backdrop-blur-md">
            <CardHeader className="text-center pb-8">
              <div className="bg-gradient-primary rounded-full p-4 w-fit mx-auto mb-6">
                <User className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-3xl font-playfair font-bold text-coffee-dark mb-4">Sign Up Today</CardTitle>
              <p className="text-coffee-medium text-lg">Join thousands of satisfied customers</p>
              <div className="h-1 w-24 bg-gradient-primary rounded-full mx-auto mt-4"></div>
            </CardHeader>
            <CardContent className="px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-coffee-dark font-medium text-lg mb-3 block">Full Name</Label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gradient-primary rounded-full p-2">
                      <User className="text-white w-4 h-4" />
                    </div>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                      className="enhanced-input pl-16 pr-4 py-4 text-lg rounded-xl border-2 border-coffee-accent/30 focus:border-coffee-primary focus:ring-coffee-primary/20 bg-white/80 backdrop-blur-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone" className="text-coffee-dark font-medium text-lg mb-3 block">Phone Number</Label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gradient-secondary rounded-full p-2">
                      <Phone className="text-white w-4 h-4" />
                    </div>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="(555) 123-4567"
                      className="enhanced-input pl-16 pr-4 py-4 text-lg rounded-xl border-2 border-coffee-accent/30 focus:border-coffee-primary focus:ring-coffee-primary/20 bg-white/80 backdrop-blur-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-coffee-dark font-medium text-lg mb-3 block">Email Address</Label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gradient-accent rounded-full p-2">
                      <Mail className="text-white w-4 h-4" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="your.email@example.com"
                      className="pl-10 focus:border-coffee-primary focus:ring-coffee-primary"
                      required
                    />
                  </div>
                </div>

                <div className="bg-coffee-cream/30 rounded-lg p-4 text-center">
                  <p className="text-sm text-coffee-medium">
                    <strong>Next Steps:</strong> Visit our Astoria location and scan the QR code at checkout to start earning points!
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-coffee-primary hover:bg-coffee-medium text-white"
                  disabled={registrationMutation.isPending}
                >
                  <Gift className="w-4 h-4 mr-2" />
                  {registrationMutation.isPending ? "Joining..." : "Join Loyalty Program"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Location Info */}
      <section className="py-16 px-6 bg-coffee-primary/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-coffee-dark mb-4">Visit Us to Start Earning</h2>
          <p className="text-lg text-coffee-medium mb-6">
            Come to our Astoria location to begin your loyalty journey
          </p>
          <div className="bg-white rounded-lg p-6 shadow-lg inline-block">
            <h3 className="text-xl font-semibold text-coffee-dark mb-2">Coffee Pro Astoria</h3>
            <p className="text-coffee-medium mb-2">23-33 Astoria Blvd, Astoria, NY 11102</p>
            <p className="text-coffee-medium mb-2">Phone: (347) 329-6816</p>
            <p className="text-coffee-medium">
              <strong>Hours:</strong> Sun-Thu 7AM-7:30PM, Fri-Sat 7AM-8:30PM
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}