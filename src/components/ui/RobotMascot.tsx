import React from 'react';

interface RobotMascotProps {
  mood?: 'happy' | 'thinking' | 'celebrating' | 'curious';
  className?: string;
  size?: number;
}

export const RobotMascot: React.FC<RobotMascotProps> = ({
  mood = 'happy',
  className = '',
  size = 120,
}) => {
  return (
    <div
      className={`inline-flex items-center justify-center transition-transform hover:scale-105 duration-300 ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Friendly AI robot mascot feeling ${mood}`}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md select-none"
      >
        {/* Antenna */}
        <line x1="50" y1="20" x2="50" y2="8" stroke="#FFE9A8" strokeWidth="5" strokeLinecap="round" />
        <circle cx="50" cy="7" r="6" fill="#FFB7A8" />
        {mood === 'thinking' && (
          <circle cx="50" cy="7" r="9" fill="#FFB7A8" opacity="0.4" className="animate-ping" />
        )}

        {/* Ears / Head bolts */}
        <rect x="18" y="38" width="6" height="12" rx="3" fill="#DDF3FF" stroke="#6558E8" strokeWidth="2" />
        <rect x="76" y="38" width="6" height="12" rx="3" fill="#DDF3FF" stroke="#6558E8" strokeWidth="2" />

        {/* Robot Head Body */}
        <rect
          x="22"
          y="20"
          width="56"
          height="48"
          rx="16"
          fill="#FFFFFF"
          stroke="#6558E8"
          strokeWidth="4"
        />

        {/* Screen Visor */}
        <rect
          x="30"
          y="28"
          width="40"
          height="22"
          rx="8"
          fill="#DDF3FF"
        />

        {/* Eyes based on mood */}
        {mood === 'celebrating' ? (
          <>
            {/* Happy arch eyes ^^ */}
            <path d="M37 40C37 36 43 36 43 40" stroke="#6558E8" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M57 40C57 36 63 36 63 40" stroke="#6558E8" strokeWidth="3.5" strokeLinecap="round" />
          </>
        ) : mood === 'thinking' ? (
          <>
            {/* Looking up eyes */}
            <circle cx="40" cy="36" r="4.5" fill="#6558E8" />
            <circle cx="39" cy="34" r="1.5" fill="#FFFFFF" />
            <circle cx="60" cy="36" r="4.5" fill="#6558E8" />
            <circle cx="59" cy="34" r="1.5" fill="#FFFFFF" />
          </>
        ) : (
          <>
            {/* Normal friendly round eyes */}
            <circle cx="40" cy="39" r="4.5" fill="#6558E8" />
            <circle cx="38.5" cy="37.5" r="1.5" fill="#FFFFFF" />
            <circle cx="60" cy="39" r="4.5" fill="#6558E8" />
            <circle cx="58.5" cy="37.5" r="1.5" fill="#FFFFFF" />
          </>
        )}

        {/* Cheeks */}
        <circle cx="33" cy="46" r="3" fill="#FFB7A8" opacity="0.9" />
        <circle cx="67" cy="46" r="3" fill="#FFB7A8" opacity="0.9" />

        {/* Mouth / Smile */}
        {mood === 'celebrating' ? (
          <path
            d="M42 56C44 61 56 61 58 56Z"
            fill="#FFB7A8"
            stroke="#17233C"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        ) : mood === 'thinking' ? (
          <ellipse cx="50" cy="57" rx="3.5" ry="3.5" fill="#17233C" />
        ) : (
          <path
            d="M43 56C46 59 54 59 57 56"
            stroke="#17233C"
            strokeWidth="3"
            strokeLinecap="round"
          />
        )}

        {/* Neck */}
        <rect x="44" y="68" width="12" height="6" rx="2" fill="#E8E8F0" />

        {/* Robot Body */}
        <path
          d="M28 74C28 72 32 72 36 72H64C68 72 72 72 72 74L76 96H24L28 74Z"
          fill="#FFFFFF"
          stroke="#6558E8"
          strokeWidth="4"
        />

        {/* Chest Heart / Badge Indicator */}
        <circle cx="50" cy="84" r="6" fill="#FFE9A8" stroke="#F59E0B" strokeWidth="2" />
        <path d="M50 81V87M47 84H53" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
};
