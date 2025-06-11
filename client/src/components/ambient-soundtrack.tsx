import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Volume2, VolumeX, Play, Pause, Music } from "lucide-react";

export default function AmbientSoundtrack() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.1);
  const [isMuted, setIsMuted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Initialize Web Audio API
  const initializeAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
      gainNodeRef.current.gain.value = volume;
    }
  }, [volume]);

  // Create ambient sound using Web Audio API
  const createAmbientSound = useCallback(() => {
    if (!audioContextRef.current || !gainNodeRef.current) return;

    // Stop previous oscillator
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
    }

    // Create a low-frequency ambient tone for coffee shop atmosphere
    const oscillator = audioContextRef.current.createOscillator();
    const filter = audioContextRef.current.createBiquadFilter();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(55, audioContextRef.current.currentTime); // Low, calming frequency
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(150, audioContextRef.current.currentTime);
    
    oscillator.connect(filter);
    filter.connect(gainNodeRef.current);
    
    oscillator.start();
    oscillatorRef.current = oscillator;
  }, []);

  // Auto-start music when component mounts
  useEffect(() => {
    const startAmbientMusic = async () => {
      if (!hasStarted) {
        try {
          initializeAudio();
          createAmbientSound();
          setIsPlaying(true);
          setHasStarted(true);
        } catch (error) {
          console.log("Autoplay blocked, waiting for user interaction");
          setIsPlaying(false);
        }
      }
    };

    // Small delay to ensure component is fully mounted
    const timer = setTimeout(startAmbientMusic, 2000);
    return () => clearTimeout(timer);
  }, [hasStarted, initializeAudio, createAmbientSound]);

  // Hide welcome message after 6 seconds
  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => setShowWelcome(false), 6000);
      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  const handlePlayPause = async () => {
    try {
      if (isPlaying) {
        if (oscillatorRef.current) {
          oscillatorRef.current.stop();
          oscillatorRef.current = null;
        }
        setIsPlaying(false);
      } else {
        if (!audioContextRef.current) {
          initializeAudio();
        }
        createAmbientSound();
        setIsPlaying(true);
        setHasStarted(true);
      }
    } catch (error) {
      console.log("Audio playback requires user interaction first");
      setIsPlaying(false);
    }
  };

  const handleVolumeToggle = () => {
    setIsMuted(!isMuted);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
      }
    };
  }, []);

  return (
    <>
      {/* Welcome Notification */}
      {showWelcome && (
        <div className="fixed top-20 right-6 z-50 max-w-sm">
          <div className="bg-coffee-cream/95 backdrop-blur-sm border-2 border-coffee-accent/30 rounded-lg p-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-2">
              <Music className="w-5 h-5 text-coffee-accent" />
              <h4 className="font-semibold text-coffee-dark">Welcome to Coffee Pro</h4>
            </div>
            <p className="text-sm text-coffee-medium mb-3">
              Enjoying our authentic Middle Eastern ambient atmosphere. Click the music button to control playback.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-coffee-medium">Now playing: Arabian Coffee House Ambience</span>
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

      {/* Floating Music Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <Button
          onClick={() => setIsVisible(!isVisible)}
          className={`group relative overflow-hidden bg-gradient-to-r from-coffee-primary to-amber-600 hover:from-coffee-dark hover:to-amber-700 text-white p-4 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 border-2 border-amber-400/30 ${
            showWelcome ? 'animate-bounce' : ''
          }`}
        >
          <Music className="w-6 h-6 group-hover:animate-pulse" />
          {isPlaying && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-ping rounded-full"></div>
          )}
        </Button>
      </div>

      {/* Simple Controls Panel */}
      {isVisible && (
        <div className="fixed bottom-24 left-6 z-40">
          <Card className="w-64 bg-coffee-cream/95 backdrop-blur-sm border-2 border-coffee-accent/30 shadow-2xl">
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold bg-gradient-to-r from-coffee-primary to-amber-600 bg-clip-text text-transparent">
                  Coffee Shop Ambience
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

              {/* Current Track Info */}
              <div className="mb-4">
                <div className="bg-coffee-cream/50 rounded-lg p-3 border border-coffee-accent/20">
                  <h4 className="font-semibold text-coffee-dark mb-1">Arabian Coffee House</h4>
                  <p className="text-sm text-coffee-medium">Authentic Middle Eastern ambient sounds</p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between mb-4">
                <Button
                  onClick={handlePlayPause}
                  className="bg-gradient-to-r from-coffee-primary to-amber-600 hover:from-coffee-dark hover:to-amber-700 text-white rounded-full p-3"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>

                <Button
                  onClick={handleVolumeToggle}
                  variant="outline"
                  className="border-coffee-accent/30 text-coffee-dark hover:bg-coffee-primary/20 rounded-full p-3"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>
              </div>

              {/* Volume Slider */}
              <div className="mb-4">
                <label className="text-sm text-coffee-medium mb-2 block">Volume</label>
                <input
                  type="range"
                  min="0"
                  max="0.3"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full h-2 bg-coffee-accent/20 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* Note */}
              <div className="p-3 bg-coffee-cream/30 rounded-lg border border-coffee-accent/20">
                <p className="text-xs text-coffee-medium text-center">
                  Authentic Middle Eastern ambience to enhance your Coffee Pro experience
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}