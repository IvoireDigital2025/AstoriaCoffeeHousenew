import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Gift, User } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertUserSchema, type User as UserType } from "@shared/schema";
import { z } from "zod";

interface LoyaltyDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const signupSchema = insertUserSchema.extend({
  agreeToTerms: z.boolean().refine(val => val === true, "You must agree to the terms and conditions"),
});

export default function LoyaltyDashboard({ isOpen, onClose }: LoyaltyDashboardProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    phone: "",
    agreeToTerms: false,
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await apiRequest("GET", `/api/users/${encodeURIComponent(email)}`);
      return await response.json();
    },
    onSuccess: (user: UserType) => {
      setCurrentUser(user);
      toast({
        title: "Welcome back!",
        description: `You have ${user.points} loyalty points.`,
      });
    },
    onError: () => {
      toast({
        title: "User not found",
        description: "Please check your email or sign up for a new account.",
        variant: "destructive",
      });
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (userData: typeof signupData) => {
      const response = await apiRequest("POST", "/api/users", {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
      });
      return await response.json();
    },
    onSuccess: (user: UserType) => {
      setCurrentUser(user);
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

  const handleLogin = () => {
    try {
      loginSchema.parse({ email: loginEmail });
      loginMutation.mutate(loginEmail);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Invalid email",
          description: error.errors[0].message,
          variant: "destructive",
        });
      }
    }
  };

  const handleSignup = () => {
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

  const handleLogout = () => {
    setCurrentUser(null);
    setLoginEmail("");
    setSignupData({
      name: "",
      email: "",
      phone: "",
      agreeToTerms: false,
    });
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const progressPercentage = currentUser ? Math.min((currentUser.points / 100) * 100, 100) : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-playfair text-coffee-primary">
            {currentUser ? "Your Loyalty Account" : "Coffee Pro Loyalty Program"}
          </DialogTitle>
        </DialogHeader>

        {currentUser ? (
          // User Dashboard
          <div className="space-y-6">
            <Card className="bg-coffee-cream">
              <CardContent className="pt-6">
                <div className="text-center mb-4">
                  <h4 className="text-xl font-playfair font-semibold text-coffee-dark">
                    Welcome back, {currentUser.name}!
                  </h4>
                  <p className="text-coffee-medium">Current Points Balance</p>
                  <div className="text-4xl font-playfair font-bold text-coffee-accent mt-2">
                    {currentUser.points}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-coffee-medium">Progress to free drink</span>
                    <span className="text-sm text-coffee-dark font-medium">
                      {currentUser.points}/100 points
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-3" />
                  {currentUser.points >= 100 && (
                    <div className="mt-3 p-3 bg-green-100 rounded-lg text-center">
                      <Gift className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      <p className="text-green-800 font-medium">
                        You've earned a free drink! Visit us to redeem.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleLogout} variant="outline" className="w-full">
              Logout
            </Button>
          </div>
        ) : (
          // Login/Signup Forms
          <div className="space-y-6">
            <div className="flex space-x-2 bg-coffee-cream rounded-lg p-1">
              <Button
                variant={isLogin ? "default" : "ghost"}
                size="sm"
                onClick={() => setIsLogin(true)}
                className={`flex-1 ${isLogin ? "bg-coffee-primary text-white" : ""}`}
              >
                Login
              </Button>
              <Button
                variant={!isLogin ? "default" : "ghost"}
                size="sm"
                onClick={() => setIsLogin(false)}
                className={`flex-1 ${!isLogin ? "bg-coffee-primary text-white" : ""}`}
              >
                Sign Up
              </Button>
            </div>

            {isLogin ? (
              // Login Form
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="focus:border-coffee-primary focus:ring-coffee-primary"
                  />
                </div>
                <Button
                  onClick={handleLogin}
                  disabled={loginMutation.isPending}
                  className="w-full bg-coffee-primary hover:bg-coffee-medium text-white"
                >
                  <User className="w-4 h-4 mr-2" />
                  {loginMutation.isPending ? "Signing in..." : "Sign In"}
                </Button>
              </div>
            ) : (
              // Signup Form
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={signupData.name}
                    onChange={(e) => setSignupData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                    className="focus:border-coffee-primary focus:ring-coffee-primary"
                  />
                </div>
                <div>
                  <Label htmlFor="signup-email">Email Address</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={signupData.email}
                    onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email"
                    className="focus:border-coffee-primary focus:ring-coffee-primary"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={signupData.phone}
                    onChange={(e) => setSignupData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Enter your phone number"
                    className="focus:border-coffee-primary focus:ring-coffee-primary"
                  />
                </div>
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={signupData.agreeToTerms}
                    onChange={(e) => setSignupData(prev => ({ ...prev, agreeToTerms: e.target.checked }))}
                    className="mt-1 text-coffee-primary focus:ring-coffee-primary"
                  />
                  <label htmlFor="terms" className="text-sm text-coffee-medium">
                    I agree to the <a href="#" className="text-coffee-primary hover:underline">Terms and Conditions</a> and{" "}
                    <a href="#" className="text-coffee-primary hover:underline">Privacy Policy</a>
                  </label>
                </div>
                <Button
                  onClick={handleSignup}
                  disabled={signupMutation.isPending}
                  className="w-full bg-coffee-accent hover:bg-orange-600 text-white"
                >
                  <Star className="w-4 h-4 mr-2" />
                  {signupMutation.isPending ? "Creating account..." : "Join Loyalty Program"}
                </Button>
              </div>
            )}

            {/* Program Benefits */}
            <div className="space-y-3 pt-4 border-t">
              <h4 className="font-semibold text-coffee-dark text-center">Program Benefits</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-coffee-accent" />
                  <span>Earn 1 point per $1 spent</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Gift className="w-4 h-4 text-coffee-accent" />
                  <span>Free drink at 100 points</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-coffee-accent" />
                  <span>Birthday rewards & early access</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
