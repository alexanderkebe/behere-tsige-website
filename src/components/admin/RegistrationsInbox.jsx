'use client';

import React, { useCallback, useEffect, useState } from 'react';

const STATUSES = ['pending', 'approved', 'rejected'];

export default function RegistrationsInbox({ supabase }) {
  const [subTab, setSubTab] = useState('sunday_school'); // sunday_school | abnet | catechumen
  
  const [ssRegs, setSsRegs] = useState([]);
  const [abnetRegs, setAbnetRegs] = useState([]);
  const [catRegs, setCatRegs] = useState([]);
  const [depts, setDepts] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadSS = useCallback(async () => {
    const { data, error } = await supabase
      .from('ss_registrations')
      .select('*, department:ss_departments(name_en)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    setSsRegs(data || []);
  }, [supabase]);

  const loadAbnet = useCallback(async () => {
    const { data, error } = await supabase
      .from('abnet_registrations')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    setAbnetRegs(data || []);
  }, [supabase]);

  const loadCat = useCallback(async () => {
    const { data, error } = await supabase
      .from('catechumen_registrations')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    setCatRegs(data || []);
  }, [supabase]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      await Promise.all([loadSS(), loadAbnet(), loadCat()]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [loadSS, loadAbnet, loadCat]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const setStatus = async (tableName, item, status) => {
    const { error } = await supabase.from(tableName).update({ status }).eq('id', item.id);
    if (error) {
      setError(error.message);
    } else {
      if (tableName === 'ss_registrations') {
        setSsRegs(prev => prev.map(r => r.id === item.id ? { ...r, status } : r));
      } else if (tableName === 'abnet_registrations') {
        setAbnetRegs(prev => prev.map(r => r.id === item.id ? { ...r, status } : r));
      } else if (tableName === 'catechumen_registrations') {
        setCatRegs(prev => prev.map(r => r.id === item.id ? { ...r, status } : r));
      }
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-header" style={{ borderBottom: 'none', paddingBottom: 0 }}>
        <h2>Registrations Inbox</h2>
      </div>

      {/* Sub tabs selector */}
      <div style={{ display: 'flex', gap: '16px', padding: '0 32px 16px 32px', borderBottom: '1px solid #e2e6ef', background: '#fff', position: 'sticky', top: '70px', zIndex: 9 }}>
        <button className="admin-link-btn" onClick={() => setSubTab('sunday_school')} style={{ textDecoration: 'none', fontSize: '0.9rem', fontWeight: subTab === 'sunday_school' ? 'bold' : 'normal', color: subTab === 'sunday_school' ? 'var(--navy)' : '#6a6a7a', borderBottom: subTab === 'sunday_school' ? '2px solid var(--navy)' : 'none', padding: '8px 0' }}>
          Sunday School ({ssRegs.length})
        </button>
        <button className="admin-link-btn" onClick={() => setSubTab('abnet')} style={{ textDecoration: 'none', fontSize: '0.9rem', fontWeight: subTab === 'abnet' ? 'bold' : 'normal', color: subTab === 'abnet' ? 'var(--navy)' : '#6a6a7a', borderBottom: subTab === 'abnet' ? '2px solid var(--navy)' : 'none', padding: '8px 0' }}>
          Abnet School ({abnetRegs.length})
        </button>
        <button className="admin-link-btn" onClick={() => setSubTab('catechumen')} style={{ textDecoration: 'none', fontSize: '0.9rem', fontWeight: subTab === 'catechumen' ? 'bold' : 'normal', color: subTab === 'catechumen' ? 'var(--navy)' : '#6a6a7a', borderBottom: subTab === 'catechumen' ? '2px solid var(--navy)' : 'none', padding: '8px 0' }}>
          Baptism & Catechism ({catRegs.length})
        </button>
      </div>

      <div style={{ marginTop: '24px' }}>
        {error && <p className="admin-error">{error}</p>}
        {loading ? (
          <p className="admin-status">Loading registrations…</p>
        ) : subTab === 'sunday_school' ? (
          <div className="admin-list">
            {ssRegs.length === 0 && <p className="admin-status">No Sunday School registrations found.</p>}
            {ssRegs.map((r) => (
              <div className={`admin-req admin-req-${r.status}`} key={r.id} style={{ borderLeftColor: r.status === 'approved' ? '#2e7d32' : r.status === 'pending' ? '#c5a044' : '#c62828' }}>
                <div className="admin-req-head">
                  <span className="admin-req-name">{r.full_name}</span>
                  <select
                    className="admin-input admin-req-status"
                    value={r.status}
                    onChange={(e) => setStatus('ss_registrations', r, e.target.value)}
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="admin-req-meta">
                  {r.phone && <span>📞 {r.phone}</span>}
                  {r.email && <span>✉️ {r.email}</span>}
                  {r.date_of_birth && <span>🎂 DOB: {r.date_of_birth}</span>}
                  {r.department && <span>🏫 Dept: <strong>{r.department.name_en}</strong></span>}
                  <span>Submitted: {new Date(r.created_at).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        ) : subTab === 'abnet' ? (
          <div className="admin-list">
            {abnetRegs.length === 0 && <p className="admin-status">No Abnet School registrations found.</p>}
            {abnetRegs.map((r) => (
              <div className={`admin-req admin-req-${r.status}`} key={r.id} style={{ borderLeftColor: r.status === 'approved' ? '#2e7d32' : r.status === 'pending' ? '#c5a044' : '#c62828' }}>
                <div className="admin-req-head">
                  <span className="admin-req-name">{r.full_name}</span>
                  <select
                    className="admin-input admin-req-status"
                    value={r.status}
                    onChange={(e) => setStatus('abnet_registrations', r, e.target.value)}
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="admin-req-meta">
                  {r.phone && <span>📞 {r.phone}</span>}
                  {r.email && <span>✉️ {r.email}</span>}
                  <span>Submitted: {new Date(r.created_at).toLocaleString()}</span>
                </div>
                {r.previous_education && (
                  <p className="admin-req-msg" style={{ background: '#f8f6f0', padding: '10px', borderRadius: '6px', marginTop: '10px' }}>
                    <strong>Prior Education:</strong> {r.previous_education}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="admin-list">
            {catRegs.length === 0 && <p className="admin-status">No Baptism/Catechumen registrations found.</p>}
            {catRegs.map((r) => (
              <div className={`admin-req admin-req-${r.status}`} key={r.id} style={{ borderLeftColor: r.status === 'approved' ? '#2e7d32' : r.status === 'pending' ? '#c5a044' : '#c62828' }}>
                <div className="admin-req-head">
                  <span className="admin-req-name">{r.full_name}</span>
                  <select
                    className="admin-input admin-req-status"
                    value={r.status}
                    onChange={(e) => setStatus('catechumen_registrations', r, e.target.value)}
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="admin-req-meta">
                  {r.phone && <span>📞 {r.phone}</span>}
                  {r.email && <span>✉️ {r.email}</span>}
                  {r.track && <span>🏷️ Track: <strong style={{ textTransform: 'capitalize' }}>{r.track}</strong></span>}
                  <span>Submitted: {new Date(r.created_at).toLocaleString()}</span>
                </div>
                {r.notes && (
                  <p className="admin-req-msg" style={{ background: '#f8f6f0', padding: '10px', borderRadius: '6px', marginTop: '10px' }}>
                    <strong>Notes / Details:</strong> {r.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
