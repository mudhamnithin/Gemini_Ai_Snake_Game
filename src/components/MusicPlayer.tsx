import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Terminal } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "SECTOR_01_SCAN",
    artist: "SYNTH_NODE_ALPHA",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "#00ffff"
  },
  {
    id: 2,
    title: "MEMORY_LEAK",
    artist: "SYNTH_NODE_BETA",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "#ff00ff"
  },
  {
    id: 3,
    title: "KERNEL_PANIC",
    artist: "SYNTH_NODE_GAMMA",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "#ffffff"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => console.error("Audio play error:", e));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const nextTrack = () => { setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length); setIsPlaying(true); };
  const prevTrack = () => { setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length); setIsPlaying(true); };
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setProgress(newTime);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-black border-4 border-[#ff00ff] relative">
      <div className="absolute top-0 left-0 bg-[#ff00ff] text-black text-lg px-2 py-1 font-bold uppercase tracking-widest">
        AUDIO_UPLINK_V1.0
      </div>
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
        loop={false}
      />
      
      <div className="flex items-center space-x-4 mb-8 mt-10">
        <div 
          className="w-20 h-20 flex items-center justify-center bg-black border-4"
          style={{ borderColor: currentTrack.color }}
        >
          <Terminal 
            size={40} 
            color={currentTrack.color} 
            className={isPlaying ? "animate-pulse tear" : ""} 
          />
        </div>
        <div className="flex-1 overflow-hidden">
          <h3 
            className="text-3xl font-bold truncate tracking-wide uppercase"
            style={{ color: currentTrack.color }}
          >
            {currentTrack.title}
          </h3>
          <p className="text-[#ff00ff] text-xl truncate uppercase tracking-widest">SRC: {currentTrack.artist}</p>
        </div>
        <button 
          onClick={toggleMute}
          className="p-2 text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-colors border-2 border-[#00ffff]"
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
      </div>

      <div className="mb-8">
        <div className="flex justify-between text-xl text-[#00ffff] mb-2 tracking-widest">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={progress}
          onChange={handleSeek}
          className="w-full h-4 bg-black border-2 border-[#00ffff] appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:bg-[#ff00ff]"
          style={{
            background: `linear-gradient(to right, ${currentTrack.color} ${duration ? (progress / duration) * 100 : 0}%, #000000 ${duration ? (progress / duration) * 100 : 0}%)`
          }}
        />
      </div>

      <div className="flex items-center justify-center space-x-6">
        <button 
          onClick={prevTrack}
          className="p-3 text-[#00ffff] border-4 border-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-all"
        >
          <SkipBack size={32} />
        </button>
        <button 
          onClick={togglePlay}
          className="p-4 bg-black border-4 text-[#ff00ff] hover:bg-[#ff00ff] hover:text-black transition-all"
          style={{ borderColor: currentTrack.color, color: isPlaying ? '#000' : currentTrack.color, backgroundColor: isPlaying ? currentTrack.color : '#000' }}
        >
          {isPlaying ? <Pause size={40} /> : <Play size={40} className="ml-2" />}
        </button>
        <button 
          onClick={nextTrack}
          className="p-3 text-[#00ffff] border-4 border-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-all"
        >
          <SkipForward size={32} />
        </button>
      </div>
    </div>
  );
}
