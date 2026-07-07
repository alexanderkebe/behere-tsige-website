'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { updateRow } from '@/lib/admin/db';

export default function ContributionsInbox({ supabase }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    
    // Joint query to load project title along with the contribution
    const { data, error } = await supabase
      .from('contributions')
      .select('*, donation_projects(title_en, title_am)')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error(error);
      setError(error.message);
    } else {
      setList(data || []);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const markCompleted = async (item) => {
    if (!window.confirm(`Mark contribution from "${item.donor_name}" for ${item.amount} ${item.currency} as Completed? This will update the project progress.`)) return;
    setUpdatingId(item.id);
    
    try {
      // 1. Update contribution status to completed (verified)
      await updateRow(supabase, 'contributions', item.id, { status: 'completed' });

      // 2. Increment project raised_amount if linked
      if (item.project_id) {
        const { data: project, error: projErr } = await supabase
          .from('donation_projects')
          .select('raised_amount')
          .eq('id', item.project_id)
          .single();

        if (projErr) throw projErr;

        const newRaisedAmount = Number(project.raised_amount) + Number(item.amount);
        await updateRow(supabase, 'donation_projects', item.project_id, { raised_amount: newRaisedAmount });
      }

      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredList = list.filter((item) => {
    if (filterStatus === 'all') return true;
    return item.status === filterStatus;
  });

  // Calculate totals for completed donations
  const totalReceived = list
    .filter((item) => item.status === 'completed')
    .reduce((sum, item) => sum + Number(item.amount), 0);

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>Donations & Contributions Inbox</h2>
        <div className="admin-header-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ background: '#f8fafc', padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--navy)' }}>
            Total Received: {totalReceived.toLocaleString()} ETB
          </div>
          <select 
            className="admin-input" 
            style={{ width: '150px', margin: 0 }}
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {error && <p className="admin-error">{error}</p>}

      {loading ? (
        <p>Loading contributions…</p>
      ) : filteredList.length === 0 ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p>No contributions found matching the selected filter.</p>
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Donor</th>
                <th>Project</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Reference</th>
                <th>Status</th>
                <th style={{ width: '150px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((item) => (
                <tr key={item.id}>
                  <td style={{ fontSize: '0.85rem', color: '#666' }}>
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>
                  <td>
                    <strong>{item.donor_name}</strong>
                    {item.is_anonymous && (
                      <span style={{ fontSize: '0.75rem', background: '#fffbeb', color: '#b45309', padding: '0.1rem 0.3rem', borderRadius: '4px', marginLeft: '0.5rem', fontWeight: 'bold' }}>
                        Anon
                      </span>
                    )}
                    {item.donor_email && <div style={{ fontSize: '0.8rem', color: '#666' }}>{item.donor_email}</div>}
                    {item.message && (
                      <div style={{ fontSize: '0.85rem', fontStyle: 'italic', marginTop: '0.4rem', background: '#f8fafc', padding: '0.4rem', borderLeft: '2px solid #ccc', borderRadius: '0 4px 4px 0', color: '#475569' }}>
                        "{item.message}"
                      </div>
                    )}
                  </td>
                  <td>
                    {item.donation_projects ? (
                      <div>
                        <strong>{item.donation_projects.title_en}</strong>
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>{item.donation_projects.title_am}</div>
                      </div>
                    ) : (
                      <em style={{ color: '#999' }}>General Donation</em>
                    )}
                  </td>
                  <td>
                    <strong style={{ color: 'var(--navy)' }}>
                      {Number(item.amount).toLocaleString()} {item.currency}
                    </strong>
                  </td>
                  <td style={{ textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 'bold' }}>{item.method}</td>
                  <td>
                    {item.chapa_tx_ref ? (
                      <code style={{ fontSize: '0.8rem', background: '#f1f5f9', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>
                        {item.chapa_tx_ref}
                      </code>
                    ) : (
                      <span style={{ color: '#999', fontSize: '0.8rem' }}>None</span>
                    )}
                  </td>
                  <td>
                    <span className="admin-badge" style={{
                      background: item.status === 'completed' ? '#f0fdf4' : item.status === 'pending' ? '#fffbeb' : '#fef2f2',
                      color: item.status === 'completed' ? '#16a34a' : item.status === 'pending' ? '#d97706' : '#dc2626',
                      padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold'
                    }}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    {item.status !== 'completed' && (
                      <button 
                        className="admin-btn-action" 
                        disabled={updatingId === item.id} 
                        onClick={() => markCompleted(item)}
                        style={{ background: '#16a34a', color: 'white', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        {updatingId === item.id ? 'Marking...' : 'Mark Completed'}
                      </button>
                    )}
                    {item.status === 'completed' && (
                      <span style={{ color: '#999', fontSize: '0.85rem' }}>Fulfilled</span>
                    )}
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
