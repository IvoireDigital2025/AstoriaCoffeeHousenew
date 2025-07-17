import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Lock, Coffee } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Attempting login with password:', password);
      const response = await apiRequest("POST", "/api/admin/login", { password });
      
      console.log('Login response:', response);
      
      toast({
        title: "Login Successful",
        description: "Welcome to the admin dashboard",
      });
      setLocation("/admin");
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: error.message || "Invalid password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-coffee-cream to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border border-coffee-accent/20">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-coffee-primary/10 rounded-full">
              <Lock className="w-6 h-6 text-coffee-primary" />
            </div>
            <Coffee className="w-8 h-8 text-coffee-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-coffee-dark">
            Admin Access
          </CardTitle>
          <p className="text-coffee-medium">
            Enter password to access customer information
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="password" className="text-coffee-dark font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="mt-1 bg-coffee-cream/30 border-coffee-accent/30"
                required
                autoFocus
              />
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-coffee-primary to-amber-600 hover:from-coffee-dark hover:to-amber-700"
            >
              {isLoading ? "Logging in..." : "Access Dashboard"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-xs text-coffee-medium">
              Authorized personnel only. Contact IT support if you need access.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}