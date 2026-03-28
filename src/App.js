import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar    from './components/Navbar';
import PageBorder from './components/PageBorder';
import EyePanel  from './components/EyePanel';
import AboutUs   from './pages/AboutUs';
import Events    from './pages/Events';
import Apply     from './pages/Apply';
import AdminLogin     from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

/* ── Home slide ─────────────────────────────── */
function Home() {
  return (
    <div className="app-home">
      <div className="eye-side"><EyePanel /></div>
      <div className="text-side">
        <div className="brand">
          <span className="brand-word">ru</span>
          <span className="brand-word">shakti</span>
        </div>
        <p className="tagline">women's empowerment · spiritual growth · rutgers university</p>
      </div>
    </div>
  );
}

/* ── Slides definition ──────────────────────── */
const SLIDES = [
  { id: 'home',   Component: Home    },
  { id: 'about',  Component: AboutUs },
  { id: 'events', Component: Events  },
  { id: 'apply',  Component: Apply   },
];

/* ── App ────────────────────────────────────── */
export default function App() {
  const isAdminPath = window.location.pathname.startsWith('/admin');

  // All hooks must be declared unconditionally
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem('ru_admin_token'));
  const [active, setActive] = useState(0);
  const [prev,   setPrev]   = useState(null);
  const lockedRef           = useRef(false);
  const slideRefs           = useRef([]);

  const goTo = useCallback((index) => {
    if (lockedRef.current || index === active || index < 0 || index >= SLIDES.length) return;
    lockedRef.current = true;
    setPrev(active);
    setActive(index);
    const leavingIndex = active;
    setTimeout(() => {
      const leaving = slideRefs.current[leavingIndex];
      if (leaving) leaving.scrollTop = 0;
      setPrev(null);
      lockedRef.current = false;
    }, 950);
  }, [active]);

  /* wheel */
  const wheelAccum    = useRef(0);
  const wheelDecay    = useRef(null);
  const edgeHitTime   = useRef(0);
  const mouseAtEdge   = useRef(false);
  const EDGE_DWELL    = 600; // ms to sit at edge before nav counts (trackpad)

  useEffect(() => {
    const onWheel = (e) => {
      if (lockedRef.current) {
        wheelAccum.current = 0;
        edgeHitTime.current = 0;
        mouseAtEdge.current = false;
        return;
      }
      const el = slideRefs.current[active];
      const scrollable = el && el.scrollHeight > el.clientHeight + 4;

      if (el) {
        const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 4;
        const atTop    = el.scrollTop <= 0;

        if (e.deltaY > 0 && !atBottom) { wheelAccum.current = 0; edgeHitTime.current = 0; mouseAtEdge.current = false; return; }
        if (e.deltaY < 0 && !atTop)    { wheelAccum.current = 0; edgeHitTime.current = 0; mouseAtEdge.current = false; return; }

        // trackpad only: dwell at edge before counting nav input
        const isTrackpad = Math.abs(e.deltaY) < 80;
        if (scrollable && isTrackpad) {
          if (edgeHitTime.current === 0) edgeHitTime.current = Date.now();
          if (Date.now() - edgeHitTime.current < EDGE_DWELL) {
            wheelAccum.current = 0;
            e.preventDefault();
            return;
          }
        }
      }

      e.preventDefault();

      // mouse wheel: require one "settle" click at the edge, then navigate on the next
      const isTrackpad = Math.abs(e.deltaY) < 80;
      if (!isTrackpad) {
        if (!mouseAtEdge.current) {
          mouseAtEdge.current = true;
          e.preventDefault();
          return;
        }
        mouseAtEdge.current = false;
        edgeHitTime.current = 0;
        goTo(e.deltaY > 0 ? active + 1 : active - 1);
        return;
      }

      clearTimeout(wheelDecay.current);
      wheelDecay.current = setTimeout(() => { wheelAccum.current = 0; }, 350);

      wheelAccum.current += Math.min(Math.abs(e.deltaY), 20) * Math.sign(e.deltaY);

      if (wheelAccum.current > 250) {
        wheelAccum.current = 0;
        edgeHitTime.current = 0;
        goTo(active + 1);
      } else if (wheelAccum.current < -250) {
        wheelAccum.current = 0;
        edgeHitTime.current = 0;
        goTo(active - 1);
      }
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [active, goTo]);

  /* touch */
  useEffect(() => {
    let startY = 0;
    const onStart = (e) => { startY = e.touches[0].clientY; };
    const onEnd   = (e) => {
      const diff = startY - e.changedTouches[0].clientY;
      if (Math.abs(diff) < 50) return;
      const el = slideRefs.current[active];
      if (el) {
        const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 4;
        const atTop    = el.scrollTop <= 0;
        if (diff > 0 && !atBottom) return;
        if (diff < 0 && !atTop)    return;
      }
      goTo(diff > 0 ? active + 1 : active - 1);
    };
    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchend',   onEnd,   { passive: true });
    return () => {
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchend',   onEnd);
    };
  }, [active, goTo]);

  // Admin routing — after all hooks
  function handleAdminLogin(token) { setAdminToken(token); }
  function handleAdminLogout() { localStorage.removeItem('ru_admin_token'); setAdminToken(null); }

  if (isAdminPath) {
    if (adminToken) return <AdminDashboard token={adminToken} onLogout={handleAdminLogout} />;
    return <AdminLogin onLogin={handleAdminLogin} />;
  }

  return (
    <>
      <PageBorder />
      <Navbar active={active} onNavigate={goTo} />

      <div className="slides-wrap">
        {SLIDES.map(({ id, Component }, i) => (
          <div
            key={id}
            ref={el => { slideRefs.current[i] = el; }}
            className={`slide ${
              i === active ? 'slide-active' :
              i < active   ? 'slide-above'  :
                              'slide-below'
            }${(i === active || i === prev) ? '' : ' slide-instant'}`}
          >
            <Component isActive={i === active} />
          </div>
        ))}
      </div>
    </>
  );
}
