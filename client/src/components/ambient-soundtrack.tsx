import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Volume2, VolumeX, Play, Pause, SkipForward, Music } from "lucide-react";

interface Track {
  id: string;
  title: string;
  artist: string;
  description: string;
  mood: string;
  duration: string;
  audioUrl: string; // In real implementation, these would be actual audio files
}

const soundtracks: Track[] = [
  {
    id: "1",
    title: "Arabian Coffee House",
    artist: "Coffee Pro Ambience",
    description: "Traditional oud and gentle percussion with coffee shop sounds",
    mood: "Authentic",
    duration: "8:30",
    audioUrl: "/audio/arabian-coffee-house.mp3"
  },
  {
    id: "2", 
    title: "Moroccan Market Vibes",
    artist: "Coffee Pro Ambience",
    description: "Bustling marketplace sounds with traditional Moroccan instruments",
    mood: "Social",
    duration: "6:45",
    audioUrl: "/audio/moroccan-market.mp3"
  },
  {
    id: "3",
    title: "Desert Winds & Coffee",
    artist: "Coffee Pro Ambience", 
    description: "Gentle wind sounds mixed with Arabic flute and coffee brewing",
    mood: "Mindful",
    duration: "10:15",
    audioUrl: "/audio/desert-winds.mp3"
  },
  {
    id: "4",
    title: "AlUla Sunset Sessions",
    artist: "Coffee Pro Ambience",
    description: "Atmospheric sounds inspired by the ancient beauty of AlUla",
    mood: "Cozy",
    duration: "7:20",
    audioUrl: "/audio/alula-sunset.mp3"
  },
  {
    id: "5",
    title: "Espresso Energy",
    artist: "Coffee Pro Ambience",
    description: "Upbeat Middle Eastern rhythms with coffee machine sounds",
    mood: "Active",
    duration: "5:30",
    audioUrl: "/audio/espresso-energy.mp3"
  }
];

export default function AmbientSoundtrack() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.2);
  const [isMuted, setIsMuted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Auto-start music when component mounts
  useEffect(() => {
    const startAmbientMusic = async () => {
      if (audioRef.current && !hasStarted) {
        try {
          // Try to start playing automatically
          await audioRef.current.play();
          setHasStarted(true);
        } catch (error) {
          // If autoplay is blocked, wait for user interaction
          setIsPlaying(false);
          console.log("Autoplay blocked, waiting for user interaction");
        }
      }
    };

    // Small delay to ensure component is fully mounted
    const timer = setTimeout(startAmbientMusic, 1000);
    return () => clearTimeout(timer);
  }, [hasStarted]);

  // Hide welcome message after 8 seconds
  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => setShowWelcome(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  const handlePlayPause = async () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
          setHasStarted(true);
        } catch (error) {
          console.log("Audio playback requires user interaction first");
          setIsPlaying(false);
        }
      }
    }
  };

  const handleNextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % soundtracks.length);
  };

  const handleVolumeToggle = () => {
    setIsMuted(!isMuted);
  };

  const track = soundtracks[currentTrack];

  return (
    <>
      {/* Welcome Notification */}
      {showWelcome && (
        <div className="fixed top-20 right-6 z-50 max-w-sm">
          <div className="bg-slate-800/95 backdrop-blur-sm border-2 border-purple-500/30 rounded-lg p-4 shadow-2xl">
            <div className="flex items-center gap-3 mb-2">
              <Music className="w-5 h-5 text-cyan-400" />
              <h4 className="font-semibold text-cyan-100">Welcome to Coffee Pro</h4>
            </div>
            <p className="text-sm text-cyan-200/80 mb-3">
              Enjoying our authentic Middle Eastern ambient soundtrack. Click the music button to control playback.
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-cyan-300/60">Now playing: {soundtracks[currentTrack].title}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowWelcome(false)}
                className="text-cyan-200/60 hover:text-white p-1"
              >
                ×
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Music Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsVisible(!isVisible)}
          className={`group relative overflow-hidden bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white p-4 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 border-2 border-cyan-400/30 ${
            showWelcome ? 'animate-bounce' : ''
          }`}
        >
          <Music className="w-6 h-6 group-hover:animate-pulse" />
          {isPlaying && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-ping rounded-full"></div>
          )}
        </Button>
      </div>

      {/* Soundtrack Player Panel */}
      {isVisible && (
        <div className="fixed bottom-24 right-6 z-40">
          <Card className="w-80 bg-slate-800/95 backdrop-blur-sm border-2 border-purple-500/30 shadow-2xl">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  Coffee Pro Ambience
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsVisible(false)}
                  className="text-cyan-100 hover:text-white"
                >
                  ×
                </Button>
              </div>

              {/* Current Track Info */}
              <div className="mb-4">
                <div className="bg-slate-700/50 rounded-lg p-4 border border-purple-500/20">
                  <h4 className="font-semibold text-cyan-100 mb-1">{track.title}</h4>
                  <p className="text-sm text-cyan-200/70 mb-2">{track.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-2 py-1 rounded-full">
                      {track.mood}
                    </span>
                    <span className="text-cyan-200/60">{track.duration}</span>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between mb-4">
                <Button
                  onClick={handlePlayPause}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-full p-3"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>

                <Button
                  onClick={handleNextTrack}
                  variant="outline"
                  className="border-purple-500/30 text-cyan-100 hover:bg-purple-600/20 rounded-full p-3"
                >
                  <SkipForward className="w-5 h-5" />
                </Button>

                <Button
                  onClick={handleVolumeToggle}
                  variant="outline"
                  className="border-purple-500/30 text-cyan-100 hover:bg-purple-600/20 rounded-full p-3"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </Button>
              </div>

              {/* Volume Slider */}
              <div className="mb-4">
                <label className="text-sm text-cyan-200/70 mb-2 block">Volume</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>

              {/* Track List */}
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-cyan-200 mb-2">Playlist</h5>
                {soundtracks.map((sound, index) => (
                  <div
                    key={sound.id}
                    onClick={() => setCurrentTrack(index)}
                    className={`p-2 rounded cursor-pointer transition-colors duration-200 ${
                      index === currentTrack
                        ? "bg-purple-600/30 border border-cyan-400/30"
                        : "bg-slate-700/30 hover:bg-slate-600/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-cyan-100">{sound.title}</p>
                        <p className="text-xs text-cyan-200/60">{sound.mood} • {sound.duration}</p>
                      </div>
                      {index === currentTrack && isPlaying && (
                        <div className="flex space-x-1">
                          <div className="w-1 h-4 bg-cyan-400 rounded animate-pulse"></div>
                          <div className="w-1 h-4 bg-purple-400 rounded animate-pulse animation-delay-200"></div>
                          <div className="w-1 h-4 bg-cyan-400 rounded animate-pulse animation-delay-400"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Note */}
              <div className="mt-4 p-3 bg-slate-700/30 rounded-lg border border-purple-500/20">
                <p className="text-xs text-cyan-200/70 text-center">
                  Authentic Middle Eastern ambience to enhance your Coffee Pro experience
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        loop
        preload="none"
        onEnded={() => setIsPlaying(false)}
        onError={() => setIsPlaying(false)}
      >
        {/* In a real implementation, this would reference actual audio files */}
        <source src={track.audioUrl} type="audio/mpeg" />
      </audio>
    </>
  );
}