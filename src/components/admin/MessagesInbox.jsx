'use client';

import React, { useCallback, useEffect, useState } from 'react';

const STATUSES = ['new', 'read', 'replied', 'archived'];

export default function MessagesInbox({ supabase }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) setError(error.message);
    else setList(data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const setStatus = async (item, status) => {
    const { error } = await supabase
      .from('contact_messages')
      .update({ status })
      .eq('id', item.id);
    
    if (error) {
      setError(error.message);
    } else {
      setList((prev) => prev.map((msg) => (msg.id === item.id ? { ...msg, status } : msg)));
    }
  };

  const remove = async (item) => {
    if (!window.confirm(`Delete message from ${item.name}?`)) return;
    const { error } = await supabase.from('contact_messages').delete().eq('id', item.id);
    if (error) setError(error.message);
    else load();
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>Contact Messages</h2>
      </div>
      {error && <p className="admin-error">{error}</p>}
      
      {loading ? (
        <p className="admin-status">Loading messages…</p>
      ) : (
        <div className="admin-list">
          {list.length === 0 && <p className="admin-status">No messages received yet.</p>}
          {list.map((r) => (
            <div className={`admin-req admin-req-${r.status}`} key={r.id} style={{ borderLeftColor: r.status === 'new' ? '#2e7d32' : r.status === 'read' ? '#c5a044' : r.status === 'replied' ? '#0f1b3d' : '#9a9aae' }}>
              <div className="admin-req-head">
                <span className="admin-req-name">{r.name}</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select
                    className="admin-input admin-req-status"
                    value={r.status}
                    onChange={(e) => setStatus(r, e.target.value)}
                    style={{ width: 'auto' }}
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button className="admin-btn admin-btn-danger" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => remove(r)}>
                    Delete
                  </button>
                </div>
              </div>
              <div className="admin-req-meta">
                {r.phone && <span>📞 {r.phone}</span>}
                {r.email && <span>✉️ {r.email}</span>}
                {r.subject && <span>📌 Subject: <strong>{r.subject}</strong></span>}
                <span>Received: {new Date(r.created_at).toLocaleString()}</span>
              </div>
              <p className="admin-req-msg" style={{ background: '#f8f6f0', padding: '12px', borderRadius: '6px', marginTop: '10px' }}>
                {r.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
