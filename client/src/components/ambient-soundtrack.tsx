import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Music, Coffee } from "lucide-react";

export default function AmbientSoundtrack() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  // Hide welcome message after 6 seconds
  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => setShowWelcome(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  return (
    <>
      {/* Welcome Notification */}
      {showWelcome && (
        <div className="fixed top-20 right-6 z-50 max-w-sm">
          <div className="bg-coffee-cream/95 backdrop-blur-sm border-2 border-coffee-accent/30 rounded-lg p-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-2">
              <Coffee className="w-5 h-5 text-coffee-accent" />
              <h4 className="font-semibold text-coffee-dark">Welcome to Coffee Pro</h4>
            </div>
            <p className="text-sm text-coffee-medium mb-3">
              Experience our authentic Middle Eastern coffee shop atmosphere. Immerse yourself in the Coffee Pro journey.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-coffee-medium">Authentic AlUla-inspired ambience</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowWelcome(false)}
                className="text-coffee-medium hover:text-coffee-dark p-1"
              >
                ×
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Ambience Indicator */}
      <div className="fixed bottom-6 left-6 z-50">
        <Button
          onClick={() => setIsVisible(!isVisible)}
          className={`group relative overflow-hidden bg-gradient-to-r from-coffee-primary to-amber-600 hover:from-coffee-dark hover:to-amber-700 text-white p-4 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 border-2 border-amber-400/30 ${
            showWelcome ? 'animate-bounce' : ''
          }`}
        >
          <Music className="w-6 h-6 group-hover:animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-ping rounded-full"></div>
        </Button>
      </div>

      {/* Ambience Info Panel */}
      {isVisible && (
        <div className="fixed bottom-24 left-6 z-40">
          <Card className="w-64 bg-coffee-cream/95 backdrop-blur-sm border-2 border-coffee-accent/30 shadow-2xl">
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold bg-gradient-to-r from-coffee-primary to-amber-600 bg-clip-text text-transparent">
                  Coffee Pro Atmosphere
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsVisible(false)}
                  className="text-coffee-dark hover:text-coffee-primary"
                >
                  ×
                </Button>
              </div>

              {/* Ambience Info */}
              <div className="mb-4">
                <div className="bg-coffee-cream/50 rounded-lg p-3 border border-coffee-accent/20">
                  <h4 className="font-semibold text-coffee-dark mb-1">Arabian Coffee House</h4>
                  <p className="text-sm text-coffee-medium">Immersive Middle Eastern coffee shop experience</p>
                </div>
              </div>

              {/* Visual Ambience Indicator */}
              <div className="mb-4">
                <div className="flex items-center justify-center space-x-2 p-4 bg-coffee-cream/30 rounded-lg">
                  <div className="w-2 h-8 bg-gradient-to-t from-coffee-primary to-amber-500 rounded animate-pulse"></div>
                  <div className="w-2 h-6 bg-gradient-to-t from-coffee-accent to-amber-400 rounded animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-10 bg-gradient-to-t from-coffee-primary to-amber-500 rounded animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  <div className="w-2 h-4 bg-gradient-to-t from-coffee-accent to-amber-400 rounded animate-pulse" style={{animationDelay: '0.6s'}}></div>
                  <div className="w-2 h-7 bg-gradient-to-t from-coffee-primary to-amber-500 rounded animate-pulse" style={{animationDelay: '0.8s'}}></div>
                </div>
                <p className="text-xs text-coffee-medium text-center mt-2">
                  Ambient atmosphere active
                </p>
              </div>

              {/* Note */}
              <div className="p-3 bg-coffee-cream/30 rounded-lg border border-coffee-accent/20">
                <p className="text-xs text-coffee-medium text-center">
                  Authentic Middle Eastern ambience enhances your Coffee Pro experience
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}