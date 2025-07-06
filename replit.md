# Coffee Pro - Digital Platform

## Project Overview
A comprehensive digital platform celebrating Middle Eastern coffee culture through innovative, interactive technologies. The website offers an immersive user experience that bridges traditional culinary heritage with modern digital engagement.

## Key Features
- React.js frontend with advanced interactive design
- Tailwind CSS for responsive styling
- AI-powered recommendation modules (mood-based)
- Mobile-first responsive architecture
- Rich multimedia content showcasing Middle Eastern coffee traditions
- Customer loyalty program
- AI-powered chatbot integration
- Location finder with multiple NYC locations

## Recent Changes
- ✓ Fixed mood selector UI with modern coffee shop aesthetic
- ✓ Removed ambient soundtrack component (music was problematic)
- ✓ Enhanced visual design with better color schemes and animations
- ✓ Integrated official Coffee Pro logo throughout the site
- ✓ Removed all ordering functionality (informational website only)
- ✓ Added Community section with photo gallery placeholder
- ✓ Updated navigation to include Community page
- ✓ Integrated 11 authentic community photos showing customers with Arabic name cards
- ✓ Created beautiful photo gallery with captions highlighting cultural connections
- ✓ Featured AlUla heritage corner, family moments, and diverse community interactions
- ✓ Implemented comprehensive marketing contact collection system
- ✓ Added newsletter signup forms throughout the website (home, community, contact, loyalty)
- ✓ Created password-protected admin dashboard for viewing and managing marketing contacts
- ✓ Database schema includes email, phone, name collection with source tracking
- ✓ API endpoints for newsletter subscription and contact management
- ✓ Removed locations navigation link (single location: 23-33 Astoria Blvd, Astoria, NY 11102)
- ✓ Created video upload and management system for coffee shop videos
- ✓ Added video upload component with file validation and preview
- ✓ Created video gallery component for displaying uploaded videos
- ✓ Added video management admin page accessible at /admin/videos
- ✓ Fixed database migration issues - ran npm run db:push to create tables
- ✓ Resolved admin authentication system with proper session management
- ✓ Admin password confirmed working: "Coffeeproegypt"
- ✓ Marketing contacts database now functional and collecting data
- ✓ Removed video features from homepage and cleaned up video-related code
- ✓ Removed Coffee Pro HQ overlay sticker from contact page map
- ✓ Created comprehensive admin dashboard with tabbed interface
- ✓ Added customer contact messages tab to admin dashboard
- ✓ Admin can now view both marketing contacts and customer form submissions
- ✓ Contact form submissions stored in database and accessible via admin dashboard
- ✓ Removed Coffee, Tea & Other, and Food category buttons from menu (pastries only)
- ✓ Removed all pricing information from menu items (informational display only)
- ✓ Added "Drinks" button alongside "Pastries" button in menu
- ✓ Added messaging indicating displayed items are samples, not complete inventory
- ✓ Removed all pictures from pastries menu items (text-only display)
- ✓ Fixed database storage - removed all images and prices from pastries in database
- ✓ Cleared all pastry items from database - ready for new uploads
- ✓ Changed "Drinks" button to "Hot Drink" in menu navigation
- ✓ Corrected "Hot Drink" to "Hot Drinks" and added "Cold Drinks" button
- ✓ Updated dynamic messaging to handle three menu categories
- ✓ Added "Sandwiches" category next to "Pastries" in menu navigation
- ✓ Added "Juices" category next to "Cold Drinks" in menu navigation
- ✓ Updated website color scheme to match Coffee Pro logo (orange/coral and blue)
- ✓ Added "New Signature Drinks" showcase section on home page featuring Tiramisu Pro Frappe and Strawfee Clouds with actual photos
- ✓ Removed AI chatbot component completely from the website
- ✓ Changed primary button colors from orange to blue throughout the website


## User Preferences
- Website should be purely informational (no ordering functionality)
- Professional, modern design maintaining coffee shop color themes
- No background music or audio components
- Clean, accessible UI with smooth animations
- Focus on showcasing Saudi Arabian heritage and AlUla inspiration

## Project Architecture
- Frontend: React.js with Wouter routing
- Backend: Express.js with in-memory storage
- Database: PostgreSQL available but using MemStorage for simplicity
- UI: Shadcn/UI components with Tailwind CSS
- Icons: Lucide React icons
- Assets: Stored in attached_assets folder

## Technical Notes
- Located at Astoria Boulevard, Long Island City
- 5-month-old establishment
- 32+ years of cultural heritage
- DoorDash integration mentioned but not implemented (informational only)