import React from 'react';

export const Floating3DBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 bg-[#070b14]">
      {/* Luxury ambient gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[140px] animate-pulse" />
      <div className="absolute top-[30%] right-[-10%] w-[500px] h-[500px] rounded-full bg-amber-500/10 blur-[150px]" />
      <div className="absolute bottom-[-10%] left-[20%] w-[700px] h-[700px] rounded-full bg-indigo-600/10 blur-[180px]" />

      {/* Subtle geometric grid */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />

      {/* Floating 3D/Academic Motifs */}
      <div className="absolute top-24 left-[8%] text-blue-400/20 text-5xl font-black select-none animate-bounce duration-[6000ms]">
        A
      </div>
      <div className="absolute top-48 right-[12%] text-amber-400/20 text-6xl font-black select-none animate-bounce duration-[8000ms]">
        B
      </div>
      <div className="absolute top-[65%] left-[5%] text-indigo-400/20 text-4xl font-black select-none animate-bounce duration-[7000ms]">
        C
      </div>
      <div className="absolute bottom-28 right-[8%] text-amber-500/20 text-5xl font-black select-none animate-bounce duration-[9000ms]">
        99%
      </div>

      {/* Futuristic Floating Orb Particles */}
      <div className="absolute top-[18%] left-[45%] w-2 h-2 rounded-full bg-amber-400/30 blur-[1px] animate-ping duration-[4000ms]" />
      <div className="absolute top-[55%] right-[25%] w-3 h-3 rounded-full bg-blue-400/30 blur-[1px] animate-pulse duration-[3000ms]" />
      <div className="absolute bottom-[35%] left-[30%] w-2 h-2 rounded-full bg-indigo-400/40 blur-[1px]" />
    </div>
  );
};
