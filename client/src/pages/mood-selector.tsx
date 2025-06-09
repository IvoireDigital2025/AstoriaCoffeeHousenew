import MoodSelector from "@/components/mood-selector";

export default function MoodSelectorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-cream via-white to-coffee-secondary/20 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-playfair font-bold text-coffee-dark mb-4">
            Mood-Based Coffee Recommendations
          </h1>
          <p className="text-xl text-coffee-medium max-w-3xl mx-auto">
            Discover your perfect Coffee Pro beverage based on how you're feeling. 
            Our authentic Middle Eastern and traditional coffee selections are curated 
            to match your mood and enhance your experience.
          </p>
        </div>
        
        <MoodSelector />
        
        <div className="mt-16 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 max-w-2xl mx-auto border border-coffee-accent/20">
            <h3 className="text-2xl font-playfair font-semibold text-coffee-dark mb-4">
              About Our Recommendations
            </h3>
            <p className="text-coffee-medium leading-relaxed">
              Our mood-based recommendations combine the wisdom of traditional Middle Eastern 
              coffee culture with modern understanding of how different beverages affect mood 
              and energy. Each suggestion is carefully selected from our authentic menu of 
              Moroccan and Saudi Arabian inspired beverages.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}