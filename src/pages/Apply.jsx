import React, { useState, useRef, useEffect } from 'react';
import './Page.css';
import './Apply.css';
import SubmitLotus from '../components/SubmitLotus';

const API = process.env.REACT_APP_API_URL || '';

export default function Apply() {
  const [submitted,    setSubmitted]    = useState(false);
  const [applyEnabled, setApplyEnabled] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/admin/content`)
      .then(r => r.json())
      .then(data => { if (typeof data.applyEnabled === 'boolean') setApplyEnabled(data.applyEnabled); })
      .catch(() => {});
  }, []);
  const fname    = useRef();
  const lname    = useRef();
  const email    = useRef();
  const major    = useRef();
  const position = useRef();
  const why      = useRef();
  const skills   = useRef();

  function handleSubmit(e) {
    e.preventDefault();

    const base = 'https://docs.google.com/forms/d/1hoqOOzNSZ_dTkHF2wOCxv0NRKa0-mQMU415HF0qJbv0/viewform';
    const params = new URLSearchParams();
    params.append('entry.973638685', fname.current.value);
    params.append('entry.2144189589', lname.current.value);
    params.append('entry.954686789', email.current.value);
    params.append('entry.1160736646', major.current.value);
    params.append('entry.910783669', position.current.value);
    params.append('entry.164645515', why.current.value);
    params.append('entry.1496671622', skills.current.value);

    window.open(`${base}?usp=pp_url&${params.toString()}`, '_blank');
    setSubmitted(true);
  }

  return (
    <div className="page">

      <section className="page-hero">
        <h1 className="page-title">apply</h1>
        <p className="page-lead">
          Interested in joining the RU Shakti executive board? Fill out the form below —
          submitting will open a pre-filled Google Form for you to review and submit.
        </p>
      </section>

      <div className="apply-layout">
        <section className="apply-body">
        {!applyEnabled ? (
          <div className="apply-confirmation">
            <h2 className="section-heading">coming soon.</h2>
            <p className="body-text">
              Applications for the next semester will open soon — follow us on Instagram to stay updated.
            </p>
          </div>
        ) : submitted ? (
          <div className="apply-confirmation">
            <h2 className="section-heading">thank you.</h2>
            <p className="body-text">
              Your Google Form should have opened pre-filled and ready to submit.
            </p>
          </div>
        ) : (
          <form className="apply-form" onSubmit={handleSubmit} noValidate>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="fname">first name</label>
                <input ref={fname} id="fname" type="text" required placeholder="your first name" />
              </div>
              <div className="form-field">
                <label htmlFor="lname">last name</label>
                <input ref={lname} id="lname" type="text" required placeholder="your last name" />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="email">rutgers email</label>
              <input ref={email} id="email" type="email" required placeholder="you@rutgers.edu" />
            </div>

            <div className="form-field">
              <label htmlFor="major">major / graduation year</label>
              <input ref={major} id="major" type="text" placeholder="e.g. Psychology, 2027" />
            </div>

            <div className="form-field">
              <label htmlFor="position">position(s) of interest</label>
              <input ref={position} id="position" type="text" placeholder="e.g. treasurer, events coordinator, open to anything…" />
            </div>

            <div className="form-field">
              <label htmlFor="why">why do you want to join the eboard?</label>
              <textarea ref={why} id="why" rows={5} required placeholder="What draws you to this role? What do you hope to contribute to RU Shakti?" />
            </div>

            <div className="form-field">
              <label htmlFor="skills">skills / experience you bring</label>
              <textarea ref={skills} id="skills" rows={3} placeholder="Leadership, event planning, design, social media, etc." />
            </div>

            <button type="submit" className="apply-submit">submit application →</button>
          </form>
        )}
        </section>

        {submitted && (
          <div className="apply-lotus-wrap">
            <SubmitLotus />
          </div>
        )}
      </div>
    </div>
  );
}
