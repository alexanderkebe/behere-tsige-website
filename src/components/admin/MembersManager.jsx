'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { uploadImage } from '@/lib/admin/upload';

const EMPTY = {
  full_name: '', role_en: '', role_am: '', department: '', photo_url: '',
  contact: '', bio_en: '', bio_am: '', display_order: 0, is_published: true,
};

export default function MembersManager({ supabase }) {
  const [list, setList] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    const { data, error } = await supabase.from('members').select('*').order('display_order');
    if (error) setError(error.message); else setList(data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  const change = (field, value) => setEditing((e) => ({ ...e, [field]: value }));

  const onPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSaving(true); setError('');
    try { change('photo_url', await uploadImage(supabase, 'members', file)); }
    catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const save = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    const payload = { ...editing, display_order: Number(editing.display_order) || 0 };
    try {
      let res;
      if (editing.id) res = await supabase.from('members').update(payload).eq('id', editing.id);
      else { const { id, created_at, ...insert } = payload; res = await supabase.from('members').insert(insert); }
      if (res.error) throw res.error;
      setEditing(null); await load();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const remove = async (m) => {
    if (!window.confirm(`Delete ${m.full_name}?`)) return;
    const { error } = await supabase.from('members').delete().eq('id', m.id);
    if (error) setError(error.message); else load();
  };

  if (editing) {
    const m = editing;
    return (
      <div className="admin-panel">
        <div className="admin-header">
          <h2>{m.id ? 'Edit Member' : 'New Member'}</h2>
          <div className="admin-header-actions">
            <button className="admin-btn" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </div>
        {error && <p className="admin-error">{error}</p>}
        <form className="admin-card" onSubmit={save}>
          <div className="admin-photo-row">
            <div className="admin-photo-preview">
              {m.photo_url ? <img src={m.photo_url} alt="" /> : <span>No photo</span>}
            </div>
            <label className="admin-btn admin-photo-btn">
              {saving ? 'Uploading…' : 'Upload photo'}
              <input type="file" accept="image/*" hidden onChange={onPhoto} />
            </label>
          </div>

          <Field label="Full name"><input className="admin-input" required value={m.full_name} onChange={(e) => change('full_name', e.target.value)} /></Field>

          <div className="admin-grid-2">
            <Field label="Role (EN)"><input className="admin-input" value={m.role_en || ''} onChange={(e) => change('role_en', e.target.value)} /></Field>
            <Field label="Role (AM)"><input className="admin-input admin-input-am" value={m.role_am || ''} onChange={(e) => change('role_am', e.target.value)} /></Field>
            <Field label="Department"><input className="admin-input" value={m.department || ''} onChange={(e) => change('department', e.target.value)} /></Field>
            <Field label="Contact"><input className="admin-input" value={m.contact || ''} onChange={(e) => change('contact', e.target.value)} /></Field>
            <Field label="Bio (EN)"><textarea className="admin-input" rows={3} value={m.bio_en || ''} onChange={(e) => change('bio_en', e.target.value)} /></Field>
            <Field label="Bio (AM)"><textarea className="admin-input admin-input-am" rows={3} value={m.bio_am || ''} onChange={(e) => change('bio_am', e.target.value)} /></Field>
            <Field label="Display order"><input className="admin-input" type="number" value={m.display_order} onChange={(e) => change('display_order', e.target.value)} /></Field>
          </div>

          <div className="admin-checks">
            <label className="admin-check"><input type="checkbox" checked={!!m.is_published} onChange={(e) => change('is_published', e.target.checked)} /> Published</label>
          </div>

          <button className="admin-btn admin-btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>Parish Council</h2>
        <div className="admin-header-actions">
          <button className="admin-btn admin-btn-primary" onClick={() => setEditing({ ...EMPTY })}>+ Add Member</button>
        </div>
      </div>
      {error && <p className="admin-error">{error}</p>}
      {loading ? <p className="admin-status">Loading…</p> : (
        <div className="admin-list">
          {list.length === 0 && <p className="admin-status">No members yet.</p>}
          {list.map((m) => (
            <div className="admin-row" key={m.id}>
              <div className="admin-row-thumb">
                {m.photo_url ? <img src={m.photo_url} alt="" /> : <span>{(m.full_name || '?')[0]}</span>}
              </div>
              <div className="admin-row-main">
                <div className="admin-row-title">
                  {m.full_name}
                  {!m.is_published && <span className="admin-badge">hidden</span>}
                </div>
                <div className="admin-row-sub">{m.role_en} · order {m.display_order}</div>
              </div>
              <div className="admin-row-actions">
                <button className="admin-btn" onClick={() => setEditing({ ...m })}>Edit</button>
                <button className="admin-btn admin-btn-danger" onClick={() => remove(m)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="admin-field">
      <label className="admin-field-label">{label}</label>
      {children}
    </div>
  );
}
