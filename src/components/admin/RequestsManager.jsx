'use client';

import React, { useCallback, useEffect, useState } from 'react';

const STATUSES = ['new', 'contacted', 'assigned', 'closed'];

export default function RequestsManager({ supabase }) {
  const [list, setList] = useState([]);
  const [fathers, setFathers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    const [reqRes, fatherRes] = await Promise.all([
      supabase.from('confessor_requests').select('*').order('created_at', { ascending: false }),
      supabase.from('fathers').select('id, full_name_en'),
    ]);
    if (reqRes.error) setError(reqRes.error.message);
    else setList(reqRes.data || []);
    if (!fatherRes.error) {
      const map = {};
      (fatherRes.data || []).forEach((f) => { map[f.id] = f.full_name_en; });
      setFathers(map);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  const setStatus = async (req, status) => {
    const { error } = await supabase.from('confessor_requests').update({ status }).eq('id', req.id);
    if (error) setError(error.message);
    else setList((l) => l.map((r) => (r.id === req.id ? { ...r, status } : r)));
  };

  return (
    <div className="admin-panel">
      <div className="admin-header"><h2>Confessor Requests</h2></div>
      {error && <p className="admin-error">{error}</p>}
      {loading ? <p className="admin-status">Loading…</p> : (
        <div className="admin-list">
          {list.length === 0 && <p className="admin-status">No requests yet.</p>}
          {list.map((r) => (
            <div className={`admin-req admin-req-${r.status}`} key={r.id}>
              <div className="admin-req-head">
                <span className="admin-req-name">{r.requester_name}</span>
                <select
                  className="admin-input admin-req-status"
                  value={r.status}
                  onChange={(e) => setStatus(r, e.target.value)}
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="admin-req-meta">
                {r.phone && <span>📞 {r.phone}</span>}
                {r.email && <span>✉️ {r.email}</span>}
                {r.preferred_father_id && <span>🙏 {fathers[r.preferred_father_id] || 'father'}</span>}
                <span>{new Date(r.created_at).toLocaleString()}</span>
              </div>
              {r.message && <p className="admin-req-msg">{r.message}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
