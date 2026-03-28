import React, { useState, useRef } from 'react';
import './EyePanel.css';

export default function EyePanel() {
  const [animKey, setAnimKey] = useState(0);
  const [closing, setClosing] = useState(false);
  const isInitial = useRef(true);

  function handleMouseEnter() {
    isInitial.current = false;
    setClosing(true);
    setAnimKey(k => k + 1);
  }

  function handleMouseLeave() {
    setClosing(false);
    setAnimKey(k => k + 1);
  }

  const animClass = closing
    ? 'eye-closing'
    : isInitial.current ? '' : 'eye-open-quick';

  return (
    <div
      className="eye-wrap"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img className="eye-img eye-open" src="/eye-open.svg" alt="" draggable={false} />
      <img
        key={animKey}
        className={`eye-img eye-closed ${animClass}`}
        src="/eye-closed.svg"
        alt=""
        draggable={false}
      />
    </div>
  );
}
