import React from 'react';

export default function SolarSystem() {
  return (
    <div className="relative w-64 h-64 mx-auto">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-16 h-16 bg-yellow-400 rounded-full shadow-lg animate-pulse"></div>
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-orbit-1">
        <div className="w-2 h-2 bg-gray-500 rounded-full shadow"></div>
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-orbit-2">
        <div className="w-4 h-4 bg-red-900 rounded-full shadow"></div>
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-orbit-3">
        <div className="w-5 h-5 bg-blue-500 rounded-full shadow"></div>
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-orbit-4">
        <div className="w-7 h-7 bg-orange-800 rounded-full shadow"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-1 bg-gray-300 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-0.5 bg-gray-400 rounded-full"></div>
      </div>
    </div>
  );
}