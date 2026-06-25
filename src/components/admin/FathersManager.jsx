'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { uploadImage } from '@/lib/admin/upload';

const EMPTY = {
  full_name_en: '', full_name_am: '', title_en: '', title_am: '', role: 'confessor',
  bio_en: '', bio_am: '', photo_url: '', is_confessor: false, is_penance_father: false,
  phone: '', email: '', display_order: 0, is_published: true,
};

const ROLES = ['head_priest', 'senior_priest', 'confessor', 'deacon', 'teacher', 'priest'];

export default function FathersManager({ supabase }) {
  const [list, setList] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    const { data, error } = await supabase.from('fathers').select('*').order('display_order');
    if (error) setError(error.message); else setList(data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  const change = (field, value) => setEditing((e) => ({ ...e, [field]: value }));

  const onPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSaving(true); setError('');
    try { change('photo_url', await uploadImage(supabase, 'fathers', file)); }
    catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const save = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    const payload = { ...editing, display_order: Number(editing.display_order) || 0 };
    try {
      let res;
      if (editing.id) res = await supabase.from('fathers').update(payload).eq('id', editing.id);
      else { const { id, created_at, ...insert } = payload; res = await supabase.from('fathers').insert(insert); }
      if (res.error) throw res.error;
      setEditing(null); await load();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const remove = async (f) => {
    if (!window.confirm(`Delete ${f.full_name_en}?`)) return;
    const { error } = await supabase.from('fathers').delete().eq('id', f.id);
    if (error) setError(error.message); else load();
  };

  if (editing) {
    const f = editing;
    return (
      <div className="admin-panel">
        <div className="admin-header">
          <h2>{f.id ? 'Edit Father' : 'New Father'}</h2>
          <div className="admin-header-actions">
            <button className="admin-btn" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </div>
        {error && <p className="admin-error">{error}</p>}
        <form className="admin-card" onSubmit={save}>
          <div className="admin-photo-row">
            <div className="admin-photo-preview">
              {f.photo_url ? <img src={f.photo_url} alt="" /> : <span>No photo</span>}
            </div>
            <label className="admin-btn admin-photo-btn">
              {saving ? 'Uploading…' : 'Upload photo'}
              <input type="file" accept="image/*" hidden onChange={onPhoto} />
            </label>
          </div>

          <div className="admin-grid-2">
            <Field label="Full name (EN)"><input className="admin-input" required value={f.full_name_en} onChange={(e) => change('full_name_en', e.target.value)} /></Field>
            <Field label="Full name (AM)"><input className="admin-input admin-input-am" value={f.full_name_am || ''} onChange={(e) => change('full_name_am', e.target.value)} /></Field>
            <Field label="Title (EN)"><input className="admin-input" value={f.title_en || ''} onChange={(e) => change('title_en', e.target.value)} /></Field>
            <Field label="Title (AM)"><input className="admin-input admin-input-am" value={f.title_am || ''} onChange={(e) => change('title_am', e.target.value)} /></Field>
          </div>

          <Field label="Role">
            <select className="admin-input" value={f.role || ''} onChange={(e) => change('role', e.target.value)}>
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </Field>

          <div className="admin-grid-2">
            <Field label="Bio (EN)"><textarea className="admin-input" rows={3} value={f.bio_en || ''} onChange={(e) => change('bio_en', e.target.value)} /></Field>
            <Field label="Bio (AM)"><textarea className="admin-input admin-input-am" rows={3} value={f.bio_am || ''} onChange={(e) => change('bio_am', e.target.value)} /></Field>
            <Field label="Phone"><input className="admin-input" value={f.phone || ''} onChange={(e) => change('phone', e.target.value)} /></Field>
            <Field label="Email"><input className="admin-input" value={f.email || ''} onChange={(e) => change('email', e.target.value)} /></Field>
            <Field label="Display order"><input className="admin-input" type="number" value={f.display_order} onChange={(e) => change('display_order', e.target.value)} /></Field>
          </div>

          <div className="admin-checks">
            <label className="admin-check"><input type="checkbox" checked={!!f.is_confessor} onChange={(e) => change('is_confessor', e.target.checked)} /> Confessor</label>
            <label className="admin-check"><input type="checkbox" checked={!!f.is_penance_father} onChange={(e) => change('is_penance_father', e.target.checked)} /> Penance father</label>
            <label className="admin-check"><input type="checkbox" checked={!!f.is_published} onChange={(e) => change('is_published', e.target.checked)} /> Published</label>
          </div>

          <button className="admin-btn admin-btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>Fathers</h2>
        <div className="admin-header-actions">
          <button className="admin-btn admin-btn-primary" onClick={() => setEditing({ ...EMPTY })}>+ Add Father</button>
        </div>
      </div>
      {error && <p className="admin-error">{error}</p>}
      {loading ? <p className="admin-status">Loading…</p> : (
        <div className="admin-list">
          {list.length === 0 && <p className="admin-status">No fathers yet.</p>}
          {list.map((f) => (
            <div className="admin-row" key={f.id}>
              <div className="admin-row-thumb">
                {f.photo_url ? <img src={f.photo_url} alt="" /> : <span>{(f.full_name_en || '?')[0]}</span>}
              </div>
              <div className="admin-row-main">
                <div className="admin-row-title">
                  {f.full_name_en}
                  {!f.is_published && <span className="admin-badge">hidden</span>}
                </div>
                <div className="admin-row-sub">{f.title_en} · order {f.display_order}</div>
              </div>
              <div className="admin-row-actions">
                <button className="admin-btn" onClick={() => setEditing({ ...f })}>Edit</button>
                <button className="admin-btn admin-btn-danger" onClick={() => remove(f)}>Delete</button>
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
