'use client';

import React, { useState } from 'react';

export default function AdminLogin({ supabase }) {
  const [mode, setMode] = useState('signin'); // signin | signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setInfo(''); setLoading(true);
    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // AdminApp's onAuthStateChange takes over from here.
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) throw error;
        setInfo('Account created. If email confirmation is enabled, confirm via your inbox, then sign in.');
        setMode('signin');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <form className="admin-login-card" onSubmit={submit}>
        <img src="/assets/logo.png" alt="" className="admin-login-logo" />
        <h1>Site Admin</h1>
        <p className="admin-login-sub">
          {mode === 'signin' ? 'Sign in to manage the site' : 'Create an admin account'}
        </p>

        {mode === 'signup' && (
          <div className="admin-field">
            <label className="admin-field-label">Full name</label>
            <input className="admin-input" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
        )}

        <div className="admin-field">
          <label className="admin-field-label">Email</label>
          <input className="admin-input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="admin-field">
          <label className="admin-field-label">Password</label>
          <input className="admin-input" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        {error && <p className="admin-error">{error}</p>}
        {info && <p className="admin-status">{info}</p>}

        <button className="admin-btn admin-btn-primary" disabled={loading}>
          {loading ? '…' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
        </button>

        <button
          type="button"
          className="admin-link-btn"
          onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); setInfo(''); }}
        >
          {mode === 'signin' ? 'Need an account? Sign up' : 'Have an account? Sign in'}
        </button>
      </form>
    </div>
  );
}
