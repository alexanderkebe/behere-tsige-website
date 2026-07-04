'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

/**
 * Article comment moderation + per-article analytics.
 * New comments arrive as 'pending' and are invisible on the site until an
 * admin approves them here — offensive/taboo posts never go public. The
 * insights view shows views, likes, and comment counts per article
 * (views come from the interactions tracking table).
 */

const FILTERS = [
  { id: 'pending', label: 'Pending' },
  { id: 'visible', label: 'Approved' },
  { id: 'hidden', label: 'Hidden' },
  { id: 'all', label: 'All' },
];

const STATUS_BADGE = {
  pending: { text: 'Pending review', bg: '#fdf3d7', fg: '#7a5b00' },
  visible: { text: 'Approved', bg: '#e0f2e4', fg: '#1c6b2c' },
  hidden: { text: 'Hidden', bg: '#fdE2e0', fg: '#8f2320' },
};

export default function CommentsManager({ supabase }) {
  const [view, setView] = useState('moderation'); // moderation | insights
  const [comments, setComments] = useState([]);
  const [stats, setStats] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    const [c, s] = await Promise.all([
      supabase
        .from('article_comments')
        .select('id, article_id, parent_comment_id, guest_name, body, status, created_at, articles(title_en, slug)')
        .order('created_at', { ascending: false })
        .limit(500),
      supabase.rpc('article_stats'),
    ]);
    if (c.error) setError(c.error.message);
    else setComments(c.data || []);
    if (s.error) setError((prev) => prev || s.error.message);
    else setStats(s.data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  const setStatus = async (comment, status) => {
    const { error: err } = await supabase
      .from('article_comments')
      .update({ status })
      .eq('id', comment.id);
    if (err) setError(err.message);
    else setComments((list) => list.map((c) => (c.id === comment.id ? { ...c, status } : c)));
  };

  const remove = async (comment) => {
    if (!window.confirm('Permanently delete this comment (and its replies)?')) return;
    const { error: err } = await supabase.from('article_comments').delete().eq('id', comment.id);
    if (err) setError(err.message);
    else load();
  };

  const counts = useMemo(() => {
    const c = { pending: 0, visible: 0, hidden: 0, all: comments.length };
    for (const item of comments) c[item.status] = (c[item.status] || 0) + 1;
    return c;
  }, [comments]);

  const shown = useMemo(() => {
    let list = filter === 'all' ? comments : comments.filter((c) => c.status === filter);
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (c) =>
          (c.body || '').toLowerCase().includes(q) ||
          (c.guest_name || '').toLowerCase().includes(q) ||
          (c.articles?.title_en || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [comments, filter, search]);

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>Article Comments</h2>
        <div className="admin-header-actions">
          <button
            className={`admin-btn ${view === 'moderation' ? 'admin-btn-primary' : ''}`}
            onClick={() => setView('moderation')}
          >
            Moderation{counts.pending > 0 ? ` (${counts.pending})` : ''}
          </button>
          <button
            className={`admin-btn ${view === 'insights' ? 'admin-btn-primary' : ''}`}
            onClick={() => setView('insights')}
          >
            Article Insights
          </button>
          <button className="admin-btn" onClick={load}>Refresh</button>
        </div>
      </div>

      {error && <p className="admin-error">{error}</p>}
      {loading && <p className="admin-status">Loading…</p>}

      {!loading && view === 'moderation' && (
        <>
          <p className="admin-status">
            New comments are hidden from the site until you approve them here.
          </p>
          <div className="admin-header-actions" style={{ marginBottom: '1rem', flexWrap: 'wrap' }}>
            {FILTERS.map((f) => (
              <button
                key={f.id}
                className={`admin-btn ${filter === f.id ? 'admin-btn-primary' : ''}`}
                onClick={() => setFilter(f.id)}
              >
                {f.label} ({counts[f.id] || 0})
              </button>
            ))}
            <input
              className="admin-input"
              style={{ maxWidth: 240, marginLeft: 'auto' }}
              placeholder="Search comments…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="admin-list">
            {shown.length === 0 && (
              <p className="admin-status">
                {filter === 'pending' ? 'No comments waiting for review. 🎉' : 'No comments here.'}
              </p>
            )}
            {shown.map((c) => {
              const badge = STATUS_BADGE[c.status] || STATUS_BADGE.pending;
              return (
                <div className="admin-req" key={c.id}>
                  <div className="admin-req-head">
                    <span className="admin-req-name">{c.guest_name || 'Guest'}</span>
                    <span
                      className="admin-badge"
                      style={{ backgroundColor: badge.bg, color: badge.fg }}
                    >
                      {badge.text}
                    </span>
                    {c.parent_comment_id && <span className="admin-badge">Reply</span>}
                  </div>
                  <p className="admin-req-meta">
                    On “{c.articles?.title_en || 'Unknown article'}” ·{' '}
                    {new Date(c.created_at).toLocaleString()}
                    {c.articles?.slug && (
                      <>
                        {' · '}
                        <a href={`/articles/${c.articles.slug}`} target="_blank" rel="noreferrer">
                          view article
                        </a>
                      </>
                    )}
                  </p>
                  <p className="admin-req-msg">{c.body}</p>
                  <div className="admin-row-actions">
                    {c.status !== 'visible' && (
                      <button className="admin-btn admin-btn-primary" onClick={() => setStatus(c, 'visible')}>
                        Approve
                      </button>
                    )}
                    {c.status !== 'hidden' && (
                      <button className="admin-btn" onClick={() => setStatus(c, 'hidden')}>
                        Hide
                      </button>
                    )}
                    <button className="admin-btn admin-btn-danger" onClick={() => remove(c)}>
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {!loading && view === 'insights' && (
        <>
          <p className="admin-status">
            Views come from visitor tracking; likes and comments from the article tables.
          </p>
          <div className="admin-card" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr>
                  {['Article', 'Status', 'Views', 'Likes', 'Approved', 'Pending', 'Hidden'].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: h === 'Article' || h === 'Status' ? 'left' : 'right',
                        padding: '8px 10px',
                        borderBottom: '1px solid #e1e0d9',
                        color: '#898781',
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.map((a) => (
                  <tr key={a.id}>
                    <td style={{ padding: '8px 10px', borderBottom: '1px solid #efeee9' }}>
                      {a.slug ? (
                        <a href={`/articles/${a.slug}`} target="_blank" rel="noreferrer">
                          {a.title_en}
                        </a>
                      ) : (
                        a.title_en
                      )}
                    </td>
                    <td style={{ padding: '8px 10px', borderBottom: '1px solid #efeee9' }}>{a.status}</td>
                    {[a.views, a.like_count, a.comments_visible, a.comments_pending, a.comments_hidden].map(
                      (v, i) => (
                        <td
                          key={i}
                          style={{
                            padding: '8px 10px',
                            borderBottom: '1px solid #efeee9',
                            textAlign: 'right',
                            fontVariantNumeric: 'tabular-nums',
                          }}
                        >
                          {Number(v).toLocaleString()}
                        </td>
                      )
                    )}
                  </tr>
                ))}
                {stats.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ padding: '12px 10px', color: '#898781' }}>
                      No articles yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
