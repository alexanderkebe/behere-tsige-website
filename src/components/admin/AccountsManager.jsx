'use client';

import React, { useCallback, useEffect, useState } from 'react';

/**
 * Admin account management:
 *  - My Account: display name + password change for the signed-in admin.
 *  - All Accounts: every registered profile with its role; admins promote or
 *    demote accounts through the admin_set_role() RPC (you can't change your
 *    own role, and only a super admin can touch super admin roles).
 * New sign-ups from /admin start as "member" (no access) until promoted here.
 */

const ROLE_LABELS = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  author: 'Author',
  member: 'Member — no access',
};

const ROLE_OPTIONS = ['member', 'author', 'admin', 'super_admin'];

function RoleBadge({ role }) {
  const cls =
    role === 'super_admin' || role === 'admin'
      ? 'admin-badge admin-badge-role-admin'
      : 'admin-badge';
  return <span className={cls}>{ROLE_LABELS[role] || role}</span>;
}

function MyAccountCard({ supabase, user, onProfileSaved }) {
  const [fullName, setFullName] = useState(user?.profile?.full_name || '');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null); // { ok, text }

  const saveProfile = async () => {
    setSaving(true);
    setMsg(null);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName.trim() || null })
        .eq('id', user.id);
      if (error) throw error;
      setMsg({ ok: true, text: 'Name updated.' });
      onProfileSaved?.();
    } catch (e) {
      setMsg({ ok: false, text: e.message });
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async () => {
    setMsg(null);
    if (password.length < 8) {
      setMsg({ ok: false, text: 'Password must be at least 8 characters.' });
      return;
    }
    if (password !== password2) {
      setMsg({ ok: false, text: 'Passwords do not match.' });
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setPassword('');
      setPassword2('');
      setMsg({ ok: true, text: 'Password changed. Use the new password next time you sign in.' });
    } catch (e) {
      setMsg({ ok: false, text: e.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-card">
      <p className="admin-subheading">My Account</p>

      <div className="admin-grid-2">
        <div className="admin-field">
          <label className="admin-field-label">Email</label>
          <input className="admin-input" value={user?.profile?.email || user?.email || ''} disabled />
        </div>
        <div className="admin-field">
          <label className="admin-field-label">Display name</label>
          <input
            className="admin-input"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your name"
          />
        </div>
      </div>
      <div className="admin-header-actions">
        <button className="admin-btn admin-btn-primary" onClick={saveProfile} disabled={saving}>
          Save Name
        </button>
      </div>

      <hr className="admin-divider" />

      <p className="admin-subheading">Change Password</p>
      <div className="admin-grid-2">
        <div className="admin-field">
          <label className="admin-field-label">New password</label>
          <input
            className="admin-input"
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="admin-field">
          <label className="admin-field-label">Confirm new password</label>
          <input
            className="admin-input"
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          />
        </div>
      </div>
      <div className="admin-header-actions">
        <button
          className="admin-btn admin-btn-primary"
          onClick={savePassword}
          disabled={saving || !password}
        >
          Change Password
        </button>
      </div>

      {msg && <p className={msg.ok ? 'admin-status ok' : 'admin-error'}>{msg.text}</p>}
    </div>
  );
}

export default function AccountsManager({ supabase, user }) {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    const { data, error: err } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, created_at')
      .order('created_at', { ascending: true });
    if (err) setError(err.message);
    else setAccounts(data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const changeRole = async (account, newRole) => {
    if (newRole === account.role) return;
    const label = ROLE_LABELS[newRole] || newRole;
    if (!window.confirm(`Change ${account.email} to "${label}"?`)) return;
    setBusyId(account.id);
    setError('');
    try {
      const { error: err } = await supabase.rpc('admin_set_role', {
        target_id: account.id,
        new_role: newRole,
      });
      if (err) throw err;
      setAccounts((rows) => rows.map((r) => (r.id === account.id ? { ...r, role: newRole } : r)));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId(null);
    }
  };

  const isSuper = user?.profile?.role === 'super_admin';

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>Admin Accounts</h2>
        <div className="admin-header-actions">
          <button className="admin-btn" onClick={load} disabled={loading}>
            Refresh
          </button>
        </div>
      </div>

      <MyAccountCard supabase={supabase} user={user} onProfileSaved={load} />

      <div className="admin-card">
        <p className="admin-subheading">All Accounts</p>
        <p className="admin-status">
          New sign-ups from the admin login page start as “Member — no access”. Promote an account
          to Admin to give it full access to this panel; demote it to Member to remove access. You
          cannot change your own role{isSuper ? '' : ', and only a super admin can manage super admin roles'}.
        </p>

        {error && <p className="admin-error">{error}</p>}

        {loading ? (
          <p className="admin-status">Loading accounts…</p>
        ) : (
          <div className="admin-list">
            {accounts.map((a) => {
              const isSelf = a.id === user.id;
              const locked = !isSuper && a.role === 'super_admin';
              return (
                <div className="admin-row" key={a.id}>
                  <div className="admin-row-thumb">
                    {(a.full_name || a.email || '?').charAt(0).toUpperCase()}
                  </div>
                  <div className="admin-row-main">
                    <div className="admin-row-title">
                      {a.full_name || a.email}
                      {isSelf && <span className="admin-badge">You</span>}
                      <RoleBadge role={a.role} />
                    </div>
                    <div className="admin-row-sub">
                      {a.email}
                      {a.created_at && ` · joined ${new Date(a.created_at).toLocaleDateString()}`}
                    </div>
                  </div>
                  <div className="admin-row-actions">
                    {isSelf || locked ? (
                      <span className="admin-status">{isSelf ? '—' : 'Super admin'}</span>
                    ) : (
                      <select
                        className="admin-input admin-role-select"
                        value={a.role}
                        disabled={busyId === a.id}
                        onChange={(e) => changeRole(a, e.target.value)}
                      >
                        {ROLE_OPTIONS.filter((r) => isSuper || r !== 'super_admin').map((r) => (
                          <option key={r} value={r}>
                            {ROLE_LABELS[r]}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
