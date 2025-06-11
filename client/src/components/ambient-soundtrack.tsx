import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Coffee, VolumeX } from "lucide-react";
import audioFile from "@assets/arab-and-muslim-190765_1749669994292.mp3";

export default function AmbientSoundtrack() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isStopped, setIsStopped] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isStopped) return;

    // Create audio element
    const audio = new Audio(audioFile);
    audio.loop = true;
    audio.volume = 0.02;
    audio.preload = 'auto';
    audioRef.current = audio;

    // Add event listeners
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    // Start playing after delay
    const playTimer = setTimeout(() => {
      if (!isStopped && audioRef.current) {
        audioRef.current.play().catch(() => {
          setIsPlaying(false);
        });
      }
    }, 2000);

    // Cleanup function
    return () => {
      clearTimeout(playTimer);
      if (audioRef.current) {
        audioRef.current.removeEventListener('play', handlePlay);
        audioRef.current.removeEventListener('pause', handlePause);
        audioRef.current.removeEventListener('ended', handleEnded);
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    };
  }, [isStopped]);

  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => setShowWelcome(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  const handleStopMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = '';
      audioRef.current.load();
      audioRef.current = null;
    }
    setIsStopped(true);
    setIsPlaying(false);
  };

  // Don't render anything if music is stopped
  if (isStopped) {
    return null;
  }

  return (
    <>
      {/* Stop Music Button - Always visible when component is active */}
      <div className="fixed top-20 left-6 z-50">
        <Button
          onClick={handleStopMusic}
          variant="outline"
          size="sm"
          className="bg-white/90 backdrop-blur-sm border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 shadow-lg transition-all duration-200"
        >
          <VolumeX className="w-4 h-4 mr-2" />
          Stop Music
        </Button>
      </div>

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
    </>
  );
}