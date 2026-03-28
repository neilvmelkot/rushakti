import React, { useState, useEffect } from 'react';
import './Page.css';
import './Events.css';

const API_KEY   = process.env.REACT_APP_GOOGLE_API_KEY;
const CAL_ID    = process.env.REACT_APP_CALENDAR_ID;

function parseEvent(item) {
  const raw = item.start.dateTime || item.start.date;
  // parse without shifting timezone for date-only strings
  const d = raw.includes('T') ? new Date(raw) : new Date(raw + 'T00:00:00');
  const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const day   = String(d.getDate()).padStart(2, '0');
  return {
    id:       item.id,
    date:     `${month} ${day}`,
    year:     String(d.getFullYear()),
    title:    item.summary || 'Untitled',
    location: item.location || 'Rutgers University–New Brunswick',
    desc:     item.description || '',
    link:     item.htmlLink,
  };
}

export default function Events() {
  const [events,  setEvents]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!API_KEY || !CAL_ID) {
      setError('Calendar not configured.');
      setLoading(false);
      return;
    }
    const now = new Date().toISOString();
    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CAL_ID)}/events`
      + `?key=${API_KEY}&orderBy=startTime&singleEvents=true`
      + `&timeMin=${encodeURIComponent(now)}&maxResults=20`;

    fetch(url)
      .then(r => r.json())
      .then(data => {
        if (data.error) throw new Error(data.error.message);
        setEvents((data.items || []).map(parseEvent));
        setLoading(false);
      })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  return (
    <div className="page">

      <section className="page-hero">
        <h1 className="page-title">events</h1>
        <p className="page-lead">
          Satsang discussions, workshops, speaker events, and service initiatives.
          Open to all women at Rutgers, regardless of background or belief.
        </p>
      </section>

      <section className="events-grid">
        {loading && <p className="body-text">Loading events…</p>}
        {error   && <p className="body-text">{error}</p>}
        {!loading && !error && events.length === 0 && (
          <p className="body-text">No upcoming events — check back soon.</p>
        )}
        {events.map((ev) => (
          <article key={ev.id} className="event-card">
            <div className="event-date">
              <span className="event-day">{ev.date}</span>
              <span className="event-year">{ev.year}</span>
            </div>
            <div className="event-body">
              <h2 className="event-title">{ev.title}</h2>
              <p className="event-location">{ev.location}</p>
              {ev.desc && <p className="event-desc">{ev.desc}</p>}
            </div>
            <a href={ev.link} target="_blank" rel="noreferrer" className="event-btn">
              view event →
            </a>
          </article>
        ))}
      </section>
    </div>
  );
}
