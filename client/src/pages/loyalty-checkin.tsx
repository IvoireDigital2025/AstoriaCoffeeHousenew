import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Coffee, Gift, User, Phone, Mail, CheckCircle, MapPin, AlertCircle, Clock, XCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface CheckinResponse {
  message: string;
  customer?: {
    id: number;
    name: string;
    currentPoints: number;
    totalVisits: number;
    totalRewards: number;
  };
  earnedReward: boolean;
  pointsToNextReward: number;
}

export default function LoyaltyCheckin() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [checkinResult, setCheckinResult] = useState<CheckinResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState<'checking' | 'valid' | 'invalid' | 'denied'>('valid');
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [tokenValid, setTokenValid] = useState<boolean | null>(true);
  const [tokenMessage, setTokenMessage] = useState<string>('');
  const [remainingTime, setRemainingTime] = useState<number>(60);
  const [timeExpired, setTimeExpired] = useState<boolean>(false);
  const { toast } = useToast();

  // Coffee Pro store location: 23-33 Astoria Blvd, Astoria, NY 11102
  const STORE_LOCATION = {
    latitude: 40.7709,
    longitude: -73.9207,
    radius: 100 // meters - adjust as needed
  };

  useEffect(() => {
    validateTokenFromUrl();
  }, []);

  useEffect(() => {
    if (tokenValid) {
      const timer = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            setTimeExpired(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [tokenValid]);

  const validateTokenFromUrl = async () => {
    try {
      // Get token from URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      
      if (!token) {
        // No token means direct access - show access denied message
        setTokenValid(false);
        setTokenMessage("QR Code scan required to access check-in. Please scan the QR code to get access.");
        return;
      }

      // If token exists in URL, validate it
      try {
        const response: any = await apiRequest('POST', '/api/qr/validate', { token });
        
        if (response.valid) {
          setTokenValid(true);
          setTokenMessage('QR code verified successfully!');
          
          // Set remaining time based on response
          if (response.permanent) {
            setRemainingTime(60); // 60 seconds to complete check-in for permanent tokens
          } else if (response.remainingTime) {
            setRemainingTime(response.remainingTime);
          }
        } else {
          setTokenValid(false);
          setTokenMessage('Invalid QR code. Please try scanning again.');
        }
      } catch (error: any) {
        console.error('Token validation error:', error);
        setTokenValid(false);
        setTokenMessage('Unable to validate QR code. Please try scanning the QR code again.');
      }
    } catch (error: any) {
      console.error('Token validation error:', error);
      setTokenValid(false);
      setTokenMessage('Unable to generate access token. Please try scanning the QR code again.');
    }
  };

  const checkLocationPermission = () => {
    if (!navigator.geolocation) {
      setLocationStatus('invalid');
      toast({
        title: "Location Required",
        description: "Your device doesn't support location services. Please check in at the store.",
        variant: "destructive",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        
        const distance = calculateDistance(
          latitude, 
          longitude, 
          STORE_LOCATION.latitude, 
          STORE_LOCATION.longitude
        );
        
        if (distance <= STORE_LOCATION.radius) {
          setLocationStatus('valid');
        } else {
          setLocationStatus('invalid');
          toast({
            title: "Location Check Failed",
            description: `You must be within ${STORE_LOCATION.radius}m of Coffee Pro to check in. You're ${Math.round(distance)}m away.`,
            variant: "destructive",
          });
        }
      },
      (error) => {
        console.error('Location error:', error);
        setLocationStatus('denied');
        toast({
          title: "Location Access Denied",
          description: "Please enable location services and reload the page to check in.",
          variant: "destructive",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000
      }
    );
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371000; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  const checkinMutation = useMutation({
    mutationFn: async (data: typeof formData): Promise<CheckinResponse> => {
      const now = new Date();
      const checkinData = {
        ...data,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        localTime: now.toISOString(),
      };
      return await apiRequest("POST", "/api/loyalty/checkin", checkinData);
    },
    onSuccess: (data: CheckinResponse) => {
      setCheckinResult(data);
      toast({
        title: data.earnedReward ? "🎉 Congratulations!" : "✅ Check-in Successful",
        description: data.message,
      });
      // Reset form
      setFormData({ name: "", phone: "", email: "" });
    },
    onError: (error: any) => {
      // Handle recent check-in error (429 status)
      if (error.status === 429) {
        toast({
          title: "Already Checked In!",
          description: error.message || "You've already checked in recently. Please wait before your next visit.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Check-in Failed",
          description: error.message || "Please try again",
          variant: "destructive",
        });
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if time has expired
    if (timeExpired) {
      toast({
        title: "Session Expired",
        description: "Please scan the QR code again to check in.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.name || !formData.phone || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    checkinMutation.mutate(formData);
  };

  const handleStartOver = () => {
    setCheckinResult(null);
    setFormData({ name: "", phone: "", email: "" });
  };

  // Access denied page for invalid tokens
  if (tokenValid === false) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-coffee-cream to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg border-red-200">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <XCircle className="w-16 h-16 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-red-600">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-coffee-medium">{tokenMessage}</p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">
                To check in, you must scan the QR code to access this page.
                The QR code contains a secure token required for check-in.
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-coffee-medium">
                <strong>Visit Coffee Pro:</strong><br />
                23-33 Astoria Blvd, Astoria, NY 11102
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (checkinResult) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-coffee-cream to-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              {checkinResult.earnedReward ? (
                <Gift className="w-16 h-16 text-green-600" />
              ) : (
                <CheckCircle className="w-16 h-16 text-blue-600" />
              )}
            </div>
            <CardTitle className="text-2xl font-bold text-coffee-dark">
              {checkinResult.earnedReward ? "Free Coffee Earned!" : "Thank You!"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-lg text-coffee-medium mb-4">{checkinResult.message}</p>
              
              {checkinResult.customer && (
                <div className="bg-coffee-cream/50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-coffee-medium">Current Points:</span>
                    <span className="font-bold text-coffee-dark">{checkinResult.customer.currentPoints}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-coffee-medium">Total Visits:</span>
                    <span className="font-bold text-coffee-dark">{checkinResult.customer.totalVisits}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-coffee-medium">Total Rewards:</span>
                    <span className="font-bold text-coffee-dark">{checkinResult.customer.totalRewards}</span>
                  </div>
                  {!checkinResult.earnedReward && (
                    <div className="flex justify-between">
                      <span className="text-coffee-medium">Points to Next Reward:</span>
                      <span className="font-bold text-coffee-primary">{checkinResult.pointsToNextReward}</span>
                    </div>
                  )}
                </div>
              )}
              
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm">
                  <strong>For your next visit:</strong><br />
                  Please scan the QR code again to check in.
                </p>
              </div>
            </div>

            {checkinResult.earnedReward && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <p className="text-green-800 font-medium">
                  Please show this screen to the barista to claim your free coffee!
                </p>
              </div>
            )}

            <Button 
              onClick={() => window.location.href = '/'}
              className="w-full bg-coffee-primary hover:bg-coffee-medium text-white"
            >
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-coffee-cream to-white p-4">
      {/* Check-in Form */}
      <div className="flex items-center justify-center">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Coffee className="w-16 h-16 text-coffee-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-coffee-dark">Coffee Pro Loyalty Check-in</CardTitle>
            <p className="text-coffee-medium">Earn 1 point per visit • 5 points = 1 FREE Coffee</p>
            
            {/* Check-in Timer */}
            {tokenValid && !timeExpired && (
              <div className="mt-4 p-3 rounded-lg border-2 border-blue-200 bg-blue-50">
                <div className="flex items-center justify-center space-x-2 text-blue-700">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Time to check in: {Math.floor(remainingTime / 60)}:{(remainingTime % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>
            )}
            
            {/* Time Expired Message */}
            {timeExpired && (
              <div className="mt-4 p-3 rounded-lg border-2 border-red-200 bg-red-50">
                <div className="flex items-center justify-center space-x-2 text-red-700">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Check-in time expired. Please scan the QR code again.
                  </span>
                </div>
              </div>
            )}
            

            
            {/* How It Works */}
            <div className="bg-amber-50 rounded-lg p-4 mt-4 text-left">
              <h4 className="font-bold text-coffee-dark mb-2 text-sm">How Our System Works:</h4>
              <ul className="text-xs text-coffee-medium space-y-1">
                <li>• Each customer has their own account tracked by phone number</li>
                <li>• Your points and visit history are saved automatically</li>
                <li>• Every check-in earns you 1 point toward your next reward</li>
                <li>• Staff can view your total points and visit history</li>
              </ul>
            </div>
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
                    <strong>Returning customer?</strong> We'll recognize you by your phone number and add points to your existing account.
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400 py-3 text-lg font-semibold"
                  disabled={checkinMutation.isPending || !tokenValid || timeExpired}
                >
                  <Coffee className="w-5 h-5 mr-2" />
                  {checkinMutation.isPending ? "Checking in..." : 
                   !tokenValid ? "Invalid Access" :
                   timeExpired ? "Time Expired - Scan Again" : "Check In"}
                </Button>
              </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}