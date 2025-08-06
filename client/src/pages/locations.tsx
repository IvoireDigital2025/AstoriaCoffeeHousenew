import { useState, useEffect } from "react";
import { updateMetaDescription, updatePageTitle, seoData } from "@/utils/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Clock, Navigation, Star } from "lucide-react";

interface Location {
  id: number;
  name: string;
  address: string;
  neighborhood: string;
  phone: string;
  hours: {
    weekdays: string;
    weekends: string;
  };
  features: string[];
  image: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export default function Locations() {
  useEffect(() => {
    updatePageTitle(seoData.locations.title);
    updateMetaDescription(seoData.locations.description);
  }, []);

  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const locations: Location[] = [
    {
      id: 1,
      name: "Coffee Pro Headquarters",
      address: "23-33 Astoria Blvd, Astoria, NY 11102",
      neighborhood: "Astoria, Queens",
      phone: "(718) 555-BREW",
      hours: {
        weekdays: "6:00 AM - 8:00 PM",
        weekends: "7:00 AM - 9:00 PM"
      },
      features: ["Corporate HQ", "Free WiFi", "Outdoor Seating", "Meeting Rooms"],
      image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      coordinates: { lat: 40.7648, lng: -73.9808 }
    },
    {
      id: 2,
      name: "Coffee Pro Manhattan",
      address: "456 5th Avenue, New York, NY 10018",
      neighborhood: "Midtown Manhattan",
      phone: "(212) 555-BREW",
      hours: {
        weekdays: "5:30 AM - 9:00 PM",
        weekends: "6:30 AM - 9:30 PM"
      },
      features: ["Express Counter", "Mobile Order Pickup", "Catering Services"],
      image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      coordinates: { lat: 40.7549, lng: -73.9840 }
    },
    {
      id: 3,
      name: "Coffee Pro Brooklyn Heights",
      address: "789 Montague Street, Brooklyn, NY 11201",
      neighborhood: "Brooklyn Heights",
      phone: "(718) 555-BREW",
      hours: {
        weekdays: "6:00 AM - 8:30 PM",
        weekends: "7:00 AM - 9:00 PM"
      },
      features: ["Roastery Tour", "Coffee Classes", "Pet Friendly", "Local Art"],
      image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      coordinates: { lat: 40.6962, lng: -73.9969 }
    },
    {
      id: 4,
      name: "Coffee Pro Upper East Side",
      address: "321 Lexington Avenue, New York, NY 10016",
      neighborhood: "Upper East Side",
      phone: "(212) 555-BREW",
      hours: {
        weekdays: "6:00 AM - 8:00 PM",
        weekends: "7:30 AM - 8:30 PM"
      },
      features: ["Quiet Study Area", "Premium Beans", "Loyalty Lounge"],
      image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      coordinates: { lat: 40.7589, lng: -73.9851 }
    },
    {
      id: 5,
      name: "Coffee Pro Greenwich Village",
      address: "654 Bleecker Street, New York, NY 10014",
      neighborhood: "Greenwich Village",
      phone: "(212) 555-BREW",
      hours: {
        weekdays: "6:30 AM - 10:00 PM",
        weekends: "7:00 AM - 11:00 PM"
      },
      features: ["Live Music", "Late Night Hours", "Artisan Pastries", "Book Exchange"],
      image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      coordinates: { lat: 40.7282, lng: -74.0776 }
    },
    {
      id: 6,
      name: "Coffee Pro Long Island City",
      address: "987 Vernon Boulevard, Long Island City, NY 11101",
      neighborhood: "Long Island City, Queens",
      phone: "(718) 555-BREW",
      hours: {
        weekdays: "6:00 AM - 8:00 PM",
        weekends: "7:00 AM - 9:00 PM"
      },
      features: ["Skyline Views", "Large Groups Welcome", "Corporate Catering"],
      image: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      coordinates: { lat: 40.7505, lng: -73.9934 }
    }
  ];

  const handleGetDirections = (location: Location) => {
    const query = encodeURIComponent(location.address);
    window.open(`https://maps.google.com/maps?q=${query}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-coffee-cream py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-playfair font-bold text-coffee-dark mb-4">
            Our Locations
          </h1>
          <p className="text-xl text-coffee-medium max-w-3xl mx-auto">
            Find your nearest Coffee Pro location across New York City
          </p>
        </div>

        {/* Locations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {locations.map((location) => (
            <Card key={location.id} className="bg-white shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                <img
                  src={location.image}
                  alt={location.name}
                  className="w-full h-48 object-cover"
                />
                <Badge className="absolute top-3 right-3 bg-coffee-accent text-white">
                  {location.neighborhood}
                </Badge>
              </div>
              
              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-playfair font-semibold text-coffee-dark">
                  {location.name}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-coffee-accent mt-0.5 flex-shrink-0" />
                  <p className="text-coffee-medium text-sm">{location.address}</p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-coffee-accent mt-0.5 flex-shrink-0" />
                  <p className="text-coffee-medium text-sm">{location.phone}</p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-coffee-accent mt-0.5 flex-shrink-0" />
                  <div className="text-coffee-medium text-sm">
                    <p>Mon-Fri: {location.hours.weekdays}</p>
                    <p>Sat-Sun: {location.hours.weekends}</p>
                  </div>
                </div>
                
                {/* Features */}
                <div className="pt-2">
                  <div className="flex flex-wrap gap-1 mb-4">
                    {location.features.slice(0, 3).map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-coffee-secondary text-coffee-dark">
                        {feature}
                      </Badge>
                    ))}
                    {location.features.length > 3 && (
                      <Badge variant="secondary" className="text-xs bg-coffee-secondary text-coffee-dark">
                        +{location.features.length - 3} more
                      </Badge>
                    )}
                  </div>
                  
                  <Button
                    onClick={() => handleGetDirections(location)}
                    className="w-full bg-coffee-primary hover:bg-coffee-medium text-white"
                    size="sm"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Coming Soon Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-playfair font-bold text-coffee-dark mb-6">
            Coming Soon
          </h2>
          <p className="text-lg text-coffee-medium mb-8">
            We're expanding! New Coffee Pro locations opening soon in:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { area: "Williamsburg, Brooklyn", date: "Spring 2024" },
              { area: "Harlem, Manhattan", date: "Summer 2024" },
              { area: "Forest Hills, Queens", date: "Fall 2024" }
            ].map((upcoming, index) => (
              <Card key={index} className="bg-white border-2 border-dashed border-coffee-accent">
                <CardContent className="pt-6 text-center">
                  <Star className="w-8 h-8 text-coffee-accent mx-auto mb-3" />
                  <h3 className="font-playfair font-semibold text-coffee-dark mb-2">
                    {upcoming.area}
                  </h3>
                  <p className="text-coffee-medium text-sm">
                    Opening {upcoming.date}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Corporate Info */}
        <div className="mt-20 bg-white rounded-xl p-8 shadow-lg">
          <div className="text-center">
            <h3 className="text-2xl font-playfair font-bold text-coffee-dark mb-4">
              Corporate Partnerships & Catering
            </h3>
            <p className="text-coffee-medium mb-6 max-w-3xl mx-auto">
              Looking to bring Coffee Pro to your office or event? We offer corporate partnerships, 
              bulk catering services, and custom coffee solutions for businesses across New York City.
            </p>
            <Button className="bg-coffee-secondary hover:bg-blue-600 text-white px-8 py-3">
              Contact Corporate Sales
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}