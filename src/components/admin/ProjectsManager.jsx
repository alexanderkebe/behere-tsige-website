'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { uploadImage } from '@/lib/admin/upload';
import { saveRow, deleteRow } from '@/lib/admin/db';

const EMPTY = {
  title_en: '',
  title_am: '',
  description_en: '',
  description_am: '',
  read_more_en: '',
  read_more_am: '',
  category: 'general',
  goal_amount: 100000,
  raised_amount: 0,
  currency: 'ETB',
  status: 'active',
  cover_url: ''
};

export default function ProjectsManager({ supabase }) {
  const [list, setList] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    const { data, error } = await supabase
      .from('donation_projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) setError(error.message);
    else setList(data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const change = (field, value) => setEditing((e) => ({ ...e, [field]: value }));

  const onCover = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSaving(true);
    setError('');
    try {
      const url = await uploadImage(supabase, 'donations', file);
      change('cover_url', url);
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

    try {
      await saveRow(supabase, 'donation_projects', payload);
      setEditing(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item) => {
    if (!window.confirm(`Delete donation project "${item.title_en}"?`)) return;
    try { await deleteRow(supabase, 'donation_projects', item.id); await load(); }
    catch (err) { setError(err.message); }
  };

  if (editing) {
    const item = editing;
    return (
      <div className="admin-panel">
        <div className="admin-header">
          <h2>{item.id ? 'Edit Donation Project' : 'New Donation Project'}</h2>
          <div className="admin-header-actions">
            <button className="admin-btn" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </div>
        {error && <p className="admin-error">{error}</p>}
        
        <form className="admin-card" onSubmit={save}>
          <div className="admin-photo-row">
            <div className="admin-photo-preview" style={{ borderRadius: '6px', width: '120px', height: '80px' }}>
              {item.cover_url ? <img src={item.cover_url} alt="" /> : <span>No Cover</span>}
            </div>
            <label className="admin-btn admin-photo-btn">
              {saving ? 'Uploading…' : 'Upload Cover Image'}
              <input type="file" accept="image/*" hidden onChange={onCover} />
            </label>
          </div>

          <div className="admin-grid-2">
            <Field label="Project Title (EN)">
              <input className="admin-input" required value={item.title_en} onChange={(e) => change('title_en', e.target.value)} />
            </Field>
            
            <Field label="Project Title (AM)">
              <input className="admin-input admin-input-am" value={item.title_am || ''} onChange={(e) => change('title_am', e.target.value)} />
            </Field>

            <Field label="Goal Amount (ETB)">
              <input className="admin-input" type="number" required value={item.goal_amount} onChange={(e) => change('goal_amount', Number(e.target.value))} />
            </Field>

            <Field label="Raised Amount (ETB) - Manually Adjusted">
              <input className="admin-input" type="number" required value={item.raised_amount} onChange={(e) => change('raised_amount', Number(e.target.value))} />
            </Field>

            <Field label="Category">
              <select className="admin-input" value={item.category} onChange={(e) => change('category', e.target.value)}>
                <option value="general">General</option>
                <option value="parish">Parish</option>
                <option value="sunday_school">Sunday School</option>
                <option value="abnet">Abnet School</option>
              </select>
            </Field>

            <Field label="Status">
              <select className="admin-input" value={item.status} onChange={(e) => change('status', e.target.value)}>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
            </Field>
          </div>

          <Field label="Short Description (EN)">
            <textarea className="admin-input" rows={2} required value={item.description_en || ''} onChange={(e) => change('description_en', e.target.value)} />
          </Field>

          <Field label="Short Description (AM)">
            <textarea className="admin-input admin-input-am" rows={2} value={item.description_am || ''} onChange={(e) => change('description_am', e.target.value)} />
          </Field>

          <Field label="Full Details & Accomplishments (EN) - Expandable Read More">
            <textarea className="admin-input" rows={4} value={item.read_more_en || ''} onChange={(e) => change('read_more_en', e.target.value)} />
          </Field>

          <Field label="Full Details & Accomplishments (AM) - Expandable Read More">
            <textarea className="admin-input admin-input-am" rows={4} value={item.read_more_am || ''} onChange={(e) => change('read_more_am', e.target.value)} />
          </Field>

          <button className="admin-btn admin-btn-primary" type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save Project'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>Donation Projects</h2>
        <div className="admin-header-actions">
          <button className="admin-btn admin-btn-primary" onClick={() => setEditing({ ...EMPTY })}>
            Create Project
          </button>
        </div>
      </div>

      {error && <p className="admin-error">{error}</p>}

      {loading ? (
        <p>Loading projects…</p>
      ) : list.length === 0 ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p>No active donation projects found. Click Create Project to add one.</p>
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Cover</th>
                <th>Title (EN / AM)</th>
                <th>Category</th>
                <th>Goal</th>
                <th>Raised</th>
                <th>Progress</th>
                <th>Status</th>
                <th style={{ width: '120px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item) => {
                const percent = Math.min(100, Math.round((item.raised_amount / item.goal_amount) * 100));
                return (
                  <tr key={item.id}>
                    <td>
                      {item.cover_url ? (
                        <img src={item.cover_url} alt="" style={{ width: '50px', height: '35px', objectFit: 'cover', borderRadius: '4px' }} />
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: '#999' }}>No img</span>
                      )}
                    </td>
                    <td>
                      <strong>{item.title_en}</strong>
                      <div className="admin-text-am" style={{ fontSize: '0.85rem', color: '#666' }}>{item.title_am}</div>
                    </td>
                    <td style={{ textTransform: 'capitalize' }}>{item.category}</td>
                    <td>{Number(item.goal_amount).toLocaleString()} {item.currency}</td>
                    <td>{Number(item.raised_amount).toLocaleString()} {item.currency}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '60px', height: '6px', background: '#eee', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${percent}%`, height: '100%', background: 'var(--gold)' }}></div>
                        </div>
                        <span style={{ fontSize: '0.8rem' }}>{percent}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={`admin-badge badge-${item.status}`} style={{
                        background: item.status === 'active' ? '#f0fdf4' : item.status === 'completed' ? '#eff6ff' : '#f1f5f9',
                        color: item.status === 'active' ? '#16a34a' : item.status === 'completed' ? '#2563eb' : '#475569',
                        padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold'
                      }}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <div className="admin-actions">
                        <button className="admin-btn-action" onClick={() => setEditing(item)}>Edit</button>
                        <button className="admin-btn-action admin-btn-danger" onClick={() => remove(item)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="admin-field" style={{ display: 'block', marginBottom: '1.2rem' }}>
      <span className="admin-field-label" style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.4rem' }}>{label}</span>
      {children}
    </label>
  );
}
