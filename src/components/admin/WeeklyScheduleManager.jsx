'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { saveRow, deleteRow } from '@/lib/admin/db';

const EMPTY = {
  day_of_week: 'sunday',
  service_type: 'kidase',
  title_en: '',
  title_am: '',
  start_time: '06:00',
  note_en: '',
  note_am: '',
  display_order: 0
};

const SERVICE_TYPES = [
  { value: 'kidase', label: 'Divine Liturgy (Kidase)' },
  { value: 'mahlet', label: 'Mahlet' },
  { value: 'seatat', label: 'Seatat' },
  { value: 'wazema', label: 'Wazema' },
  { value: 'kidan', label: 'Kidan' }
];

export default function WeeklyScheduleManager({ supabase }) {
  const [list, setList] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    const { data, error } = await supabase
      .from('weekly_schedule')
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

    // Clean up start_time to HH:MM format if needed
    if (payload.start_time && payload.start_time.length > 5) {
      payload.start_time = payload.start_time.substring(0, 5);
    }

    try {
      await saveRow(supabase, 'weekly_schedule', payload);
      setEditing(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item) => {
    if (!window.confirm(`Delete ${item.title_en || item.service_type} on ${item.day_of_week}?`)) return;
    try { 
      await deleteRow(supabase, 'weekly_schedule', item.id); 
      await load(); 
    } catch (err) { 
      setError(err.message); 
    }
  };

  if (editing) {
    const item = editing;
    return (
      <div className="admin-panel">
        <div className="admin-header">
          <h2>{item.id ? 'Edit Weekly Service' : 'New Weekly Service'}</h2>
          <div className="admin-header-actions">
            <button className="admin-btn" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </div>
        {error && <p className="admin-error">{error}</p>}
        
        <form className="admin-card" onSubmit={save}>
          <div className="admin-grid-2">
            <Field label="Day of Week (e.g. sunday, monday, sene 21)">
              <input className="admin-input" required value={item.day_of_week || ''} onChange={(e) => change('day_of_week', e.target.value)} placeholder="e.g. sunday" />
            </Field>

            <Field label="Service Type">
              <select className="admin-input" value={item.service_type} onChange={(e) => change('service_type', e.target.value)}>
                {SERVICE_TYPES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </Field>

            <Field label="Title (EN)">
              <input className="admin-input" required value={item.title_en || ''} onChange={(e) => change('title_en', e.target.value)} placeholder="e.g. Holy Liturgy (Kidase)" />
            </Field>
            
            <Field label="Title (AM)">
              <input className="admin-input admin-input-am" value={item.title_am || ''} onChange={(e) => change('title_am', e.target.value)} placeholder="e.g. ቅዳሴ" />
            </Field>

            <Field label="Start Time (HH:MM)">
              <input className="admin-input" type="time" required value={item.start_time ? item.start_time.substring(0, 5) : '06:00'} onChange={(e) => change('start_time', e.target.value)} />
            </Field>

            <Field label="Display Order">
              <input className="admin-input" type="number" required value={item.display_order} onChange={(e) => change('display_order', e.target.value)} />
            </Field>
          </div>

          <div className="admin-grid-2">
            <Field label="Note (EN)">
              <textarea className="admin-input" rows={3} value={item.note_en || ''} onChange={(e) => change('note_en', e.target.value)} placeholder="e.g. Doors open at 5:30 AM" />
            </Field>
            
            <Field label="Note (AM)">
              <textarea className="admin-input admin-input-am" rows={3} value={item.note_am || ''} onChange={(e) => change('note_am', e.target.value)} placeholder="e.g. መቅደስ በ 11:30 ይከፈታል" />
            </Field>
          </div>

          <button className="admin-btn admin-btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save Service'}</button>
        </form>
      </div>
    );
  }

  const cap = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>Weekly Liturgical Schedule</h2>
        <div className="admin-header-actions">
          <button className="admin-btn admin-btn-primary" onClick={() => setEditing({ ...EMPTY })} >+ Add Service</button>
        </div>
      </div>
      {error && <p className="admin-error">{error}</p>}
      
      {loading ? (
        <p className="admin-status">Loading schedule…</p>
      ) : (
        <div className="admin-list">
          {list.length === 0 && <p className="admin-status">No services scheduled yet.</p>}
          {list.map((item) => (
            <div className="admin-row" key={item.id}>
              <div className="admin-row-thumb" style={{ background: 'var(--gold-dark)', color: 'white', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {item.start_time ? item.start_time.substring(0, 5) : '00:00'}
              </div>
              <div className="admin-row-main">
                <div className="admin-row-title">
                  {item.title_en || cap(item.service_type)}
                  <span className="admin-badge" style={{ backgroundColor: '#e2e6ef', color: '#0f1b3d' }}>{cap(item.day_of_week)}</span>
                </div>
                <div className="admin-row-sub">
                  Amharic: {item.title_am || '—'} | Type: {cap(item.service_type)} | Order: {item.display_order}
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
