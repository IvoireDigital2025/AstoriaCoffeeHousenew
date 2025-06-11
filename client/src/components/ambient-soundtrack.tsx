import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Coffee, VolumeX } from "lucide-react";
import audioFile from "@assets/arab-and-muslim-190765_1749669994292.mp3";

let globalAudio: HTMLAudioElement | null = null;

export default function AmbientSoundtrack() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isStopped, setIsStopped] = useState(false);

  useEffect(() => {
    if (isStopped) return;

    const initAudio = () => {
      if (!globalAudio) {
        globalAudio = new Audio(audioFile);
        globalAudio.loop = true;
        globalAudio.volume = 0.02;
        globalAudio.preload = 'auto';
        
        globalAudio.addEventListener('play', () => setIsPlaying(true));
        globalAudio.addEventListener('pause', () => setIsPlaying(false));
        globalAudio.addEventListener('ended', () => setIsPlaying(false));
      }

      setTimeout(() => {
        if (globalAudio && !isStopped) {
          globalAudio.play().catch(() => {
            setIsPlaying(false);
          });
        }
      }, 2000);
    };

    initAudio();

    return () => {
      if (globalAudio && isStopped) {
        globalAudio.pause();
        globalAudio.currentTime = 0;
        globalAudio.src = '';
        globalAudio.load();
        globalAudio = null;
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
    if (globalAudio) {
      globalAudio.pause();
      globalAudio.currentTime = 0;
      globalAudio.volume = 0;
      globalAudio.muted = true;
      globalAudio.src = '';
      globalAudio.load();
      globalAudio.remove();
      globalAudio = null;
    }
    setIsStopped(true);
    setIsPlaying(false);
  };

  if (isStopped) {
    return null;
  }

  return (
    <>
      {/* Stop Music Button */}
      {isPlaying && (
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
    </>
  );
}