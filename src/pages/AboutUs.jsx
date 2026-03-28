import React, { useState, useEffect, useRef } from 'react';
import './Page.css';
import './AboutUs.css';

const API = process.env.REACT_APP_API_URL || '';

const PILLARS = [
  { title: 'shakti',      body: 'Shakti — the divine feminine force — is also inner strength. Every gathering we hold is an invitation to reconnect with that power within yourself.' },
  { title: 'compassion',  body: 'Rooted in Hindu thought, we lead with empathy, service, and care — for one another and for the communities we are part of.' },
  { title: 'community',   body: 'RU Shakti is a tight-knit circle of women at Rutgers. We grow through satsang-style reflection, open dialogue, and shared human values.' },
];

function useReveal(rootMargin = '0px 0px -18% 0px', resetKey = 0) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.remove('revealed');
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('revealed'); obs.disconnect(); } },
      { threshold: 0.15, rootMargin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [rootMargin, resetKey]);
  return ref;
}


export default function AboutUs({ isActive }) {
  const [eboard, setEboard] = useState([
    { name: 'Anika',  role: 'Co-President', photo: '' },
    { name: 'Maanya', role: 'Co-President', photo: '' },
    { name: 'Kashvi', role: '',             photo: '' },
    { name: 'Sayee',  role: '',             photo: '' },
  ]);

  useEffect(() => {
    fetch(`${API}/api/admin/content`)
      .then(r => r.json())
      .then(data => { if (data.eboard && data.eboard.length) setEboard(data.eboard); })
      .catch(() => {});
  }, []);

  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (!isActive) {
      const t = setTimeout(() => setResetKey(k => k + 1), 950);
      return () => clearTimeout(t);
    }
  }, [isActive]);

  const pillarsRef = useReveal('0px 0px -30% 0px', resetKey);
  const eboardRef  = useReveal('0px 0px -18% 0px', resetKey);
  const storyRef   = useReveal('0px 0px -18% 0px', resetKey);

  return (
    <div className="page">

      <section className="about-hero-wrap">
        <div className="page-hero">
          <h1 className="page-title">about us</h1>
          <p className="page-lead">
            RU Shakti is a student-led organization at Rutgers University–New Brunswick dedicated to
            women's empowerment, leadership development, and community-building through Hindu spirituality and shared human values.
          </p>
        </div>
        <img className="about-logo" src="/rushakti-logo.png" alt="Ru Shakti" />
      </section>

      <section ref={pillarsRef} className="about-pillars reveal-section">
        {PILLARS.map(({ title, body }) => (
          <div key={title} className="pillar">
            <h2 className="pillar-title">{title}</h2>
            <div className="pillar-rule" />
            <p className="pillar-body">{body}</p>
          </div>
        ))}
      </section>

      <section ref={eboardRef} className="about-eboard reveal-section">
        <p className="page-eyebrow">executive board</p>
        <div className="eboard-grid">
          {eboard.map(({ name, role, photo }, i) => (
            <div key={i} className="eboard-card">
              {photo
                ? <img src={photo} alt={name} className="eboard-photo" style={{ objectFit: 'cover' }} />
                : <div className="eboard-photo" />
              }
              <p className="eboard-name">{name}</p>
              <p className="eboard-role">{role}</p>
            </div>
          ))}
        </div>
      </section>

      <section ref={storyRef} className="about-story reveal-section">
        <div className="story-text">
          <h2 className="section-heading">born from reflection,<br />built for women</h2>
          <p className="body-text">
            RU Shakti was founded by two Rutgers students who wanted something the campus didn't yet have —
            a space where women could gather in satsang-style dialogue, explore spirituality and identity,
            and support one another's growth. What began as a small circle of friends meeting to reflect and
            meditate is now a growing community open to all women at Rutgers, regardless of background or belief.
          </p>
        </div>
      </section>
    </div>
  );
}
