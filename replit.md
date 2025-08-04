# Coffee Pro - Digital Platform

## Overview
Coffee Pro is a comprehensive digital platform designed to celebrate Egyptian coffee culture and heritage through an immersive online experience. The website serves as an informational hub, showcasing the brand's unique blend of traditional Egyptian culinary heritage with modern digital engagement. It aims to highlight the coffee shop's offerings, community involvement, and cultural significance, fostering a connection with customers in NYC and beyond. Key capabilities include rich multimedia content, AI-powered mood-based recommendations for drinks, and a customer loyalty program. The project's ambition is to bridge cultural heritage with modern digital engagement, showcasing authentic Egyptian coffee culture.

## User Preferences
- **Deployment Platform**: Render - User confirmed using Render for production deployment
- **Database**: PostgreSQL via Render's managed service
- **Environment**: Production deployment on Render with blueprint configuration
- **Admin Access**: Direct redirect to login page (no "Access Denied" page) when accessing /admin
- Website should be purely informational (no ordering functionality)
- Professional, modern design maintaining coffee shop color themes
- No background music or audio components
- Clean, accessible UI with smooth animations
- Focus on showcasing Egyptian heritage and authentic coffee culture

## System Architecture
The platform is built with a React.js frontend, utilizing advanced interactive design principles and a mobile-first responsive architecture. Tailwind CSS is employed for responsive styling and a professional, modern aesthetic that aligns with the coffee shop's orange/coral and blue brand colors. Shadcn/UI components and Lucide React icons are used for a consistent and clean user interface.

Core features include:
- **AI-powered Recommendation Module**: A mood-based system suggesting drinks based on user selection.
- **Content Management**: Displays authentic multimedia content, including community photos, menu items, and owner information, focusing on Egyptian coffee heritage.
- **Admin Dashboard**: A password-protected interface for managing marketing contacts, customer messages, franchise applications, and loyalty program QR codes. This includes features for viewing, filtering, and managing submissions.
- **Loyalty Program**: A QR code-based check-in system for customers to earn points, with server-side validation and secure token generation. Admin tools allow for QR code generation and customer search.
- **Franchise Application System**: Manages franchise inquiries with a dedicated section in the admin dashboard for tracking applications.
- **SEO Optimization**: Implemented with meta tags, keywords, schema markup, sitemap.xml, robots.txt, and Open Graph tags for discoverability.
- **Performance Optimization**: Includes lazy loading for images, responsive image rendering, and CSS performance enhancements for faster page loads and lower bandwidth usage.
- **Hidden Staff Access**: A secure `/staff` portal with multiple access codes provides entry to the admin dashboard, replacing visible admin links.
- **Wouter routing** is used for frontend navigation, and the backend is built with Express.js.

## External Dependencies
- **PostgreSQL**: Used as the primary database for storing marketing contacts, customer messages, loyalty program data, franchise applications, and session management.
- **DoorDash**: Integrated for "Order Delivery" buttons, linking directly to the Coffee Pro DoorDash page.
- **Instagram**: Linked for social media presence via the official Coffee Pro Instagram account.
- **TikTok**: Integrated for social media presence.
- **qrcode library**: Used for generating QR codes within the admin dashboard.
- **Google Reviews**: Authentic Google customer reviews are displayed on the Community page, including the overall rating.