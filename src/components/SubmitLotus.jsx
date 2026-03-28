import React from 'react';
import './SubmitLotus.css';

const C = '#8B1538';
const OUTER = 'M 0 0 C -10 -14 -12 -32 0 -52 C 12 -32 10 -14 0 0';
const INNER = 'M 0 0 C -6  -9  -7 -20 0 -32 C  7 -20  6  -9 0 0';
const OUTER_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];
const INNER_ANGLES = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5];

export default function SubmitLotus() {
  return (
    <svg
      className="submit-lotus"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* outer ring */}
      {OUTER_ANGLES.map(a => (
        <path key={`o${a}`} d={OUTER} fill={C} opacity="0.3"
          transform={`translate(100,100) rotate(${a})`} />
      ))}
      {/* inner ring, offset 22.5° */}
      {INNER_ANGLES.map(a => (
        <path key={`i${a}`} d={INNER} fill={C} opacity="0.5"
          transform={`translate(100,100) rotate(${a})`} />
      ))}
      {/* centre rings */}
      <circle cx="100" cy="100" r="7"  fill="none" stroke={C} strokeWidth="0.8" opacity="0.5" />
      <circle cx="100" cy="100" r="3"  fill={C} opacity="0.55" />
    </svg>
  );
}
