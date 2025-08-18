import React from 'react';

interface LogoProps {
  className?: string;
  color?: string;
}

const WeylandYutaniLogo: React.FC<LogoProps> = ({ className = '', color = 'currentColor' }) => {
  return (
    <svg 
      viewBox="0 0 200 100" 
      className={className}
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Wing-like W shape */}
      <g>
        {/* Left wing of W */}
        <path d="M 20 30 L 35 70 L 40 55 L 50 30 L 45 30 L 37.5 50 L 30 30 Z" />
        
        {/* Right wing of W (mirrored) */}
        <path d="M 50 30 L 60 55 L 65 70 L 80 30 L 70 30 L 62.5 50 L 55 30 Z" />
        
        {/* Y shape integrated */}
        <path d="M 120 30 L 135 50 L 150 30 L 140 30 L 135 40 L 130 30 Z" />
        <path d="M 135 50 L 135 70 L 145 70 L 145 50 Z" />
        
        {/* Circle/Ring around logo */}
        <circle cx="100" cy="50" r="45" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
        <circle cx="100" cy="50" r="40" fill="none" stroke={color} strokeWidth="0.5" opacity="0.3" />
        
        {/* Text below */}
        <text x="100" y="85" textAnchor="middle" fontSize="8" fontFamily="monospace" letterSpacing="2" opacity="0.8">
          WEYLAND-YUTANI
        </text>
        
        {/* Small tagline */}
        <text x="100" y="95" textAnchor="middle" fontSize="5" fontFamily="monospace" letterSpacing="1" opacity="0.5">
          BUILDING BETTER WORLDS
        </text>
        
        {/* Tech pattern decorations */}
        <g opacity="0.3">
          <rect x="10" y="48" width="15" height="0.5" />
          <rect x="175" y="48" width="15" height="0.5" />
          <rect x="10" y="52" width="15" height="0.5" />
          <rect x="175" y="52" width="15" height="0.5" />
        </g>
      </g>
    </svg>
  );
};

export default WeylandYutaniLogo;