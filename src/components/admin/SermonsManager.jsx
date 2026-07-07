'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { uploadImage } from '@/lib/admin/upload';
import { saveRow, deleteRow, saveConfig } from '@/lib/admin/db';

const EMPTY_SERMON = {
  title_en: '',
  title_am: '',
  youtube_url: '',
  display_order: 0
};

const EMPTY_PROGRAM = {
  title_en: '',
  title_am: '',
  description_en: '',
  description_am: '',
  schedule: '',
  poster_url: '',
  display_order: 0
};

export default function SermonsManager({ supabase }) {
  const [subTab, setSubTab] = useState('sermons'); // sermons | programs | text_config
  const [sermons, setSermons] = useState([]);
  const [programs, setPrograms] = useState([]);
  
  // Settings text config
  const [settings, setSettings] = useState({
    head_priest_message_en: '',
    head_priest_message_am: '',
    welcome_verses: ''
  });

  const [editing, setEditing] = useState(null); // EMPTY_SERMON or EMPTY_PROGRAM
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadSermons = useCallback(async () => {
    const { data, error } = await supabase.from('sermons').select('*').order('display_order');
    if (error) throw error;
    setSermons(data || []);
  }, [supabase]);

  const loadPrograms = useCallback(async () => {
    const { data, error } = await supabase.from('gospel_programs').select('*').order('display_order');
    if (error) throw error;
    setPrograms(data || []);
  }, [supabase]);

  const loadSettings = useCallback(async () => {
    const { data, error } = await supabase.from('site_settings').select('*').eq('key', 'evangelism').single();
    if (!error && data) {
      setSettings(data.value || {});
    }
  }, [supabase]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await Promise.all([loadSermons(), loadPrograms(), loadSettings()]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [loadSermons, loadPrograms, loadSettings]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const change = (field, value) => setEditing((e) => ({ ...e, [field]: value }));

  const onPoster = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSaving(true);
    setError('');
    try {
      const url = await uploadImage(supabase, 'gospel_programs', file);
      change('poster_url', url);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const saveSermon = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = {
      ...editing,
      display_order: Number(editing.display_order) || 0
    };

    try {
      await saveRow(supabase, 'sermons', payload);
      setEditing(null);
      await loadSermons();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const saveProgram = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = {
      ...editing,
      display_order: Number(editing.display_order) || 0
    };

    try {
      await saveRow(supabase, 'gospel_programs', payload);
      setEditing(null);
      await loadPrograms();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const removeSermon = async (item) => {
    if (!window.confirm(`Delete sermon "${item.title_en}"?`)) return;
    try { await deleteRow(supabase, 'sermons', item.id); await loadSermons(); }
    catch (err) { setError(err.message); }
  };

  const removeProgram = async (item) => {
    if (!window.confirm(`Delete program "${item.title_en}"?`)) return;
    try { await deleteRow(supabase, 'gospel_programs', item.id); await loadPrograms(); }
    catch (err) { setError(err.message); }
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await saveConfig(supabase, 'evangelism', settings);
      setSuccess('Settings updated successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (editing && subTab === 'sermons') {
    const s = editing;
    return (
      <div className="admin-panel">
        <div className="admin-header">
          <h2>{s.id ? 'Edit Sermon Link' : 'New Sermon Link'}</h2>
          <div className="admin-header-actions">
            <button className="admin-btn" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </div>
        {error && <p className="admin-error">{error}</p>}
        
        <form className="admin-card" onSubmit={saveSermon}>
          <div className="admin-grid-2">
            <Field label="Sermon Title (EN)">
              <input className="admin-input" required value={s.title_en} onChange={(e) => change('title_en', e.target.value)} />
            </Field>
            
            <Field label="Sermon Title (AM)">
              <input className="admin-input admin-input-am" value={s.title_am || ''} onChange={(e) => change('title_am', e.target.value)} />
            </Field>

            <Field label="YouTube URL">
              <input className="admin-input" type="url" required value={s.youtube_url} onChange={(e) => change('youtube_url', e.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
            </Field>

            <Field label="Display Order">
              <input className="admin-input" type="number" required value={s.display_order} onChange={(e) => change('display_order', e.target.value)} />
            </Field>
          </div>

          <button className="admin-btn admin-btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save Sermon'}</button>
        </form>
      </div>
    );
  }

  if (editing && subTab === 'programs') {
    const p = editing;
    return (
      <div className="admin-panel">
        <div className="admin-header">
          <h2>{p.id ? 'Edit Gospel Program' : 'New Gospel Program'}</h2>
          <div className="admin-header-actions">
            <button className="admin-btn" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </div>
        {error && <p className="admin-error">{error}</p>}
        
        <form className="admin-card" onSubmit={saveProgram}>
          <div className="admin-photo-row">
            <div className="admin-photo-preview" style={{ borderRadius: '6px', width: '120px', height: '80px' }}>
              {p.poster_url ? <img src={p.poster_url} alt="" /> : <span>No poster</span>}
            </div>
            <label className="admin-btn admin-photo-btn">
              {saving ? 'Uploading…' : 'Upload Poster/Image'}
              <input type="file" accept="image/*" hidden onChange={onPoster} />
            </label>
          </div>

          <div className="admin-grid-2">
            <Field label="Program Title (EN)">
              <input className="admin-input" required value={p.title_en} onChange={(e) => change('title_en', e.target.value)} />
            </Field>
            
            <Field label="Program Title (AM)">
              <input className="admin-input admin-input-am" value={p.title_am || ''} onChange={(e) => change('title_am', e.target.value)} />
            </Field>

            <Field label="Schedule Text (e.g. Every Monday at 6:00 PM)">
              <input className="admin-input" required value={p.schedule} onChange={(e) => change('schedule', e.target.value)} />
            </Field>

            <Field label="Display Order">
              <input className="admin-input" type="number" required value={p.display_order} onChange={(e) => change('display_order', e.target.value)} />
            </Field>
          </div>

          <div className="admin-grid-2">
            <Field label="Description (EN)">
              <textarea className="admin-input" rows={3} value={p.description_en || ''} onChange={(e) => change('description_en', e.target.value)} />
            </Field>
            
            <Field label="Description (AM)">
              <textarea className="admin-input admin-input-am" rows={3} value={p.description_am || ''} onChange={(e) => change('description_am', e.target.value)} />
            </Field>
          </div>

          <button className="admin-btn admin-btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save Program'}</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
        <h2>Evangelism & Sermons</h2>
        <div className="admin-header-actions">
          {subTab === 'sermons' && (
            <button className="admin-btn admin-btn-primary" onClick={() => setEditing({ ...EMPTY_SERMON })} >
              + Add Sermon Link
            </button>
          )}
          {subTab === 'programs' && (
            <button className="admin-btn admin-btn-primary" onClick={() => setEditing({ ...EMPTY_PROGRAM })} >
              + Add Program
            </button>
          )}
        </div>
      </div>

      {/* Sub tabs selector */}
      <div style={{ display: 'flex', gap: '16px', padding: '0 32px 16px 32px', borderBottom: '1px solid #e2e6ef', background: '#fff', position: 'sticky', top: '70px', zIndex: 9 }}>
        <button className="admin-link-btn" onClick={() => setSubTab('sermons')} style={{ textDecoration: 'none', fontSize: '0.9rem', fontWeight: subTab === 'sermons' ? 'bold' : 'normal', color: subTab === 'sermons' ? 'var(--navy)' : '#6a6a7a', borderBottom: subTab === 'sermons' ? '2px solid var(--navy)' : 'none', padding: '8px 0' }}>
          YouTube Video Sermons
        </button>
        <button className="admin-link-btn" onClick={() => setSubTab('programs')} style={{ textDecoration: 'none', fontSize: '0.9rem', fontWeight: subTab === 'programs' ? 'bold' : 'normal', color: subTab === 'programs' ? 'var(--navy)' : '#6a6a7a', borderBottom: subTab === 'programs' ? '2px solid var(--navy)' : 'none', padding: '8px 0' }}>
          Gospel Program Details
        </button>
        <button className="admin-link-btn" onClick={() => setSubTab('text_config')} style={{ textDecoration: 'none', fontSize: '0.9rem', fontWeight: subTab === 'text_config' ? 'bold' : 'normal', color: subTab === 'text_config' ? 'var(--navy)' : '#6a6a7a', borderBottom: subTab === 'text_config' ? '2px solid var(--navy)' : 'none', padding: '8px 0' }}>
          Evangelism Text & Verses
        </button>
      </div>

      <div style={{ marginTop: '24px' }}>
        {error && <p className="admin-error">{error}</p>}
        {success && <p className="admin-status ok" style={{ color: '#2e7d32', fontWeight: 'bold' }}>{success}</p>}
        
        {loading ? (
          <p className="admin-status">Loading data…</p>
        ) : subTab === 'sermons' ? (
          <div className="admin-list">
            {sermons.length === 0 && <p className="admin-status">No video links defined yet.</p>}
            {sermons.map((s) => (
              <div className="admin-row" key={s.id}>
                <div className="admin-row-thumb" style={{ background: '#f00', color: '#fff' }}>
                  ▶️
                </div>
                <div className="admin-row-main">
                  <div className="admin-row-title">
                    {s.title_en}
                    <span className="admin-badge">order {s.display_order}</span>
                  </div>
                  <div className="admin-row-sub" style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '500px' }}>
                    Amharic: {s.title_am || '—'} | URL: {s.youtube_url}
                  </div>
                </div>
                <div className="admin-row-actions">
                  <button className="admin-btn" onClick={() => setEditing({ ...s })}>Edit</button>
                  <button className="admin-btn admin-btn-danger" onClick={() => removeSermon(s)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        ) : subTab === 'programs' ? (
          <div className="admin-list">
            {programs.length === 0 && <p className="admin-status">No gospel programs defined yet.</p>}
            {programs.map((p) => (
              <div className="admin-row" key={p.id}>
                <div className="admin-row-thumb">
                  {p.poster_url ? <img src={p.poster_url} alt="" /> : <span>📖</span>}
                </div>
                <div className="admin-row-main">
                  <div className="admin-row-title">
                    {p.title_en}
                    <span className="admin-badge">order {p.display_order}</span>
                  </div>
                  <div className="admin-row-sub">
                    Amharic: {p.title_am || '—'} | Schedule: {p.schedule}
                  </div>
                </div>
                <div className="admin-row-actions">
                  <button className="admin-btn" onClick={() => setEditing({ ...p })}>Edit</button>
                  <button className="admin-btn admin-btn-danger" onClick={() => removeProgram(p)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <form className="admin-card" onSubmit={saveSettings}>
            <div className="admin-grid-2">
              <Field label="Head Priest Welcome Message (EN)">
                <textarea className="admin-input" rows={4} value={settings.head_priest_message_en || ''} onChange={(e) => setSettings(prev => ({ ...prev, head_priest_message_en: e.target.value }))} />
              </Field>

              <Field label="Head Priest Welcome Message (AM)">
                <textarea className="admin-input admin-input-am" rows={4} value={settings.head_priest_message_am || ''} onChange={(e) => setSettings(prev => ({ ...prev, head_priest_message_am: e.target.value }))} />
              </Field>

              <Field label="Welcome Verses (e.g. Luke 15:11-32 or Matthew 11:29)">
                <input className="admin-input" value={settings.welcome_verses || ''} onChange={(e) => setSettings(prev => ({ ...prev, welcome_verses: e.target.value }))} />
              </Field>
            </div>

            <button className="admin-btn admin-btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save Settings'}</button>
          </form>
        )}
      </div>
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
