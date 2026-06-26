'use client';

import React, { useCallback, useEffect, useState } from 'react';

const EMPTY = {
  bank_name: '',
  account_name: '',
  account_number: '',
  type: 'local',
  swift: '',
  routing: '',
  notes: '',
  display_order: 1
};

export default function BankAccountsManager({ supabase }) {
  const [list, setList] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    const { data, error } = await supabase
      .from('bank_accounts')
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
    const payload = { ...editing };

    try {
      let res;
      if (editing.id) {
        res = await supabase.from('bank_accounts').update(payload).eq('id', editing.id);
      } else {
        const { id, created_at, ...insert } = payload;
        res = await supabase.from('bank_accounts').insert(insert);
      }
      if (res.error) throw res.error;
      setEditing(null);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item) => {
    if (!window.confirm(`Delete bank account "${item.bank_name}" - ${item.account_number}?`)) return;
    const { error } = await supabase.from('bank_accounts').delete().eq('id', item.id);
    if (error) setError(error.message);
    else load();
  };

  if (editing) {
    const item = editing;
    return (
      <div className="admin-panel">
        <div className="admin-header">
          <h2>{item.id ? 'Edit Bank Account' : 'New Bank Account'}</h2>
          <div className="admin-header-actions">
            <button className="admin-btn" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </div>
        {error && <p className="admin-error">{error}</p>}
        
        <form className="admin-card" onSubmit={save}>
          <div className="admin-grid-2">
            <Field label="Bank Name (EN / AM)">
              <input className="admin-input" required value={item.bank_name} onChange={(e) => change('bank_name', e.target.value)} placeholder="e.g. Commercial Bank of Ethiopia" />
            </Field>

            <Field label="Account Name (EN / AM)">
              <input className="admin-input" required value={item.account_name} onChange={(e) => change('account_name', e.target.value)} placeholder="e.g. Bihere Tsige Church" />
            </Field>

            <Field label="Account Number / Email (Zelle)">
              <input className="admin-input" required value={item.account_number} onChange={(e) => change('account_number', e.target.value)} placeholder="e.g. 1000123456789 or email@domain.com" />
            </Field>

            <Field label="Account Type">
              <select className="admin-input" value={item.type} onChange={(e) => change('type', e.target.value)}>
                <option value="local">Local Bank (Ethiopian)</option>
                <option value="us">US Bank / Zelle</option>
                <option value="international">International Swift Transfer</option>
              </select>
            </Field>

            <Field label="SWIFT Code (Optional)">
              <input className="admin-input" value={item.swift || ''} onChange={(e) => change('swift', e.target.value)} placeholder="e.g. CBETETAA" />
            </Field>

            <Field label="Routing Number (Optional)">
              <input className="admin-input" value={item.routing || ''} onChange={(e) => change('routing', e.target.value)} placeholder="e.g. 123456789" />
            </Field>

            <Field label="Display Order (Ascending)">
              <input className="admin-input" type="number" required value={item.display_order} onChange={(e) => change('display_order', Number(e.target.value))} />
            </Field>
          </div>

          <Field label="Account Notes & Memo Instructions (Bilingual)">
            <textarea className="admin-input" rows={2} value={item.notes || ''} onChange={(e) => change('notes', e.target.value)} placeholder="e.g. Please specify name and purpose in memo." />
          </Field>

          <button className="admin-btn admin-btn-primary" type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save Account'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>Bank Accounts & Copy Details</h2>
        <div className="admin-header-actions">
          <button className="admin-btn admin-btn-primary" onClick={() => setEditing({ ...EMPTY })}>
            Add Account
          </button>
        </div>
      </div>

      {error && <p className="admin-error">{error}</p>}

      {loading ? (
        <p>Loading accounts…</p>
      ) : list.length === 0 ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p>No bank accounts set up yet. Click Add Account to create one.</p>
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Bank Name</th>
                <th>Account Name</th>
                <th>Number / Email</th>
                <th>Type</th>
                <th>SWIFT / Routing</th>
                <th style={{ width: '120px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item) => (
                <tr key={item.id}>
                  <td><strong>{item.display_order}</strong></td>
                  <td><strong>{item.bank_name}</strong></td>
                  <td>{item.account_name}</td>
                  <td><code style={{ fontSize: '0.95rem' }}>{item.account_number}</code></td>
                  <td>
                    <span className="admin-badge" style={{
                      background: item.type === 'local' ? '#eff6ff' : item.type === 'us' ? '#fdf2f8' : '#faf5ff',
                      color: item.type === 'local' ? '#2563eb' : item.type === 'us' ? '#db2777' : '#9333ea',
                      padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase'
                    }}>
                      {item.type}
                    </span>
                  </td>
                  <td>
                    {item.swift && <div>SWIFT: <code>{item.swift}</code></div>}
                    {item.routing && <div>Routing: <code>{item.routing}</code></div>}
                    {!item.swift && !item.routing && <span style={{ color: '#999', fontSize: '0.8rem' }}>None</span>}
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button className="admin-btn-action" onClick={() => setEditing(item)}>Edit</button>
                      <button className="admin-btn-action admin-btn-danger" onClick={() => remove(item)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
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
