import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Coffee, VolumeX } from "lucide-react";
import audioFile from "@assets/arab-and-muslim-190765_1749669994292.mp3";

export default function AmbientSoundtrack() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isStopped, setIsStopped] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.02;
    }
  }, []);

  // Auto-start audio when component mounts
  useEffect(() => {
    const startAudio = () => {
      if (audioRef.current && !isStopped) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          // Autoplay blocked, user will need to click play
          setIsPlaying(false);
        });
      }
    };

    const timer = setTimeout(startAudio, 2000);
    return () => clearTimeout(timer);
  }, [isStopped]);

  // Hide welcome message after 6 seconds
  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => setShowWelcome(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [showWelcome]);





  const handleStopMusic = () => {
    console.log('Stop button clicked');
    if (audioRef.current) {
      console.log('Audio element found, stopping music');
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.volume = 0;
      audioRef.current.src = '';
      setIsPlaying(false);
      setIsStopped(true);
      console.log('Music stopped, isPlaying:', false, 'isStopped:', true);
    } else {
      console.log('No audio element found');
    }
  };

  return (
    <>
      {/* Stop Music Button */}
      {isPlaying && !isStopped && (
        <div className="fixed top-20 left-6 z-50">
          <Button
            onClick={handleStopMusic}
            variant="outline"
            size="sm"
            className="bg-white/90 backdrop-blur-sm border-red-300 text-red-600 hover:bg-red-50 shadow-lg"
          >
            <VolumeX className="w-4 h-4 mr-2" />
            Stop Music
          </Button>
        </div>
      )}

      {/* Welcome Notification */}
      {showWelcome && (
        <div className="fixed top-20 right-6 z-50 max-w-sm">
          <div className="bg-coffee-cream/95 backdrop-blur-sm border-2 border-coffee-accent/30 rounded-lg p-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-2">
              <Coffee className="w-5 h-5 text-coffee-accent" />
              <h4 className="font-semibold text-coffee-dark">Welcome to Coffee Pro</h4>
            </div>
            <p className="text-sm text-coffee-medium mb-3">
              Enjoying our authentic Middle Eastern ambient music creating the perfect coffee shop atmosphere.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-coffee-medium">Now playing: Arab & Muslim Ambience</span>
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





      {/* Audio Element */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onError={() => setIsPlaying(false)}
      >
        <source src={audioFile} type="audio/mpeg" />
      </audio>
    </>
  );
}