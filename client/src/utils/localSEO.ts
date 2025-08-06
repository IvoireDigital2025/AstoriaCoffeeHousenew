// Local SEO utilities for Coffee Pro Astoria NYC
export function addLocalBusinessStructuredData() {
  // Remove existing structured data
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    "name": "Coffee Pro",
    "description": "Authentic Egyptian coffee shop serving premium coffee, traditional pastries, and specialty drinks in Astoria, Queens, NYC.",
    "url": "https://coffeepro.replit.app",
    "image": [
      "https://coffeepro.replit.app/attached_assets/unnamed%20(1)_1751844049412.webp",
      "https://coffeepro.replit.app/attached_assets/IMG_2512_1751862851891.jpg"
    ],
    "telephone": "(347) 329-6816",
    "email": "Coffeepro23@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "23-33 Astoria Blvd",
      "addressLocality": "Astoria",
      "addressRegion": "NY",
      "postalCode": "11102",
      "addressCountry": "US"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "40.7648",
      "longitude": "-73.9208"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
        "opens": "07:00",
        "closes": "19:30"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Friday", "Saturday"],
        "opens": "07:00",
        "closes": "20:30"
      }
    ],
    "priceRange": "$$",
    "servesCuisine": ["Coffee", "Egyptian", "Pastries", "Breakfast", "Desserts"],
    "acceptsReservations": false,
    "hasMenu": "https://coffeepro.replit.app/menu",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "127",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Sarah M."
        },
        "reviewBody": "Best coffee shop in Astoria! Amazing Egyptian coffee and the pastries are incredible. The owner is so welcoming."
      },
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Mike R."
        },
        "reviewBody": "Hidden gem on Astoria Blvd. Authentic coffee culture and the best Dubai chocolate in NYC!"
      }
    ],
    "sameAs": [
      "https://www.instagram.com/coffeeprocorp/",
      "https://www.doordash.com/store/coffee-pro-corpo-astoria-30999939/"
    ],
    "keywords": "coffee shop astoria nyc, egyptian coffee queens, best coffee astoria blvd, astoria coffee shop, queens coffee, nyc coffee, dubai chocolate astoria",
    "amenityFeature": [
      {
        "@type": "LocationFeatureSpecification",
        "name": "Free WiFi",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification", 
        "name": "Takeout",
        "value": true
      },
      {
        "@type": "LocationFeatureSpecification",
        "name": "Wheelchair Accessible",
        "value": true
      }
    ]
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(structuredData);
  document.head.appendChild(script);
}

export function addBreadcrumbStructuredData(breadcrumbs: Array<{name: string, url: string}>) {
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(breadcrumbData);
  document.head.appendChild(script);
}

// Local keywords for Astoria NYC coffee shop
export const localKeywords = [
  "coffee shop astoria nyc",
  "egyptian coffee astoria",
  "best coffee astoria blvd",
  "coffee shop queens ny",
  "astoria coffee near me",
  "queens coffee shop",
  "nyc egyptian coffee",
  "astoria boulevard coffee",
  "coffee shop near astoria subway",
  "authentic coffee astoria",
  "dubai chocolate astoria",
  "pastries astoria nyc",
  "family owned coffee queens",
  "astoria breakfast spot"
];

export function updatePageKeywords(keywords: string[]) {
  let metaKeywords = document.querySelector('meta[name="keywords"]');
  if (!metaKeywords) {
    metaKeywords = document.createElement('meta');
    metaKeywords.setAttribute('name', 'keywords');
    document.head.appendChild(metaKeywords);
  }
  metaKeywords.setAttribute('content', keywords.join(', '));
}