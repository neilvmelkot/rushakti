import React from 'react';
import './RuShaktiLogo.css';

const C = '#8B1538'; // brand crimson

/* ──────────────────────────────────────────────────────
   LOTUS CROWN  (centre: 280, 82)
   Each petal rendered in local space (base at 0,0 tip up)
   then rotated via SVG transform around the lotus centre.
────────────────────────────────────────────────────── */
const CROWN_CX = 280;
const CROWN_CY = 82;

/* petal shapes (base at 0,0, tip pointing up) */
const TEARDROP   = 'M 0 0 C -5 -16 -6 -36 0 -58 C 6 -36 5 -16 0 0';
const BIG_PETAL  = 'M 0 0 C -11 -14 -13 -34 0 -54 C 13 -34 11 -14 0 0';
const MID_PETAL  = 'M 0 0 C -9  -12 -11 -28 0 -44 C 11 -28  9 -12 0 0';
const SM_PETAL   = 'M 0 0 C -7  -10  -9 -22 0 -34 C  9 -22  7 -10 0 0';

const CROWN_PETALS = [
  { d: TEARDROP,  angle: 0,   delay: 0.05 },
  { d: BIG_PETAL, angle: -22, delay: 0.18 },
  { d: BIG_PETAL, angle:  22, delay: 0.18 },
  { d: MID_PETAL, angle: -50, delay: 0.30 },
  { d: MID_PETAL, angle:  50, delay: 0.30 },
  { d: SM_PETAL,  angle: -76, delay: 0.42 },
  { d: SM_PETAL,  angle:  76, delay: 0.42 },
];

/* tip-dot world coordinates */
function tipDot(angle, tipDist, r) {
  const rad = (angle * Math.PI) / 180;
  return {
    x: CROWN_CX + Math.sin(rad) * tipDist,
    y: CROWN_CY - Math.cos(rad) * tipDist,
    r,
  };
}
const CROWN_DOTS = [
  tipDot(0,   60, 4.5),
  tipDot(-22, 56, 3.5),
  tipDot(22,  56, 3.5),
  tipDot(-50, 46, 3.0),
  tipDot(50,  46, 3.0),
];

/* ──────────────────────────────────────────────────────
   BOTTOM LOTUS  (centre: 280, 382)
────────────────────────────────────────────────────── */
const BTM_CX = 280;
const BTM_CY = 382;
const BTM_PETAL = 'M 0 0 C -7 -10 -8 -22 0 -34 C 8 -22 7 -10 0 0';
const BTM_PETALS = [
  { angle:  0,   delay: 5.90 },
  { angle: -28,  delay: 6.00 },
  { angle:  28,  delay: 6.00 },
  { angle: -60,  delay: 6.10 },
  { angle:  60,  delay: 6.10 },
  { angle: -90,  delay: 6.20 },
  { angle:  90,  delay: 6.20 },
];

/* ──────────────────────────────────────────────────────
   EYE PATHS  (right eye; left eye paths are listed separately)
────────────────────────────────────────────────────── */

/* RIGHT EYE
   inner corner → up to lotus base → sweep right to outer corner */
const R_UPPER = 'M 348 192 C 348 145 300 108 286 93 C 350 97 476 143 522 183';
const R_LOWER = 'M 348 192 C 402 218 474 216 522 183';
const R_CURL  = 'M 522 183 C 536 172 542 178 537 191';
const R_IRIS  = { cx: 428, cy: 178, r: 40 };

/* LEFT EYE  (mirror image) */
const L_UPPER = 'M 212 192 C 212 145 260 108 274 93 C 210 97  84 143  38 183';
const L_LOWER = 'M 212 192 C 158 218  86 216  38 183';
const L_CURL  = 'M  38 183 C  24 172  18 178  23 191';
const L_IRIS  = { cx: 132, cy: 178, r: 40 };

/* ──────────────────────────────────────────────────────
   FLOURISH PATHS
────────────────────────────────────────────────────── */
const R_FLOURISH = 'M 328 394 C 352 385 368 396 386 386 C 402 376 418 388 440 380 C 456 373 474 377 504 375';
const L_FLOURISH = 'M 232 394 C 208 385 192 396 174 386 C 158 376 142 388 120 380 C 104 373  86 377  56 375';

const R_DOTS = [{ x: 386, y: 386 }, { x: 440, y: 380 }, { x: 492, y: 376 }];
const L_DOTS = [{ x: 174, y: 386 }, { x: 120, y: 380 }, { x:  68, y: 376 }];

/* ──────────────────────────────────────────────────────
   COMPONENT
────────────────────────────────────────────────────── */
export default function RuShaktiLogo() {
  return (
    <div className="logo-wrapper">
      <svg
        viewBox="0 0 560 520"
        xmlns="http://www.w3.org/2000/svg"
        className="logo-svg"
        aria-label="Ru Shakti"
        overflow="visible"
      >
        {/* ── 1. LOTUS CROWN ──────────────────── */}
        <g>
          {CROWN_PETALS.map((p, i) => (
            <g
              key={i}
              transform={`translate(${CROWN_CX},${CROWN_CY}) rotate(${p.angle})`}
            >
              <path
                d={p.d}
                fill={C}
                className="crown-petal"
                style={{ animationDelay: `${p.delay}s` }}
              />
            </g>
          ))}

          {CROWN_DOTS.map((dot, i) => (
            <circle
              key={`cdot-${i}`}
              cx={dot.x} cy={dot.y} r={dot.r}
              fill={C}
              className="crown-dot"
              style={{ animationDelay: `${0.08 + i * 0.08}s` }}
            />
          ))}
        </g>

        {/* ── 2. EYE OUTLINES ─────────────────── */}
        {/* Right */}
        <path d={R_UPPER} stroke={C} strokeWidth="3.5" fill="none" strokeLinecap="round"
              className="eye-outline r-upper" />
        <path d={R_LOWER} stroke={C} strokeWidth="2.5" fill="none" strokeLinecap="round"
              className="eye-outline r-lower" />
        <path d={R_CURL}  stroke={C} strokeWidth="2"   fill="none" strokeLinecap="round"
              className="eye-curl r-curl" />
        {/* Left */}
        <path d={L_UPPER} stroke={C} strokeWidth="3.5" fill="none" strokeLinecap="round"
              className="eye-outline l-upper" />
        <path d={L_LOWER} stroke={C} strokeWidth="2.5" fill="none" strokeLinecap="round"
              className="eye-outline l-lower" />
        <path d={L_CURL}  stroke={C} strokeWidth="2"   fill="none" strokeLinecap="round"
              className="eye-curl l-curl" />

        {/* ── 3. IRISES ────────────────────────── */}
        <circle cx={R_IRIS.cx} cy={R_IRIS.cy} r={R_IRIS.r}
                fill={C} className="iris r-iris iris-glow-r" />
        <circle cx={L_IRIS.cx} cy={L_IRIS.cy} r={L_IRIS.r}
                fill={C} className="iris l-iris iris-glow-l" />
        {/* subtle highlight dot */}
        <circle cx={R_IRIS.cx + 11} cy={R_IRIS.cy - 12} r={7}
                fill="rgba(255,255,255,0.15)" className="iris r-iris" />
        <circle cx={L_IRIS.cx - 11} cy={L_IRIS.cy - 12} r={7}
                fill="rgba(255,255,255,0.15)" className="iris l-iris" />

        {/* ── 4. BINDI ─────────────────────────── */}
        <circle cx="280" cy="188" r="9.5" fill={C} className="bindi" />

        {/* small accent dots near bridge */}
        {[
          { x: 257, y: 172, d: 4.35 }, { x: 303, y: 172, d: 4.42 },
          { x: 266, y: 162, d: 4.49 }, { x: 294, y: 162, d: 4.56 },
        ].map((dot, i) => (
          <circle key={i} cx={dot.x} cy={dot.y} r={2.2}
                  fill={C} className="bridge-dot"
                  style={{ animationDelay: `${dot.d}s` }} />
        ))}

        {/* ── 5. TEXT ──────────────────────────── */}
        <text
          x="280" y="320"
          textAnchor="middle"
          fontFamily="'Cinzel', 'Trajan Pro', 'Times New Roman', serif"
          fontWeight="700"
          fontSize="54"
          letterSpacing="7"
          fill={C}
          className="logo-text"
        >
          RU SHAKTI
        </text>

        {/* ── 6. BOTTOM LOTUS ──────────────────── */}
        <g>
          {BTM_PETALS.map((p, i) => (
            <g
              key={i}
              transform={`translate(${BTM_CX},${BTM_CY}) rotate(${p.angle})`}
            >
              <path
                d={BTM_PETAL}
                fill={C}
                className="btm-petal"
                style={{ animationDelay: `${p.delay}s` }}
              />
            </g>
          ))}
        </g>

        {/* ── 7. FLOURISHES ────────────────────── */}
        <path d={R_FLOURISH} stroke={C} strokeWidth="2" fill="none" strokeLinecap="round"
              className="flourish-path r-flourish" />
        <path d={L_FLOURISH} stroke={C} strokeWidth="2" fill="none" strokeLinecap="round"
              className="flourish-path l-flourish" />

        {[...R_DOTS, ...L_DOTS].map((dot, i) => (
          <circle key={i} cx={dot.x} cy={dot.y} r={2.5}
                  fill={C} className="flourish-dot"
                  style={{ animationDelay: `${7.10 + i * 0.06}s` }} />
        ))}
      </svg>
    </div>
  );
}
