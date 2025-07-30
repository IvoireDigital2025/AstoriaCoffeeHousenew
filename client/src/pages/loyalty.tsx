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
    <div className="min-h-screen bg-gradient-to-br from-coffee-cream via-white to-blue-50">
      {/* Modern Hero Section */}
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-transparent to-blue-100 opacity-60"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="mx-auto mb-12">
            <div className="relative inline-block">
              <Coffee className="w-24 h-24 text-coffee-primary mx-auto mb-6 drop-shadow-lg" />
              <div className="absolute -inset-4 bg-gradient-to-r from-orange-400 to-blue-400 rounded-full opacity-20 blur-xl"></div>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-coffee-primary via-orange-600 to-blue-600 bg-clip-text text-transparent mb-6 leading-tight">
              Join Coffee Pro Loyalty
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Unlock exclusive rewards and special perks with every visit to our charming Astoria location
            </p>
          </div>

          {/* Modern Benefits Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="group bg-white/80 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-orange-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="relative p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Gift className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-coffee-dark mb-3">Easy Rewards</h3>
                <p className="text-gray-600 leading-relaxed">Get 1 point per visit, earn a free coffee at 5 points</p>
              </CardContent>
            </Card>

            <Card className="group bg-white/80 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="relative p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-coffee-dark mb-3">Exclusive Perks</h3>
                <p className="text-gray-600 leading-relaxed">Special offers and early access to new menu items</p>
              </CardContent>
            </Card>

            <Card className="group bg-white/80 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-purple-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="relative p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-coffee-dark mb-3">Weekly Promotions</h3>
                <p className="text-gray-600 leading-relaxed">Exclusive weekly deals and special offers for members</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Modern Registration Form */}
      <section className="py-20 px-6">
        <div className="max-w-lg mx-auto">
          <Card className="bg-white/90 backdrop-blur-md border-0 shadow-2xl rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-transparent to-blue-50 opacity-30"></div>
            <CardHeader className="relative text-center py-10 bg-gradient-to-r from-coffee-primary/10 to-blue-600/10">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-orange-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-coffee-primary to-blue-600 bg-clip-text text-transparent mb-2">
                Sign Up Today
              </CardTitle>
              <p className="text-gray-600 text-lg">Join thousands of satisfied customers</p>
            </CardHeader>
            <CardContent className="relative p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-lg font-semibold text-gray-700">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                      className="pl-12 h-14 text-lg border-0 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-400 rounded-xl transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-lg font-semibold text-gray-700">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="(555) 123-4567"
                      className="pl-12 h-14 text-lg border-0 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-400 rounded-xl transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-lg font-semibold text-gray-700">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="your.email@example.com"
                      className="pl-12 h-14 text-lg border-0 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-purple-400 rounded-xl transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-blue-50 rounded-xl p-6 text-center border border-orange-100">
                  <p className="text-gray-700 leading-relaxed">
                    <strong className="text-coffee-primary">Next Steps:</strong> Visit our Astoria location and scan the QR code at checkout to start earning points!
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-orange-500 to-blue-600 hover:from-orange-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  disabled={registrationMutation.isPending}
                >
                  {registrationMutation.isPending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      Creating Your Account...
                    </>
                  ) : (
                    <>
                      <Gift className="w-5 h-5 mr-3" />
                      Join Loyalty Program
                    </>
                  )}
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