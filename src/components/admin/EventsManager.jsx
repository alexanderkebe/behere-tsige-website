'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { uploadImage } from '@/lib/admin/upload';
import { saveRow, deleteRow } from '@/lib/admin/db';

const EMPTY = {
  title_en: '',
  title_am: '',
  description_en: '',
  description_am: '',
  event_date: '',
  start_time: '',
  location_en: '',
  location_am: '',
  poster_url: '',
  is_main: false
};

export default function EventsManager({ supabase }) {
  const [list, setList] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: false });
    
    if (error) setError(error.message);
    else setList(data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const change = (field, value) => setEditing((e) => ({ ...e, [field]: value }));

  const onPoster = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSaving(true);
    setError('');
    try {
      const url = await uploadImage(supabase, 'events', file);
      change('poster_url', url);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = { ...editing };

    // Format start_time to HH:MM format if needed
    if (payload.start_time && payload.start_time.length > 5) {
      payload.start_time = payload.start_time.substring(0, 5);
    }

    try {
      await saveRow(supabase, 'events', payload);
      setEditing(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item) => {
    if (!window.confirm(`Delete event "${item.title_en}"?`)) return;
    try { await deleteRow(supabase, 'events', item.id); await load(); }
    catch (err) { setError(err.message); }
  };

  if (editing) {
    const item = editing;
    return (
      <div className="admin-panel">
        <div className="admin-header">
          <h2>{item.id ? 'Edit Event' : 'New Event'}</h2>
          <div className="admin-header-actions">
            <button className="admin-btn" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </div>
        {error && <p className="admin-error">{error}</p>}
        
        <form className="admin-card" onSubmit={save}>
          <div className="admin-photo-row">
            <div className="admin-photo-preview" style={{ borderRadius: '6px', width: '120px', height: '80px' }}>
              {item.poster_url ? <img src={item.poster_url} alt="" /> : <span>No poster</span>}
            </div>
            <label className="admin-btn admin-photo-btn">
              {saving ? 'Uploading…' : 'Upload Poster'}
              <input type="file" accept="image/*" hidden onChange={onPoster} />
            </label>
          </div>

          <div className="admin-grid-2">
            <Field label="Event Title (EN)">
              <input className="admin-input" required value={item.title_en} onChange={(e) => change('title_en', e.target.value)} />
            </Field>
            
            <Field label="Event Title (AM)">
              <input className="admin-input admin-input-am" value={item.title_am || ''} onChange={(e) => change('title_am', e.target.value)} />
            </Field>

            <Field label="Event Date">
              <input className="admin-input" type="date" required value={item.event_date || ''} onChange={(e) => change('event_date', e.target.value)} />
            </Field>

            <Field label="Start Time (HH:MM)">
              <input className="admin-input" type="time" value={item.start_time ? item.start_time.substring(0, 5) : ''} onChange={(e) => change('start_time', e.target.value)} />
            </Field>

            <Field label="Location (EN)">
              <input className="admin-input" value={item.location_en || ''} onChange={(e) => change('location_en', e.target.value)} placeholder="e.g. Main Sanctuary" />
            </Field>

            <Field label="Location (AM)">
              <input className="admin-input admin-input-am" value={item.location_am || ''} onChange={(e) => change('location_am', e.target.value)} placeholder="e.g. ዋናው ቤተ መቅደስ" />
            </Field>
          </div>

          <div className="admin-grid-2">
            <Field label="Description (EN)">
              <textarea className="admin-input" rows={3} value={item.description_en || ''} onChange={(e) => change('description_en', e.target.value)} />
            </Field>
            
            <Field label="Description (AM)">
              <textarea className="admin-input admin-input-am" rows={3} value={item.description_am || ''} onChange={(e) => change('description_am', e.target.value)} />
            </Field>
          </div>

          <div className="admin-checks">
            <label className="admin-check">
              <input type="checkbox" checked={!!item.is_main} onChange={(e) => change('is_main', e.target.checked)} />
              Featured / Main Annual Feast
            </label>
          </div>

          <button className="admin-btn admin-btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save Event'}</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>Events Manager</h2>
        <div className="admin-header-actions">
          <button className="admin-btn admin-btn-primary" onClick={() => setEditing({ ...EMPTY })} >+ Add Event</button>
        </div>
      </div>
      {error && <p className="admin-error">{error}</p>}
      
      {loading ? (
        <p className="admin-status">Loading events…</p>
      ) : (
        <div className="admin-list">
          {list.length === 0 && <p className="admin-status">No events found.</p>}
          {list.map((item) => (
            <div className="admin-row" key={item.id}>
              <div className="admin-row-thumb">
                {item.poster_url ? <img src={item.poster_url} alt="" /> : <span>📅</span>}
              </div>
              <div className="admin-row-main">
                <div className="admin-row-title">
                  {item.title_en}
                  {item.is_main && <span className="admin-badge" style={{ backgroundColor: '#fdf0d0', color: '#827717' }}>Featured</span>}
                </div>
                <div className="admin-row-sub">
                  Amharic: {item.title_am || '—'} | Date: {item.event_date} {item.start_time ? `at ${item.start_time.substring(0, 5)}` : ''}
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
