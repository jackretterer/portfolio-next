'use client';

import { FC } from 'react';

export const WalkingRobot: FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {/* Walking Robot */}
      <div className="absolute animate-[walk-path_12s_ease-in-out_infinite]">
        <svg
          width="40"
          height="60"
          viewBox="0 0 40 60"
          className="drop-shadow-lg"
          style={{ transform: 'translate(-50%, -100%)' }}
        >
          {/* Robot Head */}
          <rect x="12" y="8" width="16" height="12" fill="#22c55e" rx="2" />
          {/* Eyes */}
          <circle cx="16" cy="12" r="1.5" fill="#34d399" />
          <circle cx="24" cy="12" r="1.5" fill="#34d399" />
          {/* Antenna */}
          <rect x="19" y="6" width="2" height="4" fill="#15803d" />

          {/* Robot Body/Torso */}
          <rect x="8" y="20" width="24" height="16" fill="#22c55e" rx="2" />
          {/* Chest panel */}
          <rect x="12" y="22" width="16" height="12" fill="#15803d" rx="1" />

          {/* Left Arm */}
          <g className="animate-[left-arm-swing_0.6s_ease-in-out_infinite_alternate]">
            <rect x="2" y="22" width="6" height="12" fill="#22c55e" rx="1" />
            <rect x="4" y="34" width="4" height="8" fill="#34d399" rx="1" />
          </g>

          {/* Right Arm */}
          <g className="animate-[right-arm-swing_0.6s_ease-in-out_infinite_alternate]">
            <rect x="32" y="22" width="6" height="12" fill="#22c55e" rx="1" />
            <rect x="34" y="34" width="4" height="8" fill="#34d399" rx="1" />
          </g>

          {/* Left Leg */}
          <g className="animate-[left-leg-swing_0.7s_ease-in-out_infinite_alternate]" style={{ transformOrigin: '13px 40px', transformBox: 'fill-box' }}>
            <rect x="10" y="36" width="6" height="16" fill="#22c55e" rx="1" />
            <rect x="12" y="52" width="4" height="8" fill="#34d399" rx="1" />
          </g>

          {/* Right Leg */}
          <g className="animate-[right-leg-swing_0.7s_ease-in-out_infinite_alternate]" style={{ transformOrigin: '27px 40px', transformBox: 'fill-box', animationDelay: '0.35s' }}>
            <rect x="24" y="36" width="6" height="16" fill="#22c55e" rx="1" />
            <rect x="26" y="52" width="4" height="8" fill="#34d399" rx="1" />
          </g>

          {/* Robot Details */}
          {/* Shoulder joints */}
          <circle cx="6" cy="26" r="2" fill="#15803d" />
          <circle cx="34" cy="26" r="2" fill="#15803d" />
          {/* Hip joints */}
          <circle cx="13" cy="40" r="2" fill="#15803d" />
          <circle cx="27" cy="40" r="2" fill="#15803d" />
          {/* Knee joints */}
          <circle cx="13" cy="48" r="1.5" fill="#15803d" />
          <circle cx="27" cy="48" r="1.5" fill="#15803d" />
        </svg>
      </div>
    </div>
  );
};
