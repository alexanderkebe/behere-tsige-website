'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { saveRow, deleteRow } from '@/lib/admin/db';

const EMPTY = {
  platform: 'youtube',
  title_en: '',
  title_am: '',
  url: '',
  thumb_url: '',
  is_live: false,
  display_order: 0
};

const PLATFORMS = [
  { value: 'youtube', label: 'YouTube' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'web', label: 'Other Web Link' }
];

export default function MediaLinksManager({ supabase }) {
  const [list, setList] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    const { data, error } = await supabase
      .from('media_links')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (error) setError(error.message);
    else setList(data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const change = (field, value) => setEditing((e) => ({ ...e, [field]: value }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = { 
      ...editing,
      display_order: Number(editing.display_order) || 0
    };

    try {
      await saveRow(supabase, 'media_links', payload);
      setEditing(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item) => {
    if (!window.confirm(`Delete media link "${item.title_en}"?`)) return;
    try { await deleteRow(supabase, 'media_links', item.id); await load(); }
    catch (err) { setError(err.message); }
  };

  if (editing) {
    const item = editing;
    return (
      <div className="admin-panel">
        <div className="admin-header">
          <h2>{item.id ? 'Edit Media Link' : 'New Media Link'}</h2>
          <div className="admin-header-actions">
            <button className="admin-btn" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </div>
        {error && <p className="admin-error">{error}</p>}
        
        <form className="admin-card" onSubmit={save}>
          <div className="admin-grid-2">
            <Field label="Platform Type">
              <select className="admin-input" value={item.platform} onChange={(e) => change('platform', e.target.value)}>
                {PLATFORMS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </Field>

            <Field label="Display Order">
              <input className="admin-input" type="number" required value={item.display_order} onChange={(e) => change('display_order', e.target.value)} />
            </Field>

            <Field label="Channel/Link Title (EN)">
              <input className="admin-input" required value={item.title_en} onChange={(e) => change('title_en', e.target.value)} placeholder="e.g. Official YouTube Channel" />
            </Field>
            
            <Field label="Channel/Link Title (AM)">
              <input className="admin-input admin-input-am" value={item.title_am || ''} onChange={(e) => change('title_am', e.target.value)} placeholder="e.g. ኦፊሴላዊ የዩቲዩብ ቻናል" />
            </Field>

            <Field label="Full Link URL">
              <input className="admin-input" type="url" required value={item.url} onChange={(e) => change('url', e.target.value)} placeholder="https://..." />
            </Field>

            <Field label="Thumbnail URL (Optional)">
              <input className="admin-input" value={item.thumb_url || ''} onChange={(e) => change('thumb_url', e.target.value)} placeholder="https://..." />
            </Field>
          </div>

          <div className="admin-checks">
            <label className="admin-check">
              <input type="checkbox" checked={!!item.is_live} onChange={(e) => change('is_live', e.target.checked)} />
              Is Live Stream (Will show a live badge on site)
            </label>
          </div>

          <button className="admin-btn admin-btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save Link'}</button>
        </form>
      </div>
    );
  }

  const getPlatformLabel = (val) => PLATFORMS.find(p => p.value === val)?.label || val;

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>Media Links Manager</h2>
        <div className="admin-header-actions">
          <button className="admin-btn admin-btn-primary" onClick={() => setEditing({ ...EMPTY })} >+ Add Link</button>
        </div>
      </div>
      {error && <p className="admin-error">{error}</p>}
      
      {loading ? (
        <p className="admin-status">Loading links…</p>
      ) : (
        <div className="admin-list">
          {list.length === 0 && <p className="admin-status">No media links configured.</p>}
          {list.map((item) => (
            <div className="admin-row" key={item.id}>
              <div className="admin-row-thumb" style={{ fontSize: '1.2rem' }}>
                {item.platform === 'youtube' ? '🔴' : item.platform === 'facebook' ? '🔵' : item.platform === 'telegram' ? '✈️' : '🌐'}
              </div>
              <div className="admin-row-main">
                <div className="admin-row-title">
                  {item.title_en}
                  {item.is_live && <span className="admin-badge" style={{ backgroundColor: '#ff0000', color: '#fff' }}>LIVE</span>}
                  <span className="admin-badge" style={{ backgroundColor: '#e2e6ef', color: '#0f1b3d' }}>{getPlatformLabel(item.platform)}</span>
                </div>
                <div className="admin-row-sub" style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '600px' }}>
                  Amharic: {item.title_am || '—'} | URL: {item.url} | Order: {item.display_order}
                </div>
              </div>
              <div className="admin-row-actions">
                <button className="admin-btn" onClick={() => setEditing({ ...item })}>Edit</button>
                <button className="admin-btn admin-btn-danger" onClick={() => remove(item)}>Delete</button>
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
