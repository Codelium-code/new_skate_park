import React from 'react';

const SkaterAnimation: React.FC = () => {
  return (
    <div className="relative w-full h-64 overflow-hidden rounded-xl bg-gradient-to-r from-orange-500/20 to-blue-500/20 border border-orange-500/30">
      {/* Background elements */}
      <div className="absolute inset-0">
        {/* Ramp/Half-pipe */}
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-t from-gray-600 to-gray-500 rounded-tl-full opacity-60"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-t from-gray-600 to-gray-500 rounded-tr-full opacity-60"></div>
        
        {/* Crowd silhouettes */}
        <div className="absolute bottom-0 left-1/4 w-2 h-8 bg-gray-700 rounded-t-full opacity-40"></div>
        <div className="absolute bottom-0 left-1/3 w-2 h-6 bg-gray-700 rounded-t-full opacity-40"></div>
        <div className="absolute bottom-0 right-1/4 w-2 h-7 bg-gray-700 rounded-t-full opacity-40"></div>
        <div className="absolute bottom-0 right-1/3 w-2 h-5 bg-gray-700 rounded-t-full opacity-40"></div>
      </div>

      {/* Skater */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="relative animate-bounce">
          {/* Skateboard */}
          <div className="absolute -bottom-2 -left-4 w-8 h-2 bg-orange-400 rounded-full shadow-lg transform rotate-12"></div>
          
          {/* Skater body */}
          <div className="w-6 h-12 bg-blue-400 rounded-lg transform rotate-12 relative">
            {/* Head */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-300 rounded-full"></div>
            
            {/* Arms */}
            <div className="absolute top-2 -left-2 w-3 h-1 bg-blue-400 rounded transform rotate-45"></div>
            <div className="absolute top-2 -right-2 w-3 h-1 bg-blue-400 rounded transform -rotate-45"></div>
            
            {/* Legs */}
            <div className="absolute bottom-0 left-0 w-1 h-4 bg-blue-400 rounded transform rotate-12"></div>
            <div className="absolute bottom-0 right-0 w-1 h-4 bg-blue-400 rounded transform -rotate-12"></div>
          </div>
        </div>
      </div>

      {/* Motion lines */}
      <div className="absolute top-1/3 left-1/4 w-8 h-0.5 bg-white/30 rounded transform rotate-12 animate-pulse"></div>
      <div className="absolute top-1/2 left-1/3 w-6 h-0.5 bg-white/20 rounded transform rotate-12 animate-pulse delay-100"></div>
      <div className="absolute top-2/3 left-1/2 w-4 h-0.5 bg-white/10 rounded transform rotate-12 animate-pulse delay-200"></div>

      {/* Event text */}
      <div className="absolute top-4 left-4 text-white/80 text-sm font-bold">
        X GAMES STYLE
      </div>
      <div className="absolute bottom-4 right-4 text-orange-400 text-xs font-medium">
        LIVE EVENT
      </div>

      {/* Floating particles */}
      <div className="absolute top-1/4 right-1/4 w-1 h-1 bg-orange-400 rounded-full animate-ping"></div>
      <div className="absolute top-3/4 left-1/3 w-1 h-1 bg-blue-400 rounded-full animate-ping delay-300"></div>
      <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-yellow-400 rounded-full animate-ping delay-500"></div>
    </div>
  );
};

export default SkaterAnimation;