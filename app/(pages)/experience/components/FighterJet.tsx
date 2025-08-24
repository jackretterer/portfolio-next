import { FC } from 'react';

export const FighterJet: FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {/* Fighter Jet */}
      <div className="absolute animate-fly-path">
        {/* Jet Body */}
        <div className="relative">
          {/* Main body */}
          <div className="w-8 h-2 bg-emerald-400 rounded-sm"></div>

          {/* Wings */}
          <div className="absolute -left-3 top-0 w-3 h-1 bg-emerald-500 rounded-sm transform -rotate-12"></div>
          <div className="absolute -right-3 top-0 w-3 h-1 bg-emerald-500 rounded-sm transform rotate-12"></div>

          {/* Tail */}
          <div className="absolute -left-2 -top-1 w-2 h-1 bg-emerald-400 rounded-sm"></div>
          <div className="absolute -right-2 -top-1 w-2 h-1 bg-emerald-400 rounded-sm"></div>

          {/* Nose cone */}
          <div className="absolute left-8 top-0 w-2 h-2 bg-emerald-300 rounded-full transform rotate-45"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fly-path {
          0% {
            transform: translateX(-100px) translateY(20vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          25% {
            transform: translateX(30vw) translateY(10vh) rotate(15deg);
          }
          50% {
            transform: translateX(70vw) translateY(30vh) rotate(-10deg);
          }
          75% {
            transform: translateX(40vw) translateY(70vh) rotate(20deg);
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateX(calc(100vw + 100px)) translateY(50vh) rotate(0deg);
            opacity: 0;
          }
        }

        .animate-fly-path {
          animation: fly-path 15s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
