'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

/**
 * Analytics for every recorded interaction: page views, clicks, form submits,
 * language switches, and chat conversations (question + AI reply). Aggregates
 * come from the analytics_summary() RPC (admin-only); the activity feed and
 * response counts read the tables directly under admin RLS.
 */

const RANGES = [
  { days: 7, label: 'Last 7 days' },
  { days: 30, label: 'Last 30 days' },
  { days: 90, label: 'Last 90 days' },
];

const EVENT_LABELS = {
  page_view: 'Page views',
  click: 'Clicks',
  form_submit: 'Form submissions',
  language_switch: 'Language switches',
  chat_message: 'Chat messages',
};

// Tables where visitor responses/submissions are stored (shown as counts).
const RESPONSE_TABLES = [
  { table: 'confessor_requests', label: 'Confessor requests' },
  { table: 'contact_messages', label: 'Contact messages' },
  { table: 'ss_registrations', label: 'Sunday School reg.' },
  { table: 'abnet_registrations', label: 'Abnet reg.' },
  { table: 'catechumen_registrations', label: 'Catechism reg.' },
  { table: 'memorial_orders', label: 'Memorial orders' },
  { table: 'contributions', label: 'Contributions' },
];

const compact = (n) => {
  if (n == null) return '0';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
};

const niceCeil = (n) => {
  if (n <= 5) return 5;
  const pow = 10 ** Math.floor(Math.log10(n));
  for (const m of [1, 2, 5, 10]) if (m * pow >= n) return m * pow;
  return 10 * pow;
};

/** Fill missing days with 0 so the bar chart shows the whole range. */
function fillDays(daily, days) {
  const map = new Map((daily || []).map((d) => [d.day, d.views]));
  const out = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    out.push({ day: key, views: map.get(key) || 0 });
  }
  return out;
}

function StatTile({ label, value }) {
  return (
    <div className="av-tile">
      <span className="av-tile-label">{label}</span>
      <span className="av-tile-value">{compact(value)}</span>
    </div>
  );
}

/** Single-series daily column chart: one hue, rounded data-ends, hover tooltip. */
function DailyViewsChart({ data }) {
  const max = niceCeil(Math.max(1, ...data.map((d) => d.views)));
  const H = 160;
  const gridLines = [1, 0.5]; // max, half (baseline drawn separately)

  return (
    <div className="av-chart">
      <div className="av-plot" style={{ height: H }}>
        {gridLines.map((f) => (
          <div className="av-grid" key={f} style={{ bottom: f * H }}>
            <span className="av-tick">{compact(max * f)}</span>
          </div>
        ))}
        <div className="av-cols">
          {data.map((d) => (
            <div className="av-col" key={d.day}>
              <div
                className="av-bar"
                style={{ height: Math.max(d.views > 0 ? 3 : 0, (d.views / max) * H) }}
              />
              <span className="av-tip">
                {new Date(`${d.day}T00:00:00`).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })}
                {' · '}
                {d.views.toLocaleString()} views
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="av-xaxis">
        <span>{new Date(`${data[0].day}T00:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
        <span>{new Date(`${data[data.length - 1].day}T00:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
      </div>
    </div>
  );
}

/** Horizontal one-hue bars for "top N" breakdowns; value at the bar tip. */
function BarList({ items, nameKey, valueKey }) {
  const max = Math.max(1, ...items.map((i) => i[valueKey]));
  return (
    <div className="av-barlist">
      {items.map((item) => (
        <div className="av-barrow" key={item[nameKey]}>
          <span className="av-barname" title={item[nameKey]}>{item[nameKey]}</span>
          <div className="av-bartrack">
            <div className="av-barfill" style={{ width: `${(item[valueKey] / max) * 100}%` }} />
            <span className="av-barvalue">{item[valueKey].toLocaleString()}</span>
          </div>
        </div>
      ))}
      {items.length === 0 && <p className="av-empty">No data yet.</p>}
    </div>
  );
}

export default function AnalyticsDashboard({ supabase }) {
  const [days, setDays] = useState(30);
  const [summary, setSummary] = useState(null);
  const [recent, setRecent] = useState([]);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [sum, feed, counts] = await Promise.all([
        supabase.rpc('analytics_summary', { days }),
        supabase
          .from('interactions')
          .select('id, event_type, page, session_id, lang, metadata, created_at')
          .order('created_at', { ascending: false })
          .limit(50),
        Promise.all(
          RESPONSE_TABLES.map(async ({ table, label }) => {
            const { count } = await supabase
              .from(table)
              .select('*', { count: 'exact', head: true });
            return { label, count: count || 0 };
          })
        ),
      ]);
      if (sum.error) throw sum.error;
      if (feed.error) throw feed.error;
      setSummary(sum.data);
      setRecent(feed.data || []);
      setResponses(counts);
    } catch (err) {
      setError(err.message || 'Failed to load analytics');
    }
    setLoading(false);
  }, [supabase, days]);

  useEffect(() => {
    load();
  }, [load]);

  const daily = useMemo(
    () => (summary ? fillDays(summary.daily_views, days) : []),
    [summary, days]
  );

  const eventTypes = useMemo(
    () =>
      (summary?.event_types || []).map((e) => ({
        name: EVENT_LABELS[e.type] || e.type,
        count: e.count,
      })),
    [summary]
  );

  const languages = useMemo(
    () =>
      (summary?.languages || []).map((l) => ({
        name: l.lang === 'en' ? 'English' : l.lang === 'am' ? 'Amharic' : l.lang,
        count: l.count,
      })),
    [summary]
  );

  return (
    <div className="admin-panel av-root">
      <style>{AV_CSS}</style>

      <div className="admin-header">
        <h2>Analytics</h2>
        <div className="admin-header-actions">
          {RANGES.map((r) => (
            <button
              key={r.days}
              className={`admin-btn ${days === r.days ? 'admin-btn-primary' : ''}`}
              onClick={() => setDays(r.days)}
            >
              {r.label}
            </button>
          ))}
          <button className="admin-btn" onClick={load}>Refresh</button>
        </div>
      </div>

      {error && <p className="admin-error">{error}</p>}
      {loading && <p className="admin-status">Loading analytics…</p>}

      {!loading && summary && (
        <>
          <div className="av-tiles">
            <StatTile label="Views today" value={summary.views_today} />
            <StatTile label={`Page views (${days}d)`} value={summary.page_views} />
            <StatTile label={`Visitors (${days}d)`} value={summary.sessions} />
            <StatTile label={`Chat messages (${days}d)`} value={summary.chat_messages} />
            <StatTile label={`Form submissions (${days}d)`} value={summary.form_submits} />
            <StatTile label={`All interactions (${days}d)`} value={summary.total_events} />
          </div>

          <div className="admin-card av-card">
            <h3 className="av-h3">Daily page views</h3>
            {daily.length > 0 && <DailyViewsChart data={daily} />}
          </div>

          <div className="av-grid2">
            <div className="admin-card av-card">
              <h3 className="av-h3">Top pages</h3>
              <BarList
                items={(summary.top_pages || []).map((p) => ({ name: p.page, count: p.views }))}
                nameKey="name"
                valueKey="count"
              />
            </div>
            <div className="admin-card av-card">
              <h3 className="av-h3">Interactions by type</h3>
              <BarList items={eventTypes} nameKey="name" valueKey="count" />
              <h3 className="av-h3" style={{ marginTop: '1.25rem' }}>Language of visitors</h3>
              <BarList items={languages} nameKey="name" valueKey="count" />
            </div>
          </div>

          <div className="av-grid2">
            <div className="admin-card av-card">
              <h3 className="av-h3">Most clicked</h3>
              <BarList
                items={(summary.top_clicks || []).map((c) => ({ name: c.label, count: c.count }))}
                nameKey="name"
                valueKey="count"
              />
            </div>
            <div className="admin-card av-card">
              <h3 className="av-h3">Responses received (all time)</h3>
              <BarList items={responses} nameKey="label" valueKey="count" />
            </div>
          </div>

          <div className="admin-card av-card">
            <h3 className="av-h3">Recent activity</h3>
            <div className="av-tablewrap">
              <table className="av-table">
                <thead>
                  <tr>
                    <th>When</th>
                    <th>Event</th>
                    <th>Page</th>
                    <th>Detail</th>
                    <th>Lang</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((e) => (
                    <tr key={e.id}>
                      <td className="av-num">{new Date(e.created_at).toLocaleString()}</td>
                      <td>{EVENT_LABELS[e.event_type] || e.event_type}</td>
                      <td>{e.page || '—'}</td>
                      <td className="av-detail">
                        {e.event_type === 'chat_message'
                          ? `Q: ${e.metadata?.question || ''} — A: ${e.metadata?.reply || ''}`
                          : e.metadata?.label || e.metadata?.form ||
                            (e.metadata?.to ? `→ ${e.metadata.to}` : '') || '—'}
                      </td>
                      <td>{e.lang || '—'}</td>
                    </tr>
                  ))}
                  {recent.length === 0 && (
                    <tr><td colSpan={5} className="av-empty">No interactions recorded yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* Light-surface viz tokens: series-1 blue, hairline grid, text tokens for all
   labels (text never wears the data color). */
const AV_CSS = `
.av-root { --av-series: #2a78d6; --av-grid: #e1e0d9; --av-baseline: #c3c2b7;
  --av-ink: #0b0b0b; --av-ink2: #52514e; --av-muted: #898781; --av-surface: #ffffff; }
.av-tiles { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px; margin-bottom: 16px; }
.av-tile { background: var(--av-surface); border: 1px solid rgba(11,11,11,0.10);
  border-radius: 10px; padding: 14px 16px; display: flex; flex-direction: column; gap: 4px; }
.av-tile-label { font-size: 0.78rem; color: var(--av-ink2); }
.av-tile-value { font-size: 1.6rem; font-weight: 600; color: var(--av-ink); line-height: 1.1; }
.av-card { margin-bottom: 16px; }
.av-h3 { margin: 0 0 12px; font-size: 0.95rem; color: var(--av-ink); }
.av-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 900px) { .av-grid2 { grid-template-columns: 1fr; } }

.av-chart { padding-top: 8px; }
.av-plot { position: relative; margin-left: 44px; }
.av-grid { position: absolute; left: 0; right: 0; height: 1px; background: var(--av-grid); }
.av-tick { position: absolute; left: -44px; top: -0.55em; width: 36px; text-align: right;
  font-size: 0.7rem; color: var(--av-muted); font-variant-numeric: tabular-nums; }
.av-cols { position: absolute; inset: 0; display: flex; align-items: flex-end; gap: 2px;
  border-bottom: 1px solid var(--av-baseline); }
.av-col { position: relative; flex: 1 1 0; max-width: 24px; height: 100%;
  display: flex; align-items: flex-end; }
.av-bar { width: 100%; background: var(--av-series); border-radius: 4px 4px 0 0; }
.av-col:hover .av-bar { background: #1c5cab; }
.av-tip { display: none; position: absolute; bottom: calc(100% + 6px); left: 50%;
  transform: translateX(-50%); white-space: nowrap; background: var(--av-ink);
  color: #fff; font-size: 0.72rem; padding: 4px 8px; border-radius: 6px; z-index: 5;
  pointer-events: none; }
.av-col:hover .av-tip { display: block; }
.av-xaxis { display: flex; justify-content: space-between; margin: 6px 0 0 44px;
  font-size: 0.7rem; color: var(--av-muted); }

.av-barlist { display: flex; flex-direction: column; gap: 8px; }
.av-barrow { display: grid; grid-template-columns: 150px 1fr; align-items: center; gap: 10px; }
.av-barname { font-size: 0.8rem; color: var(--av-ink2); white-space: nowrap;
  overflow: hidden; text-overflow: ellipsis; }
.av-bartrack { display: flex; align-items: center; gap: 8px; min-height: 12px; }
.av-barfill { height: 12px; min-width: 2px; background: var(--av-series);
  border-radius: 0 4px 4px 0; }
.av-barvalue { font-size: 0.76rem; color: var(--av-ink2);
  font-variant-numeric: tabular-nums; }
.av-empty { font-size: 0.85rem; color: var(--av-muted); margin: 4px 0; }

.av-tablewrap { overflow-x: auto; }
.av-table { width: 100%; border-collapse: collapse; font-size: 0.8rem; }
.av-table th { text-align: left; color: var(--av-muted); font-weight: 500;
  padding: 6px 10px; border-bottom: 1px solid var(--av-grid); white-space: nowrap; }
.av-table td { padding: 6px 10px; border-bottom: 1px solid var(--av-grid);
  color: var(--av-ink2); vertical-align: top; }
.av-num { white-space: nowrap; font-variant-numeric: tabular-nums; }
.av-detail { max-width: 420px; overflow-wrap: anywhere; }
`;
