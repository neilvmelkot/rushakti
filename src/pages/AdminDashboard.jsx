import React, { useState, useEffect, useRef } from 'react';
import './AdminDashboard.css';

const API = process.env.REACT_APP_API_URL || '';

function authHeaders(token) {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

export default function AdminDashboard({ token, onLogout }) {
  useEffect(() => {
    document.documentElement.style.overflow = 'auto';
    document.body.style.overflow = 'auto';
    document.getElementById('root').style.overflow = 'auto';
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.getElementById('root').style.overflow = '';
    };
  }, []);

  const [content,     setContent]     = useState(null);
  const [eboard,      setEboard]      = useState([]);
  const [msg,         setMsg]         = useState('');
  const [saving,      setSaving]      = useState(false);
  const [currPw,      setCurrPw]      = useState('');
  const [newPw,       setNewPw]       = useState('');
  const [pwSaving,    setPwSaving]    = useState(false);

  useEffect(() => {
    fetch(`${API}/api/admin/content`)
      .then(r => r.json())
      .then(data => { setContent(data); setEboard(data.eboard || []); })
      .catch(() => setMsg('Failed to load content'));
  }, []);

  function flash(m) { setMsg(m); setTimeout(() => setMsg(''), 3000); }

  async function toggleApply() {
    try {
      const res  = await fetch(`${API}/api/admin/apply-toggle`, {
        method: 'PUT', headers: authHeaders(token),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setContent(prev => ({ ...prev, applyEnabled: data.applyEnabled }));
      flash(`Applications ${data.applyEnabled ? 'enabled' : 'disabled'}`);
    } catch (err) {
      if (err.message.includes('token')) { onLogout(); return; }
      flash('Error: ' + err.message);
    }
  }

  async function saveEboard() {
    setSaving(true);
    try {
      const res  = await fetch(`${API}/api/admin/eboard`, {
        method:  'PUT',
        headers: authHeaders(token),
        body:    JSON.stringify({ eboard }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setEboard(data);
      flash('Eboard saved');
    } catch (err) {
      if (err.message.includes('token')) { onLogout(); return; }
      flash('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  function updateMember(i, field, value) {
    setEboard(prev => prev.map((m, idx) => idx === i ? { ...m, [field]: value } : m));
  }

  function handlePhoto(i, e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => updateMember(i, 'photo', ev.target.result);
    reader.readAsDataURL(file);
  }

  async function changePassword() {
    if (!currPw || !newPw) { flash('Both fields required'); return; }
    setPwSaving(true);
    try {
      const res  = await fetch(`${API}/api/admin/change-password`, {
        method:  'PUT',
        headers: authHeaders(token),
        body:    JSON.stringify({ currentPassword: currPw, newPassword: newPw }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCurrPw('');
      setNewPw('');
      flash('Password updated — confirmation email sent');
    } catch (err) {
      if (err.message.includes('token')) { onLogout(); return; }
      flash('Error: ' + err.message);
    } finally {
      setPwSaving(false);
    }
  }

  function addMember() {
    setEboard(prev => [...prev, { name: '', role: '', photo: '' }]);
  }

  function removeMember(i) {
    setEboard(prev => prev.filter((_, idx) => idx !== i));
  }

  if (!content) return <div className="admin-dash-loading">Loading…</div>;

  return (
    <div className="admin-dash">
      <header className="admin-dash-header">
        <div className="admin-dash-logo">ru shakti <span>admin</span></div>
        <button className="admin-dash-logout" onClick={onLogout}>log out</button>
      </header>

      {msg && <div className="admin-dash-msg">{msg}</div>}

      <main className="admin-dash-main">

        {/* ── Apply Toggle ── */}
        <section className="admin-section">
          <h2 className="admin-section-title">applications</h2>
          <div className="admin-toggle-row">
            <div className="admin-toggle-info">
              <p className="admin-toggle-status">
                Currently <strong>{content.applyEnabled ? 'open' : 'closed'}</strong>
              </p>
              <p className="admin-toggle-desc">
                {content.applyEnabled
                  ? 'The apply page is live and accepting submissions.'
                  : 'The apply page shows a "coming soon" message.'}
              </p>
            </div>
            <button
              className={`admin-toggle-btn ${content.applyEnabled ? 'on' : 'off'}`}
              onClick={toggleApply}
            >
              {content.applyEnabled ? 'close applications' : 'open applications'}
            </button>
          </div>
        </section>

        {/* ── Calendar ── */}
        <section className="admin-section">
          <h2 className="admin-section-title">events calendar</h2>
          <div className="admin-toggle-row">
            <div className="admin-toggle-info">
              <p className="admin-toggle-status">RU Shakti Google Calendar</p>
              <p className="admin-toggle-desc">Add, edit, or remove events — they'll appear on the site automatically.</p>
            </div>
            <a
              href="https://calendar.google.com/calendar/r?cid=3bdef760f676fd1d7af4a7e66a45c88e57567441e54b05a406fc97a69a069857@group.calendar.google.com"
              target="_blank"
              rel="noreferrer"
              className="admin-toggle-btn off"
              style={{ textDecoration: 'none', display: 'inline-block', textAlign: 'center' }}
            >
              open calendar →
            </a>
          </div>
        </section>

        {/* ── Eboard ── */}
        <section className="admin-section">
          <div className="admin-section-header">
            <h2 className="admin-section-title">executive board</h2>
            <button className="admin-add-btn" onClick={addMember}>+ add member</button>
          </div>

          <div className="admin-eboard-grid">
            {eboard.map((m, i) => (
              <div key={i} className="admin-eboard-card">
                <div className="admin-photo-wrap">
                  {m.photo
                    ? <img src={m.photo} alt={m.name} className="admin-photo-preview" />
                    : <div className="admin-photo-placeholder" />
                  }
                  <label className="admin-photo-upload">
                    {m.photo ? 'change photo' : 'upload photo'}
                    <input type="file" accept="image/*" onChange={e => handlePhoto(i, e)} hidden />
                  </label>
                </div>
                <div className="admin-member-fields">
                  <div className="admin-field">
                    <label>name</label>
                    <input
                      type="text"
                      value={m.name}
                      onChange={e => updateMember(i, 'name', e.target.value)}
                      placeholder="Name"
                    />
                  </div>
                  <div className="admin-field">
                    <label>role</label>
                    <input
                      type="text"
                      value={m.role}
                      onChange={e => updateMember(i, 'role', e.target.value)}
                      placeholder="Role (optional)"
                    />
                  </div>
                  <button className="admin-remove-btn" onClick={() => removeMember(i)}>
                    remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button className="admin-save-btn" onClick={saveEboard} disabled={saving}>
            {saving ? 'saving…' : 'save eboard →'}
          </button>
        </section>

        {/* ── Change Password ── */}
        <section className="admin-section">
          <h2 className="admin-section-title">change password</h2>
          <div className="admin-pw-form">
            <div className="admin-field">
              <label>current password</label>
              <input
                type="password"
                value={currPw}
                onChange={e => setCurrPw(e.target.value)}
                placeholder="Current password"
              />
            </div>
            <div className="admin-field">
              <label>new password</label>
              <input
                type="password"
                value={newPw}
                onChange={e => setNewPw(e.target.value)}
                placeholder="New password"
              />
            </div>
            <button className="admin-save-btn" onClick={changePassword} disabled={pwSaving}>
              {pwSaving ? 'updating…' : 'update password →'}
            </button>
          </div>
        </section>

      </main>
    </div>
  );
}
