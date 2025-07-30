import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coffee, Shield, ArrowRight } from "lucide-react";

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
  requireStaffAccess?: boolean;
}

export default function ProtectedAdminRoute({ 
  children, 
  requireStaffAccess = false 
}: ProtectedAdminRouteProps) {
  const [, setLocation] = useLocation();
  const [hasStaffAccess, setHasStaffAccess] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user came from staff access or has admin session
    const checkAccess = async () => {
      try {
        // First check if they have an active admin session
        const authResponse = await fetch('/api/admin/check', {
          credentials: 'include'
        });

        if (authResponse.ok) {
          const authData = await authResponse.json();
          if (authData.authenticated) {
            setHasStaffAccess(true);
            return;
          }
        }

        // If requiring staff access and no session, check session storage for staff access flag
        if (requireStaffAccess) {
          const staffAccessGranted = sessionStorage.getItem('coffee-pro-staff-access');
          const accessTimestamp = sessionStorage.getItem('coffee-pro-staff-access-time');
          
          if (staffAccessGranted && accessTimestamp) {
            const now = Date.now();
            const accessTime = parseInt(accessTimestamp);
            // Staff access expires after 2 hours for security
            if (now - accessTime < 2 * 60 * 60 * 1000) {
              setHasStaffAccess(true);
              return;
            } else {
              // Clear expired access
              sessionStorage.removeItem('coffee-pro-staff-access');
              sessionStorage.removeItem('coffee-pro-staff-access-time');
            }
          }
          
          setHasStaffAccess(false);
        } else {
          setHasStaffAccess(true);
        }
      } catch (error) {
        console.error('Access check failed:', error);
        setHasStaffAccess(false);
      }
    };

    checkAccess();
  }, [requireStaffAccess]);

  // Show loading while checking access
  if (hasStaffAccess === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Verifying access permissions...</p>
        </div>
      </div>
    );
  }

  // Show access denied if no staff access
  if (!hasStaffAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8 text-center space-y-6">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-full shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <Coffee className="w-10 h-10 text-blue-600" />
            </div>
            
            <div className="space-y-3">
              <h1 className="text-2xl font-bold text-slate-800">Access Restricted</h1>
              <p className="text-slate-600 leading-relaxed">
                This area is for authorized Coffee Pro staff only.
              </p>
              <p className="text-sm text-slate-500">
                Please use the staff access portal or contact management for assistance.
              </p>
            </div>

            <div className="space-y-3 pt-4">
              <Button
                onClick={() => setLocation('/staff')}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 shadow-lg transition-all duration-200"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Go to Staff Access Portal
              </Button>
              
              <Button
                onClick={() => setLocation('/')}
                variant="outline"
                className="w-full border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Return to Homepage
              </Button>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6">
              <p className="text-xs text-amber-800">
                <strong>Staff Members:</strong> Contact Mohamed at <br/>
                <span className="font-mono">(347) 329-6816</span> for access codes
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render children if access is granted
  return <>{children}</>;
}