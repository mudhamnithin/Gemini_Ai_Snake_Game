import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-[#00ffff] flex flex-col items-center justify-center p-4 md:p-8 relative crt-flicker">
      <div className="scanlines"></div>
      <div className="static-noise"></div>

      <header className="mb-8 text-center z-10 tear">
        <h1 className="text-6xl md:text-8xl font-bold uppercase mb-2 glitch-text" data-text="SYS.OP.SNAKE">
          SYS.OP.SNAKE
        </h1>
        <p className="text-[#ff00ff] text-2xl tracking-[0.3em] uppercase">Neural Link Established</p>
      </header>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8 z-10">
        <div className="lg:col-span-2 flex justify-center items-center border-4 border-[#ff00ff] p-4 relative bg-[#000000]">
          <div className="absolute top-0 left-0 w-full h-full border-2 border-[#00ffff] pointer-events-none mix-blend-screen animate-pulse"></div>
          <div className="absolute -top-3 -left-3 w-6 h-6 border-t-4 border-l-4 border-[#00ffff]"></div>
          <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-4 border-r-4 border-[#00ffff]"></div>
          <SnakeGame />
        </div>
        <div className="flex justify-center items-center border-4 border-[#00ffff] p-4 relative bg-[#000000]">
          <div className="absolute top-0 left-0 w-full h-full border-2 border-[#ff00ff] pointer-events-none mix-blend-screen animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute -top-3 -right-3 w-6 h-6 border-t-4 border-r-4 border-[#ff00ff]"></div>
          <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-4 border-l-4 border-[#ff00ff]"></div>
          <MusicPlayer />
        </div>
      </div>
    </div>
  );
}
