'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { uploadImage } from '@/lib/admin/upload';

const EMPTY = {
  title_en: '', title_am: '', slug: '', excerpt_en: '', excerpt_am: '',
  body_en: '', body_am: '', cover_url: '', author_id: '', status: 'draft',
  published_at: null, _tags: '',
};

const STATUSES = ['draft', 'scheduled', 'published', 'unlisted', 'archived'];

const slugify = (s) =>
  (s || 'untitled').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

export default function ArticlesManager({ supabase }) {
  const [list, setList] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    const [aRes, authRes] = await Promise.all([
      supabase.from('articles').select('*, articles_tags(tag:tags(tag))').order('created_at', { ascending: false }),
      supabase.from('authors').select('id, name').order('name'),
    ]);
    if (aRes.error) setError(aRes.error.message);
    else setList(aRes.data || []);
    if (!authRes.error) setAuthors(authRes.data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  const change = (field, value) => setEditing((e) => ({ ...e, [field]: value }));

  const startEdit = (a) => {
    const tags = (a.articles_tags || []).map((t) => t.tag?.tag).filter(Boolean).join(', ');
    setEditing({ ...a, _tags: tags });
  };

  const onCover = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSaving(true); setError('');
    try { change('cover_url', await uploadImage(supabase, 'articles', file)); }
    catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const syncTags = async (articleId, raw) => {
    const names = [...new Set((raw || '').split(',').map((t) => t.trim().toLowerCase()).filter(Boolean))];
    await supabase.from('articles_tags').delete().eq('article_id', articleId);
    if (names.length === 0) return;
    await supabase.from('tags').upsert(names.map((tag) => ({ tag })), { onConflict: 'tag' });
    const { data: tagRows } = await supabase.from('tags').select('id, tag').in('tag', names);
    const links = (tagRows || []).map((t) => ({ article_id: articleId, tag_id: t.id }));
    if (links.length) await supabase.from('articles_tags').insert(links);
  };

  const save = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      const slug = editing.slug?.trim() || slugify(editing.title_en);
      const payload = {
        slug,
        title_en: editing.title_en, title_am: editing.title_am || null,
        excerpt_en: editing.excerpt_en || null, excerpt_am: editing.excerpt_am || null,
        body_en: editing.body_en || null, body_am: editing.body_am || null,
        cover_url: editing.cover_url || null,
        author_id: editing.author_id || null,
        status: editing.status || 'draft',
        updated_at: new Date().toISOString(),
      };
      if (editing.status === 'published') {
        payload.published_at = editing.published_at || new Date().toISOString();
      } else {
        payload.published_at = editing.published_at || null;
      }

      const res = editing.id
        ? await supabase.from('articles').update(payload).eq('id', editing.id).select().single()
        : await supabase.from('articles').insert(payload).select().single();
      if (res.error) throw res.error;

      await syncTags(res.data.id, editing._tags);
      setEditing(null); await load();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const remove = async (a) => {
    if (!window.confirm(`Delete "${a.title_en}"?`)) return;
    const { error } = await supabase.from('articles').delete().eq('id', a.id);
    if (error) setError(error.message); else load();
  };

  if (editing) {
    const a = editing;
    return (
      <div className="admin-panel">
        <div className="admin-header">
          <h2>{a.id ? 'Edit Article' : 'New Article'}</h2>
          <div className="admin-header-actions">
            <button className="admin-btn" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </div>
        {error && <p className="admin-error">{error}</p>}
        <form className="admin-card" onSubmit={save}>
          <div className="admin-photo-row">
            <div className="admin-photo-preview" style={{ borderRadius: 8, width: 120, height: 80 }}>
              {a.cover_url ? <img src={a.cover_url} alt="" /> : <span>No cover</span>}
            </div>
            <label className="admin-btn admin-photo-btn">
              {saving ? 'Uploading…' : 'Upload cover'}
              <input type="file" accept="image/*" hidden onChange={onCover} />
            </label>
          </div>

          <div className="admin-grid-2">
            <Field label="Title (EN)"><input className="admin-input" required value={a.title_en} onChange={(e) => change('title_en', e.target.value)} /></Field>
            <Field label="Title (AM)"><input className="admin-input admin-input-am" value={a.title_am || ''} onChange={(e) => change('title_am', e.target.value)} /></Field>
            <Field label="Slug (auto if blank)"><input className="admin-input" value={a.slug || ''} onChange={(e) => change('slug', e.target.value)} placeholder={slugify(a.title_en)} /></Field>
            <Field label="Author">
              <select className="admin-input" value={a.author_id || ''} onChange={(e) => change('author_id', e.target.value)}>
                <option value="">— none —</option>
                {authors.map((au) => <option key={au.id} value={au.id}>{au.name}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select className="admin-input" value={a.status} onChange={(e) => change('status', e.target.value)}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="Hashtags (comma separated)"><input className="admin-input" value={a._tags || ''} onChange={(e) => change('_tags', e.target.value)} placeholder="faith, teaching" /></Field>
            <Field label="Excerpt (EN)"><textarea className="admin-input" rows={2} value={a.excerpt_en || ''} onChange={(e) => change('excerpt_en', e.target.value)} /></Field>
            <Field label="Excerpt (AM)"><textarea className="admin-input admin-input-am" rows={2} value={a.excerpt_am || ''} onChange={(e) => change('excerpt_am', e.target.value)} /></Field>
            <Field label="Body (EN)"><textarea className="admin-input" rows={6} value={a.body_en || ''} onChange={(e) => change('body_en', e.target.value)} /></Field>
            <Field label="Body (AM)"><textarea className="admin-input admin-input-am" rows={6} value={a.body_am || ''} onChange={(e) => change('body_am', e.target.value)} /></Field>
          </div>

          <button className="admin-btn admin-btn-primary" disabled={saving}>{saving ? 'Saving…' : 'Save Article'}</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>Articles</h2>
        <div className="admin-header-actions">
          <button className="admin-btn admin-btn-primary" onClick={() => setEditing({ ...EMPTY })}>+ New Article</button>
        </div>
      </div>
      {error && <p className="admin-error">{error}</p>}
      {loading ? <p className="admin-status">Loading…</p> : (
        <div className="admin-list">
          {list.length === 0 && <p className="admin-status">No articles yet.</p>}
          {list.map((a) => (
            <div className="admin-row" key={a.id}>
              <div className="admin-row-thumb" style={{ borderRadius: 6 }}>
                {a.cover_url ? <img src={a.cover_url} alt="" /> : <span>✚</span>}
              </div>
              <div className="admin-row-main">
                <div className="admin-row-title">
                  {a.title_en}
                  <span className="admin-badge" style={{ background: a.status === 'published' ? '#d8f0dd' : '#e2e6ef', color: a.status === 'published' ? '#1d7a44' : '#0f1b3d' }}>{a.status}</span>
                </div>
                <div className="admin-row-sub">/{a.slug}</div>
              </div>
              <div className="admin-row-actions">
                <button className="admin-btn" onClick={() => startEdit(a)}>Edit</button>
                <button className="admin-btn admin-btn-danger" onClick={() => remove(a)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
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
