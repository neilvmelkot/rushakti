import React, { useState, useEffect } from 'react';
import './AdminLogin.css';

const API = process.env.REACT_APP_API_URL || '';

export default function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

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

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res  = await fetch(`${API}/api/auth/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      localStorage.setItem('ru_admin_token', data.token);
      onLogin(data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-box">
        <p className="admin-login-eyebrow">admin</p>
        <h1 className="admin-login-title">ru shakti</h1>
        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div className="admin-field">
            <label htmlFor="al-username">username</label>
            <input
              id="al-username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </div>
          <div className="admin-field">
            <label htmlFor="al-password">password</label>
            <input
              id="al-password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          {error && <p className="admin-login-error">{error}</p>}
          <button className="admin-login-btn" type="submit" disabled={loading}>
            {loading ? 'signing in…' : 'sign in →'}
          </button>
        </form>
      </div>
    </div>
  );
}
