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
      return await apiRequest("/api/loyalty/register", "POST", data);
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
    <div className="min-h-screen bg-gradient-to-b from-coffee-cream to-white">
      {/* Hero Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mx-auto mb-8">
            <Coffee className="w-20 h-20 text-coffee-primary mx-auto mb-4" />
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-coffee-dark mb-4">
              Join Coffee Pro Loyalty
            </h1>
            <p className="text-base sm:text-xl text-coffee-medium mb-8">
              Earn rewards with every visit to our Astoria location
            </p>
          </div>

          {/* Benefits Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-white/90 backdrop-blur-sm border border-coffee-accent/20 shadow-lg">
              <CardContent className="p-6 text-center">
                <Gift className="w-12 h-12 text-coffee-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-coffee-dark mb-2">Easy Rewards</h3>
                <p className="text-coffee-medium">Get 1 point per visit, earn a free coffee at 5 points</p>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border border-coffee-accent/20 shadow-lg">
              <CardContent className="p-6 text-center">
                <Star className="w-12 h-12 text-coffee-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-coffee-dark mb-2">Exclusive Perks</h3>
                <p className="text-coffee-medium">Special offers and early access to new menu items</p>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm border border-coffee-accent/20 shadow-lg">
              <CardContent className="p-6 text-center">
                <Trophy className="w-12 h-12 text-coffee-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-coffee-dark mb-2">Access to Weekly Promotions</h3>
                <p className="text-coffee-medium">Exclusive weekly deals and special offers for members</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-16 px-6">
        <div className="max-w-md mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-coffee-dark">Sign Up Today</CardTitle>
              <p className="text-coffee-medium">Join thousands of satisfied customers</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-coffee-dark">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coffee-medium w-4 h-4" />
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                      className="pl-10 focus:border-coffee-primary focus:ring-coffee-primary"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone" className="text-coffee-dark">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coffee-medium w-4 h-4" />
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="(555) 123-4567"
                      className="pl-10 focus:border-coffee-primary focus:ring-coffee-primary"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-coffee-dark">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coffee-medium w-4 h-4" />
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