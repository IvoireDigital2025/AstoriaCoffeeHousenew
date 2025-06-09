import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coffee, Sparkles } from "lucide-react";

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
    <div className="w-full max-w-4xl mx-auto p-6">
      <Card className="bg-gradient-to-br from-coffee-cream to-white border-coffee-accent/20">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-coffee-accent" />
            <CardTitle className="text-3xl font-playfair text-coffee-dark">
              How are you feeling today?
            </CardTitle>
            <Sparkles className="w-6 h-6 text-coffee-accent" />
          </div>
          <p className="text-coffee-medium text-lg">
            Let us recommend the perfect Coffee Pro beverage for your mood
          </p>
        </CardHeader>
        
        <CardContent>
          {!showRecommendations ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {moods.map((mood) => (
                <Button
                  key={mood.name}
                  variant="outline"
                  className="h-auto p-6 flex flex-col items-center gap-3 hover:bg-coffee-cream hover:border-coffee-accent transition-all duration-300 group"
                  onClick={() => handleMoodSelect(mood)}
                >
                  <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
                    {mood.emoji}
                  </span>
                  <div className="text-center">
                    <div className="font-semibold text-coffee-dark">{mood.name}</div>
                    <div className="text-sm text-coffee-medium mt-1">{mood.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          ) : selectedMood && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-6xl mb-4">{selectedMood.emoji}</div>
                <h3 className="text-2xl font-playfair text-coffee-dark mb-2">
                  Perfect for when you're feeling {selectedMood.name.toLowerCase()}
                </h3>
                <p className="text-coffee-medium">{selectedMood.description}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {selectedMood.recommendations.map((rec, index) => (
                  <Card key={index} className="border-coffee-accent/30 hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-playfair font-semibold text-lg text-coffee-dark">
                          {rec.name}
                        </h4>
                        <Badge variant="secondary" className="bg-coffee-accent text-white">
                          {rec.price}
                        </Badge>
                      </div>
                      <p className="text-coffee-medium mb-3">{rec.description}</p>
                      <div className="bg-coffee-cream/50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Coffee className="w-4 h-4 text-coffee-accent" />
                          <span className="text-sm font-medium text-coffee-dark">Why this works:</span>
                        </div>
                        <p className="text-sm text-coffee-medium">{rec.reason}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center pt-4">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="border-coffee-primary text-coffee-primary hover:bg-coffee-primary hover:text-white"
                >
                  Try Another Mood
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}