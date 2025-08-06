import { useEffect } from 'react';

// Local SEO component for Astoria NYC coffee shop
export function LocalSEO() {
  useEffect(() => {
    // Add local business hours schema
    const hoursSchema = {
      "@context": "https://schema.org",
      "@type": "OpeningHoursSpecification",
      "opens": "07:00",
      "closes": "19:30",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Sunday"],
      "validFrom": "2024-01-01",
      "validThrough": "2024-12-31"
    };

    // Add location-specific meta tags
    const locationMeta = document.createElement('meta');
    locationMeta.name = 'geo.region';
    locationMeta.content = 'US-NY';
    document.head.appendChild(locationMeta);

    const cityMeta = document.createElement('meta');
    cityMeta.name = 'geo.placename';
    cityMeta.content = 'Astoria, Queens, New York';
    document.head.appendChild(cityMeta);

    const coordMeta = document.createElement('meta');
    coordMeta.name = 'geo.position';
    coordMeta.content = '40.7648;-73.9208';
    document.head.appendChild(coordMeta);

    // Add local business keywords
    const localKeywords = document.createElement('meta');
    localKeywords.name = 'keywords';
    localKeywords.content = 'coffee shop astoria nyc, egyptian coffee astoria, best coffee astoria blvd, coffee shop queens ny, astoria coffee near me, queens coffee shop, nyc egyptian coffee, astoria boulevard coffee, coffee shop near astoria subway, authentic coffee astoria, dubai chocolate astoria, pastries astoria nyc';
    document.head.appendChild(localKeywords);

    return () => {
      // Cleanup meta tags on unmount
      document.head.removeChild(locationMeta);
      document.head.removeChild(cityMeta);
      document.head.removeChild(coordMeta);
      document.head.removeChild(localKeywords);
    };
  }, []);

  return null; // This component doesn't render anything visible
}

// Astoria NYC specific content suggestions
export const astoriaContent = {
  nearbyLandmarks: [
    "Near Astoria Park",
    "Close to Astoria-Ditmars Blvd subway",
    "Walking distance from Astoria Boulevard",
    "Minutes from Steinway Street",
    "Convenient to LGA Airport area"
  ],
  localCommunity: [
    "Popular with Astoria locals",
    "Favorite of Queens residents", 
    "Community gathering spot in Astoria",
    "Supporting local Astoria businesses",
    "Part of Astoria's coffee culture"
  ],
  transportation: [
    "Near N, W subway lines",
    "Bus routes Q19, Q102, Q103",
    "Easy parking on Astoria Blvd",
    "Walkable from Astoria Heights",
    "Accessible from Manhattan"
  ]
};