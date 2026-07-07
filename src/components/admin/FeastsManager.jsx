'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { saveRow, deleteRow } from '@/lib/admin/db';

const EMPTY = {
  date_en: '',
  date_am: '',
  title_en: '',
  title_am: '',
  display_order: 0
};

export default function FeastsManager({ supabase }) {
  const [list, setList] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    const { data, error } = await supabase
      .from('annual_feasts')
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
      await saveRow(supabase, 'annual_feasts', payload);
      setEditing(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item) => {
    if (!window.confirm(`Delete ${item.title_en || 'this feast'}?`)) return;
    try { 
      await deleteRow(supabase, 'annual_feasts', item.id); 
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
          <h2>{item.id ? 'Edit Annual Feast' : 'New Annual Feast'}</h2>
          <div className="admin-header-actions">
            <button className="admin-btn" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </div>
        {error && <p className="admin-error">{error}</p>}
        
        <form className="admin-card" onSubmit={save}>
          <div className="admin-grid-2">
            <Field label="Date (EN) (e.g. Meskerem 21)">
              <input className="admin-input" required value={item.date_en || ''} onChange={(e) => change('date_en', e.target.value)} placeholder="e.g. Meskerem 21" />
            </Field>

            <Field label="Date (AM) (e.g. መስከረም ፳፩)">
              <input className="admin-input admin-input-am" required value={item.date_am || ''} onChange={(e) => change('date_am', e.target.value)} placeholder="e.g. መስከረም ፳፩" />
            </Field>

            <Field label="Title (EN)">
              <input className="admin-input" required value={item.title_en || ''} onChange={(e) => change('title_en', e.target.value)} placeholder="e.g. Emme Bizuhaan Maryam" />
            </Field>
            
            <Field label="Title (AM)">
              <input className="admin-input admin-input-am" required value={item.title_am || ''} onChange={(e) => change('title_am', e.target.value)} placeholder="e.g. እመ ብዙኃን ማርያም" />
            </Field>

            <Field label="Display Order">
              <input className="admin-input" type="number" required value={item.display_order} onChange={(e) => change('display_order', e.target.value)} />
            </Field>
          </div>

          <button className="admin-btn admin-btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save Feast'}</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>Major Annual Feasts</h2>
        <div className="admin-header-actions">
          <button className="admin-btn admin-btn-primary" onClick={() => setEditing({ ...EMPTY })} >+ Add Feast</button>
        </div>
      </div>
      {error && <p className="admin-error">{error}</p>}
      
      {loading ? (
        <p className="admin-status">Loading feasts…</p>
      ) : (
        <div className="admin-list">
          {list.length === 0 && <p className="admin-status">No annual feasts scheduled yet.</p>}
          {list.map((item) => (
            <div className="admin-row" key={item.id}>
              <div className="admin-row-thumb" style={{ background: 'var(--gold-dark)', color: 'white', fontSize: '0.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                #{item.display_order}
              </div>
              <div className="admin-row-main">
                <div className="admin-row-title">
                  {item.title_en}
                  <span className="admin-badge" style={{ backgroundColor: '#e2e6ef', color: '#0f1b3d' }}>{item.date_en}</span>
                </div>
                <div className="admin-row-sub">
                  Amharic: {item.title_am} ({item.date_am}) | Order: {item.display_order}
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
