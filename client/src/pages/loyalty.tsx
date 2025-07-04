import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star, Gift, Zap, Calendar, Plus, Check } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertUserSchema, type User } from "@shared/schema";
import { z } from "zod";
import NewsletterSignup from "@/components/newsletter-signup";

const signupSchema = insertUserSchema.extend({
  agreeToTerms: z.boolean().refine(val => val === true, "You must agree to the terms and conditions"),
});

export default function Loyalty() {
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    phone: "",
    agreeToTerms: false,
  });
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [newUser, setNewUser] = useState<User | null>(null);
  const { toast } = useToast();

  const signupMutation = useMutation({
    mutationFn: async (userData: typeof signupData) => {
      const response = await apiRequest("POST", "/api/users", {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
      });
      return await response.json();
    },
    onSuccess: (user: User) => {
      setNewUser(user);
      setIsSignedUp(true);
      toast({
        title: "Welcome to Coffee Pro!",
        description: "Your loyalty account has been created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Signup failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      signupSchema.parse(signupData);
      signupMutation.mutate(signupData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Please check your information",
          description: error.errors[0].message,
          variant: "destructive",
        });
      }
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setSignupData(prev => ({ ...prev, [field]: value }));
  };

  const benefits = [
    {
      icon: Star,
      title: "Earn 1 point per $1 spent",
      description: "Simple and straightforward rewards system",
    },
    {
      icon: Gift,
      title: "Free drink at 100 points",
      description: "Redeem for any beverage on our menu",
    },
    {
      icon: Calendar,
      title: "Birthday rewards",
      description: "Special treats on your special day",
    },
    {
      icon: Zap,
      title: "Early access to new products",
      description: "Be the first to try seasonal specials",
    },
  ];

  const tiers = [
    {
      name: "Bean Lover",
      points: "0-99 points",
      color: "bg-coffee-secondary",
      benefits: ["1 point per $1", "Birthday treat"],
    },
    {
      name: "Coffee Connoisseur",
      points: "100-299 points",
      color: "bg-coffee-accent",
      benefits: ["1.25 points per $1", "Free drink rewards", "Early access"],
    },
    {
      name: "Brew Master",
      points: "300+ points",
      color: "bg-coffee-primary",
      benefits: ["1.5 points per $1", "VIP events", "Custom drink creation"],
    },
  ];

  return (
    <div className="min-h-screen bg-coffee-cream py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-playfair font-bold text-coffee-dark mb-4">
            Coffee Pro Loyalty Program
          </h1>
          <p className="text-xl text-coffee-medium">
            Earn points with every purchase and unlock exclusive rewards
          </p>
        </div>

        {/* Success Message */}
        {isSignedUp && newUser && (
          <Card className="mb-12 bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-playfair font-semibold text-green-800 mb-2">
                  Welcome to the family, {newUser.name}!
                </h3>
                <p className="text-green-700 mb-4">
                  Your loyalty account has been created. You now have <strong>{newUser.points} points</strong> to start with.
                </p>
                <p className="text-green-600">
                  Visit us soon to start earning points on your purchases!
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Benefits Section */}
          <div>
            <h2 className="text-2xl font-playfair font-semibold text-coffee-dark mb-6">
              Program Benefits
            </h2>
            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-coffee-accent rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <IconComponent className="text-white w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-coffee-dark">
                        {benefit.title}
                      </h4>
                      <p className="text-coffee-medium text-sm">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Loyalty Tiers */}
            <h3 className="text-xl font-playfair font-semibold text-coffee-dark mb-4">
              Loyalty Tiers
            </h3>
            <div className="space-y-3">
              {tiers.map((tier, index) => (
                <Card key={index} className="border-none shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${tier.color}`} />
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-semibold text-coffee-dark">
                            {tier.name}
                          </h4>
                          <span className="text-sm text-coffee-medium">
                            {tier.points}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {tier.benefits.map((benefit, benefitIndex) => (
                            <span
                              key={benefitIndex}
                              className="text-xs bg-coffee-cream px-2 py-1 rounded-full text-coffee-medium"
                            >
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Signup Form */}
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-playfair font-semibold text-coffee-dark text-center">
                {isSignedUp ? "Account Created!" : "Join Today!"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!isSignedUp ? (
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-coffee-dark font-medium">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={signupData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter your full name"
                      className="focus:border-coffee-primary focus:ring-coffee-primary"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="text-coffee-dark font-medium">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={signupData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="Enter your email"
                      className="focus:border-coffee-primary focus:ring-coffee-primary"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="text-coffee-dark font-medium">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={signupData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="Enter your phone number"
                      className="focus:border-coffee-primary focus:ring-coffee-primary"
                      required
                    />
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={signupData.agreeToTerms}
                      onChange={(e) => handleInputChange("agreeToTerms", e.target.checked)}
                      className="mt-1 text-coffee-primary focus:ring-coffee-primary"
                      required
                    />
                    <label htmlFor="terms" className="text-sm text-coffee-medium">
                      I agree to the{" "}
                      <a href="#" className="text-coffee-primary hover:underline">
                        Terms and Conditions
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-coffee-primary hover:underline">
                        Privacy Policy
                      </a>
                    </label>
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={signupMutation.isPending}
                    className="w-full bg-coffee-accent hover:bg-orange-600 text-white font-semibold"
                  >
                    <Star className="w-4 h-4 mr-2" />
                    {signupMutation.isPending ? "Creating account..." : "Join Loyalty Program"}
                  </Button>
                </form>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-coffee-medium">
                    Start earning points on your next visit!
                  </p>
                  <Button
                    onClick={() => window.location.href = "/menu"}
                    className="bg-coffee-accent hover:bg-orange-600 text-white"
                  >
                    Browse Menu
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div className="mt-20">
          <h2 className="text-3xl font-playfair font-bold text-coffee-dark text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-none shadow-sm bg-white">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-coffee-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-playfair font-semibold text-coffee-dark mb-3">
                  1. Sign Up
                </h3>
                <p className="text-coffee-medium">
                  Join our loyalty program for free and start earning points immediately.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-none shadow-sm bg-white">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-coffee-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-playfair font-semibold text-coffee-dark mb-3">
                  2. Earn Points
                </h3>
                <p className="text-coffee-medium">
                  Get 1 point for every $1 you spend on any item in our store.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-none shadow-sm bg-white">
              <CardContent className="pt-8">
                <div className="w-16 h-16 bg-coffee-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-playfair font-semibold text-coffee-dark mb-3">
                  3. Redeem Rewards
                </h3>
                <p className="text-coffee-medium">
                  Use your points for free drinks, discounts, and exclusive perks.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Newsletter Signup Section */}
        <div className="mt-16">
          <NewsletterSignup variant="compact" />
        </div>
      </div>
    </div>
  );
}
