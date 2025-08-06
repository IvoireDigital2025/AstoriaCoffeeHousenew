// SEO utilities for dynamic meta descriptions
export function updateMetaDescription(description: string) {
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', description);
  } else {
    const meta = document.createElement('meta');
    meta.name = 'description';
    meta.content = description;
    document.getElementsByTagName('head')[0].appendChild(meta);
  }
}

export function updatePageTitle(title: string) {
  document.title = title;
}

// Page-specific SEO data
export const seoData = {
  home: {
    title: "Coffee Pro - Best Coffee Shop in Astoria NYC | Egyptian Coffee Queens NY",
    description: "Coffee Pro: Top-rated coffee shop in Astoria, NYC. Authentic Egyptian coffee, fresh pastries, Dubai chocolate. Located on Astoria Blvd, Queens NY. Open 7 days."
  },
  menu: {
    title: "Menu - Coffee Pro Astoria NYC | Egyptian Coffee Shop Queens NY",
    description: "Coffee shop menu in Astoria NYC: Premium Egyptian coffee, fresh pastries, sandwiches, Dubai chocolate. Best coffee shop in Queens NY on Astoria Blvd."
  },
  about: {
    title: "About Coffee Pro - Authentic Egyptian Coffee Shop Astoria NYC",
    description: "Family-owned Egyptian coffee shop in Astoria NYC. Authentic coffee traditions on Astoria Blvd, Queens NY. Best coffee shop experience in NYC since 2024."
  },
  contact: {
    title: "Visit Coffee Pro Astoria NYC | 23-33 Astoria Blvd Queens NY",
    description: "Coffee shop Astoria NYC: 23-33 Astoria Blvd, Queens NY 11102. Call (347) 329-6816. Open daily. Best Egyptian coffee shop near Astoria subway."
  },
  community: {
    title: "Community - Coffee Pro Astoria NYC | Local Coffee Shop Culture",
    description: "Coffee Pro Astoria NYC community: Local coffee culture, customer events, photos from our Astoria Blvd location. Join the best coffee shop in Queens NY."
  },
  loyalty: {
    title: "Loyalty Program - Coffee Pro Astoria NYC | Free Coffee Rewards",
    description: "Coffee Pro Astoria NYC loyalty program: Earn points at our Astoria Blvd location. Free coffee rewards for regular customers. Best coffee shop perks in Queens."
  },
  franchise: {
    title: "Franchise Opportunities - Coffee Pro | Start Your Egyptian Coffee Shop",
    description: "Explore Coffee Pro franchise opportunities. Bring authentic Egyptian coffee culture to your community with our proven business model and support."
  },
  locations: {
    title: "Coffee Pro Locations | Best Coffee Shop Astoria NYC Queens",
    description: "Coffee Pro locations: Main location 23-33 Astoria Blvd, NYC. Best coffee shop in Astoria Queens. Egyptian coffee near Astoria subway station."
  },
  'mood-selector': {
    title: "Mood Coffee Selector - Coffee Pro Astoria NYC | AI Coffee Recommendations",
    description: "Discover your perfect coffee at Astoria NYC's Coffee Pro. AI-powered recommendations for Egyptian coffee drinks based on your mood. Visit us on Astoria Blvd."
  },
  'loyalty-checkin': {
    title: "Check-in - Coffee Pro Astoria NYC | Loyalty Points & Rewards",
    description: "Check-in at Coffee Pro Astoria NYC: Earn loyalty points at 23-33 Astoria Blvd. Track rewards at Queens' best Egyptian coffee shop."
  }
};