'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { saveRow, deleteRow } from '@/lib/admin/db';

const EMPTY_SERVICE = {
  type: 'fitehat',
  name_en: '',
  name_am: '',
  description_en: '',
  description_am: '',
  price: 0,
  currency: 'ETB'
};

const STATUSES = ['pending', 'completed', 'failed', 'refunded'];

export default function MemorialManager({ supabase }) {
  const [subTab, setSubTab] = useState('packages'); // packages | bookings
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadServices = useCallback(async () => {
    const { data, error } = await supabase.from('memorial_services').select('*');
    if (error) throw error;
    setServices(data || []);
  }, [supabase]);

  const loadBookings = useCallback(async () => {
    const { data, error } = await supabase
      .from('memorial_orders')
      .select('*, service:memorial_services(name_en, name_am)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    setBookings(data || []);
  }, [supabase]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      await Promise.all([loadServices(), loadBookings()]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [loadServices, loadBookings]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const change = (field, value) => setEditing((e) => ({ ...e, [field]: value }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = {
      ...editing,
      price: Number(editing.price) || 0
    };

    try {
      await saveRow(supabase, 'memorial_services', payload);
      setEditing(null);
      await loadServices();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item) => {
    if (!window.confirm(`Delete service "${item.name_en}"?`)) return;
    try { await deleteRow(supabase, 'memorial_services', item.id); await loadServices(); }
    catch (err) { setError(err.message); }
  };

  const updateStatus = async (booking, status) => {
    const { error } = await supabase
      .from('memorial_orders')
      .update({ payment_status: status })
      .eq('id', booking.id);
    
    if (error) {
      setError(error.message);
    } else {
      setBookings((prev) =>
        prev.map((b) => (b.id === booking.id ? { ...b, payment_status: status } : b))
      );
    }
  };

  if (editing) {
    const s = editing;
    return (
      <div className="admin-panel">
        <div className="admin-header">
          <h2>{s.id ? 'Edit Package' : 'New Package'}</h2>
          <div className="admin-header-actions">
            <button className="admin-btn" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </div>
        {error && <p className="admin-error">{error}</p>}
        
        <form className="admin-card" onSubmit={save}>
          <div className="admin-grid-2">
            <Field label="Package Name (EN)">
              <input className="admin-input" required value={s.name_en} onChange={(e) => change('name_en', e.target.value)} />
            </Field>
            
            <Field label="Package Name (AM)">
              <input className="admin-input admin-input-am" value={s.name_am || ''} onChange={(e) => change('name_am', e.target.value)} />
            </Field>

            <Field label="Service Type / Slug">
              <input className="admin-input" required value={s.type} onChange={(e) => change('type', e.target.value)} placeholder="e.g. fitehat" />
            </Field>

            <div className="admin-grid-2" style={{ gap: '8px' }}>
              <Field label="Price">
                <input className="admin-input" type="number" required value={s.price} onChange={(e) => change('price', e.target.value)} />
              </Field>
              <Field label="Currency">
                <input className="admin-input" required value={s.currency} onChange={(e) => change('currency', e.target.value)} />
              </Field>
            </div>
          </div>

          <div className="admin-grid-2">
            <Field label="Description (EN)">
              <textarea className="admin-input" rows={3} value={s.description_en || ''} onChange={(e) => change('description_en', e.target.value)} />
            </Field>
            
            <Field label="Description (AM)">
              <textarea className="admin-input admin-input-am" rows={3} value={s.description_am || ''} onChange={(e) => change('description_am', e.target.value)} />
            </Field>
          </div>

          <button className="admin-btn admin-btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save Package'}</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
        <h2>Memorial Services (Fithat)</h2>
        <div className="admin-header-actions">
          {subTab === 'packages' && (
            <button className="admin-btn admin-btn-primary" onClick={() => setEditing({ ...EMPTY_SERVICE })} >
              + Add Package
            </button>
          )}
        </div>
      </div>

      {/* Sub tabs selector */}
      <div style={{ display: 'flex', gap: '16px', padding: '0 32px 16px 32px', borderBottom: '1px solid #e2e6ef', background: '#fff', position: 'sticky', top: '70px', zIndex: 9 }}>
        <button className={`admin-link-btn ${subTab === 'packages' ? 'active-subtab' : ''}`} onClick={() => setSubTab('packages')} style={{ textDecoration: 'none', fontSize: '0.9rem', fontWeight: subTab === 'packages' ? 'bold' : 'normal', color: subTab === 'packages' ? 'var(--navy)' : '#6a6a7a', borderBottom: subTab === 'packages' ? '2px solid var(--navy)' : 'none', padding: '8px 0' }}>
          Pricing Packages
        </button>
        <button className={`admin-link-btn ${subTab === 'bookings' ? 'active-subtab' : ''}`} onClick={() => setSubTab('bookings')} style={{ textDecoration: 'none', fontSize: '0.9rem', fontWeight: subTab === 'bookings' ? 'bold' : 'normal', color: subTab === 'bookings' ? 'var(--navy)' : '#6a6a7a', borderBottom: subTab === 'bookings' ? '2px solid var(--navy)' : 'none', padding: '8px 0' }}>
          Service Requests / Bookings ({bookings.length})
        </button>
      </div>

      <div style={{ marginTop: '24px' }}>
        {error && <p className="admin-error">{error}</p>}
        {loading ? (
          <p className="admin-status">Loading data…</p>
        ) : subTab === 'packages' ? (
          <div className="admin-list">
            {services.length === 0 && <p className="admin-status">No memorial packages defined yet.</p>}
            {services.map((s) => (
              <div className="admin-row" key={s.id}>
                <div className="admin-row-thumb" style={{ background: '#f8f6f0', color: 'var(--navy)', border: '1px solid rgba(197, 160, 68, 0.3)' }}>
                  ✝️
                </div>
                <div className="admin-row-main">
                  <div className="admin-row-title">
                    {s.name_en}
                    <span className="admin-badge">{s.price} {s.currency}</span>
                  </div>
                  <div className="admin-row-sub">
                    Amharic: {s.name_am || '—'} | Slug: {s.type}
                  </div>
                </div>
                <div className="admin-row-actions">
                  <button className="admin-btn" onClick={() => setEditing({ ...s })}>Edit</button>
                  <button className="admin-btn admin-btn-danger" onClick={() => remove(s)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="admin-list">
            {bookings.length === 0 && <p className="admin-status">No bookings recorded yet.</p>}
            {bookings.map((b) => (
              <div className={`admin-req admin-req-${b.payment_status === 'completed' ? 'new' : b.payment_status === 'refunded' ? 'closed' : 'status-pending'}`} key={b.id} style={{ borderLeftColor: b.payment_status === 'completed' ? '#2e7d32' : b.payment_status === 'pending' ? '#c5a044' : '#9a9aae' }}>
                <div className="admin-req-head">
                  <span className="admin-req-name">Requester: {b.requester_name}</span>
                  <select
                    className="admin-input admin-req-status"
                    value={b.payment_status}
                    onChange={(e) => updateStatus(b, e.target.value)}
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="admin-req-meta">
                  {b.deceased_name && <span>🕊️ Deceased: <strong>{b.deceased_name}</strong></span>}
                  {b.requester_phone && <span>📞 {b.requester_phone}</span>}
                  {b.requester_email && <span>✉️ {b.requester_email}</span>}
                  {b.preferred_date && <span>📅 Date: {b.preferred_date}</span>}
                  <span>💰 {b.amount} ETB</span>
                  {b.chapa_tx_ref && <span style={{ fontFamily: 'monospace' }}>Tx: {b.chapa_tx_ref}</span>}
                  <span>Created: {new Date(b.created_at).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
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
