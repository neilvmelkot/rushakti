import React from 'react';
import './EyePanel.css';

export default function EyePanel() {
  return (
    <div
      className="eye-wrap"
    >
      <img className="eye-img eye-open" src="/eye-open.svg" alt="" draggable={false} />
      <img
        className="eye-img eye-closed"
        src="/eye-closed.svg"
        alt=""
        draggable={false}
      />
    </div>
  );
}
