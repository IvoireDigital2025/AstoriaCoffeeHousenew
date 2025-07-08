import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

const moods = [
  { emoji: "😊", name: "Happy", description: "Cheerful and optimistic" },
  { emoji: "😴", name: "Tired", description: "Need an energy boost" },
  { emoji: "😌", name: "Relaxed", description: "Calm and peaceful state" },
  { emoji: "🤔", name: "Focused", description: "Ready to concentrate" },
  { emoji: "🥶", name: "Cold", description: "Want something warm" },
  { emoji: "🌞", name: "Energetic", description: "Feeling vibrant and active" }
];

export default function MoodButtons() {
  const [, navigate] = useLocation();

  const handleMoodSelect = (mood: string) => {
    navigate(`/mood-selector?mood=${encodeURIComponent(mood)}`);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
      {moods.map((mood) => (
        <Button
          key={mood.name}
          variant="outline"
          className="p-4 h-auto bg-white/90 backdrop-blur-sm border-white/30 hover:bg-white/100 hover:border-coffee-secondary text-coffee-dark transition-all duration-200 flex flex-col items-center gap-2"
          onClick={() => handleMoodSelect(mood.name)}
        >
          <span className="text-2xl">{mood.emoji}</span>
          <div className="text-center">
            <div className="font-semibold text-sm">{mood.name}</div>
            <div className="text-xs text-coffee-medium opacity-80 leading-tight">
              {mood.description}
            </div>
          </div>
        </Button>
      ))}
    </div>
  );
}