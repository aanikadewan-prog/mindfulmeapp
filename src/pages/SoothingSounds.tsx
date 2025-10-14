import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Pause, Volume2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Slider } from "@/components/ui/slider";

interface Sound {
  id: string;
  name: string;
  emoji: string;
  description: string;
  url: string;
}

const sounds: Sound[] = [
  {
    id: "rain",
    name: "Gentle Rain",
    emoji: "🌧️",
    description: "Soft rainfall on leaves",
    url: "https://assets.mixkit.co/active_storage/sfx/2393/2393-preview.mp3"
  },
  {
    id: "ocean",
    name: "Ocean Waves",
    emoji: "🌊",
    description: "Calming waves on the shore",
    url: "https://assets.mixkit.co/active_storage/sfx/2487/2487-preview.mp3"
  },
  {
    id: "forest",
    name: "Forest Birds",
    emoji: "🌲",
    description: "Morning birds chirping",
    url: "https://assets.mixkit.co/active_storage/sfx/2462/2462-preview.mp3"
  },
  {
    id: "fire",
    name: "Crackling Fire",
    emoji: "🔥",
    description: "Warm fireplace ambience",
    url: "https://assets.mixkit.co/active_storage/sfx/2377/2377-preview.mp3"
  },
  {
    id: "wind",
    name: "Gentle Wind",
    emoji: "🍃",
    description: "Wind through trees",
    url: "https://assets.mixkit.co/active_storage/sfx/2499/2499-preview.mp3"
  },
  {
    id: "stream",
    name: "Flowing Stream",
    emoji: "💧",
    description: "Babbling brook sounds",
    url: "https://assets.mixkit.co/active_storage/sfx/2520/2520-preview.mp3"
  }
];

export default function SoothingSounds() {
  const navigate = useNavigate();
  const [selectedSound, setSelectedSound] = useState<Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([70]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleSoundSelect = (sound: Sound) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    setSelectedSound(sound);
    setIsPlaying(false);

    audioRef.current = new Audio(sound.url);
    audioRef.current.loop = true;
    audioRef.current.volume = volume[0] / 100;
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <Button
        variant="ghost"
        onClick={() => navigate("/activities")}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Activities
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Soothing Sounds</CardTitle>
          <p className="text-muted-foreground">Choose nature sounds to help you relax</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sound Selection Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sounds.map((sound) => (
              <Card
                key={sound.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedSound?.id === sound.id
                    ? "border-primary ring-2 ring-primary/20"
                    : "hover:border-primary/50"
                }`}
                onClick={() => handleSoundSelect(sound)}
              >
                <CardContent className="pt-6">
                  <div className="text-center space-y-2">
                    <div className="text-4xl mb-2">{sound.emoji}</div>
                    <h3 className="font-semibold">{sound.name}</h3>
                    <p className="text-sm text-muted-foreground">{sound.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Player Controls */}
          {selectedSound && (
            <Card className="bg-gradient-to-br from-primary/10 to-secondary/10">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl mb-2">{selectedSound.emoji}</div>
                    <h3 className="text-xl font-semibold">Now Playing</h3>
                    <p className="text-muted-foreground">{selectedSound.name}</p>
                  </div>

                  <div className="flex items-center justify-center gap-4">
                    <Button
                      size="lg"
                      onClick={togglePlayPause}
                      className="gap-2 min-w-32"
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="h-5 w-5" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-5 w-5" />
                          Play
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Volume2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Volume</span>
                    </div>
                    <Slider
                      value={volume}
                      onValueChange={setVolume}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tips */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <h4 className="font-semibold mb-3 text-center">💡 Tips for Your Sound Session</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Use headphones for the best immersive experience</li>
                <li>• Close your eyes and let the sounds wash over you</li>
                <li>• Try to identify different layers within the sound</li>
                <li>• Combine with deep breathing for deeper relaxation</li>
                <li>• Let it play while you work, read, or meditate</li>
              </ul>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
