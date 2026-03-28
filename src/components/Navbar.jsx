import React, { useState } from 'react';
import './Navbar.css';

const LINKS = [
  { label: 'about us', index: 1 },
  { label: 'events',   index: 2 },
  { label: 'apply',    index: 3 },
];

export default function Navbar({ active, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const go = (index) => {
    onNavigate(index);
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <button className="nav-brand" onClick={() => go(0)}>ru shakti</button>

      <button
        className={`nav-hamburger${menuOpen ? ' open' : ''}`}
        onClick={() => setMenuOpen(v => !v)}
        aria-label="menu"
      >
        <span /><span /><span />
      </button>

      <ul className={`nav-links${menuOpen ? ' open' : ''}`}>
        {LINKS.map(({ label, index }) => (
          <li key={index}>
            <button
              className={`nav-link${active === index ? ' active' : ''}`}
              onClick={() => go(index)}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
