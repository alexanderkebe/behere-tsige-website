'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Eye, EyeOff, LockKeyhole } from 'lucide-react';

export default function AdminLogin({ supabase }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError(''); setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw error;
      // AdminApp checks the authenticated user's role before showing the dashboard.
    } catch (err) {
      setError(err.code === 'invalid_credentials'
        ? 'The email or password is incorrect. Please try again.'
        : err.status === 429
          ? 'Too many sign-in attempts. Please wait a few minutes and try again.'
          : 'Unable to sign in. Please check your connection and try again. If this continues, contact the site owner.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login admin-signin">
      <div className="admin-signin-shell">
      <div className="admin-signin-brand">
        <img src="/assets/logo-footer.png" alt="" width="280" height="62" />
        <p>Behere Tsige Mariam</p>
        <span>Church administration</span>
      </div>
      <form className="admin-login-card admin-signin-card" onSubmit={submit} aria-busy={loading}>
        <span className="admin-signin-icon"><LockKeyhole size={22} aria-hidden="true" /></span>
        <h1>Welcome back</h1>
        <p className="admin-login-sub">Sign in to manage your church website.</p>

        <div className="admin-field">
          <label className="admin-field-label" htmlFor="admin-email">Email address</label>
          <input id="admin-email" name="email" className="admin-input" type="email" autoComplete="username" autoCapitalize="none" spellCheck={false} required disabled={loading} placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="admin-field">
          <label className="admin-field-label" htmlFor="admin-password">Password</label>
          <div className="admin-password-wrap">
            <input id="admin-password" name="password" className="admin-input" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required disabled={loading} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" className="admin-password-toggle" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} onClick={() => setShowPassword((shown) => !shown)}>
              {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {error && <p className="admin-error" role="alert">{error}</p>}

        <button type="submit" className="admin-btn admin-btn-primary admin-signin-submit" disabled={loading}>
          {loading ? 'Signing in…' : <>Sign in <ArrowRight size={18} aria-hidden="true" /></>}
        </button>

        <p className="admin-signin-help">Access is for authorized administrators.<br />For password help, contact the site owner.</p>
      </form>
      <Link href="/" className="admin-back-link">← Back to the website</Link>
      </div>
    </main>
  );
}
