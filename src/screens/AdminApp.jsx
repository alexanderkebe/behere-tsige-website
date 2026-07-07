'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminDashboard from '@/components/admin/AdminDashboard';
import '@/admin.css';

/**
 * Admin entry point. Resolves the Supabase session and the user's role, then
 * shows the login, an unauthorized notice, or the dashboard. All writes are
 * protected server-side by RLS (only admins can mutate), so the UI gate is a
 * convenience, not the security boundary.
 */
export default function AdminApp() {
  const [supabase] = useState(() => createClient());
  const [status, setStatus] = useState('loading'); // loading | anon | denied | admin
  const [user, setUser] = useState(null);

  useEffect(() => {
    let active = true;

    const resolve = async (sessionUser) => {
      if (!sessionUser) {
        if (active) { setUser(null); setStatus('anon'); }
        return;
      }
      const { data, error } = await supabase
        .from('profiles')
        .select('role, full_name, email')
        .eq('id', sessionUser.id)
        .single();
      if (!active) return;
      if (!error && data && (data.role === 'admin' || data.role === 'super_admin')) {
        setUser({ ...sessionUser, profile: data });
        setStatus('admin');
      } else {
        setUser(sessionUser);
        setStatus('denied');
      }
    };

    supabase.auth.getSession().then(({ data }) => resolve(data.session?.user || null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) =>
      resolve(session?.user || null)
    );

    // Re-verify the session whenever the admin returns to the tab. Supabase
    // refreshes tokens in the background, but if a refresh failed (or the
    // session was revoked) we want the login screen back rather than a
    // dashboard whose saves would silently fail.
    const recheck = () => {
      if (document.visibilityState === 'visible') {
        supabase.auth.getSession().then(({ data }) => resolve(data.session?.user || null));
      }
    };
    document.addEventListener('visibilitychange', recheck);

    return () => {
      active = false;
      sub.subscription.unsubscribe();
      document.removeEventListener('visibilitychange', recheck);
    };
  }, [supabase]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setStatus('anon');
  };

  if (status === 'loading') {
    return <div className="admin-login"><p className="admin-status">Loading…</p></div>;
  }

  if (status === 'anon') {
    return <AdminLogin supabase={supabase} />;
  }

  if (status === 'denied') {
    return (
      <div className="admin-login">
        <div className="admin-login-card">
          <img src="/assets/logo.png" alt="" className="admin-login-logo" />
          <h1>Not authorized</h1>
          <p className="admin-login-sub">
            This account doesn’t have admin access yet.
          </p>
          <button className="admin-btn admin-btn-primary" onClick={signOut}>Sign out</button>
        </div>
      </div>
    );
  }

  return <AdminDashboard supabase={supabase} user={user} onSignOut={signOut} />;
}
