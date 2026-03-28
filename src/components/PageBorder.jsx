import React from 'react';
import './PageBorder.css';

// Same petal shape as the logo's bottom lotus, scaled to ~60%
const PETAL = 'M 0 0 C -4 -6 -5 -13 0 -20 C 5 -13 4 -6 0 0';
// Same angles as the logo's bottom lotus — rendered back→front for natural layering
const ANGLES = [90, -90, 60, -60, 28, -28, 0];

export default function PageBorder() {
  return (
    <div className="page-border" aria-hidden="true">
      <div className="border-lotus">
        <svg
          viewBox="-24 -23 48 26"
          xmlns="http://www.w3.org/2000/svg"
        >
          {ANGLES.map((a) => (
            <path
              key={a}
              d={PETAL}
              fill="#8B1538"
              fillOpacity="0.7"
              transform={`rotate(${a})`}
            />
          ))}
          {/* centre dot matching logo crown dots */}
          <circle cx="0" cy="0" r="2" fill="#8B1538" fillOpacity="0.9" />
        </svg>
      </div>
    </div>
  );
}
