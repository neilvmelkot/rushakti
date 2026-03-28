import React, { useState, useRef } from 'react';
import './EyePanel.css';

export default function EyePanel() {
  const loaded = useRef(0);
  const [ready, setReady] = useState(false);

  function onImgLoad() {
    loaded.current += 1;
    if (loaded.current >= 2) setReady(true);
  }

  return (
    <div className="eye-wrap" style={{ visibility: ready ? 'visible' : 'hidden' }}>
      <img className="eye-img eye-open" src="/eye-open.svg" alt="" draggable={false} onLoad={onImgLoad} />
      <img
        className={`eye-img eye-closed${ready ? ' eye-animate' : ''}`}
        src="/eye-closed.svg"
        alt=""
        draggable={false}
        onLoad={onImgLoad}
      />
    </div>
  );
}
