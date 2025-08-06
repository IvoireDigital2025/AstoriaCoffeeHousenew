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
    title: "Coffee Pro - Best Coffee Shop in Astoria, NY | Egyptian Coffee & Pastries",
    description: "Coffee Pro Astoria serving premium coffee, traditional pastries, and Dubai chocolate. Open 7 days a week. Best coffee shop in Queens, NY."
  },
  menu: {
    title: "Menu - Coffee Pro Astoria | Specialty Coffee, Pastries & Egyptian Treats",
    description: "Explore our menu of premium coffee, fresh pastries, sandwiches, and traditional Egyptian treats. Hot drinks, cold beverages, and specialty desserts available daily."
  },
  about: {
    title: "About Coffee Pro - Egyptian Coffee Culture in Astoria, Queens NY",
    description: "Learn about Coffee Pro's mission to bring authentic Egyptian coffee traditions to Astoria. Family-owned coffee shop celebrating cultural heritage through premium coffee and hospitality."
  },
  contact: {
    title: "Contact Coffee Pro Astoria | Location, Hours & Get in Touch",
    description: "Visit Coffee Pro at 23-33 Astoria Blvd, Queens NY. Open 7 days a week. Call (347) 329-6816 for orders, catering, or general inquiries."
  },
  community: {
    title: "Community - Coffee Pro Astoria | Local Coffee Culture & Events",
    description: "Join the Coffee Pro community in Astoria. See photos from local customers, community events, and authentic moments from our Egyptian coffee shop."
  },
  loyalty: {
    title: "Loyalty Program - Coffee Pro | Earn Points & Free Coffee Rewards",
    description: "Join Coffee Pro loyalty program in Astoria. Earn points with every visit and get free coffee rewards. Simple check-in system for regular customers."
  },
  franchise: {
    title: "Franchise Opportunities - Coffee Pro | Start Your Egyptian Coffee Shop",
    description: "Explore Coffee Pro franchise opportunities. Bring authentic Egyptian coffee culture to your community with our proven business model and support."
  },
  locations: {
    title: "Locations - Coffee Pro | Find Your Nearest Egyptian Coffee Shop",
    description: "Find Coffee Pro locations near you. Currently serving Astoria, Queens with plans for expansion. Premium coffee and Egyptian treats across NYC."
  },
  'mood-selector': {
    title: "Mood Coffee Selector - Coffee Pro | AI-Powered Drink Recommendations",
    description: "Discover your perfect coffee based on your mood. Our AI-powered recommendation system suggests drinks that match how you're feeling today."
  },
  'loyalty-checkin': {
    title: "Check-in - Coffee Pro Loyalty Program | Earn Points for Your Visit",
    description: "Check in to Coffee Pro loyalty program during your visit. Earn points and track your rewards at our Astoria location."
  }
};