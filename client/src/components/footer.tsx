import { Link } from "wouter";
import { Instagram, Facebook, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-coffee-dark text-coffee-cream py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="mb-4">
              <img 
                src="/attached_assets/01_1749671523922.webp"
                alt="Coffee Pro - Coffee & Bakery Logo"
                className="h-16 w-auto mb-3"
              />
            </div>
            <p className="text-coffee-secondary mb-4">
              Astoria's premier coffee destination, serving exceptional coffee and building community one cup at a time.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/coffeeprocorp/?hl=en" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-coffee-secondary hover:text-coffee-accent transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-coffee-secondary hover:text-coffee-accent transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-coffee-secondary hover:text-coffee-accent transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/menu" 
                  className="text-coffee-secondary hover:text-coffee-accent transition-colors"
                >
                  Menu
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-coffee-secondary hover:text-coffee-accent transition-colors"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link 
                  to="/loyalty" 
                  className="text-coffee-secondary hover:text-coffee-accent transition-colors"
                >
                  Loyalty Program
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-coffee-secondary hover:text-coffee-accent transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-2 text-coffee-secondary">
              <p>Coffee Pro</p>
              <p>23-33 Astoria Blvd, Astoria, NY 11102</p>
              <p>(347) 329-6816</p>
              <p>Coffeepro23@gmail.com</p>
            </div>
          </div>
        </div>
        <div className="border-t border-coffee-medium mt-8 pt-8 text-center">
          <p className="text-coffee-secondary">
            &copy; 2024 Coffee Pro. All rights reserved. | Privacy Policy | Terms of Service
          </p>
          <div className="mt-2">
            <Link 
              href="/admin/contacts" 
              className="text-coffee-secondary hover:text-coffee-accent transition-colors text-xs"
            >
              Admin Access
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
