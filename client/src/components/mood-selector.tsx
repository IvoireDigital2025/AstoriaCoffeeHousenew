import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coffee, ArrowLeft, RefreshCw, Sparkles, Heart, Brain, Zap, Smile } from "lucide-react";

interface Mood {
  emoji: string;
  name: string;
  description: string;
  recommendations: {
    name: string;
    description: string;
    reason: string;
  }[];
}

const moods: Mood[] = [
  {
    emoji: "😊",
    name: "Happy",
    description: "Cheerful and optimistic",
    recommendations: [
      {
        name: "Tiramisu Pro Frappe",
        description: "Luxurious coffee frappe with mascarpone flavors and chocolate garnish. A delightful treat that matches your joyful mood perfectly.",
        reason: "Sweet, indulgent flavors enhance happiness and create a celebratory coffee experience"
      },
      {
        name: "Rose Water Cappuccino",
        description: "Classic cappuccino enhanced with delicate rose water. An elegant and uplifting drink with floral notes that brighten your day.",
        reason: "Aromatic rose water creates a cheerful, sophisticated drinking experience that complements your positive energy"
      }
    ]
  },
  {
    emoji: "😴",
    name: "Tired",
    description: "Need an energy boost",
    recommendations: [
      {
        name: "Cold Brew",
        description: "Smooth, bold cold brew coffee served over ice. Perfect for when you need a strong caffeine boost without the heat.",
        reason: "High caffeine content provides long-lasting energy boost to combat fatigue"
      },
      {
        name: "Pro Frappe",
        description: "Our signature iced coffee blend with rich espresso, creamy texture, and energizing taste. A refreshing pick-me-up drink.",
        reason: "Combines strong coffee with refreshing cold temperature for instant alertness"
      }
    ]
  },
  {
    emoji: "😌",
    name: "Relaxed",
    description: "Calm and peaceful",
    recommendations: [
      {
        name: "Pistachio Iced Latte",
        description: "Iced latte with authentic Middle Eastern pistachio syrup. A comforting blend perfect for peaceful moments and gentle indulgence.",
        reason: "Sweet, nutty flavors complement a calm state of mind and enhance relaxation"
      },
      {
        name: "Date Syrup Macchiato",
        description: "Espresso macchiato sweetened with natural date syrup. A unique blend that promotes tranquility and well-being with natural sweetness.",
        reason: "Gentle coffee with natural date syrup provides comforting sweetness perfect for peaceful moments"
      }
    ]
  },
  {
    emoji: "🤔",
    name: "Focused",
    description: "Need to concentrate",
    recommendations: [
      {
        name: "Arabic Coffee (Qahwa)",
        description: "Traditional Egyptian coffee with cardamom and saffron. A pure, concentrated coffee experience that enhances mental clarity and focus.",
        reason: "Strong, authentic coffee with aromatic spices provides sustained concentration without distractions"
      },
      {
        name: "Turkish Coffee",
        description: "Finely ground coffee beans prepared in traditional Turkish style. Rich, intense flavor that sharpens mental alertness.",
        reason: "Concentrated coffee preparation delivers focused energy and enhances cognitive performance"
      }
    ]
  },
  {
    emoji: "🥶",
    name: "Cold",
    description: "Want something warm",
    recommendations: [
      {
        name: "Cardamom Latte",
        description: "Espresso with steamed milk and aromatic cardamom spice. A warming, comforting drink with Middle Eastern spices that heat you from within.",
        reason: "Hot, spiced latte provides immediate warmth and comfort on cold days"
      },
      {
        name: "Egyptian Mint Tea",
        description: "Traditional Atay with fresh mint leaves and sugar. A hot, soothing tea that warms your body and refreshes your spirit.",
        reason: "Hot tea with warming spices provides gentle heat and comfort during cold weather"
      }
    ]
  },
  {
    emoji: "🔥",
    name: "Energetic",
    description: "High energy boost",
    recommendations: [
      {
        name: "Saffron Cold Brew",
        description: "Cold brew coffee infused with precious saffron threads. A vibrant, energizing drink that matches your dynamic spirit.",
        reason: "Bold cold brew with exotic saffron provides sustained energy perfect for high-intensity activities"
      },
      {
        name: "Orange Blossom Americano",
        description: "Classic Americano with a hint of orange blossom water. Pure energy in its most concentrated form with aromatic floral notes.",
        reason: "Strong coffee with uplifting orange blossom provides immediate energy boost perfect for high-intensity activities"
      }
    ]
  },

];

export default function MoodSelector() {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood);
    setShowRecommendations(true);
  };

  const handleReset = () => {
    setSelectedMood(null);
    setShowRecommendations(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-cream via-amber-50 to-coffee-cream relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full border-2 border-coffee-primary animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 rounded-full border-2 border-amber-600 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-40 h-40 rounded-full border border-coffee-accent animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/3 w-28 h-28 rounded-full border border-coffee-medium animate-pulse"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto p-6">
        <Card className="bg-white/95 backdrop-blur-sm border border-coffee-accent/20 shadow-xl rounded-2xl">
          <CardHeader className="text-center pb-8 bg-gradient-to-r from-coffee-primary/5 to-amber-100/30 rounded-t-2xl">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="p-3 bg-coffee-primary/10 rounded-full">
                <Coffee className="w-8 h-8 text-coffee-primary" />
              </div>
              <CardTitle className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-coffee-primary via-amber-700 to-coffee-accent bg-clip-text text-transparent">
                Mood-Based Recommendations
              </CardTitle>
              <div className="p-3 bg-amber-100 rounded-full">
                <Sparkles className="w-8 h-8 text-amber-600" />
              </div>
            </div>
            <p className="text-sm sm:text-xl text-coffee-dark/80 font-light max-w-2xl mx-auto">
              Choose your current mood to discover the perfect Coffee Pro experience tailored just for you
            </p>
            <div className="mt-6 h-1 w-32 bg-gradient-to-r from-coffee-primary to-amber-500 rounded-full mx-auto"></div>
          </CardHeader>
          
          <CardContent className="p-8">
            {!showRecommendations ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {moods.map((mood) => (
                  <Button
                    key={mood.name}
                    variant="outline"
                    className="group h-auto p-3 sm:p-4 flex flex-col items-center gap-2 sm:gap-3 bg-gradient-to-b from-white via-coffee-cream/20 to-coffee-cream/40 border-2 border-coffee-accent/30 hover:border-coffee-secondary/60 hover:shadow-2xl hover:shadow-coffee-secondary/20 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 rounded-2xl h-[120px] sm:h-[140px] touch-manipulation"
                    onClick={() => handleMoodSelect(mood)}
                  >
                    <div className="relative">
                      <span className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform duration-300 filter drop-shadow-lg">
                        {mood.emoji}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-coffee-secondary/30 to-amber-400/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="text-center flex-1 flex flex-col justify-center px-1">
                      <h3 className="text-xs sm:text-sm font-playfair font-bold text-coffee-dark group-hover:text-coffee-secondary transition-colors duration-300 mb-1 leading-tight">
                        {mood.name}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-coffee-medium group-hover:text-coffee-dark transition-colors duration-300 leading-tight px-1 text-center mood-text-clamp mood-card-text">
                        {mood.description}
                      </p>
                    </div>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="space-y-8">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <span className="text-4xl">{selectedMood?.emoji}</span>
                    <h2 className="text-3xl font-bold text-coffee-dark">
                      Perfect for when you're feeling {selectedMood?.name.toLowerCase()}
                    </h2>
                  </div>
                  <p className="text-lg text-coffee-medium">
                    {selectedMood?.description}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {selectedMood?.recommendations.map((rec, index) => (
                    <Card key={index} className="bg-gradient-to-br from-white via-coffee-cream/20 to-coffee-cream/40 border-2 border-coffee-accent/30 hover:border-coffee-secondary/50 hover:shadow-2xl hover:shadow-coffee-secondary/20 transition-all duration-300 rounded-2xl overflow-hidden transform hover:scale-105 hover:-translate-y-1">
                      <CardContent className="p-8">
                        <div className="mb-6">
                          <h4 className="text-2xl font-playfair font-bold text-coffee-dark">
                            {rec.name}
                          </h4>
                        </div>
                        <p className="text-coffee-medium mb-6 leading-relaxed text-lg">
                          {rec.description}
                        </p>
                        
                        <div className="bg-gradient-to-r from-coffee-cream/60 to-coffee-cream/40 p-5 rounded-xl border border-coffee-accent/30">
                          <div className="flex items-start gap-3">
                            <Heart className="w-5 h-5 text-coffee-secondary mt-1 flex-shrink-0" />
                            <p className="text-coffee-dark leading-relaxed italic">
                              "{rec.reason}"
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="bg-white border-2 border-coffee-accent/30 text-coffee-dark hover:bg-coffee-cream/50 hover:border-coffee-primary/50 px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Try Another Mood
                  </Button>
                  
                  <Button 
                    onClick={handleReset}
                    className="bg-gradient-to-r from-coffee-primary to-amber-600 hover:from-coffee-dark hover:to-amber-700 text-white px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Get New Recommendations
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}