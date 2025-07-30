import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Coffee, ShieldCheck, Eye, EyeOff } from "lucide-react";

export default function StaffAccess() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [accessCode, setAccessCode] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check for URL parameters (from QR codes)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const codeParam = urlParams.get('code');
    if (codeParam) {
      setAccessCode(codeParam);
      // Auto-submit if valid code is provided
      const validCodes = ["COFFEE2025", "ASTORIA23", "BARISTA"];
      if (validCodes.includes(codeParam.toUpperCase())) {
        handleAutoAccess(codeParam);
      }
    }
  }, []);

  const handleAutoAccess = (code: string) => {
    // Set staff access flag in session storage
    sessionStorage.setItem('coffee-pro-staff-access', 'true');
    sessionStorage.setItem('coffee-pro-staff-access-time', Date.now().toString());
    
    toast({
      title: "Access Granted",
      description: "Authorized via QR code. Redirecting...",
    });
    
    setTimeout(() => {
      setLocation("/admin/login");
    }, 1000);
  };

  const handleAccessRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Staff access codes (these should be changed regularly)
    const validCodes = [
      "COFFEE2025", // Main staff code
      "ASTORIA23", // Location-specific code
      "BARISTA", // Simple staff code
    ];

    if (validCodes.includes(accessCode.toUpperCase())) {
      // Set staff access flag in session storage
      sessionStorage.setItem('coffee-pro-staff-access', 'true');
      sessionStorage.setItem('coffee-pro-staff-access-time', Date.now().toString());
      
      toast({
        title: "Access Granted",
        description: "Redirecting to admin login...",
      });
      
      // Redirect to actual admin login
      setTimeout(() => {
        setLocation("/admin/login");
      }, 1000);
    } else {
      toast({
        title: "Access Denied",
        description: "Invalid access code. Contact management for assistance.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-lg">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <Coffee className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800">
            Staff Access Portal
          </CardTitle>
          <p className="text-slate-600 text-sm">
            Enter your staff access code to continue
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleAccessRequest} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="accessCode" className="text-slate-700 font-medium">
                Access Code
              </Label>
              <div className="relative">
                <Input
                  id="accessCode"
                  type={showCode ? "text" : "password"}
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  placeholder="Enter staff access code"
                  className="pr-10 bg-slate-50 border-slate-200 focus:border-blue-400 focus:ring-blue-400"
                  required
                  autoFocus
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-slate-100"
                  onClick={() => setShowCode(!showCode)}
                >
                  {showCode ? (
                    <EyeOff className="w-4 h-4 text-slate-500" />
                  ) : (
                    <Eye className="w-4 h-4 text-slate-500" />
                  )}
                </Button>
              </div>
            </div>
            
            <Button
              type="submit"
              disabled={isLoading || !accessCode.trim()}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2.5 shadow-lg transition-all duration-200"
            >
              {isLoading ? "Verifying..." : "Request Access"}
            </Button>
          </form>
          
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <div className="text-center">
              <p className="text-xs text-slate-500 mb-2">
                Staff members can also scan the QR code located:
              </p>
              <ul className="text-xs text-slate-600 space-y-1">
                <li>• Behind the counter (main register)</li>
                <li>• In the staff break area</li>
                <li>• Manager's office</li>
              </ul>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs text-amber-800 text-center">
                <strong>Need help?</strong> Contact Mohamed at <br/>
                <span className="font-mono">(347) 329-6816</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}