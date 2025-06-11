import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coffee, Sparkles, RefreshCw, ArrowLeft, Heart, Zap, Brain } from "lucide-react";

interface Mood {
  emoji: string;
  name: string;
  description: string;
  recommendations: {
    name: string;
    description: string;
    reason: string;
    price: string;
  }[];
}

const moods: Mood[] = [
  {
    emoji: "😴",
    name: "Sleepy",
    description: "Need an energy boost",
    recommendations: [
      {
        name: "Arabic Coffee (Qahwa)",
        description: "Traditional Saudi Arabian coffee with cardamom and saffron",
        reason: "Strong caffeine with aromatic spices to awaken your senses",
        price: "$4.25"
      },
      {
        name: "Double Espresso",
        description: "Rich, bold double shot of premium espresso",
        reason: "Maximum caffeine for instant energy",
        price: "$3.50"
      }
    ]
  },
  {
    emoji: "😰",
    name: "Stressed",
    description: "Looking for comfort and calm",
    recommendations: [
      {
        name: "Atay (Moroccan Mint Tea)",
        description: "Traditional Moroccan green tea with fresh mint and sugar",
        reason: "Mint naturally soothes stress and promotes relaxation",
        price: "$3.50"
      },
      {
        name: "Vanilla Latte",
        description: "Smooth espresso with steamed milk and vanilla",
        reason: "Comforting vanilla helps reduce anxiety",
        price: "$4.75"
      }
    ]
  },
  {
    emoji: "🤗",
    name: "Social",
    description: "Ready to connect with others",
    recommendations: [
      {
        name: "Moroccan Spiced Coffee",
        description: "Rich coffee blend with cinnamon, ginger, and Moroccan spices",
        reason: "Perfect conversation starter with exotic flavors",
        price: "$4.75"
      },
      {
        name: "Cappuccino",
        description: "Espresso with steamed milk foam art",
        reason: "Classic social coffee perfect for sharing moments",
        price: "$4.25"
      }
    ]
  },
  {
    emoji: "🏃‍♂️",
    name: "Active",
    description: "Pre or post workout energy",
    recommendations: [
      {
        name: "Cold Brew",
        description: "Smooth, less acidic coffee brewed cold for 12 hours",
        reason: "Easy on the stomach with sustained energy release",
        price: "$3.75"
      },
      {
        name: "Karak Tea",
        description: "Saudi-style spiced tea with cardamom, cinnamon, and milk",
        reason: "Energizing spices support active lifestyle",
        price: "$3.75"
      }
    ]
  },
  {
    emoji: "🧘‍♀️",
    name: "Mindful",
    description: "Seeking balance and focus",
    recommendations: [
      {
        name: "Green Tea Latte",
        description: "Matcha powder with steamed milk and honey",
        reason: "L-theanine promotes calm focus and mental clarity",
        price: "$4.50"
      },
      {
        name: "Chamomile Tea",
        description: "Soothing herbal tea with calming properties",
        reason: "Natural relaxation without caffeine",
        price: "$3.25"
      }
    ]
  },
  {
    emoji: "🎉",
    name: "Celebratory",
    description: "Treating yourself to something special",
    recommendations: [
      {
        name: "Mocha",
        description: "Espresso with chocolate syrup and whipped cream",
        reason: "Indulgent chocolate treats deserve celebration",
        price: "$5.25"
      },
      {
        name: "Dates & Coffee Pairing",
        description: "Traditional Medjool dates served with Arabic coffee",
        reason: "Authentic Middle Eastern luxury experience",
        price: "$5.50"
      }
    ]
  },
  {
    emoji: "🌅",
    name: "Fresh Start",
    description: "Beginning the day with optimism",
    recommendations: [
      {
        name: "Americano",
        description: "Espresso with hot water for a clean, bright taste",
        reason: "Clean, pure coffee flavor to start fresh",
        price: "$3.25"
      },
      {
        name: "Flat White",
        description: "Double espresso with micro-foamed milk",
        reason: "Smooth, balanced coffee for a perfect morning",
        price: "$4.50"
      }
    ]
  },
  {
    emoji: "🍂",
    name: "Cozy",
    description: "Wanting warmth and comfort",
    recommendations: [
      {
        name: "Chai Latte",
        description: "Spiced tea blend with steamed milk and honey",
        reason: "Warming spices create ultimate comfort",
        price: "$4.25"
      },
      {
        name: "Hot Chocolate",
        description: "Rich cocoa with steamed milk and marshmallows",
        reason: "Pure comfort in a cup",
        price: "$4.00"
      }
    ]
  },
  {
    emoji: "🔥",
    name: "Intense",
    description: "Need maximum energy and focus",
    recommendations: [
      {
        name: "Turkish Coffee",
        description: "Ultra-strong traditional coffee with cardamom",
        reason: "Highest caffeine concentration for peak performance",
        price: "$3.75"
      },
      {
        name: "Red Eye Coffee",
        description: "Drip coffee with double espresso shot",
        reason: "Triple caffeine boost for intense energy needs",
        price: "$4.50"
      }
    ]
  },
  {
    emoji: "🌙",
    name: "Dreamy",
    description: "Relaxed and contemplative mood",
    recommendations: [
      {
        name: "Lavender Latte",
        description: "Espresso with steamed milk and lavender syrup",
        reason: "Lavender promotes calm and dreamy relaxation",
        price: "$4.75"
      },
      {
        name: "Golden Milk",
        description: "Turmeric latte with warming spices and milk",
        reason: "Anti-inflammatory spices for peaceful contemplation",
        price: "$4.50"
      }
    ]
  },
  {
    emoji: "⚡",
    name: "Electric",
    description: "Buzzing with creative energy",
    recommendations: [
      {
        name: "Nitro Cold Brew",
        description: "Nitrogen-infused cold brew with silky texture",
        reason: "Smooth energy boost that matches your electric vibe",
        price: "$4.25"
      },
      {
        name: "Espresso Romano",
        description: "Double espresso with lemon twist",
        reason: "Citrus enhances creativity and mental sharpness",
        price: "$3.75"
      }
    ]
  }
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
    <div className="w-full max-w-6xl mx-auto p-6 min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
      
      <Card className="relative z-10 bg-slate-800/90 backdrop-blur-sm border-2 border-purple-500/30 shadow-2xl">
        <CardHeader className="text-center pb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-8 h-8 text-cyan-400 animate-pulse" />
            <CardTitle className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Mood-Based Recommendations
            </CardTitle>
            <Heart className="w-8 h-8 text-pink-400 animate-pulse" />
          </div>
          <p className="text-xl text-cyan-100/80 font-light">
            Our AI analyzes your mood to suggest the perfect Coffee Pro experience
          </p>
          <div className="mt-4 h-1 w-32 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full mx-auto"></div>
        </CardHeader>
        
        <CardContent>
          {!showRecommendations ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {moods.map((mood) => (
                <Button
                  key={mood.name}
                  variant="outline"
                  className="group h-auto p-8 flex flex-col items-center gap-4 bg-slate-700/50 backdrop-blur-sm border-2 border-purple-500/30 hover:border-cyan-400/60 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 transform hover:scale-105 hover:bg-slate-600/50"
                  onClick={() => handleMoodSelect(mood)}
                >
                  <div className="relative">
                    <span className="text-6xl group-hover:scale-125 transition-transform duration-500 drop-shadow-2xl">
                      {mood.emoji}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="font-bold text-xl text-cyan-100 group-hover:text-white transition-colors duration-300">
                      {mood.name}
                    </div>
                    <div className="text-sm text-cyan-200/70 group-hover:text-cyan-100/90 transition-colors duration-300 leading-relaxed">
                      {mood.description}
                    </div>
                  </div>
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
                </Button>
              ))}
            </div>
          ) : selectedMood && (
            <div className="space-y-8">
              {/* Selected Mood Display */}
              <div className="text-center relative">
                <div className="relative inline-block">
                  <div className="text-8xl mb-6 animate-bounce">{selectedMood.emoji}</div>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 to-purple-500/30 rounded-full blur-2xl animate-pulse"></div>
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-4">
                  Perfect for when you're feeling {selectedMood.name.toLowerCase()}
                </h3>
                <p className="text-xl text-cyan-100/80 max-w-2xl mx-auto">{selectedMood.description}</p>
                <div className="mt-6 flex items-center justify-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span className="text-cyan-200 font-medium">AI-Powered Recommendations</span>
                  <Zap className="w-5 h-5 text-yellow-400" />
                </div>
              </div>

              {/* Recommendations */}
              <div className="grid md:grid-cols-2 gap-6">
                {selectedMood.recommendations.map((rec, index) => (
                  <Card key={index} className="group bg-slate-700/70 backdrop-blur-sm border-2 border-purple-500/30 hover:border-cyan-400/50 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 transform hover:scale-105">
                    <CardContent className="p-8">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="font-bold text-2xl text-cyan-100 group-hover:text-white transition-colors duration-300">
                          {rec.name}
                        </h4>
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-3 py-1 text-lg">
                          {rec.price}
                        </Badge>
                      </div>
                      <p className="text-cyan-200/80 mb-6 leading-relaxed text-lg">{rec.description}</p>
                      
                      <div className="bg-slate-600/50 p-4 rounded-xl border border-purple-500/20">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full">
                            <Coffee className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-lg font-bold text-cyan-100">AI Analysis:</span>
                        </div>
                        <p className="text-cyan-200/90 leading-relaxed">{rec.reason}</p>
                      </div>
                      
                      <Button className="w-full mt-6 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-bold py-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300">
                        <Coffee className="w-5 h-5 mr-2" />
                        Order Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                <Button
                  onClick={handleReset}
                  className="group bg-slate-600/50 hover:bg-slate-500/50 text-cyan-100 border border-purple-500/30 hover:border-cyan-400/50 px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
                >
                  <ArrowLeft className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                  Try Another Mood
                </Button>
                
                <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Get New Recommendations
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}