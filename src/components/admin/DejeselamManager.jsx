'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { getDayDetails, toDateStr } from '../../lib/dejeselam';

/**
 * Project Dejeselam control panel: every meal sponsorship submitted on the
 * website lands here (table dejeselam_sponsorships). Admins confirm/cancel
 * pledges, record payment, and read the reports — day-by-day coverage of the
 * next 30 days plus totals.
 */

const STATUSES = ['pending', 'confirmed', 'paid', 'cancelled'];

const STATUS_BADGE = {
  pending: { text: 'Pending', bg: '#fdf3d7', fg: '#7a5b00' },
  confirmed: { text: 'Confirmed', bg: '#dbe9fb', fg: '#1c5cab' },
  paid: { text: 'Paid', bg: '#e0f2e4', fg: '#1c6b2c' },
  cancelled: { text: 'Cancelled', bg: '#eeedea', fg: '#6d6b64' },
};

const FREQ_LABEL = {
  one_time: 'One-time',
  monthly: 'Monthly (3 mo)',
  year_round: 'Year-round',
};

const compact = (n) => Number(n || 0).toLocaleString();

export default function DejeselamManager({ supabase }) {
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [search, setSearch] = useState('');
  const [view, setView] = useState('sponsorships'); // sponsorships | coverage
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    const { data, error: err } = await supabase
      .from('dejeselam_sponsorships')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1000);
    if (err) setError(err.message);
    else setRows(data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const setStatus = async (row, status) => {
    const { error: err } = await supabase
      .from('dejeselam_sponsorships')
      .update({ status })
      .eq('id', row.id);
    if (err) setError(err.message);
    else setRows((list) => list.map((r) => (r.id === row.id ? { ...r, status } : r)));
  };

  const remove = async (row) => {
    if (!window.confirm(`Delete the sponsorship by ${row.sponsor_name} on ${row.sponsor_date}?`)) return;
    const { error: err } = await supabase.from('dejeselam_sponsorships').delete().eq('id', row.id);
    if (err) setError(err.message);
    else setRows((list) => list.filter((r) => r.id !== row.id));
  };

  /* ---------- reports ---------- */

  const report = useMemo(() => {
    const active = rows.filter((r) => r.status !== 'cancelled');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = toDateStr(today);
    const end = new Date(today);
    end.setDate(end.getDate() + 29);
    const endStr = toDateStr(end);

    const monthStr = todayStr.slice(0, 7);

    let meals30 = 0;
    let capacity30 = 0;
    let pledgedThisMonth = 0;
    let paidTotal = 0;

    const byDate = new Map();
    for (const r of active) {
      if (r.sponsor_date >= todayStr && r.sponsor_date <= endStr) {
        meals30 += r.meals;
        byDate.set(r.sponsor_date, (byDate.get(r.sponsor_date) || 0) + r.meals);
      }
      if (r.sponsor_date.startsWith(monthStr)) pledgedThisMonth += r.meals * (r.meal_price || 170);
      if (r.status === 'paid') paidTotal += r.meals * (r.meal_price || 170);
    }

    // Day-by-day coverage of the next 30 days.
    const days = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      const key = toDateStr(d);
      const details = getDayDetails(key);
      capacity30 += details.capacity;
      days.push({
        date: key,
        label: d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
        meals: byDate.get(key) || 0,
        capacity: details.capacity,
        isFeast: details.isFeast,
        feastName: details.feastName,
      });
    }

    return {
      pending: rows.filter((r) => r.status === 'pending').length,
      meals30,
      coverage30: capacity30 > 0 ? Math.round((meals30 / capacity30) * 100) : 0,
      pledgedThisMonth,
      paidTotal,
      sponsors: new Set(active.map((r) => `${r.sponsor_name}|${r.phone}`)).size,
      days,
    };
  }, [rows]);

  const shown = useMemo(() => {
    let list = filter === 'all' ? rows : rows.filter((r) => r.status === filter);
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (r) =>
          (r.sponsor_name || '').toLowerCase().includes(q) ||
          (r.phone || '').toLowerCase().includes(q) ||
          (r.message || '').toLowerCase().includes(q) ||
          (r.sponsor_date || '').includes(q)
      );
    }
    return list;
  }, [rows, filter, search]);

  const counts = useMemo(() => {
    const c = { all: rows.length };
    for (const s of STATUSES) c[s] = rows.filter((r) => r.status === s).length;
    return c;
  }, [rows]);

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>Project Dejeselam</h2>
        <div className="admin-header-actions">
          <button
            className={`admin-btn ${view === 'sponsorships' ? 'admin-btn-primary' : ''}`}
            onClick={() => setView('sponsorships')}
          >
            Sponsorships{report.pending > 0 ? ` (${report.pending})` : ''}
          </button>
          <button
            className={`admin-btn ${view === 'coverage' ? 'admin-btn-primary' : ''}`}
            onClick={() => setView('coverage')}
          >
            Coverage Report
          </button>
          <button className="admin-btn" onClick={load}>Refresh</button>
        </div>
      </div>

      {error && <p className="admin-error">{error}</p>}
      {loading && <p className="admin-status">Loading sponsorships…</p>}

      {!loading && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: 12,
            marginBottom: 16,
          }}
        >
          {[
            ['Pending requests', compact(report.pending)],
            ['Meals, next 30 days', compact(report.meals30)],
            ['Coverage, next 30 days', `${report.coverage30}%`],
            ['Pledged this month', `${compact(report.pledgedThisMonth)} Br`],
            ['Paid (all time)', `${compact(report.paidTotal)} Br`],
            ['Distinct sponsors', compact(report.sponsors)],
          ].map(([label, value]) => (
            <div
              key={label}
              style={{
                background: '#fff',
                border: '1px solid rgba(11,11,11,0.10)',
                borderRadius: 10,
                padding: '14px 16px',
              }}
            >
              <span style={{ display: 'block', fontSize: '0.78rem', color: '#52514e' }}>{label}</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 600, color: '#0b0b0b' }}>{value}</span>
            </div>
          ))}
        </div>
      )}

      {!loading && view === 'coverage' && (
        <div className="admin-card">
          <p className="admin-status" style={{ marginTop: 0 }}>
            Daily meal goal is 200 (400 on ★ monthly feast days). The bar shows meals already
            sponsored for each of the next 30 days.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {report.days.map((d) => {
              const pct = Math.min(100, (d.meals / d.capacity) * 100);
              return (
                <div
                  key={d.date}
                  style={{ display: 'grid', gridTemplateColumns: '170px 1fr 110px', gap: 10, alignItems: 'center' }}
                >
                  <span style={{ fontSize: '0.8rem', color: '#52514e', whiteSpace: 'nowrap' }}>
                    {d.label} {d.isFeast && <span title={d.feastName}>★</span>}
                  </span>
                  <div style={{ background: '#dbe9fb', borderRadius: 4, height: 12, overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${pct}%`,
                        height: '100%',
                        background: '#2a78d6',
                        borderRadius: pct >= 100 ? 4 : '4px 0 0 4px',
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: '0.78rem',
                      color: '#52514e',
                      textAlign: 'right',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {compact(d.meals)} / {compact(d.capacity)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!loading && view === 'sponsorships' && (
        <>
          <div className="admin-header-actions" style={{ marginBottom: '1rem', flexWrap: 'wrap' }}>
            {['pending', 'confirmed', 'paid', 'cancelled', 'all'].map((f) => (
              <button
                key={f}
                className={`admin-btn ${filter === f ? 'admin-btn-primary' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? 'All' : STATUS_BADGE[f].text} ({counts[f] || 0})
              </button>
            ))}
            <input
              className="admin-input"
              style={{ maxWidth: 240, marginLeft: 'auto' }}
              placeholder="Search name, phone, date…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="admin-list">
            {shown.length === 0 && <p className="admin-status">No sponsorships here.</p>}
            {shown.map((r) => {
              const badge = STATUS_BADGE[r.status] || STATUS_BADGE.pending;
              const amount = r.meals * (r.meal_price || 170);
              return (
                <div className="admin-req" key={r.id}>
                  <div className="admin-req-head">
                    <span className="admin-req-name">{r.sponsor_name}</span>
                    <span className="admin-badge" style={{ backgroundColor: badge.bg, color: badge.fg }}>
                      {badge.text}
                    </span>
                    <span className="admin-badge">{FREQ_LABEL[r.frequency] || r.frequency}</span>
                  </div>
                  <p className="admin-req-meta">
                    {r.sponsor_date} · {compact(r.meals)} meals · {compact(amount)} Br
                    {r.phone ? ` · ${r.phone}` : ''} · submitted {new Date(r.created_at).toLocaleString()}
                  </p>
                  {r.message && <p className="admin-req-msg">“{r.message}”</p>}
                  <div className="admin-row-actions">
                    {r.status === 'pending' && (
                      <button className="admin-btn admin-btn-primary" onClick={() => setStatus(r, 'confirmed')}>
                        Confirm
                      </button>
                    )}
                    {(r.status === 'pending' || r.status === 'confirmed') && (
                      <button className="admin-btn admin-btn-primary" onClick={() => setStatus(r, 'paid')}>
                        Mark Paid
                      </button>
                    )}
                    {r.status !== 'cancelled' && (
                      <button className="admin-btn" onClick={() => setStatus(r, 'cancelled')}>
                        Cancel
                      </button>
                    )}
                    <button className="admin-btn admin-btn-danger" onClick={() => remove(r)}>
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
